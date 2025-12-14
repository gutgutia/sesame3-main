"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataWidget } from "@/components/chat/DataWidget";
import { ChancesPanel } from "@/components/chat/ChancesPanel";
import {
  StudentProfile,
  loadProfile,
  saveProfile,
  parseUserInput,
  ParsedData,
} from "@/lib/profile";

type WidgetData = {
  type: "gpa" | "sat" | "act" | "activity" | "award" | "school";
  data: any;
  status: "draft" | "saved" | "dismissed";
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  widget?: WidgetData;
};

function AdvisorContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const mode = searchParams.get("mode"); // "chances" for chances-focused flow

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({});
  const [targetSchool, setTargetSchool] = useState<string | undefined>();

  const hasInitialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load profile on mount
  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);

    // Set target school from onboarding or query
    if (loaded.onboarding?.dreamSchool) {
      setTargetSchool(loaded.onboarding.dreamSchool);
    }
  }, []);

  // Initialize conversation
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loaded = loadProfile();
    const name = loaded.onboarding?.name;
    const dreamSchool = loaded.onboarding?.dreamSchool;
    const grade = loaded.onboarding?.grade;

    setIsTyping(true);

    setTimeout(() => {
      let welcomeMessages: Message[] = [];

      // Check if this is a "check chances" flow
      if (mode === "chances") {
        if (dreamSchool) {
          setTargetSchool(dreamSchool);
          welcomeMessages = [
            {
              id: "1",
              role: "assistant",
              text: `Hi${name ? ` ${name}` : ""}! Let's see where you stand for ${dreamSchool}.`,
            },
            {
              id: "2",
              role: "assistant",
              text: "Tell me about yourself — start with whatever feels easiest. Your GPA? Test scores? Activities you're proud of?",
            },
          ];
        } else {
          welcomeMessages = [
            {
              id: "1",
              role: "assistant",
              text: `Hi${name ? ` ${name}` : ""}! I can help you see your chances at any school.`,
            },
            {
              id: "2",
              role: "assistant",
              text: "First, which school are you most curious about?",
            },
          ];
        }
      }
      // Initial query from dashboard
      else if (initialQuery) {
        welcomeMessages = [
          {
            id: "1",
            role: "assistant",
            text: `Hi${name ? ` ${name}` : ""}! I saw your message.`,
          },
        ];
        // Process the initial query
        setTimeout(() => {
          addUserMessage(initialQuery);
          processUserInput(initialQuery);
        }, 500);
      }
      // Default welcome
      else {
        const greeting = dreamSchool
          ? `Let's build your profile for ${dreamSchool}. What would you like to share first?`
          : grade
          ? `As a ${grade.toLowerCase()}, now's a great time to start building your profile. What would you like to share?`
          : "I can help you build your profile, check your chances at schools, or plan your next steps. What's on your mind?";

        welcomeMessages = [
          {
            id: "1",
            role: "assistant",
            text: `Hi${name ? ` ${name}` : ""}! I'm Sesame, your college prep advisor.`,
          },
          {
            id: "2",
            role: "assistant",
            text: greeting,
          },
        ];
      }

      setMessages(welcomeMessages);
      setIsTyping(false);
    }, 600);
  }, [initialQuery, mode]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addUserMessage = (text: string) => {
    const msg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, msg]);
  };

  const addAssistantMessage = (text: string, widget?: WidgetData) => {
    const msg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      text,
      widget,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const processUserInput = (text: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const parsed = parseUserInput(text);

      // Handle different parsed types
      if (parsed.type === "gpa") {
        const response = parsed.data.value >= 3.8
          ? `A ${parsed.data.value} GPA is strong! That puts you in competitive range for top schools.`
          : parsed.data.value >= 3.5
          ? `${parsed.data.value} is solid. Combined with strong extracurriculars, you're in good shape.`
          : `Got it — ${parsed.data.value}. Remember, GPA is just one factor. Strong activities and essays can balance this.`;

        addAssistantMessage(response, {
          type: "gpa",
          data: parsed.data,
          status: "draft",
        });
      }
      else if (parsed.type === "sat") {
        const score = parsed.data.value;
        const response = score >= 1500
          ? `Excellent! ${score} puts you in the top percentiles. This is a strong asset for your applications.`
          : score >= 1400
          ? `${score} is competitive for most schools. Some students retake to push higher, but this is solid.`
          : `Got it — ${score}. If you're targeting highly selective schools, you might consider retaking or looking at test-optional policies.`;

        addAssistantMessage(response, {
          type: "sat",
          data: parsed.data,
          status: "draft",
        });
      }
      else if (parsed.type === "act") {
        const score = parsed.data.value;
        const response = score >= 34
          ? `${score} is excellent! That's equivalent to a ~1550+ SAT.`
          : score >= 30
          ? `${score} is competitive for most schools. Nice work!`
          : `Got it — ${score} ACT recorded.`;

        addAssistantMessage(response, {
          type: "act",
          data: parsed.data,
          status: "draft",
        });
      }
      else if (parsed.type === "activity") {
        const response = parsed.data.isLeadership
          ? `Leadership roles like this stand out to admissions officers. This shows initiative and impact.`
          : `Great! Activities like this help build your profile beyond academics.`;

        addAssistantMessage(response, {
          type: "activity",
          data: parsed.data,
          status: "draft",
        });
      }
      else if (parsed.type === "award") {
        const response = parsed.data.level === "national"
          ? `A national-level award is a significant differentiator. This could really strengthen your application.`
          : `Nice! Awards show recognition for your efforts. Every bit helps build your story.`;

        addAssistantMessage(response, {
          type: "award",
          data: parsed.data,
          status: "draft",
        });
      }
      else if (parsed.type === "school") {
        setTargetSchool(parsed.data.name);
        addAssistantMessage(
          `${parsed.data.name} — great choice! I'll track your chances there as we build your profile. What's your GPA?`,
          {
            type: "school",
            data: parsed.data,
            status: "draft",
          }
        );
      }
      else {
        // Unknown - ask clarifying question
        addAssistantMessage(
          "I want to make sure I capture that correctly. Is this about your academics, test scores, activities, or something else?"
        );
      }

      setIsTyping(false);
    }, 800);
  };

  const handleWidgetConfirm = (msgId: string, data: any, type: string) => {
    // Update message widget status
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.widget) {
          return { ...msg, widget: { ...msg.widget, status: "saved" as const, data } };
        }
        return msg;
      })
    );

    // Update profile based on type
    const updatedProfile = { ...profile };

    if (type === "gpa") {
      updatedProfile.academics = updatedProfile.academics || {};
      if (data.isWeighted) {
        updatedProfile.academics.gpaWeighted = data.value;
      } else {
        updatedProfile.academics.gpaUnweighted = data.value;
      }
    }
    else if (type === "sat") {
      updatedProfile.testing = updatedProfile.testing || {};
      updatedProfile.testing.sat = data.value;
    }
    else if (type === "act") {
      updatedProfile.testing = updatedProfile.testing || {};
      updatedProfile.testing.act = data.value;
    }
    else if (type === "activity") {
      updatedProfile.activities = updatedProfile.activities || [];
      updatedProfile.activities.push({
        id: Date.now().toString(),
        title: data.title || data.label,
        isLeadership: data.isLeadership,
      });
    }
    else if (type === "award") {
      updatedProfile.awards = updatedProfile.awards || [];
      updatedProfile.awards.push({
        id: Date.now().toString(),
        title: data.title || data.label,
        level: data.level,
      });
    }
    else if (type === "school") {
      updatedProfile.schools = updatedProfile.schools || [];
      // Check if school already exists
      if (!updatedProfile.schools.find(s => s.name === data.name)) {
        updatedProfile.schools.push({
          id: Date.now().toString(),
          name: data.name,
          status: "exploring",
        });
      }
      setTargetSchool(data.name);
    }

    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    // Add follow-up message
    setTimeout(() => {
      const followUps = [
        "What else would you like to share?",
        "Anything else you want to add?",
        "Keep going — what else is part of your story?",
        "What else should I know about you?",
      ];
      addAssistantMessage(followUps[Math.floor(Math.random() * followUps.length)]);
    }, 500);
  };

  const handleWidgetDismiss = (msgId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.widget) {
          return { ...msg, widget: { ...msg.widget, status: "dismissed" as const } };
        }
        return msg;
      })
    );
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    addUserMessage(text);
    processUserInput(text);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg-app">
      {/* Left: Chat Interface */}
      <div className="flex-1 flex flex-col h-full relative">
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
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
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
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 text-[15px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-text-main text-white rounded-br-sm"
                      : "bg-white border border-border-subtle text-text-main rounded-bl-sm shadow-sm"
                  )}
                >
                  {msg.text}
                </div>

                {/* Widget */}
                {msg.widget && msg.widget.status !== "dismissed" && (
                  <DataWidget
                    type={msg.widget.type}
                    data={msg.widget.data}
                    status={msg.widget.status}
                    onConfirm={(data) => handleWidgetConfirm(msg.id, data, msg.widget!.type)}
                    onDismiss={() => handleWidgetDismiss(msg.id)}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-border-subtle rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-text-muted/40 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-border-subtle">
          <div className="relative max-w-3xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Share your GPA, test scores, activities..."
              className="w-full bg-bg-sidebar border border-border-medium rounded-xl pl-5 pr-14 py-4 text-[15px] focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-surface transition-all"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-text-main text-white rounded-lg hover:bg-black/80 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-3 max-w-3xl mx-auto">
            {!profile.academics?.gpaUnweighted && (
              <QuickSuggestion onClick={() => setInput("My GPA is ")} label="Add GPA" />
            )}
            {!profile.testing?.sat && !profile.testing?.act && (
              <QuickSuggestion onClick={() => setInput("I got a ")} label="Add test score" />
            )}
            {(!profile.activities || profile.activities.length === 0) && (
              <QuickSuggestion onClick={() => setInput("I'm involved in ")} label="Add activity" />
            )}
          </div>
        </div>
      </div>

      {/* Right: Profile & Chances Panel */}
      <div className="hidden md:flex w-[380px] bg-[#FAFAF9] flex-col border-l border-border-subtle p-6 overflow-y-auto">
        <ChancesPanel profile={profile} targetSchool={targetSchool} />
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

export default function AdvisorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-bg-app">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdvisorContent />
    </Suspense>
  );
}
