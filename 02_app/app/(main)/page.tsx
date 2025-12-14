"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Coffee, FlaskConical, Users, Calculator, Target, Sparkles, TrendingUp, GraduationCap, Calendar, School, ChevronRight, Plus, Check } from "lucide-react";
import { ZenInput } from "@/components/dashboard/ZenInput";
import { FocusWidgetEnhanced } from "@/components/dashboard/FocusWidgetEnhanced";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ThreePillars } from "@/components/dashboard/ThreePillars";
import { PillarSnapshot } from "@/components/dashboard/PillarSnapshot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { loadProfile, calculateZone, StudentProfile, DashboardZone, ZoneStatus } from "@/lib/profile";

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

// Mock profiles for each zone (for prototyping)
const MOCK_PROFILES: Record<number, StudentProfile> = {
  0: {
    // Zone 0: Just completed onboarding, nothing else
    onboarding: {
      name: "Alex",
      grade: "11th Grade",
      feeling: "Excited",
      dreamSchool: "Stanford",
    },
  },
  1: {
    // Zone 1: Has schools only
    onboarding: {
      name: "Alex",
      grade: "11th Grade",
      feeling: "Excited",
      dreamSchool: "Stanford",
    },
    schools: [
      { id: "1", name: "MIT", status: "reach" },
      { id: "2", name: "UCLA", status: "target" },
    ],
  },
  2: {
    // Zone 2: Has schools + profile
    onboarding: {
      name: "Alex",
      grade: "11th Grade",
      feeling: "Confident",
      dreamSchool: "Stanford",
    },
    schools: [
      { id: "1", name: "MIT", status: "reach" },
      { id: "2", name: "UCLA", status: "target" },
      { id: "3", name: "UC Berkeley", status: "reach" },
    ],
    academics: {
      gpaUnweighted: 3.92,
    },
    testing: {
      sat: 1520,
    },
    activities: [
      { id: "1", title: "Robotics Club President", isLeadership: true },
      { id: "2", title: "Math Olympiad Team", isLeadership: false },
    ],
  },
  3: {
    // Zone 3: Full profile
    onboarding: {
      name: "Alex",
      grade: "11th Grade",
      feeling: "Confident",
      dreamSchool: "Stanford",
    },
    schools: [
      { id: "1", name: "Stanford", status: "dream" },
      { id: "2", name: "MIT", status: "reach" },
      { id: "3", name: "UCLA", status: "target" },
      { id: "4", name: "UC Berkeley", status: "reach" },
      { id: "5", name: "Georgia Tech", status: "target" },
    ],
    academics: {
      gpaUnweighted: 3.92,
      gpaWeighted: 4.3,
    },
    testing: {
      sat: 1520,
    },
    activities: [
      { id: "1", title: "Robotics Club President", isLeadership: true },
      { id: "2", title: "Math Olympiad Team", isLeadership: false },
      { id: "3", title: "Volunteer Tutor at Local Library", isLeadership: false },
    ],
    awards: [
      { id: "1", title: "AIME Qualifier", level: "national" },
      { id: "2", title: "Regional Science Fair - 2nd Place", level: "regional" },
    ],
    goals: [
      { 
        id: "1", 
        title: "Apply to SIMR Summer Research", 
        category: "research", 
        status: "in_progress",
        targetDate: "Jan 15",
        tasks: [
          { id: "t1", title: "Draft Essay 1", completed: true },
          { id: "t2", title: "Draft Essay 2", completed: false },
          { id: "t3", title: "Upload Transcript", completed: false },
          { id: "t4", title: "Submit Application", completed: false },
        ],
      },
      { 
        id: "2", 
        title: "Qualify for USAMO", 
        category: "competition", 
        status: "planning",
        targetDate: "Feb 8",
        tasks: [
          { id: "t5", title: "Take AMC Practice Exam", completed: false },
          { id: "t6", title: "Review Number Theory", completed: false },
        ],
      },
      { 
        id: "3", 
        title: "Launch coding bootcamp for underserved students", 
        category: "leadership", 
        status: "planning",
        tasks: [
          { id: "t7", title: "Find venue", completed: false },
          { id: "t8", title: "Create curriculum", completed: false },
        ],
      },
    ],
  },
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const zoneOverride = searchParams.get("zone"); // For prototyping
  const [profile, setProfile] = useState<StudentProfile>({});
  const [zoneStatus, setZoneStatus] = useState<ZoneStatus | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  // Load profile data from localStorage (or use mock data for prototyping)
  useEffect(() => {
    let profileToUse: StudentProfile;
    let zoneStatusToUse: ZoneStatus;
    let usingMock = false;
    
    if (zoneOverride !== null) {
      // Use mock data for the specified zone
      const overrideZone = parseInt(zoneOverride) as DashboardZone;
      if (overrideZone >= 0 && overrideZone <= 3) {
        profileToUse = MOCK_PROFILES[overrideZone];
        zoneStatusToUse = calculateZone(profileToUse);
        zoneStatusToUse.zone = overrideZone; // Force the zone
        usingMock = true;
      } else {
        profileToUse = loadProfile();
        zoneStatusToUse = calculateZone(profileToUse);
      }
    } else {
      // Use real localStorage data
      profileToUse = loadProfile();
      zoneStatusToUse = calculateZone(profileToUse);
    }
    
    setProfile(profileToUse);
    setZoneStatus(zoneStatusToUse);
    setIsMockData(usingMock);
    setIsLoaded(true);
  }, [zoneOverride]);

  // Don't render until we've loaded the data (prevents flash)
  if (!isLoaded || !zoneStatus) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userName = profile.onboarding?.name || "there";
  const dreamSchool = profile.onboarding?.dreamSchool;
  const grade = profile.onboarding?.grade;
  const feeling = profile.onboarding?.feeling;
  const greeting = getTimeOfDayGreeting();
  const encouragement = getEncouragingMessage(feeling, grade);
  const { zone, areas } = zoneStatus;

  // ========== ZONE 0: Empty - Full CTAs ==========
  if (zone === 0) {
    return (
      <>
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
            Welcome{profile.onboarding?.name ? `, ${profile.onboarding.name}` : ""}.
          </h1>
          <p className="text-text-muted text-base md:text-lg">
            {dreamSchool 
              ? `Let's build your path to ${dreamSchool}.`
              : feeling === "Overwhelmed" 
              ? "Let's start small. One thing at a time."
              : "Let's set you up for success."
            }
          </p>
        </div>

        <ZenInput />

        {/* PRIMARY CTA: Check Chances */}
        <div className="bg-gradient-to-br from-accent-surface to-white border border-accent-border rounded-[20px] p-8 shadow-float mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-white text-accent-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-accent-border">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-accent-primary uppercase tracking-wider mb-2">Quick Start</div>
              <h2 className="font-display font-bold text-2xl mb-2 text-text-main">
                {dreamSchool 
                  ? `Check your chances at ${dreamSchool}`
                  : "Check your chances at any school"
                }
              </h2>
              <p className="text-text-muted mb-4 max-w-lg">
                Share a few details and I'll show you where you stand. Takes about 2 minutes.
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

        {/* SECONDARY CTAs: Three options */}
        <div className="mb-8">
          <div className="text-xs font-bold text-text-light uppercase tracking-wider mb-4">Or dive deeper</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CTACard 
              href="/advisor?mode=profile"
              icon={GraduationCap}
              title="Build Profile"
              description="Add your GPA, test scores, activities, and awards."
            />
            <CTACard 
              href="/advisor?mode=planning"
              icon={Calendar}
              title="Set Goals"
              description="Summer research? Competitions? Let's plan it out."
            />
            <CTACard 
              href="/advisor?mode=schools"
              icon={School}
              title="Build School List"
              description="Add schools, get suggestions, balance your list."
            />
          </div>
        </div>

        {/* What we know so far */}
        {(grade || dreamSchool || feeling) && (
          <div className="bg-bg-sidebar rounded-xl p-5 mb-8">
            <div className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">What I know so far</div>
            <div className="flex flex-wrap gap-2">
              {grade && (
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-text-muted border border-border-subtle">
                  📚 {grade}
                </span>
              )}
              {dreamSchool && (
                <span className="px-3 py-1.5 bg-accent-surface text-accent-primary rounded-full text-sm font-medium border border-accent-border">
                  🎯 Dream: {dreamSchool}
                </span>
              )}
              {feeling && (
                <span className="px-3 py-1.5 bg-white rounded-full text-sm text-text-muted border border-border-subtle">
                  {feeling === "Overwhelmed" ? "😮‍💨" : feeling === "Confident" ? "💪" : feeling === "Behind" ? "🏃" : "🌱"} {feeling}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Blurred preview of full dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 opacity-40 pointer-events-none grayscale-[40%]">
          <div className="flex flex-col gap-8">
            <PillarSnapshot />
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-5">Timeline</h3>
              <Card className="h-48 flex items-center justify-center border-dashed">
                <span className="text-text-muted text-sm">Your timeline will appear here</span>
              </Card>
            </div>
          </div>
        </div>

        <ZoneIndicator zone={zone} isMock={isMockData} />
      </>
    );
  }

  // ========== ZONE 1: One area filled ==========
  if (zone === 1) {
    return (
      <>
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
            {greeting}, {userName}.
          </h1>
          <p className="text-text-muted text-base md:text-lg">
            You're making progress. Let's keep building.
          </p>
        </div>

        <ZenInput />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mb-8">
          {/* Left: Show filled area as content + remaining CTAs */}
          <div className="flex flex-col gap-6">
            
            {/* Schools - if filled, show content */}
            {areas.schools.filled ? (
              <FilledSchoolsCard profile={profile} />
            ) : (
              <MiniCTACard 
                href="/advisor?mode=schools"
                icon={School}
                title="Build Your School List"
                description="Add schools to start seeing match analysis."
              />
            )}

            {/* Profile - if filled, show content */}
            {areas.profile.filled ? (
              <FilledProfileCard profile={profile} />
            ) : (
              <MiniCTACard 
                href="/advisor?mode=profile"
                icon={GraduationCap}
                title="Build Your Profile"
                description="Add GPA, test scores, and activities."
              />
            )}

            {/* Goals - if filled, show content */}
            {areas.goals.filled ? (
              <FilledGoalsCard profile={profile} />
            ) : (
              <MiniCTACard 
                href="/advisor?mode=planning"
                icon={Calendar}
                title="Set Your Goals"
                description="Plan your path to success."
              />
            )}
          </div>

          {/* Right: Encourage next step */}
          <div className="flex flex-col gap-6">
            <div className="bg-accent-surface/50 border border-accent-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Next Step</span>
              </div>
              <p className="text-sm text-text-main mb-4">
                {!areas.profile.filled && "Add your GPA or test scores to unlock chances calculations."}
                {areas.profile.filled && !areas.schools.filled && "Add schools to your list to see how you match."}
                {areas.profile.filled && areas.schools.filled && !areas.goals.filled && "Set a goal to start building your roadmap."}
              </p>
              <Link href={
                !areas.profile.filled ? "/advisor?mode=profile" :
                !areas.schools.filled ? "/advisor?mode=schools" :
                "/advisor?mode=planning"
              }>
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Add Now
                </Button>
              </Link>
            </div>

            {/* Progress indicator */}
            <div className="bg-bg-sidebar rounded-xl p-5">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Setup Progress</div>
              <div className="space-y-2">
                <ProgressItem label="School List" done={areas.schools.filled} />
                <ProgressItem label="Profile" done={areas.profile.filled} />
                <ProgressItem label="Goals" done={areas.goals.filled} />
              </div>
            </div>
          </div>
        </div>

        <ZoneIndicator zone={zone} isMock={isMockData} />
      </>
    );
  }

  // ========== ZONE 2: Two areas filled ==========
  if (zone === 2) {
    return (
      <>
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
            {greeting}, {userName}.
          </h1>
          <p className="text-text-muted text-base md:text-lg">
            {encouragement}
          </p>
        </div>

        <ZenInput />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Real content */}
          <div className="flex flex-col gap-6">
            {/* Schools */}
            {areas.schools.filled ? (
              <FilledSchoolsCard profile={profile} />
            ) : (
              <SubtlePrompt 
                href="/advisor?mode=schools"
                icon={School}
                text="Add schools to complete your setup"
              />
            )}

            {/* Profile */}
            {areas.profile.filled && <FilledProfileCard profile={profile} />}

            {/* Goals */}
            {areas.goals.filled ? (
              <FilledGoalsCard profile={profile} />
            ) : (
              <SubtlePrompt 
                href="/advisor?mode=planning"
                icon={Calendar}
                text="Set goals to complete your setup"
              />
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Timeline preview */}
            <div>
              <h3 className="font-display font-bold text-lg mb-4">Timeline</h3>
              <Card>
                <div className="flex flex-col gap-4 pl-3 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border-subtle" />
                  <TimelineItem status="active" date="Today" title="Continue building profile" />
                  <TimelineItem date="This week" title="Complete setup" />
                  <TimelineItem date="Soon" title="Get personalized recommendations" />
                </div>
              </Card>
            </div>

            {/* Remaining task */}
            {(!areas.schools.filled || !areas.profile.filled || !areas.goals.filled) && (
              <div className="bg-accent-surface/30 border border-accent-border/50 rounded-xl p-4">
                <div className="text-xs font-bold text-accent-primary uppercase tracking-wider mb-2">One more thing</div>
                <p className="text-sm text-text-muted mb-3">
                  {!areas.profile.filled && "Add your academics to unlock full features."}
                  {areas.profile.filled && !areas.schools.filled && "Add schools to see match analysis."}
                  {areas.profile.filled && areas.schools.filled && "Set goals to complete your setup."}
                </p>
                <Link href={
                  !areas.profile.filled ? "/advisor?mode=profile" :
                  !areas.schools.filled ? "/advisor?mode=schools" :
                  "/advisor?mode=planning"
                }>
                  <button className="text-sm text-accent-primary font-medium hover:underline flex items-center gap-1">
                    Complete now <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <ZoneIndicator zone={zone} isMock={isMockData} />
      </>
    );
  }

  // ========== ZONE 3: Full Dashboard ==========
  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main mb-2">
          {greeting}, {userName}.
        </h1>
        <p className="text-text-muted text-base md:text-lg">
          {encouragement}
        </p>
      </div>

      {/* Advisor Chat Input - Always present and inviting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-text-muted">Ask your advisor anything</span>
        </div>
        <ZenInput />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Focus Widget with Timeline */}
      <FocusWidgetEnhanced profile={profile} />

      {/* Three Pillars: Profile, Goals, Schools */}
      <ThreePillars profile={profile} />

      {/* Footer */}
      <div className="mt-8 text-center text-text-light text-[13px] flex items-center justify-center gap-2">
        <Coffee className="w-4 h-4" />
        <span>Remember to take breaks. You've got this.</span>
      </div>

      <ZoneIndicator zone={zone} isMock={isMockData} />
    </>
  );
}

// ============ HELPER COMPONENTS ============

function CTACard({ href, icon: Icon, title, description }: { href: string; icon: any; title: string; description: string }) {
  return (
    <Link href={href} className="group">
      <div className="bg-white border border-border-subtle rounded-xl p-5 h-full hover:border-accent-primary hover:shadow-card transition-all">
        <div className="w-10 h-10 bg-bg-sidebar text-text-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent-surface group-hover:text-accent-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </Link>
  );
}

function MiniCTACard({ href, icon: Icon, title, description }: { href: string; icon: any; title: string; description: string }) {
  return (
    <Link href={href} className="group">
      <div className="bg-white border border-border-subtle rounded-xl p-5 hover:border-accent-primary hover:shadow-card transition-all flex items-center gap-4">
        <div className="w-12 h-12 bg-bg-sidebar text-text-muted rounded-xl flex items-center justify-center group-hover:bg-accent-surface group-hover:text-accent-primary transition-colors shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg mb-0.5">{title}</h3>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
      </div>
    </Link>
  );
}

function SubtlePrompt({ href, icon: Icon, text }: { href: string; icon: any; text: string }) {
  return (
    <Link href={href} className="group">
      <div className="border border-dashed border-border-medium rounded-xl p-4 hover:border-accent-primary transition-colors flex items-center gap-3">
        <Icon className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">{text}</span>
        <Plus className="w-4 h-4 text-text-muted ml-auto group-hover:text-accent-primary transition-colors" />
      </div>
    </Link>
  );
}

function FilledSchoolsCard({ profile }: { profile: StudentProfile }) {
  const schools = profile.schools || [];
  const dreamSchool = profile.onboarding?.dreamSchool;
  const allSchools = dreamSchool && !schools.find(s => s.name.toLowerCase() === dreamSchool.toLowerCase())
    ? [{ id: "dream", name: dreamSchool, status: "dream" as const }, ...schools]
    : schools;
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <School className="w-5 h-5 text-accent-primary" />
          Your Schools
        </h3>
        <Link href="/schools" className="text-sm text-accent-primary hover:underline">View all</Link>
      </div>
      <div className="space-y-2">
        {allSchools.slice(0, 4).map(school => (
          <div key={school.id} className="flex items-center gap-3 p-2 bg-bg-sidebar rounded-lg">
            <div className="w-8 h-8 bg-accent-surface text-accent-primary rounded-lg flex items-center justify-center text-sm font-bold">
              {school.name.charAt(0)}
            </div>
            <span className="font-medium text-sm flex-1">{school.name}</span>
            {school.status === "dream" && (
              <span className="text-xs bg-accent-surface text-accent-primary px-2 py-0.5 rounded-full">Dream</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FilledProfileCard({ profile }: { profile: StudentProfile }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-accent-primary" />
          Your Profile
        </h3>
        <Link href="/portfolio" className="text-sm text-accent-primary hover:underline">View full</Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {profile.academics?.gpaUnweighted && (
          <div className="bg-bg-sidebar rounded-lg p-3">
            <div className="text-xs text-text-muted">GPA</div>
            <div className="font-mono font-bold text-lg">{profile.academics.gpaUnweighted}</div>
          </div>
        )}
        {profile.testing?.sat && (
          <div className="bg-bg-sidebar rounded-lg p-3">
            <div className="text-xs text-text-muted">SAT</div>
            <div className="font-mono font-bold text-lg">{profile.testing.sat}</div>
          </div>
        )}
        {profile.testing?.act && (
          <div className="bg-bg-sidebar rounded-lg p-3">
            <div className="text-xs text-text-muted">ACT</div>
            <div className="font-mono font-bold text-lg">{profile.testing.act}</div>
          </div>
        )}
        {(profile.activities?.length || 0) > 0 && (
          <div className="bg-bg-sidebar rounded-lg p-3">
            <div className="text-xs text-text-muted">Activities</div>
            <div className="font-mono font-bold text-lg">{profile.activities?.length}</div>
          </div>
        )}
        {(profile.awards?.length || 0) > 0 && (
          <div className="bg-bg-sidebar rounded-lg p-3">
            <div className="text-xs text-text-muted">Awards</div>
            <div className="font-mono font-bold text-lg">{profile.awards?.length}</div>
          </div>
        )}
      </div>
    </Card>
  );
}

function FilledGoalsCard({ profile }: { profile: StudentProfile }) {
  const goals = profile.goals || [];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent-primary" />
          Your Goals
        </h3>
        <Link href="/plan" className="text-sm text-accent-primary hover:underline">View all</Link>
      </div>
      <div className="space-y-2">
        {goals.slice(0, 3).map(goal => (
          <div key={goal.id} className="flex items-center gap-3 p-2 bg-bg-sidebar rounded-lg">
            <div className="w-8 h-8 bg-accent-surface text-accent-primary rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm flex-1 truncate">{goal.title}</span>
            <span className="text-xs text-text-muted capitalize">{goal.status.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProgressItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-success-bg text-success-text' : 'bg-border-medium text-white'}`}>
        {done ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <span className={`text-sm ${done ? 'text-text-main' : 'text-text-muted'}`}>{label}</span>
    </div>
  );
}

function ZoneIndicator({ zone, isMock }: { zone: DashboardZone; isMock: boolean }) {
  return (
    <div className="fixed bottom-4 right-4 bg-text-main text-white text-xs px-3 py-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity shadow-lg">
      <div className="flex items-center gap-3">
        <span className="font-bold">Zone {zone}</span>
        {isMock && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">MOCK</span>}
        <span className="text-white/60">|</span>
        <Link href={`/?zone=${(zone + 1) % 4}`} className="hover:underline">Next →</Link>
        {isMock && (
          <>
            <span className="text-white/60">|</span>
            <Link href="/" className="hover:underline text-white/80">Real Data</Link>
          </>
        )}
      </div>
    </div>
  );
}

function GoalRow({ icon: Icon, title, meta, progress, active }: { icon: any; title: string; meta: string; progress: number; active?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-bg-sidebar last:border-0 hover:bg-bg-card-hover transition-colors cursor-pointer">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-accent-surface text-accent-primary' : 'bg-bg-sidebar text-text-muted'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-[15px] text-text-main mb-0.5">{title}</div>
        <div className="text-[13px] text-text-muted">{meta}</div>
      </div>
      <div className="relative w-8 h-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-bg-sidebar" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className="text-accent-primary" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function TimelineItem({ status, date, title }: { status?: string; date: string; title: string }) {
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
