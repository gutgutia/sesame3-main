"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConfirmationWidget, WidgetType } from "./ConfirmationWidget";

// Message type
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Widget from a tool call
type PendingWidget = {
  id: string;
  type: WidgetType;
  data: Record<string, unknown>;
  status: "pending" | "confirmed" | "dismissed";
};

interface ChatInterfaceProps {
  initialMessage?: string;
  mode?: "general" | "onboarding" | "chances" | "schools" | "planning" | "profile" | "story";
  onProfileUpdate?: () => void;
}

export function ChatInterface({ 
  initialMessage, 
  mode = "general",
  onProfileUpdate 
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const welcomeFetched = useRef(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start loading for welcome
  const [pendingWidgets, setPendingWidgets] = useState<PendingWidget[]>([]);
  
  // Fetch AI-generated welcome message
  useEffect(() => {
    if (welcomeFetched.current) return;
    welcomeFetched.current = true;
    
    async function fetchWelcome() {
      try {
        const res = await fetch("/api/chat/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode }),
        });
        
        if (res.ok) {
          const { message } = await res.json();
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: message,
          }]);
        } else {
          // Fallback
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm Sesame, your college prep advisor. What's on your mind today?",
          }]);
        }
      } catch {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Hi! I'm Sesame, your college prep advisor. What's on your mind today?",
        }]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWelcome();
  }, [mode]);
  
  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          mode, // Pass the entry mode for context assembly
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      // Read the streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }
      
      const decoder = new TextDecoder();
      let fullText = "";
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream done");
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        console.log("Raw chunk received:", JSON.stringify(chunk.slice(0, 200)));
        
        // Try to parse as data stream format (0:"text") or plain text
        if (chunk.includes("0:")) {
          // Data stream format
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                fullText += text;
              } catch {
                // Not valid JSON, use as-is
                fullText += line.slice(2);
              }
            }
          }
        } else {
          // Plain text
          fullText += chunk;
        }
        
        // Update the assistant message
        setMessages(prev => 
          prev.map(m => 
            m.id === assistantMessage.id 
              ? { ...m, content: fullText }
              : m
          )
        );
      }
      
      console.log("Stream complete. Full text:", fullText.slice(0, 100));
      
      // After streaming is complete, check for tool calls in the response
      // For now, we'll detect patterns in the text and show widgets
      // In the future, this will be properly integrated with tool results
      detectAndShowWidgets(content, fullText);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);
  
  // Simple pattern detection for widgets (temporary until tool calls work properly)
  const detectAndShowWidgets = (userInput: string, assistantResponse: string) => {
    const input = userInput.toLowerCase();
    const newWidgets: PendingWidget[] = [];
    
    // Detect GPA - more flexible patterns
    // Matches: "3.9 gpa", "gpa is 3.9", "my gpa is 3.9", "I have a 3.9 gpa", "3.9 unweighted"
    const gpaPatterns = [
      /(\d+\.?\d*)\s*(?:gpa|grade point|unweighted|weighted)/i,
      /gpa\s*(?:of|is|:|was)?\s*(\d+\.?\d*)/i,
      /(?:have|got|has)\s+(?:a\s+)?(\d+\.?\d*)\s*(?:gpa)?/i,
    ];
    
    let gpaValue: number | null = null;
    for (const pattern of gpaPatterns) {
      const match = userInput.match(pattern);
      if (match) {
        const val = parseFloat(match[1] || match[2]);
        if (val >= 1.0 && val <= 5.0) {
          gpaValue = val;
          break;
        }
      }
    }
    
    if (gpaValue !== null) {
      const isWeighted = input.includes("weighted") && !input.includes("unweighted");
      newWidgets.push({
        id: `widget-gpa-${Date.now()}`,
        type: "gpa",
        data: {
          gpaUnweighted: !isWeighted ? gpaValue : undefined,
          gpaWeighted: isWeighted ? gpaValue : undefined,
        },
        status: "pending",
      });
    }
    
    // Detect SAT - more flexible patterns
    // Matches: "1490 sat", "sat 1490", "got a 1490", "scored 1490 on sat"
    const satPatterns = [
      /(\d{3,4})\s*(?:sat|on the sat|on my sat)/i,
      /sat\s*(?:score|is|of|:|was)?\s*(\d{3,4})/i,
      /(?:got|scored|have|received)\s+(?:a\s+)?(\d{3,4})\s*(?:on|sat)?/i,
    ];
    
    let satScore: number | null = null;
    if (!gpaValue) { // Only check if not a GPA (to avoid confusing numbers)
      for (const pattern of satPatterns) {
        const match = userInput.match(pattern);
        if (match) {
          const score = parseInt(match[1] || match[2]);
          if (score >= 400 && score <= 1600) {
            satScore = score;
            break;
          }
        }
      }
    }
    
    // Also check for 4-digit numbers when "sat" is mentioned
    if (!satScore && input.includes("sat")) {
      const numberMatch = userInput.match(/\b(\d{3,4})\b/);
      if (numberMatch) {
        const score = parseInt(numberMatch[1]);
        if (score >= 400 && score <= 1600) {
          satScore = score;
        }
      }
    }
    
    if (satScore !== null) {
      newWidgets.push({
        id: `widget-sat-${Date.now()}`,
        type: "sat",
        data: { satTotal: satScore },
        status: "pending",
      });
    }
    
    // Detect ACT
    const actPatterns = [
      /(\d{1,2})\s*(?:act|on the act|on my act)/i,
      /act\s*(?:score|is|of|:|was)?\s*(\d{1,2})/i,
    ];
    
    let actScore: number | null = null;
    if (!gpaValue && !satScore && input.includes("act")) {
      for (const pattern of actPatterns) {
        const match = userInput.match(pattern);
        if (match) {
          const score = parseInt(match[1] || match[2]);
          if (score >= 1 && score <= 36) {
            actScore = score;
            break;
          }
        }
      }
    }
    
    if (actScore !== null) {
      newWidgets.push({
        id: `widget-act-${Date.now()}`,
        type: "act",
        data: { actComposite: actScore },
        status: "pending",
      });
    }
    
    // Detect Activity
    const leadershipKeywords = ["president", "captain", "founder", "leader", "head", "director", "vp", "vice president", "co-founder"];
    const activityKeywords = ["club", "team", "volunteer", "member", "involved", "participate", "join", "play", "sport", "robotics", "debate", "orchestra", "band", "theater", "theatre"];
    const hasLeadership = leadershipKeywords.some(k => input.includes(k));
    const hasActivity = activityKeywords.some(k => input.includes(k)) || hasLeadership;
    
    if (hasActivity && !gpaValue && !satScore && !actScore) {
      newWidgets.push({
        id: `widget-activity-${Date.now()}`,
        type: "activity",
        data: {
          title: hasLeadership ? "Leadership Role" : "Member",
          organization: extractOrganization(userInput),
          isLeadership: hasLeadership,
        },
        status: "pending",
      });
    }
    
    // Detect Awards
    const awardKeywords = ["won", "winner", "award", "finalist", "semifinalist", "qualifier", "aime", "usamo", "usaco", "olympiad", "medal", "honor", "recognition", "national merit"];
    const hasAward = awardKeywords.some(k => input.includes(k));
    
    if (hasAward && !hasActivity && !gpaValue && !satScore) {
      const isNational = input.includes("national") || input.includes("aime") || input.includes("usamo") || input.includes("usaco");
      newWidgets.push({
        id: `widget-award-${Date.now()}`,
        type: "award",
        data: {
          title: extractAwardTitle(userInput),
          level: isNational ? "national" : "regional",
        },
        status: "pending",
      });
    }
    
    console.log("Widget detection - input:", userInput, "widgets:", newWidgets);
    
    if (newWidgets.length > 0) {
      setPendingWidgets(prev => [...prev, ...newWidgets]);
    }
  };
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pendingWidgets, isLoading]);
  
  // Handle initial message
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    if (initialMessage) {
      setTimeout(() => {
        sendMessage(initialMessage);
      }, 500);
    }
  }, [initialMessage, sendMessage]);
  
  // Get current pending widget (show one at a time)
  const currentWidget = pendingWidgets.find(w => w.status === "pending");
  
  // Handle widget confirmation
  const handleWidgetConfirm = async (widgetId: string, data: Record<string, unknown>) => {
    const widget = pendingWidgets.find(w => w.id === widgetId);
    if (!widget) return;
    
    try {
      const endpoint = getApiEndpoint(widget.type);
      const method = getApiMethod(widget.type);
      
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setPendingWidgets(prev => 
          prev.map(w => w.id === widgetId ? { ...w, status: "confirmed" as const } : w)
        );
        onProfileUpdate?.();
      } else {
        console.error("Failed to save:", await response.text());
      }
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };
  
  // Handle widget dismiss
  const handleWidgetDismiss = (widgetId: string) => {
    setPendingWidgets(prev => 
      prev.map(w => w.id === widgetId ? { ...w, status: "dismissed" as const } : w)
    );
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || currentWidget) return;
    
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border-subtle bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Link
          href="/"
          className="mr-4 p-2 hover:bg-bg-sidebar rounded-full transition-colors text-text-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-text-main text-white rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-text-main">Sesame</span>
          {isLoading && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div className="max-w-[85%]">
              {msg.content && (
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-text-main text-white rounded-br-sm"
                      : "bg-white border border-border-subtle text-text-main rounded-bl-sm shadow-sm"
                  )}
                >
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-white border border-border-subtle rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        
        {/* Current pending widget */}
        {currentWidget && !isLoading && (
          <div className="flex justify-start">
            <div className="max-w-md w-full">
              <ConfirmationWidget
                type={currentWidget.type}
                data={currentWidget.data}
                onConfirm={(data) => handleWidgetConfirm(currentWidget.id, data)}
                onDismiss={() => handleWidgetDismiss(currentWidget.id)}
              />
            </div>
          </div>
        )}
        
        {/* Confirmed widgets indicator */}
        {pendingWidgets.filter(w => w.status === "confirmed").length > 0 && !currentWidget && (
          <div className="flex justify-start">
            <div className="bg-success-bg border border-[#BBF7D0] rounded-xl px-4 py-2 text-sm text-success-text flex items-center gap-2">
              <span>✓</span>
              <span>
                {pendingWidgets.filter(w => w.status === "confirmed").length} item(s) saved to your profile
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-border-subtle">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your GPA, test scores, activities..."
            className="w-full bg-bg-sidebar border border-border-medium rounded-xl pl-5 pr-14 py-4 text-[15px] focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-surface transition-all"
            disabled={isLoading || !!currentWidget}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !!currentWidget}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-text-main text-white rounded-lg hover:bg-black/80 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        {/* Quick suggestions */}
        {!currentWidget && !isLoading && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-3xl mx-auto">
            <QuickSuggestion onClick={() => setInput("My GPA is ")} label="Add GPA" />
            <QuickSuggestion onClick={() => setInput("I got a ")} label="Add test score" />
            <QuickSuggestion onClick={() => setInput("I'm involved in ")} label="Add activity" />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickSuggestion({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-bg-sidebar border border-border-subtle rounded-full text-xs text-text-muted hover:text-text-main hover:border-accent-primary transition-colors"
    >
      + {label}
    </button>
  );
}

// Helper functions

function getApiEndpoint(widgetType: WidgetType): string {
  const endpoints: Record<WidgetType, string> = {
    gpa: "/api/profile/academics",
    sat: "/api/profile/testing",
    act: "/api/profile/testing",
    activity: "/api/profile/activities",
    award: "/api/profile/awards",
    course: "/api/profile/courses",
    program: "/api/profile/programs",
    goal: "/api/profile/goals",
    school: "/api/profile/schools",
    profile: "/api/profile",
  };
  
  return endpoints[widgetType];
}

function getApiMethod(widgetType: WidgetType): string {
  const postTypes: WidgetType[] = ["activity", "award", "course", "program", "goal", "school"];
  return postTypes.includes(widgetType) ? "POST" : "PUT";
}

function extractOrganization(text: string): string {
  // Simple extraction - in production, the AI would do this
  const patterns = [
    /(?:of|at|for|in)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:Club|Team|Society|Organization|Group))/i,
    /([A-Z][a-zA-Z\s]+(?:Club|Team|Society))/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return "Organization";
}

function extractAwardTitle(text: string): string {
  // Simple extraction
  const patterns = [
    /(AIME\s*Qualifier)/i,
    /(National Merit\s*(?:Semifinalist|Finalist)?)/i,
    /(USAMO\s*Qualifier)/i,
    /(?:won|received|got)\s+(?:the\s+)?([^,\.]+(?:award|prize|medal))/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return "Award";
}
