// Prompts Module
// Exports all prompt templates

export { 
  ADVISOR_BASE_PERSONA, 
  ADVISOR_TOOL_INSTRUCTIONS,
  ADVISOR_PROMPT_TEMPLATE, 
  buildAdvisorPrompt 
} from "./prompts/advisor-prompt";

export { 
  PARSER_BASE_INSTRUCTIONS, 
  PARSER_PROMPT_TEMPLATE, 
  buildParserPrompt 
} from "./prompts/parser-prompt";
