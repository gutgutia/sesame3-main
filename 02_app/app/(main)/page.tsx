"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Coffee, FlaskConical, Users, Calculator, Target, Sparkles, TrendingUp, MessageCircle } from "lucide-react";
import { ZenInput } from "@/components/dashboard/ZenInput";
import { FocusWidget } from "@/components/dashboard/FocusWidget";
import { PillarSnapshot } from "@/components/dashboard/PillarSnapshot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type OnboardingData = {
  name?: string;
  grade?: string;
  feeling?: string;
  dreamSchool?: string;
  hasDreamSchool?: boolean;
};

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getEncouragingMessage(feeling?: string, grade?: string): string {
  if (feeling === "Overwhelmed") {
    return "Take a breath. We'll tackle this together, one step at a time.";
  }
  if (feeling === "Behind") {
    return "You're exactly where you need to be. Let's build momentum.";
  }
  if (feeling === "Confident") {
    return "You're doing great. Let's keep that energy going.";
  }
  if (grade === "12th Grade") {
    return "Senior year is here. You've got this — let's finish strong.";
  }
  if (grade === "11th Grade") {
    return "Junior year is key. You're right on track.";
  }
  return "One step at a time. You've got this.";
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("new") === "true";
  const [userData, setUserData] = useState<OnboardingData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load onboarding data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sesame3_onboarding");
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse onboarding data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Don't render until we've loaded the data (prevents flash)
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userName = userData.name || "there";
  const greeting = getTimeOfDayGreeting();
  const encouragement = getEncouragingMessage(userData.feeling, userData.grade);

  if (isNewUser) {
    // Determine what the first task should be based on what we know
    const hasBasicInfo = userData.name && userData.grade;
    
    return (
      <>
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
            Welcome{userData.name ? `, ${userData.name}` : " to your workspace"}.
          </h1>
          <p className="text-text-muted text-base md:text-lg">
            {userData.feeling === "Overwhelmed" 
              ? "Let's start small. One thing at a time."
              : "Let's start by building your profile foundation."
            }
          </p>
        </div>

        <ZenInput />

        {/* Primary CTA: Check Chances (if they have a dream school) */}
        {userData.dreamSchool && (
          <div className="bg-gradient-to-br from-accent-surface to-white border border-accent-border rounded-[20px] p-8 shadow-float mb-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-white text-accent-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-accent-border">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-2xl mb-2 text-text-main">
                  See your chances at {userData.dreamSchool}
                </h2>
                <p className="text-text-muted mb-4 max-w-lg">
                  Share your GPA and test scores, and I'll show you where you stand. Every detail helps refine your chances.
                </p>
                <Link href="/advisor?mode=chances">
                  <Button>
                    <TrendingUp className="w-4 h-4" />
                    Check My Chances
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Secondary CTA: Build Profile */}
        <div className="bg-white border border-border-subtle rounded-[20px] p-8 shadow-float mb-12 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-accent-surface text-accent-primary rounded-2xl flex items-center justify-center shrink-0">
              {userData.dreamSchool ? <MessageCircle className="w-8 h-8" /> : <Target className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl mb-2">
                {userData.dreamSchool 
                  ? "Or, start building your full profile"
                  : hasBasicInfo 
                  ? "First Goal: Check Your Chances" 
                  : "Let's get to know you"
                }
              </h2>
              <p className="text-text-muted mb-4 max-w-lg">
                {userData.dreamSchool 
                  ? "Tell me about your activities, awards, and goals. The more I know, the better I can help."
                  : hasBasicInfo 
                  ? "To give you accurate chances, I need a baseline. Let's add your GPA or a recent test score."
                  : "Tell me a bit about yourself so I can personalize your experience."
                }
              </p>
              <Link href={userData.dreamSchool ? "/advisor" : "/advisor?mode=chances"}>
                <Button variant={userData.dreamSchool ? "secondary" : "primary"}>
                  {userData.dreamSchool 
                    ? "Chat with Sesame"
                    : hasBasicInfo 
                    ? "Check My Chances" 
                    : "Get Started"
                  }
                </Button>
              </Link>
            </div>
          </div>

          {/* Show what we know so far */}
          {(userData.grade || userData.dreamSchool) && (
            <div className="mt-6 pt-6 border-t border-border-subtle">
              <div className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">What I know so far</div>
              <div className="flex flex-wrap gap-2">
                {userData.grade && (
                  <span className="px-3 py-1.5 bg-bg-sidebar rounded-full text-sm text-text-muted">
                    📚 {userData.grade}
                  </span>
                )}
                {userData.dreamSchool && (
                  <span className="px-3 py-1.5 bg-accent-surface text-accent-primary rounded-full text-sm font-medium">
                    🎯 Dream: {userData.dreamSchool}
                  </span>
                )}
                {userData.feeling && (
                  <span className="px-3 py-1.5 bg-bg-sidebar rounded-full text-sm text-text-muted">
                    {userData.feeling === "Overwhelmed" ? "😮‍💨" : userData.feeling === "Confident" ? "💪" : "🌱"} {userData.feeling}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 opacity-50 pointer-events-none grayscale-[30%]">
          {/* Blurred out content to focus user on the main task */}
          <div className="flex flex-col gap-8">
            <PillarSnapshot />
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-5">Timeline</h3>
              <Card className="h-64 flex items-center justify-center border-dashed">
                <span className="text-text-muted text-sm">Your timeline will appear here</span>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Returning user (full dashboard)
  return (
    <>
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
          {greeting}, {userName}.
        </h1>
        <p className="text-text-muted text-base md:text-lg">
          {encouragement}
        </p>
      </div>

      <ZenInput />

      <FocusWidget />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <PillarSnapshot />

          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-lg">Active Goals</h3>
              <a href="#" className="text-[13px] font-medium text-accent-primary hover:underline">View all</a>
            </div>
            
            <Card className="p-0 overflow-hidden">
              <GoalRow 
                icon={FlaskConical} 
                title="Summer Research" 
                meta="Applications open • 2 deadlines soon" 
                progress={40} 
                active 
              />
              <GoalRow 
                icon={Users} 
                title="EduAccess Nonprofit" 
                meta="Growth phase • 50+ members" 
                progress={65} 
              />
              <GoalRow 
                icon={Calculator} 
                title="AIME Qualification" 
                meta="Study plan created • Exam in Feb" 
                progress={25} 
              />
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-5">Timeline</h3>
            
            {/* Advisor Note - Personalized */}
            <div className="bg-bg-sidebar rounded-xl p-4 flex gap-3 items-start mb-6">
              <div className="w-8 h-8 bg-text-main text-white rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-[13px] text-text-main leading-relaxed">
                <strong>Tip for this week:</strong> Since your <em>Academics</em> are strong, focusing on the <em>Programs</em> pillar (like SIMR) is the smartest move right now.
              </div>
            </div>

            <Card>
              <div className="flex flex-col gap-5 pl-3 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border-subtle" />
                
                <TimelineItem 
                  status="done" 
                  date="Yesterday" 
                  title="Draft Intro Essay" 
                />
                <TimelineItem 
                  status="active" 
                  date="Today" 
                  title="Gather transcripts" 
                />
                <TimelineItem 
                  date="Jan 15" 
                  title="SIMR Deadline" 
                />
                <TimelineItem 
                  date="Jan 20" 
                  title="AMC Registration" 
                />
              </div>
            </Card>
          </div>

          {/* Dream School Card (if they have one) */}
          {userData.dreamSchool && (
            <div>
              <h3 className="font-display font-bold text-lg mb-5">Dream School</h3>
              <Card className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-surface text-accent-primary rounded-xl flex items-center justify-center font-bold text-lg">
                    {userData.dreamSchool.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg">{userData.dreamSchool}</div>
                    <div className="text-sm text-text-muted">Your target</div>
                  </div>
                </div>
                <Link 
                  href="/schools" 
                  className="text-sm text-accent-primary hover:underline font-medium"
                >
                  View match analysis →
                </Link>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 text-center text-text-light text-[13px] flex items-center justify-center gap-2">
        <Coffee className="w-4 h-4" />
        <span>Remember to take breaks. You've got this.</span>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function GoalRow({ icon: Icon, title, meta, progress, active }: any) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-bg-sidebar last:border-0 hover:bg-bg-card-hover transition-colors cursor-pointer">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-accent-surface text-accent-primary' : 'bg-bg-sidebar text-text-muted'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-[15px] text-text-main mb-0.5">{title}</div>
        <div className="text-[13px] text-text-muted">{meta}</div>
      </div>
      {/* Simple SVG Progress Ring */}
      <div className="relative w-8 h-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-bg-sidebar" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className="text-accent-primary" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function TimelineItem({ status, date, title }: any) {
  const isDone = status === "done";
  const isActive = status === "active";
  
  return (
    <div className="relative pl-6">
      <div className={`absolute left-[-5px] top-1 w-4 h-4 rounded-full border-[3px] bg-white z-10 ${
        isDone || isActive ? 'border-accent-primary' : 'border-border-medium'
      } ${isDone ? 'bg-accent-primary' : ''}`} />
      
      <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}>
        {date}
      </div>
      <div className={`text-sm font-semibold ${isDone ? 'text-text-muted line-through' : 'text-text-main'}`}>
        {title}
      </div>
    </div>
  );
}
