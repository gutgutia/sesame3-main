import { streamText } from "ai";
import { NextRequest } from "next/server";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  modelFor, 
  allTools, 
  assembleContext, 
  parseUserMessage,
  shouldParse,
  formatParserContextForAdvisor,
  type EntryMode,
  type ParserResponse,
} from "@/lib/ai";

export const maxDuration = 60; // Allow up to 60 seconds for streaming

/**
 * POST /api/chat
 * Main chat endpoint with Parser + Advisor dual-model architecture
 * 
 * Flow:
 * 1. Parser (Kimi K2, ~50ms) extracts entities and determines widgets
 * 2. Widget data sent immediately via SSE
 * 3. Advisor (Claude) streams response with parsed context
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const { messages, conversationId, mode = "general" } = await request.json();
    
    // Filter out any messages with empty content
    const validMessages = messages.filter(
      (m: { role: string; content: string }) => m.content && m.content.trim() !== ""
    );
    
    if (validMessages.length === 0) {
      return new Response("No valid messages", { status: 400 });
    }
    
    // Get the latest user message
    const lastMessage = validMessages[validMessages.length - 1];
    const isUserMessage = lastMessage?.role === "user";
    const userInput = isUserMessage ? lastMessage.content : "";
    
    // === PHASE 1: Fast Parsing with Kimi K2 ===
    let parserResult: ParserResponse | null = null;
    
    if (isUserMessage && shouldParse(userInput)) {
      console.log("[Chat] Parsing user message...");
      const parseStart = Date.now();
      
      parserResult = await parseUserMessage(userInput, {
        entryMode: mode,
      });
      
      console.log(`[Chat] Parser completed in ${Date.now() - parseStart}ms`);
      
      if (parserResult.widget) {
        console.log(`[Chat] Widget detected: ${parserResult.widget.type}`);
      }
    }
    
    // === PHASE 2: Assemble Context for Advisor ===
    const context = await assembleContext({
      profileId,
      mode: mode as EntryMode,
      messages: validMessages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      sessionStartTime: new Date(),
    });
    
    // Inject parser context into the system prompt
    let advisorPrompt = context.advisorPrompt;
    if (parserResult) {
      const parserContext = formatParserContextForAdvisor(parserResult);
      if (parserContext) {
        advisorPrompt += `\n\n## Parser Analysis\n${parserContext}`;
      }
    }
    
    // === PHASE 3: Create SSE Stream with Widget + Advisor Response ===
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send widget data first (if detected)
          if (parserResult?.widget) {
            const widgetEvent = JSON.stringify({
              type: "widget",
              widget: parserResult.widget,
            });
            controller.enqueue(encoder.encode(`event: widget\ndata: ${widgetEvent}\n\n`));
          }
          
          // Stream the Advisor response
          const result = streamText({
            model: modelFor.advisor,
            system: advisorPrompt,
            messages: validMessages,
            tools: allTools,
            onFinish: async ({ text, toolCalls, toolResults }) => {
              // Save to database in background
              saveConversation({
                profileId,
                conversationId,
                mode,
                messages,
                assistantText: text,
                toolCalls,
                toolResults,
                parserResult,
              }).catch(err => console.error("Error saving conversation:", err));
            },
          });
          
          // Get the text stream
          const textStream = result.textStream;
          
          // Stream text chunks
          for await (const chunk of textStream) {
            if (chunk) {
              controller.enqueue(encoder.encode(chunk));
            }
          }
          
          controller.close();
        } catch (error) {
          console.error("[Chat] Stream error:", error);
          controller.error(error);
        }
      },
    });
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
    
  } catch (error) {
    console.error("Chat error:", error);
    if (error instanceof Error && error.message === "Profile not found") {
      return new Response("Not authenticated", { status: 401 });
    }
    return new Response("Internal server error", { status: 500 });
  }
}

/**
 * Save conversation to database (runs in background)
 */
async function saveConversation({
  profileId,
  conversationId,
  mode,
  messages,
  assistantText,
  toolCalls,
  toolResults,
  parserResult,
}: {
  profileId: string;
  conversationId?: string;
  mode: string;
  messages: Array<{ role: string; content: string }>;
  assistantText: string;
  toolCalls?: unknown;
  toolResults?: unknown;
  parserResult?: ParserResponse | null;
}) {
  try {
    let conversation;
    
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }
    
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          studentProfileId: profileId,
          title: messages[0]?.content?.slice(0, 50) || "New conversation",
          mode: mode || "general",
        },
      });
    }
    
    // Save user message
    const userMessage = messages[messages.length - 1];
    if (userMessage?.role === "user") {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: typeof userMessage.content === "string" 
            ? userMessage.content 
            : JSON.stringify(userMessage.content),
          parsedIntents: parserResult?.intents,
          parsedEntities: parserResult?.entities as unknown as undefined,
        },
      });
    }
    
    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: assistantText,
        toolCalls: toolCalls ? JSON.parse(JSON.stringify(toolCalls)) : undefined,
        toolResults: toolResults ? JSON.parse(JSON.stringify(toolResults)) : undefined,
        widgetType: parserResult?.widget?.type,
        widgetData: parserResult?.widget?.data as unknown as undefined,
        model: "claude-sonnet-4-5",
        provider: "anthropic",
      },
    });
    
    // Update conversation stats
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 2 },
      },
    });
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}
