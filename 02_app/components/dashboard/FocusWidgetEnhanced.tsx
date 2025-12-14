"use client";

import React from "react";
import { Target, ArrowRight, Clock, Check, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { StudentProfile, Goal } from "@/lib/profile";

interface FocusWidgetEnhancedProps {
  profile: StudentProfile;
}

// Get the most important goal to focus on
function getPrimaryFocus(profile: StudentProfile): { goal: Goal | null; advice: string; nextStep: string } {
  const goals = profile.goals || [];
  
  // Prioritize: in_progress > planning
  const inProgress = goals.find(g => g.status === "in_progress");
  if (inProgress) {
    return {
      goal: inProgress,
      advice: getAdviceForGoal(inProgress),
      nextStep: getNextStepForGoal(inProgress),
    };
  }
  
  const planning = goals.find(g => g.status === "planning");
  if (planning) {
    return {
      goal: planning,
      advice: getAdviceForGoal(planning),
      nextStep: "Start working on this goal",
    };
  }
  
  // No goals set
  return {
    goal: null,
    advice: "Set your first goal to get personalized recommendations.",
    nextStep: "Define what you want to achieve",
  };
}

function getAdviceForGoal(goal: Goal): string {
  const adviceMap: Record<string, string> = {
    research: "Research programs value curiosity and initiative. Highlight any independent projects.",
    competition: "Consistent practice is key. Focus on problem-solving techniques.",
    leadership: "Document your impact with numbers. How many people did you help?",
    project: "Show progression and learning. What problems did you solve?",
  };
  return adviceMap[goal.category] || "Stay focused and take it one step at a time.";
}

function getNextStepForGoal(goal: Goal): string {
  const stepMap: Record<string, string> = {
    research: "Prepare your application materials",
    competition: "Complete today's practice set",
    leadership: "Plan your next initiative",
    project: "Work on the next milestone",
  };
  return stepMap[goal.category] || "Continue making progress";
}

// Generate timeline items from goals and profile
function getTimelineItems(profile: StudentProfile): { date: string; title: string; status: "done" | "active" | "upcoming" }[] {
  const items: { date: string; title: string; status: "done" | "active" | "upcoming" }[] = [];
  
  // Add completed goals
  const completedGoals = (profile.goals || []).filter(g => g.status === "completed");
  completedGoals.slice(0, 1).forEach(g => {
    items.push({ date: "Completed", title: g.title.slice(0, 35) + (g.title.length > 35 ? "..." : ""), status: "done" });
  });
  
  // Add current focus
  const inProgress = (profile.goals || []).find(g => g.status === "in_progress");
  if (inProgress) {
    items.push({ date: "Now", title: inProgress.title.slice(0, 35) + (inProgress.title.length > 35 ? "..." : ""), status: "active" });
  }
  
  // Add upcoming goals
  const planning = (profile.goals || []).filter(g => g.status === "planning");
  planning.slice(0, 2).forEach((g, i) => {
    items.push({ date: i === 0 ? "Next" : "Later", title: g.title.slice(0, 35) + (g.title.length > 35 ? "..." : ""), status: "upcoming" });
  });
  
  // Add school deadlines if we have schools
  if ((profile.schools?.length || 0) > 0 && items.length < 4) {
    items.push({ date: "Spring", title: "Application deadlines", status: "upcoming" });
  }
  
  // Fallback if no items
  if (items.length === 0) {
    items.push({ date: "Now", title: "Set your first goal", status: "active" });
    items.push({ date: "Next", title: "Build your profile", status: "upcoming" });
    items.push({ date: "Soon", title: "Explore opportunities", status: "upcoming" });
  }
  
  return items.slice(0, 4);
}

export function FocusWidgetEnhanced({ profile }: FocusWidgetEnhancedProps) {
  const { goal, advice, nextStep } = getPrimaryFocus(profile);
  const timelineItems = getTimelineItems(profile);
  const dreamSchool = profile.onboarding?.dreamSchool;
  
  return (
    <div className="bg-white border border-border-subtle rounded-[20px] p-1.5 shadow-float mb-10 relative overflow-hidden">
      <div className="bg-[#FAFAF9] rounded-xl flex flex-col lg:flex-row relative">
        {/* Decorative Blob */}
        <div className="absolute -top-1/2 -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,var(--color-accent-surface)_0%,rgba(255,255,255,0)_70%)] opacity-80 pointer-events-none" />

        {/* Main Content - Focus */}
        <div className="p-8 flex-[2] relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-medium rounded-full text-xs font-bold text-text-muted uppercase tracking-wide mb-4">
            <Target className="w-3.5 h-3.5" />
            Today's Focus
          </div>
          
          {goal ? (
            <>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-3 text-text-main leading-tight">
                {goal.title}
              </h2>
              
              <p className="text-text-muted mb-6 max-w-lg leading-relaxed">
                {advice}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/advisor">
                  <Button>
                    Work on this
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/plan">
                  <Button variant="secondary">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    View Plan
                  </Button>
                </Link>
              </div>

              <div className="bg-accent-surface/50 border border-accent-border/50 rounded-lg p-4 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-text-main mb-1">Next step</div>
                  <div className="text-sm text-text-muted">{nextStep}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-3 text-text-main leading-tight">
                {dreamSchool ? `Let's plan your path to ${dreamSchool}` : "Set your first goal"}
              </h2>
              
              <p className="text-text-muted mb-6 max-w-lg leading-relaxed">
                {advice}
              </p>

              <Link href="/advisor?mode=planning">
                <Button>
                  Set a Goal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Right Side - Timeline */}
        <div className="w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l border-border-medium p-6 bg-white/50 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Timeline</h4>
            <Link href="/plan" className="text-xs text-accent-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex flex-col gap-4 relative">
            {/* Vertical line - positioned to align with circle centers */}
            <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border-subtle" />

            {timelineItems.map((item, i) => (
              <TimelineItem key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ status, date, title }: { status: "done" | "active" | "upcoming"; date: string; title: string }) {
  const isDone = status === "done";
  const isActive = status === "active";
  
  return (
    <div className="flex items-start gap-3">
      {/* Circle - centered on the vertical line */}
      <div className={`relative w-4 h-4 rounded-full border-[3px] bg-white shrink-0 mt-0.5 ${
        isDone || isActive ? 'border-accent-primary' : 'border-border-medium'
      } ${isDone ? 'bg-accent-primary' : ''}`}>
        {isDone && <Check className="w-2 h-2 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
      </div>
      
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-accent-primary' : 'text-text-muted'}`}>
          {date}
        </div>
        <div className={`text-sm font-medium truncate ${isDone ? 'text-text-muted line-through' : 'text-text-main'}`}>
          {title}
        </div>
      </div>
    </div>
  );
}
