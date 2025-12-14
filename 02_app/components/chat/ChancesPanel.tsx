"use client";

import React from "react";
import { 
  GraduationCap, 
  PenTool, 
  Users, 
  Trophy, 
  FlaskConical, 
  Check, 
  AlertCircle, 
  Minus,
  TrendingUp,
  Target,
  Sparkles,
  School,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentProfile, calculateChances, getProfileCompleteness } from "@/lib/profile";

interface ChancesPanelProps {
  profile: StudentProfile;
  targetSchool?: string;
}

export function ChancesPanel({ profile, targetSchool }: ChancesPanelProps) {
  const completeness = getProfileCompleteness(profile);
  const chances = targetSchool ? calculateChances(profile, targetSchool) : null;
  
  // Get display name
  const name = profile.onboarding?.name || "Student";
  const grade = profile.onboarding?.grade;
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-text-muted mb-2">
          Your Profile
        </h3>
        <div className="text-lg font-display font-bold text-text-main">
          {name}
          {grade && <span className="text-text-muted font-normal text-sm ml-2">• {grade}</span>}
        </div>
      </div>
      
      {/* Chances Card (if school selected) */}
      {chances && targetSchool && (
        <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-card mb-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-accent-primary" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {targetSchool}
            </span>
          </div>
          
          {/* Chance Display */}
          <div className="text-center mb-4">
            <div className={cn(
              "inline-flex items-baseline gap-1 px-4 py-2 rounded-xl",
              chances.tier === "reach" && "bg-reach-bg",
              chances.tier === "target" && "bg-target-bg",
              chances.tier === "safety" && "bg-safety-bg"
            )}>
              <span className={cn(
                "font-display font-bold text-4xl",
                chances.tier === "reach" && "text-reach-text",
                chances.tier === "target" && "text-target-text",
                chances.tier === "safety" && "text-safety-text"
              )}>
                ~{chances.chance}%
              </span>
            </div>
            <div className={cn(
              "text-xs font-bold uppercase tracking-wider mt-2",
              chances.tier === "reach" && "text-reach-text",
              chances.tier === "target" && "text-target-text",
              chances.tier === "safety" && "text-safety-text"
            )}>
              {chances.tier.toUpperCase()}
            </div>
          </div>
          
          {/* Confidence indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    (chances.confidence === "high" && i <= 3) ||
                    (chances.confidence === "medium" && i <= 2) ||
                    (chances.confidence === "low" && i <= 1)
                      ? "bg-accent-primary"
                      : "bg-border-medium"
                  )}
                />
              ))}
            </div>
            <span>{chances.confidence} confidence</span>
          </div>
          
          {/* Breakdown */}
          <div className="space-y-2">
            {chances.breakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {item.status === "strong" && <Check className="w-4 h-4 text-green-600" />}
                  {item.status === "ok" && <Minus className="w-4 h-4 text-yellow-600" />}
                  {item.status === "weak" && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {item.status === "missing" && <AlertCircle className="w-4 h-4 text-text-light" />}
                  <span className={cn(
                    item.status === "missing" && "text-text-light"
                  )}>
                    {item.factor}
                  </span>
                </div>
                <span className={cn(
                  "font-mono text-xs",
                  item.status === "strong" && "text-green-600",
                  item.status === "weak" && "text-red-500",
                  item.status === "missing" && "text-text-light"
                )}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
          
          {chances.confidence !== "high" && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="text-xs text-text-muted flex items-start gap-2">
                <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Add more info to improve accuracy</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Profile Completeness */}
      <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Profile Strength
          </span>
          <span className="font-mono font-bold text-accent-primary">{completeness.total}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-bg-sidebar rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-accent-primary rounded-full transition-all duration-500"
            style={{ width: `${completeness.total}%` }}
          />
        </div>
        
        {/* Section checklist */}
        <div className="space-y-2">
          {completeness.sections.map((section, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className={cn(
                "w-4 h-4 rounded flex items-center justify-center",
                section.complete 
                  ? "bg-accent-primary text-white" 
                  : "border border-border-medium"
              )}>
                {section.complete && <Check className="w-3 h-3" />}
              </div>
              <span className={cn(
                section.complete ? "text-text-main" : "text-text-muted"
              )}>
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Profile Data */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
          What You've Shared
        </h4>
        
        <div className="space-y-3">
          {/* Academics */}
          {(profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted) && (
            <ProfileItem 
              icon={GraduationCap}
              label="Academics"
              value={profile.academics.gpaUnweighted 
                ? `${profile.academics.gpaUnweighted} GPA (UW)` 
                : `${profile.academics.gpaWeighted} GPA (W)`
              }
            />
          )}
          
          {/* Testing */}
          {profile.testing?.sat && (
            <ProfileItem 
              icon={PenTool}
              label="SAT"
              value={profile.testing.sat.toString()}
            />
          )}
          {profile.testing?.act && (
            <ProfileItem 
              icon={PenTool}
              label="ACT"
              value={profile.testing.act.toString()}
            />
          )}
          
          {/* Activities */}
          {profile.activities && profile.activities.length > 0 && (
            <ProfileItem 
              icon={Users}
              label="Activities"
              value={`${profile.activities.length} added`}
              detail={profile.activities.slice(0, 2).map(a => a.title).join(", ")}
            />
          )}
          
          {/* Awards */}
          {profile.awards && profile.awards.length > 0 && (
            <ProfileItem 
              icon={Trophy}
              label="Awards"
              value={`${profile.awards.length} added`}
              detail={profile.awards.slice(0, 2).map(a => a.title).join(", ")}
            />
          )}
          
          {/* Schools */}
          {profile.schools && profile.schools.length > 0 && (
            <ProfileItem 
              icon={School}
              label="Schools"
              value={`${profile.schools.length} on list`}
              detail={profile.schools.slice(0, 3).map(s => s.name).join(", ")}
            />
          )}

          {/* Goals */}
          {profile.goals && profile.goals.length > 0 && (
            <ProfileItem 
              icon={Calendar}
              label="Goals"
              value={`${profile.goals.length} set`}
              detail={profile.goals.slice(0, 2).map(g => g.title).join(", ")}
            />
          )}
          
          {/* Empty state */}
          {!profile.academics?.gpaUnweighted && 
           !profile.academics?.gpaWeighted && 
           !profile.testing?.sat && 
           !profile.testing?.act &&
           (!profile.activities || profile.activities.length === 0) &&
           (!profile.awards || profile.awards.length === 0) &&
           (!profile.schools || profile.schools.length === 0) &&
           (!profile.goals || profile.goals.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 text-text-muted opacity-60">
              <Sparkles className="w-8 h-8 mb-3" />
              <p className="text-sm text-center">
                Share your GPA, test scores,<br/>or activities to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ 
  icon: Icon, 
  label, 
  value, 
  detail 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  detail?: string;
}) {
  return (
    <div className="bg-bg-sidebar rounded-lg p-3 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-text-muted" />
        <span className="text-xs text-text-muted">{label}</span>
        <span className="ml-auto font-mono font-semibold text-sm text-text-main">{value}</span>
      </div>
      {detail && (
        <div className="text-xs text-text-muted mt-1 truncate pl-6">{detail}</div>
      )}
    </div>
  );
}
