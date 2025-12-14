"use client";

import React from "react";
import { GraduationCap, Target, School, ChevronRight, TrendingUp, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { StudentProfile, calculateChances } from "@/lib/profile";

interface ThreePillarsProps {
  profile: StudentProfile;
}

export function ThreePillars({ profile }: ThreePillarsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
      <ProfilePillar profile={profile} />
      <GoalsPillar profile={profile} />
      <SchoolsPillar profile={profile} />
    </div>
  );
}

function ProfilePillar({ profile }: { profile: StudentProfile }) {
  const hasAcademics = !!(profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted);
  const hasTesting = !!(profile.testing?.sat || profile.testing?.act);
  const activityCount = profile.activities?.length || 0;
  const awardCount = profile.awards?.length || 0;
  
  const stats = [
    hasAcademics && { 
      label: "GPA", 
      value: profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted,
      sub: profile.academics?.gpaUnweighted ? "UW" : "W"
    },
    hasTesting && profile.testing?.sat && { label: "SAT", value: profile.testing.sat },
    hasTesting && profile.testing?.act && { label: "ACT", value: profile.testing.act },
  ].filter(Boolean) as { label: string; value: number | undefined; sub?: string }[];
  
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-surface text-accent-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base">Profile</h3>
        </div>
        <Link href="/portfolio" className="text-xs text-accent-primary hover:underline flex items-center gap-0.5">
          View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      {stats.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {stats.slice(0, 4).map((stat, i) => (
            <div key={i} className="bg-bg-sidebar rounded-lg p-2.5">
              <div className="text-[10px] text-text-muted uppercase tracking-wide">{stat.label}</div>
              <div className="font-mono font-bold text-lg text-text-main">
                {stat.value}
                {stat.sub && <span className="text-xs text-text-muted ml-1">{stat.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-text-muted">No academics added yet</p>
        </div>
      )}
      
      <div className="flex gap-4 text-sm">
        {activityCount > 0 && (
          <div className="flex items-center gap-1.5 text-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span>{activityCount} activities</span>
          </div>
        )}
        {awardCount > 0 && (
          <div className="flex items-center gap-1.5 text-text-muted">
            <Trophy className="w-3.5 h-3.5" />
            <span>{awardCount} awards</span>
          </div>
        )}
      </div>
      
      {activityCount === 0 && awardCount === 0 && !hasAcademics && (
        <Link href="/advisor?mode=profile" className="text-sm text-accent-primary hover:underline">
          + Add your first entry
        </Link>
      )}
    </div>
  );
}

function GoalsPillar({ profile }: { profile: StudentProfile }) {
  const goals = profile.goals || [];
  const inProgress = goals.filter(g => g.status === "in_progress");
  const planning = goals.filter(g => g.status === "planning");
  const completed = goals.filter(g => g.status === "completed");
  
  const categoryIcons: Record<string, string> = {
    research: "🔬",
    competition: "🏆",
    leadership: "👥",
    project: "💡",
    other: "🎯",
  };
  
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-surface text-accent-primary rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base">Goals</h3>
        </div>
        <Link href="/plan" className="text-xs text-accent-primary hover:underline flex items-center gap-0.5">
          View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      {goals.length > 0 ? (
        <>
          <div className="space-y-2 mb-4">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center gap-2 p-2 bg-bg-sidebar rounded-lg">
                <span className="text-sm">{categoryIcons[goal.category] || "🎯"}</span>
                <span className="text-sm font-medium text-text-main flex-1 truncate">{goal.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  goal.status === "in_progress" ? "bg-accent-surface text-accent-primary" :
                  goal.status === "completed" ? "bg-success-bg text-success-text" :
                  "bg-bg-sidebar text-text-muted border border-border-subtle"
                }`}>
                  {goal.status === "in_progress" ? "Active" : goal.status === "completed" ? "Done" : "Planned"}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 text-xs text-text-muted">
            {inProgress.length > 0 && <span>{inProgress.length} active</span>}
            {planning.length > 0 && <span>{planning.length} planned</span>}
            {completed.length > 0 && <span className="text-success-text">{completed.length} completed</span>}
          </div>
        </>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 text-center">
          <p className="text-sm text-text-muted mb-2">No goals set yet</p>
          <Link href="/advisor?mode=planning" className="text-sm text-accent-primary hover:underline">
            + Set your first goal
          </Link>
        </div>
      )}
    </div>
  );
}

function SchoolsPillar({ profile }: { profile: StudentProfile }) {
  const schools = profile.schools || [];
  const dreamSchool = profile.onboarding?.dreamSchool;
  
  // Combine dream school with school list
  const allSchools = dreamSchool && !schools.find(s => s.name.toLowerCase() === dreamSchool.toLowerCase())
    ? [{ id: "dream", name: dreamSchool, status: "dream" as const }, ...schools]
    : schools;
  
  // Calculate chances for dream school if we have enough profile data
  const hasEnoughData = !!(profile.academics?.gpaUnweighted || profile.testing?.sat);
  const dreamSchoolChances = dreamSchool && hasEnoughData 
    ? calculateChances(profile, dreamSchool)
    : null;
  
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-surface text-accent-primary rounded-lg flex items-center justify-center">
            <School className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base">Schools</h3>
        </div>
        <Link href="/schools" className="text-xs text-accent-primary hover:underline flex items-center gap-0.5">
          View <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      {allSchools.length > 0 ? (
        <>
          {/* Dream school with chances */}
          {dreamSchool && dreamSchoolChances && (
            <div className="bg-accent-surface/50 border border-accent-border/50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-accent-primary uppercase tracking-wide font-bold">Dream School</div>
                  <div className="font-display font-bold text-text-main">{dreamSchool}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-accent-primary">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">~{dreamSchoolChances.chance}%</span>
                  </div>
                  <div className={`text-[10px] font-bold uppercase ${
                    dreamSchoolChances.tier === "reach" ? "text-reach-text" :
                    dreamSchoolChances.tier === "target" ? "text-target-text" :
                    "text-safety-text"
                  }`}>
                    {dreamSchoolChances.tier}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Other schools */}
          <div className="space-y-1.5 mb-3">
            {allSchools.filter(s => s.name !== dreamSchool).slice(0, 3).map(school => (
              <div key={school.id} className="flex items-center gap-2 p-2 bg-bg-sidebar rounded-lg">
                <div className="w-6 h-6 bg-white text-text-muted rounded flex items-center justify-center text-xs font-bold border border-border-subtle">
                  {school.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-text-main flex-1 truncate">{school.name}</span>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-text-muted">
            {allSchools.length} school{allSchools.length !== 1 ? "s" : ""} on your list
          </div>
        </>
      ) : (
        <div className="bg-bg-sidebar rounded-lg p-4 text-center">
          <p className="text-sm text-text-muted mb-2">No schools added yet</p>
          <Link href="/advisor?mode=schools" className="text-sm text-accent-primary hover:underline">
            + Add your first school
          </Link>
        </div>
      )}
    </div>
  );
}
