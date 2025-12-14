"use client";

import React from "react";
import { Sparkles, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StudentProfile } from "@/lib/profile";

interface Suggestion {
  id: string;
  title: string;
  category: "research" | "competition" | "leadership" | "project" | "other";
  reason: string;
  difficulty: "easy" | "medium" | "hard";
}

// Generate suggestions based on profile
function generateSuggestions(profile: StudentProfile): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const dreamSchool = profile.onboarding?.dreamSchool?.toLowerCase() || "";
  const hasResearchActivity = profile.activities?.some(a => 
    a.title.toLowerCase().includes("research") || a.title.toLowerCase().includes("lab")
  );
  const hasCompetitionActivity = profile.activities?.some(a =>
    a.title.toLowerCase().includes("olympiad") || a.title.toLowerCase().includes("competition") || a.title.toLowerCase().includes("math")
  );
  
  // Research suggestions for top schools
  if (["stanford", "mit", "harvard", "caltech"].some(s => dreamSchool.includes(s))) {
    suggestions.push({
      id: "s1",
      title: "Apply to RSI (Research Science Institute)",
      category: "research",
      reason: `Top choice for ${profile.onboarding?.dreamSchool} applicants`,
      difficulty: "hard",
    });
  }
  
  // SIMR if interested in research
  if (!hasResearchActivity || dreamSchool.includes("stanford")) {
    suggestions.push({
      id: "s2",
      title: "Apply to SIMR or similar summer research",
      category: "research",
      reason: "Research experience strengthens applications",
      difficulty: "medium",
    });
  }
  
  // Competition suggestions
  if (hasCompetitionActivity) {
    suggestions.push({
      id: "s3",
      title: "Prepare for Science Olympiad",
      category: "competition",
      reason: "Builds on your competition experience",
      difficulty: "medium",
    });
  }
  
  // Leadership suggestions
  suggestions.push({
    id: "s4",
    title: "Start a community initiative",
    category: "leadership",
    reason: "Demonstrates initiative and impact",
    difficulty: "medium",
  });
  
  // Project suggestions
  suggestions.push({
    id: "s5",
    title: "Build a personal project in your interest area",
    category: "project",
    reason: "Shows passion beyond classroom",
    difficulty: "easy",
  });
  
  // Limit to 4 suggestions
  return suggestions.slice(0, 4);
}

const categoryIcons: Record<string, string> = {
  research: "🔬",
  competition: "🏆",
  leadership: "👥",
  project: "💡",
  other: "🎯",
};

const difficultyColors: Record<string, string> = {
  easy: "text-success-text",
  medium: "text-warning-text",
  hard: "text-error-text",
};

interface IdeasSuggestionsProps {
  profile: StudentProfile;
  onAddToParking?: (suggestion: Suggestion) => void;
  onStartPlanning?: (suggestion: Suggestion) => void;
}

export function IdeasSuggestions({ profile, onAddToParking, onStartPlanning }: IdeasSuggestionsProps) {
  const suggestions = generateSuggestions(profile);
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-primary" />
          <h2 className="font-display font-bold text-lg">Ideas & Suggestions</h2>
        </div>
        <Link 
          href="/advisor?mode=planning"
          className="text-sm text-accent-primary hover:underline flex items-center gap-1"
        >
          Explore more <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <p className="text-sm text-text-muted mb-4">
        Based on your profile and goals, you might consider:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onAddToParking={() => onAddToParking?.(suggestion)}
            onStartPlanning={() => onStartPlanning?.(suggestion)}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionCard({ 
  suggestion, 
  onAddToParking,
  onStartPlanning,
}: { 
  suggestion: Suggestion;
  onAddToParking: () => void;
  onStartPlanning: () => void;
}) {
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-4 hover:shadow-card transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-lg">{categoryIcons[suggestion.category]}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-main mb-1">
            {suggestion.title}
          </h3>
          <p className="text-xs text-text-muted mb-3">
            {suggestion.reason}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onAddToParking}
              className="text-xs text-text-muted hover:text-text-main transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Save for later
            </button>
            <span className="text-border-medium">|</span>
            <button
              onClick={onStartPlanning}
              className="text-xs text-accent-primary hover:underline font-medium"
            >
              Start planning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
