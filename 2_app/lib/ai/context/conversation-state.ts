// =============================================================================
// CONVERSATION STATE GENERATOR
// =============================================================================

/**
 * Generates a summary of what's happened in the current session.
 * Updated each turn to give the AI context about the ongoing conversation.
 * 
 * Token budget: ~100 tokens
 */

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationStateParams = {
  messages: Message[];
  sessionStartTime?: Date;
  dataConfirmed?: string[];  // e.g., ["SAT: 1490", "GPA: 3.9"]
  dataPending?: string[];    // Widgets shown but not confirmed
  dataDismissed?: string[];  // Widgets dismissed
};

export function buildConversationState(params: ConversationStateParams): string {
  const { messages, sessionStartTime, dataConfirmed, dataPending, dataDismissed } = params;
  
  if (messages.length === 0) {
    return "Conversation just started.";
  }
  
  const parts: string[] = [];
  
  // Session duration
  if (sessionStartTime) {
    const minutes = Math.floor((Date.now() - sessionStartTime.getTime()) / 60000);
    if (minutes < 1) {
      parts.push("Session just started (less than a minute ago).");
    } else if (minutes === 1) {
      parts.push("Session started 1 minute ago.");
    } else {
      parts.push(`Session started ${minutes} minutes ago.`);
    }
  }
  
  // Message count
  const userMessages = messages.filter(m => m.role === "user").length;
  const assistantMessages = messages.filter(m => m.role === "assistant").length;
  parts.push(`${userMessages} messages from user, ${assistantMessages} from you.`);
  
  // Data confirmed this session
  if (dataConfirmed && dataConfirmed.length > 0) {
    parts.push(`Data saved this session: ${dataConfirmed.join(", ")}`);
  }
  
  // Pending confirmations
  if (dataPending && dataPending.length > 0) {
    parts.push(`Awaiting confirmation: ${dataPending.join(", ")}`);
  }
  
  // Dismissed data
  if (dataDismissed && dataDismissed.length > 0) {
    parts.push(`User skipped: ${dataDismissed.join(", ")}`);
  }
  
  // Recent conversation summary (last 3 exchanges)
  const recentSummary = summarizeRecentMessages(messages);
  if (recentSummary) {
    parts.push(`Recent discussion: ${recentSummary}`);
  }
  
  return parts.join("\n");
}

/**
 * Summarizes the last few messages into a brief description.
 */
function summarizeRecentMessages(messages: Message[]): string | null {
  if (messages.length === 0) return null;
  
  // Take last 4 messages (2 exchanges)
  const recent = messages.slice(-4);
  
  // Extract key topics from user messages
  const userMessages = recent.filter(m => m.role === "user");
  if (userMessages.length === 0) return null;
  
  // Simple topic extraction based on keywords
  const topics: string[] = [];
  
  for (const msg of userMessages) {
    const content = msg.content.toLowerCase();
    
    if (content.includes("gpa") || content.includes("grade")) {
      topics.push("grades");
    }
    if (content.includes("sat") || content.includes("act") || content.includes("test")) {
      topics.push("testing");
    }
    if (content.includes("chance") || content.includes("odds") || content.includes("get in")) {
      topics.push("chances");
    }
    if (content.includes("school") || content.includes("college") || content.includes("university")) {
      topics.push("schools");
    }
    if (content.includes("activity") || content.includes("club") || content.includes("sport")) {
      topics.push("activities");
    }
    if (content.includes("essay") || content.includes("application")) {
      topics.push("applications");
    }
    if (content.includes("major") || content.includes("career")) {
      topics.push("interests");
    }
  }
  
  // Deduplicate
  const uniqueTopics = [...new Set(topics)];
  
  if (uniqueTopics.length > 0) {
    return uniqueTopics.slice(0, 3).join(", ");
  }
  
  // If no topics detected, use first user message snippet
  const firstUserMsg = userMessages[0].content;
  const snippet = firstUserMsg.slice(0, 50);
  return snippet.length < firstUserMsg.length ? `"${snippet}..."` : `"${snippet}"`;
}
