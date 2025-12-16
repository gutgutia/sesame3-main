/**
 * Welcome Message API
 * Generates an AI-powered initial greeting based on user context
 */

import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { assembleContext } from "@/lib/ai/context/assembler";
import { getCurrentProfileId } from "@/lib/auth";
import { EntryMode } from "@/lib/ai/context/entry-context";

// Mode descriptions for the AI
const MODE_CONTEXT: Record<string, string> = {
  onboarding: "The student just signed up and is going through initial onboarding. Focus on warmly welcoming them and asking for their name.",
  chances: "The student wants to check their admission chances. Be ready to ask about their profile and target schools.",
  schools: "The student wants to build their college list. Help them explore and add schools.",
  planning: "The student wants to set goals and plan their activities. Help them think strategically.",
  profile: "The student wants to update their profile information (GPA, scores, activities, etc.).",
  story: "The student wants to share their personal story. Ask open-ended questions about who they are.",
  general: "The student is starting a general conversation. Be helpful and guide them.",
};

export async function POST(request: NextRequest) {
  try {
    const { mode = "general" } = await request.json();
    
    // Get current user's profile
    const profileId = await getCurrentProfileId();
    if (!profileId) {
      return NextResponse.json({
        message: "Hi! I'm Sesame, your college prep advisor. What's on your mind today?",
      });
    }
    
    // Assemble context for this user
    const context = await assembleContext({
      profileId,
      mode: mode as EntryMode,
      messages: [],
      sessionStartTime: new Date(),
      isNewUser: mode === "onboarding",
    });
    
    // Generate personalized welcome
    const systemPrompt = `You are Sesame, a warm and knowledgeable college admissions advisor.
Your task is to generate a brief, personalized opening message (2-4 sentences max).

Current context:
${MODE_CONTEXT[mode] || MODE_CONTEXT.general}

${context.profileNarrative ? `Student Profile Summary:\n${context.profileNarrative}` : "This is a new student with no profile data yet."}

${context.components.counselorObjectives ? `Your objectives for this conversation:\n${context.components.counselorObjectives}` : ""}

Guidelines:
- Be warm, casual, and encouraging (not overly formal)
- If this is a new user, welcome them and ask for their name
- If you know their name, use it
- Reference something specific from their profile if available
- Keep it SHORT - 2-4 sentences only
- End with a question or invitation to continue
- Don't use bullet points or lists - this is conversational
- Don't say "I'm here to help" or similar clichés`;

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      prompt: "Generate the opening message for this conversation.",
    });
    
    return NextResponse.json({ message: text.trim() });
    
  } catch (error) {
    console.error("Welcome message error:", error);
    
    // Fallback to simple message if AI fails
    return NextResponse.json({
      message: "Hi! I'm Sesame, your college prep advisor. What's on your mind today?",
    });
  }
}
