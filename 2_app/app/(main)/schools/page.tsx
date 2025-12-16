"use client";

import React from "react";
import Link from "next/link";
import { 
  Plus, 
  MessageCircle, 
  Sparkles,
  TrendingUp,
  School,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/context/ProfileContext";

// =============================================================================
// TYPES
// =============================================================================

interface StudentSchool {
  id: string;
  tier: string | null;
  status: string | null;
  school: {
    id: string;
    name: string;
  } | null;
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SchoolsPage() {
  // Use global profile context
  const { profile, isLoading, refreshProfile } = useProfile();
  
  // Extract schools from profile, with type assertion for compatibility
  const schools: StudentSchool[] = (profile?.schoolList || []).map(s => ({
    id: s.id,
    tier: s.tier || null,
    status: s.status || null,
    school: s.school || null,
  }));
  
  const refreshSchools = () => {
    refreshProfile();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/profile/schools?id=${id}`, { method: "DELETE" });
    refreshSchools();
  };

  // Group by tier
  const reachSchools = schools.filter(s => s.tier === "reach");
  const targetSchools = schools.filter(s => s.tier === "target");
  const safetySchools = schools.filter(s => s.tier === "safety");
  const otherSchools = schools.filter(s => !s.tier || !["reach", "target", "safety"].includes(s.tier));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-main mb-2">Your Schools</h1>
          <p className="text-text-muted">Build and balance your college list.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/advisor?mode=chances">
            <Button variant="secondary">
              <TrendingUp className="w-4 h-4" />
              Check Chances
            </Button>
          </Link>
          <Link href="/advisor?mode=schools">
            <Button>
              <Plus className="w-4 h-4" />
              Add Schools
            </Button>
          </Link>
        </div>
      </div>

      {/* Subtle Chat Prompt */}
      <Link 
        href="/advisor?mode=schools" 
        className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors mb-6 group"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Need help building your list? <span className="text-accent-primary group-hover:underline">Chat with your advisor →</span></span>
      </Link>

      {schools.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-accent-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <School className="w-8 h-8 text-accent-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">No schools yet</h2>
          <p className="text-text-muted mb-4">Start building your college list with reaches, targets, and safeties.</p>
          <Link href="/advisor?mode=schools">
            <Button>
              <Plus className="w-4 h-4" />
              Add Your First School
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Balance Overview */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-primary" />
              List Balance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{reachSchools.length}</div>
                <div className="text-sm text-red-600 font-medium">Reach</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{targetSchools.length}</div>
                <div className="text-sm text-amber-600 font-medium">Target</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{safetySchools.length}</div>
                <div className="text-sm text-green-600 font-medium">Safety</div>
              </div>
            </div>
          </Card>

          {/* Reach Schools */}
          {reachSchools.length > 0 && (
            <SchoolSection 
              title="Reach" 
              color="red"
              schools={reachSchools} 
              onDelete={handleDelete}
            />
          )}

          {/* Target Schools */}
          {targetSchools.length > 0 && (
            <SchoolSection 
              title="Target" 
              color="amber"
              schools={targetSchools} 
              onDelete={handleDelete}
            />
          )}

          {/* Safety Schools */}
          {safetySchools.length > 0 && (
            <SchoolSection 
              title="Safety" 
              color="green"
              schools={safetySchools} 
              onDelete={handleDelete}
            />
          )}

          {/* Other Schools */}
          {otherSchools.length > 0 && (
            <SchoolSection 
              title="Exploring" 
              color="gray"
              schools={otherSchools} 
              onDelete={handleDelete}
            />
          )}
        </div>
      )}
    </>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function SchoolSection({ 
  title, 
  color, 
  schools, 
  onDelete 
}: { 
  title: string; 
  color: "red" | "amber" | "green" | "gray";
  schools: StudentSchool[]; 
  onDelete: (id: string) => void;
}) {
  const colorClasses = {
    red: "border-red-200 bg-red-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    green: "border-green-200 bg-green-50/50",
    gray: "border-gray-200 bg-gray-50/50",
  };

  const headerColors = {
    red: "text-red-600",
    amber: "text-amber-600",
    green: "text-green-600",
    gray: "text-gray-600",
  };

  return (
    <div>
      <h2 className={cn("font-display font-bold text-lg mb-4", headerColors[color])}>
        {title} ({schools.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map(school => (
          <div 
            key={school.id}
            className={cn(
              "border rounded-xl p-4 transition-all hover:shadow-card group",
              colorClasses[color]
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg font-bold text-accent-primary shadow-sm">
                  {school.school.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-text-main">
                    {school.school.name}
                  </h3>
                  {school.status && (
                    <span className="text-xs text-text-muted capitalize">
                      {school.status.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDelete(school.id)}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
