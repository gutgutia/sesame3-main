/**
 * Test script to verify all AI models are working
 * Run with: npx tsx scripts/test-models.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(process.cwd(), ".env") });

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

const TEST_PROMPT = "Say 'Hello from [model name]' and nothing else.";

interface TestResult {
  provider: string;
  model: string;
  status: "success" | "error";
  response?: string;
  error?: string;
  latencyMs?: number;
}

async function testModel(
  provider: string,
  modelId: string,
  modelInstance: ReturnType<typeof anthropic | typeof openai | typeof google | typeof groq>
): Promise<TestResult> {
  const start = Date.now();
  
  try {
    const result = await generateText({
      model: modelInstance as Parameters<typeof generateText>[0]["model"],
      prompt: TEST_PROMPT,
    });
    
    return {
      provider,
      model: modelId,
      status: "success",
      response: result.text.trim(),
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      provider,
      model: modelId,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - start,
    };
  }
}

async function main() {
  console.log("🧪 Testing AI Models...\n");
  console.log("=".repeat(60));
  
  const results: TestResult[] = [];
  
  // Check which API keys are present
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  
  console.log("\n📋 API Keys Status:");
  console.log(`  ANTHROPIC_API_KEY: ${hasAnthropic ? "✅ Present" : "❌ Missing"}`);
  console.log(`  OPENAI_API_KEY: ${hasOpenAI ? "✅ Present" : "❌ Missing"}`);
  console.log(`  GOOGLE_GENERATIVE_AI_API_KEY: ${hasGoogle ? "✅ Present" : "❌ Missing"}`);
  console.log(`  GROQ_API_KEY: ${hasGroq ? "✅ Present" : "❌ Missing"}`);
  console.log("\n" + "=".repeat(60) + "\n");
  
  // Test Anthropic models
  if (hasAnthropic) {
    console.log("🔵 Testing Anthropic models...");
    
    const anthropicModels = [
      ["claude-opus-4-5", "Claude Opus 4.5"],
      ["claude-sonnet-4-5", "Claude Sonnet 4.5"],
      ["claude-haiku-4-5", "Claude Haiku 4.5"],
    ];
    
    for (const [modelId, displayName] of anthropicModels) {
      process.stdout.write(`  Testing ${displayName} (${modelId})... `);
      const result = await testModel("Anthropic", modelId, anthropic(modelId));
      results.push(result);
      
      if (result.status === "success") {
        console.log(`✅ ${result.latencyMs}ms`);
      } else {
        console.log(`❌ ${result.error?.slice(0, 60)}...`);
      }
    }
    console.log();
  }
  
  // Test OpenAI models
  if (hasOpenAI) {
    console.log("🟢 Testing OpenAI models...");
    
    const openaiModels = [
      ["gpt-5.1", "GPT-5.1"],
      ["gpt-5-mini", "GPT-5 Mini"],
    ];
    
    for (const [modelId, displayName] of openaiModels) {
      process.stdout.write(`  Testing ${displayName} (${modelId})... `);
      const result = await testModel("OpenAI", modelId, openai(modelId));
      results.push(result);
      
      if (result.status === "success") {
        console.log(`✅ ${result.latencyMs}ms`);
      } else {
        console.log(`❌ ${result.error?.slice(0, 60)}...`);
      }
    }
    console.log();
  }
  
  // Test Google models
  if (hasGoogle) {
    console.log("🟡 Testing Google models...");
    
    const googleModels = [
      ["gemini-3-pro-preview", "Gemini 3 Pro Preview"],
    ];
    
    for (const [modelId, displayName] of googleModels) {
      process.stdout.write(`  Testing ${displayName} (${modelId})... `);
      const result = await testModel("Google", modelId, google(modelId));
      results.push(result);
      
      if (result.status === "success") {
        console.log(`✅ ${result.latencyMs}ms`);
      } else {
        console.log(`❌ ${result.error?.slice(0, 60)}...`);
      }
    }
    console.log();
  }
  
  // Test Groq models
  if (hasGroq) {
    console.log("🟠 Testing Groq models...");
    
    const groqModels = [
      ["moonshotai/kimi-k2-instruct-0905", "Kimi K2"],
      ["qwen/qwen3-32b", "Qwen 32B"],
    ];
    
    for (const [modelId, displayName] of groqModels) {
      process.stdout.write(`  Testing ${displayName} (${modelId})... `);
      const result = await testModel("Groq", modelId, groq(modelId));
      results.push(result);
      
      if (result.status === "success") {
        console.log(`✅ ${result.latencyMs}ms`);
      } else {
        console.log(`❌ ${result.error?.slice(0, 60)}...`);
      }
    }
    console.log();
  }
  
  // Summary
  console.log("=".repeat(60));
  console.log("\n📊 Summary:\n");
  
  const successful = results.filter(r => r.status === "success");
  const failed = results.filter(r => r.status === "error");
  
  console.log(`✅ Working models (${successful.length}):`);
  for (const r of successful) {
    console.log(`   ${r.provider}/${r.model} - ${r.latencyMs}ms`);
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed models (${failed.length}):`);
    for (const r of failed) {
      console.log(`   ${r.provider}/${r.model}`);
      console.log(`      Error: ${r.error}`);
    }
  }
  
  console.log();
}

main().catch(console.error);
