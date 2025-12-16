// Profile Types
// Types for student profile data used across components
// Note: These are frontend types that may differ from Prisma schema types

export type Activity = {
  id: string;
  title: string;
  role?: string;
  organization?: string;
  yearsActive?: string;
  hoursPerWeek?: number;
  description?: string;
  isLeadership?: boolean;
  isSpike?: boolean;
};

export type Award = {
  id: string;
  title: string;
  level?: "school" | "regional" | "state" | "national" | "international";
  year?: string;
  description?: string;
};

export type Program = {
  id: string;
  name: string;
  organization?: string;
  year?: string;
  status?: "completed" | "accepted" | "applying" | "planned";
  description?: string;
};

export type School = {
  id: string;
  name: string;
  status: "dream" | "reach" | "target" | "safety" | "exploring";
  chance?: number;
  deadline?: string;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
};

export type Goal = {
  id: string;
  title: string;
  category: "research" | "competition" | "leadership" | "project" | "application" | "other";
  status: "parking_lot" | "planning" | "in_progress" | "completed";
  targetDate?: string;
  description?: string;
  opportunities?: string[];
  tasks?: Task[];
};

export type AboutMe = {
  story?: string;
  values?: string[];
  interests?: string[];
  personality?: string;
  background?: string;
  aspirations?: string;
};

export type StudentProfile = {
  // From onboarding
  onboarding?: {
    name?: string;
    grade?: string;
    feeling?: string;
    dreamSchool?: string;
    hasDreamSchool?: boolean;
  };
  
  // About Me
  aboutMe?: AboutMe;
  
  // Academics
  academics?: {
    gpaUnweighted?: number;
    gpaWeighted?: number;
    classRank?: string;
    courseRigor?: string;
    courses?: string[];
  };
  
  // Testing
  testing?: {
    sat?: number;
    satMath?: number;
    satReading?: number;
    act?: number;
    apScores?: { subject: string; score: number }[];
    satSubjects?: { subject: string; score: number }[];
  };
  
  // Collections
  activities?: Activity[];
  awards?: Award[];
  programs?: Program[];
  schools?: School[];
  goals?: Goal[];
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate profile completeness percentage
 */
export function getProfileCompleteness(profile: StudentProfile): {
  total: number;
  sections: { name: string; complete: boolean; weight: number }[];
} {
  const sections = [
    { name: "Academics", complete: !!(profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted), weight: 25 },
    { name: "Testing", complete: !!(profile.testing?.sat || profile.testing?.act), weight: 20 },
    { name: "Activities", complete: (profile.activities?.length || 0) > 0, weight: 25 },
    { name: "Awards", complete: (profile.awards?.length || 0) > 0, weight: 15 },
    { name: "Programs", complete: (profile.programs?.length || 0) > 0, weight: 15 },
  ];
  
  const total = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
  return { total, sections };
}

/**
 * Calculate admission chances for a school (simplified estimate)
 * Note: This is a basic estimation - real chances depend on many factors
 */
export function calculateChances(profile: StudentProfile, schoolName: string): {
  chance: number;
  tier: "reach" | "target" | "safety" | "unknown";
  breakdown: { factor: string; status: "strong" | "ok" | "weak" | "missing"; impact: string }[];
  confidence: "low" | "medium" | "high";
} {
  // Base selectivity (simplified)
  const schoolSelectivity: Record<string, number> = {
    "stanford": 4, "harvard": 3, "yale": 5, "mit": 4, "princeton": 5,
    "ucla": 12, "berkeley": 14, "michigan": 20, "nyu": 15, "usc": 13,
    "cornell": 10, "duke": 8, "columbia": 5, "northwestern": 9,
  };
  
  const normalizedName = schoolName.toLowerCase();
  let baseChance = schoolSelectivity[normalizedName] || 15;
  
  const breakdown: { factor: string; status: "strong" | "ok" | "weak" | "missing"; impact: string }[] = [];
  let dataPoints = 0;
  
  // GPA impact
  if (profile.academics?.gpaUnweighted) {
    dataPoints++;
    const gpa = profile.academics.gpaUnweighted;
    if (gpa >= 3.9) {
      baseChance += 5;
      breakdown.push({ factor: "GPA", status: "strong", impact: "+5%" });
    } else if (gpa >= 3.7) {
      baseChance += 2;
      breakdown.push({ factor: "GPA", status: "ok", impact: "+2%" });
    } else {
      breakdown.push({ factor: "GPA", status: "weak", impact: "0%" });
    }
  } else {
    breakdown.push({ factor: "GPA", status: "missing", impact: "?" });
  }
  
  // SAT/ACT impact
  if (profile.testing?.sat) {
    dataPoints++;
    const sat = profile.testing.sat;
    if (sat >= 1550) {
      baseChance += 6;
      breakdown.push({ factor: "SAT", status: "strong", impact: "+6%" });
    } else if (sat >= 1450) {
      baseChance += 3;
      breakdown.push({ factor: "SAT", status: "ok", impact: "+3%" });
    } else {
      breakdown.push({ factor: "SAT", status: "weak", impact: "+1%" });
    }
  } else if (profile.testing?.act) {
    dataPoints++;
    const act = profile.testing.act;
    if (act >= 34) {
      baseChance += 5;
      breakdown.push({ factor: "ACT", status: "strong", impact: "+5%" });
    } else if (act >= 31) {
      baseChance += 2;
      breakdown.push({ factor: "ACT", status: "ok", impact: "+2%" });
    }
  } else {
    breakdown.push({ factor: "Testing", status: "missing", impact: "?" });
  }
  
  // Activities impact
  if (profile.activities && profile.activities.length > 0) {
    dataPoints++;
    const hasLeadership = profile.activities.some(a => a.isLeadership);
    if (profile.activities.length >= 5 && hasLeadership) {
      baseChance += 4;
      breakdown.push({ factor: "Activities", status: "strong", impact: "+4%" });
    } else {
      baseChance += 1;
      breakdown.push({ factor: "Activities", status: "ok", impact: "+1%" });
    }
  } else {
    breakdown.push({ factor: "Activities", status: "missing", impact: "?" });
  }
  
  // Awards impact
  if (profile.awards && profile.awards.length > 0) {
    dataPoints++;
    const hasNational = profile.awards.some(a => a.level === "national" || a.level === "international");
    if (hasNational) {
      baseChance += 5;
      breakdown.push({ factor: "Awards", status: "strong", impact: "+5%" });
    } else {
      baseChance += 2;
      breakdown.push({ factor: "Awards", status: "ok", impact: "+2%" });
    }
  } else {
    breakdown.push({ factor: "Awards", status: "missing", impact: "?" });
  }
  
  const chance = Math.max(1, Math.min(baseChance, 95));
  
  let tier: "reach" | "target" | "safety" | "unknown" = "unknown";
  if (chance < 15) tier = "reach";
  else if (chance < 40) tier = "target";
  else tier = "safety";
  
  let confidence: "low" | "medium" | "high" = "low";
  if (dataPoints >= 4) confidence = "high";
  else if (dataPoints >= 2) confidence = "medium";
  
  return { chance, tier, breakdown, confidence };
}
