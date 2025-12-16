import { streamText } from "ai";
import { NextRequest } from "next/server";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { modelFor, allTools, assembleContext, type EntryMode } from "@/lib/ai";

export const maxDuration = 60; // Allow up to 60 seconds for streaming

/**
 * POST /api/chat
 * Main chat endpoint - streams AI responses with full context assembly
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const { messages, conversationId, mode = "general" } = await request.json();
    
    // Assemble full context for the AI
    const context = await assembleContext({
      profileId,
      mode: mode as EntryMode,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      sessionStartTime: new Date(),
    });
    
    // Log context assembly for debugging (remove in production)
    console.log("=== Context Assembly ===");
    console.log("Profile Narrative:", context.components.profileNarrative.slice(0, 200) + "...");
    console.log("Entry Context:", context.components.entryContext.slice(0, 100));
    console.log("========================");
    
    // Filter out any messages with empty content (can happen with streaming UI)
    const validMessages = messages.filter(
      (m: { role: string; content: string }) => m.content && m.content.trim() !== ""
    );
    
    if (validMessages.length === 0) {
      return new Response("No valid messages", { status: 400 });
    }
    
    // Stream the response using the assembled advisor prompt
    const result = streamText({
      model: modelFor.advisor,
      system: context.advisorPrompt,
      messages: validMessages,
      tools: allTools,
      onFinish: async ({ text, toolCalls, toolResults }) => {
        // Save the conversation to the database
        try {
          let conversation;
          
          if (conversationId) {
            conversation = await prisma.conversation.findUnique({
              where: { id: conversationId },
            });
          }
          
          if (!conversation) {
            // Create new conversation
            conversation = await prisma.conversation.create({
              data: {
                studentProfileId: profileId,
                title: messages[0]?.content?.slice(0, 50) || "New conversation",
                mode: mode || "general",
              },
            });
          }
          
          // Save user message (last one in the array)
          const userMessage = messages[messages.length - 1];
          if (userMessage?.role === "user") {
            await prisma.message.create({
              data: {
                conversationId: conversation.id,
                role: "user",
                content: typeof userMessage.content === "string" ? userMessage.content : JSON.stringify(userMessage.content),
              },
            });
          }
          
          // Save assistant message
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: text,
              toolCalls: toolCalls ? JSON.parse(JSON.stringify(toolCalls)) : undefined,
              toolResults: toolResults ? JSON.parse(JSON.stringify(toolResults)) : undefined,
              model: "claude-sonnet-4-5",
              provider: "anthropic",
            },
          });
          
          // Update conversation stats
          await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
              lastMessageAt: new Date(),
              messageCount: { increment: 2 }, // user + assistant
            },
          });
        } catch (error) {
          console.error("Error saving conversation:", error);
          // Don't throw - we still want the response to stream
        }
      },
    });
    
    // Return the streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    if (error instanceof Error && error.message === "Profile not found") {
      return new Response("Not authenticated", { status: 401 });
    }
    return new Response("Internal server error", { status: 500 });
  }
}
