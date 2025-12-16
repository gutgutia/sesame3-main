"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  PenTool, 
  Users, 
  Trophy, 
  FlaskConical,
  Download, 
  MessageCircle,
  Plus,
  Check,
  X,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/context/ProfileContext";

// =============================================================================
// TYPES (matching Prisma schema)
// =============================================================================

interface ProfileData {
  id: string;
  firstName: string | null;
  preferredName: string | null;
  aboutMe: {
    story: string | null;
    interests: string[] | null;
    values: string[] | null;
    personality: string | null;
  } | null;
  academics: {
    gpaUnweighted: number | null;
    gpaWeighted: number | null;
    classRank: number | null;
    classSize: number | null;
  } | null;
  testing: {
    satTotal: number | null;
    satMath: number | null;
    satReading: number | null;
    actComposite: number | null;
    actMath: number | null;
    actEnglish: number | null;
    apScores: Array<{ subject: string; score: number }>;
    subjectTests: Array<{ subject: string; score: number }>;
  } | null;
  courses: Array<{
    id: string;
    name: string;
    grade: string | null;
    type: string | null;
  }>;
  activities: Array<{
    id: string;
    title: string;
    organization: string | null;
    yearsActive: string | null;
    hoursPerWeek: number | null;
    description: string | null;
    isSpike: boolean;
    isLeadership: boolean;
  }>;
  awards: Array<{
    id: string;
    title: string;
    level: string | null;
    year: number | null;
  }>;
  programs: Array<{
    id: string;
    name: string;
    status: string | null;
    year: number | null;
  }>;
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ProfilePage() {
  // Use global profile context instead of fetching per-page
  const { profile, isLoading, error, refreshProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-text-muted mb-4">Failed to load profile</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-main mb-2">Your Profile</h1>
          <p className="text-text-muted">Your academic and extracurricular snapshot.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Subtle Chat Prompt */}
      <Link 
        href="/advisor?mode=profile" 
        className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors mb-6 group"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Need help building your profile? <span className="text-accent-primary group-hover:underline">Chat with your advisor →</span></span>
      </Link>

      {/* About Me Section */}
      <AboutMeCard aboutMe={profile?.aboutMe} />

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicsCard academics={profile?.academics} onRefresh={refreshProfile} />
        <TestingCard testing={profile?.testing} onRefresh={refreshProfile} />
        <ActivitiesCard activities={profile?.activities || []} onRefresh={refreshProfile} />
        <AwardsCard awards={profile?.awards || []} onRefresh={refreshProfile} />
        <ProgramsCard programs={profile?.programs || []} onRefresh={refreshProfile} />
      </div>
    </>
  );
}

// =============================================================================
// ABOUT ME CARD
// =============================================================================

interface AboutMe {
  story: string | null;
  interests: string[] | null;
  values: string[] | null;
  personality: string | null;
}

function AboutMeCard({ aboutMe }: { aboutMe: AboutMe | null | undefined }) {
  if (!aboutMe?.story) {
    return (
      <div className="bg-bg-sidebar border border-border-subtle rounded-[20px] p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-text-muted border border-border-subtle">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-text-main mb-1">Tell us about yourself</h3>
            <p className="text-sm text-text-muted">Beyond grades and scores — who are you?</p>
          </div>
          <Link href="/advisor?mode=story">
            <Button size="sm">
              <MessageCircle className="w-4 h-4" />
              Share My Story
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-subtle rounded-[20px] p-6 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg text-text-main">About Me</h3>
      </div>
      <p className="text-sm text-text-main leading-relaxed mb-4">{aboutMe.story}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {aboutMe.values?.map((value, i) => (
          <span key={i} className="px-3 py-1 bg-accent-surface text-accent-primary text-xs font-medium rounded-full">
            {value}
          </span>
        ))}
        {aboutMe.interests?.map((interest, i) => (
          <span key={i} className="px-3 py-1 bg-bg-sidebar text-text-muted text-xs font-medium rounded-full">
            {interest}
          </span>
        ))}
      </div>

      {aboutMe.personality && (
        <div className="text-xs text-text-muted italic">"{aboutMe.personality}"</div>
      )}
    </div>
  );
}

// =============================================================================
// ACADEMICS CARD
// =============================================================================

function AcademicsCard({ 
  academics, 
  onRefresh 
}: { 
  academics: ProfileData["academics"] | undefined;
  onRefresh: () => void;
}) {
  const hasData = academics?.gpaUnweighted || academics?.gpaWeighted;

  return (
    <ProfileCard icon={GraduationCap} title="Academics">
      {hasData ? (
        <>
          {academics?.gpaUnweighted && (
            <DataRow label="GPA (Unweighted)" value={academics.gpaUnweighted.toFixed(2)} />
          )}
          {academics?.gpaWeighted && (
            <DataRow label="GPA (Weighted)" value={academics.gpaWeighted.toFixed(2)} />
          )}
          {academics?.classRank && academics?.classSize && (
            <DataRow label="Class Rank" value={`${academics.classRank} / ${academics.classSize}`} />
          )}
        </>
      ) : (
        <EmptyState message="No academics data yet" href="/advisor?mode=profile" />
      )}
    </ProfileCard>
  );
}

// =============================================================================
// TESTING CARD
// =============================================================================

function TestingCard({ 
  testing, 
  onRefresh 
}: { 
  testing: ProfileData["testing"] | undefined;
  onRefresh: () => void;
}) {
  const hasData = testing?.satTotal || testing?.actComposite;

  return (
    <ProfileCard icon={PenTool} title="Testing">
      {hasData ? (
        <>
          {testing?.satTotal && (
            <DataRow 
              label="SAT" 
              value={testing.satTotal.toString()} 
              subValue={testing.satMath && testing.satReading 
                ? `M: ${testing.satMath} | V: ${testing.satReading}` 
                : undefined
              }
            />
          )}
          {testing?.actComposite && (
            <DataRow label="ACT" value={testing.actComposite.toString()} />
          )}
          
          {/* AP Scores */}
          {testing?.apScores && testing.apScores.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">AP Scores</div>
              <div className="space-y-2">
                {testing.apScores.map((ap, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5">
                    <span className="text-text-main">{ap.subject}</span>
                    <span className="font-mono font-semibold text-accent-primary">{ap.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState message="No test scores yet" href="/advisor?mode=profile" />
      )}
    </ProfileCard>
  );
}

// =============================================================================
// ACTIVITIES CARD
// =============================================================================

function ActivitiesCard({ 
  activities,
  onRefresh 
}: { 
  activities: ProfileData["activities"];
  onRefresh: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await fetch(`/api/profile/activities/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <ProfileCard icon={Users} title="Activities" className="lg:row-span-2">
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={cn(
                "border border-border-subtle rounded-xl p-4 transition-all",
                activity.isSpike && "border-accent-primary/30 bg-accent-surface/20"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-main">{activity.title}</span>
                    {activity.isSpike && (
                      <span className="text-[10px] font-bold uppercase text-accent-primary bg-accent-surface px-1.5 py-0.5 rounded">Spike</span>
                    )}
                  </div>
                  {activity.organization && (
                    <div className="text-sm text-text-muted">{activity.organization}</div>
                  )}
                  <div className="text-xs text-text-light mt-1">
                    {activity.yearsActive && `${activity.yearsActive} • `}
                    {activity.hoursPerWeek && `${activity.hoursPerWeek} hr/wk`}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                    className="p-1.5 text-text-muted hover:text-text-main hover:bg-bg-sidebar rounded-lg transition-colors"
                  >
                    {expandedId === activity.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === activity.id && activity.description && (
                <div className="mt-3 pt-3 border-t border-border-subtle text-sm text-text-main">
                  {activity.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No activities added yet" href="/advisor?mode=profile" />
      )}
      <AddButton label="Add activity" href="/advisor?mode=profile" />
    </ProfileCard>
  );
}

// =============================================================================
// AWARDS CARD
// =============================================================================

function AwardsCard({ 
  awards, 
  onRefresh 
}: { 
  awards: ProfileData["awards"];
  onRefresh: () => void;
}) {
  const handleDelete = async (id: string) => {
    await fetch(`/api/profile/awards/${id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <ProfileCard icon={Trophy} title="Awards">
      {awards.length > 0 ? (
        <div className="space-y-3">
          {awards.map((award) => (
            <div 
              key={award.id} 
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0 group"
            >
              <div>
                <div className="font-medium text-text-main">{award.title}</div>
                <div className="text-xs text-text-muted">
                  {award.level && `${award.level} • `}{award.year}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(award.id)}
                className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No awards added yet" href="/advisor?mode=profile" />
      )}
      <AddButton label="Add award" href="/advisor?mode=profile" />
    </ProfileCard>
  );
}

// =============================================================================
// PROGRAMS CARD
// =============================================================================

function ProgramsCard({ 
  programs, 
  onRefresh 
}: { 
  programs: ProfileData["programs"];
  onRefresh: () => void;
}) {
  const handleDelete = async (id: string) => {
    await fetch(`/api/profile/programs/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const getStatusStyle = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "applying":
        return "bg-accent-surface text-accent-primary";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-bg-sidebar text-text-muted";
    }
  };

  return (
    <ProfileCard icon={FlaskConical} title="Programs">
      {programs.length > 0 ? (
        <div className="space-y-3">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0 group"
            >
              <div>
                <div className="font-medium text-text-main">{program.name}</div>
                <div className="text-xs text-text-muted">{program.year}</div>
              </div>
              <div className="flex items-center gap-2">
                {program.status && (
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded", getStatusStyle(program.status))}>
                    {program.status}
                  </span>
                )}
                <button 
                  onClick={() => handleDelete(program.id)}
                  className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No programs added yet" href="/advisor?mode=profile" />
      )}
      <AddButton label="Add program" href="/advisor?mode=profile" />
    </ProfileCard>
  );
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function ProfileCard({ icon: Icon, title, children, className }: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-white border border-border-subtle rounded-[20px] p-6 shadow-card hover:border-accent-border transition-all",
      className
    )}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-bg-sidebar rounded-lg flex items-center justify-center text-text-muted">
          <Icon className="w-5 h-5" />
        </div>
        <div className="font-display font-bold text-lg text-text-main">{title}</div>
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border-subtle last:border-0">
      <span className="text-text-muted text-[15px]">{label}</span>
      <div className="text-right">
        <span className="font-mono font-semibold text-text-main">{value}</span>
        {subValue && <div className="text-xs text-text-muted">{subValue}</div>}
      </div>
    </div>
  );
}

function EmptyState({ message, href }: { message: string; href: string }) {
  return (
    <div className="text-center py-6 text-text-muted text-sm">
      <p className="mb-3">{message}</p>
      <Link href={href}>
        <Button size="sm" variant="secondary">
          <MessageCircle className="w-4 h-4" />
          Add via Chat
        </Button>
      </Link>
    </div>
  );
}

function AddButton({ label, href }: { label: string; href: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-1.5 mt-4 text-sm text-accent-primary hover:text-accent-primary/80 font-medium transition-colors"
    >
      <Plus className="w-4 h-4" />
      {label}
    </Link>
  );
}
