"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChancesPanel } from "@/components/chat/ChancesPanel";
import { useProfile } from "@/lib/context/ProfileContext";

function AdvisorContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const mode = searchParams.get("mode") as "general" | "onboarding" | "chances" | "schools" | "planning" | "profile" | "story" || "general";
  
  // Use global profile context (already loaded on app init)
  const { profile, refreshProfile } = useProfile();
  
  // Pre-fetch welcome message on page load
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const welcomeFetched = useRef(false);
  
  useEffect(() => {
    if (welcomeFetched.current) return;
    welcomeFetched.current = true;
    
    // Start fetching welcome message immediately on page load
    const fetchWelcome = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch("/api/chat/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode }),
        });
        
        if (res.ok) {
          const { message } = await res.json();
          setWelcomeMessage(message);
          console.log(`[Advisor] Welcome pre-fetched in ${Date.now() - startTime}ms`);
        }
      } catch (error) {
        console.error("[Advisor] Failed to pre-fetch welcome:", error);
      }
    };
    
    fetchWelcome();
  }, [mode]);
  
  // Find target school for chances panel
  const targetSchool = profile?.schoolList?.find(
    (s) => s.tier === "dream"
  )?.school?.name;
  
  const handleProfileUpdate = () => {
    // Refresh the global profile context when data is saved
    refreshProfile();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg-app">
      {/* Left: Chat Interface */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatInterface 
          mode={mode}
          initialMessage={initialQuery || undefined}
          onProfileUpdate={handleProfileUpdate}
          preloadedWelcome={welcomeMessage}
        />
      </div>

      {/* Right: Profile & Chances Panel */}
      <div className="hidden md:flex w-[380px] bg-[#FAFAF9] flex-col border-l border-border-subtle p-6 overflow-y-auto">
        <ChancesPanel profile={profile || {}} targetSchool={targetSchool} />
      </div>
    </div>
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
