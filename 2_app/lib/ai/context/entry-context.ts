// =============================================================================
// ENTRY CONTEXT GENERATOR
// =============================================================================

/**
 * Generates context about how/where the user entered the conversation.
 * Helps the AI understand what the user is likely trying to accomplish.
 * 
 * Token budget: ~50 tokens
 */

export type EntryMode = 
  | "general"
  | "onboarding"
  | "chances"
  | "schools"
  | "planning"
  | "profile"
  | "story";

export type EntryContextParams = {
  mode: EntryMode;
  initialQuery?: string;
  referrer?: string;
  isNewUser?: boolean;
  daysSinceLastSession?: number;
};

export function buildEntryContext(params: EntryContextParams): string {
  const { mode, initialQuery, isNewUser, daysSinceLastSession } = params;
  
  const parts: string[] = [];
  
  // User status
  if (isNewUser) {
    parts.push("This is a NEW user - their first time using Sesame.");
  } else if (daysSinceLastSession !== undefined) {
    if (daysSinceLastSession === 0) {
      parts.push("Returning user - last session was earlier today.");
    } else if (daysSinceLastSession === 1) {
      parts.push("Returning user - last session was yesterday.");
    } else if (daysSinceLastSession <= 7) {
      parts.push(`Returning user - last session was ${daysSinceLastSession} days ago.`);
    } else {
      parts.push(`Returning user - hasn't been active in ${daysSinceLastSession} days.`);
    }
  }
  
  // Entry mode context
  parts.push(getModeContext(mode));
  
  // Initial query
  if (initialQuery) {
    parts.push(`User's opening question: "${initialQuery}"`);
  }
  
  return parts.join("\n");
}

function getModeContext(mode: EntryMode): string {
  switch (mode) {
    case "onboarding":
      return `User is in ONBOARDING flow. This is their first time using Sesame.

Your goal: Get to know them through a natural conversation. Gather:
1. Their name (if not known yet)
2. What grade they're in
3. What's on their mind about college
4. Any dream schools or goals

IMPORTANT: ALWAYS end your response with a follow-up question to keep the conversation moving.
Don't just acknowledge what they said - engage and ask the next natural question.
Keep it conversational, not like a form to fill out.`;
    
    case "chances":
      return `User came from CHANCES mode. They want to know their odds at specific schools.
- Share realistic but encouraging assessments
- Explain what factors help or hurt
- Identify what's missing from their profile
- Suggest ways to improve their chances`;
    
    case "schools":
      return `User is in SCHOOL LIST mode. They want help building their college list.
- Help them find good-fit schools
- Balance reaches, targets, and safeties
- Consider their preferences and stats
- Explain why certain schools might be good fits`;
    
    case "planning":
      return `User is in PLANNING mode. They want to set goals and plan ahead.
- Help them identify important milestones
- Suggest programs, competitions, or activities
- Create actionable next steps
- Consider timing and deadlines`;
    
    case "profile":
      return `User is in PROFILE BUILDING mode. They want to document their achievements.
- Help them articulate their experiences
- Capture details that matter for applications
- Identify gaps in their profile
- Celebrate their accomplishments`;
    
    case "story":
      return `User is in STORY mode. They want to explore their personal narrative.
- Listen deeply and ask thoughtful questions
- Help them discover themes in their experiences
- Connect different parts of their journey
- Don't rush to data collection`;
    
    case "general":
    default:
      return `General conversation. Be ready to help with whatever the student needs.`;
  }
}
