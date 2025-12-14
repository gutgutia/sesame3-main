"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChancesPanel } from "@/components/chat/ChancesPanel";
import { StudentProfile } from "@/lib/profile";
import { useState, useEffect } from "react";

function AdvisorContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const mode = searchParams.get("mode") as "general" | "chances" | "schools" | "planning" | "profile" | "story" || "general";
  
  const [profile, setProfile] = useState<StudentProfile>({});
  const [targetSchool, setTargetSchool] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch profile from API
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        // If there's a dream school in the list, set it as target
        const dreamSchool = data.schoolList?.find((s: { tier: string }) => s.tier === "dream");
        if (dreamSchool) {
          setTargetSchool(dreamSchool.school?.name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, [refreshKey]);
  
  const handleProfileUpdate = () => {
    // Refresh the profile when data is saved
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg-app">
      {/* Left: Chat Interface */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatInterface 
          mode={mode}
          initialMessage={initialQuery || undefined}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>

      {/* Right: Profile & Chances Panel */}
      <div className="hidden md:flex w-[380px] bg-[#FAFAF9] flex-col border-l border-border-subtle p-6 overflow-y-auto">
        <ChancesPanel profile={profile} targetSchool={targetSchool} />
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
