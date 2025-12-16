// AI Module - Main exports

// Model providers
export { models, modelFor, getAvailableProviders, getModelWithFallback } from "./providers";

// Tools
export { allTools, profileTools, planningTools } from "./tools";
export { executeToolCall } from "./tool-handlers";

// Context assembly (NEW)
export { 
  assembleContext, 
  assembleContextSimple,
  buildProfileNarrative,
  buildEntryContext,
  buildConversationState,
  buildConversationSummary,
  buildCounselorObjectives,
  type AssembleContextParams,
  type AssembledContext,
  type EntryMode,
  type Message,
} from "./context";

// Prompts (NEW structure)
export {
  ADVISOR_BASE_PERSONA,
  ADVISOR_PROMPT_TEMPLATE,
  buildAdvisorPrompt,
  PARSER_BASE_INSTRUCTIONS,
  PARSER_PROMPT_TEMPLATE,
  buildParserPrompt,
} from "./prompts";

// Legacy exports (for backwards compatibility)
export { ADVISOR_SYSTEM_PROMPT, FAST_PARSER_PROMPT, buildProfileContext, SUMMARIZATION_PROMPT } from "./prompts.legacy";
