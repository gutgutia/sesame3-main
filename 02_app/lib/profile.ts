// Profile State Management
// Unified structure for student profile data

export type Activity = {
  id: string;
  title: string;
  role?: string;
  organization?: string;
  yearsActive?: string;
  hoursPerWeek?: number;
  description?: string;
  isLeadership?: boolean;
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

export type Goal = {
  id: string;
  title: string;
  category: "research" | "competition" | "leadership" | "project" | "other";
  status: "planning" | "in_progress" | "completed";
  targetDate?: string;
  description?: string;
  opportunities?: string[]; // Related opportunity names
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
  
  // Academics
  academics?: {
    gpaUnweighted?: number;
    gpaWeighted?: number;
    classRank?: string;
    courseRigor?: string; // e.g., "8 AP, 4 Honors"
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
  
  // Activities
  activities?: Activity[];
  
  // Awards
  awards?: Award[];
  
  // Programs (summer, research, internships)
  programs?: Program[];
  
  // Schools list
  schools?: School[];
  
  // Goals
  goals?: Goal[];
};

const PROFILE_KEY = "sesame3_profile";
const ONBOARDING_KEY = "sesame3_onboarding";

// Load profile from localStorage
export function loadProfile(): StudentProfile {
  if (typeof window === "undefined") return {};
  
  try {
    // Load main profile
    const profileStr = localStorage.getItem(PROFILE_KEY);
    const profile: StudentProfile = profileStr ? JSON.parse(profileStr) : {};
    
    // Merge with onboarding data if exists
    const onboardingStr = localStorage.getItem(ONBOARDING_KEY);
    if (onboardingStr) {
      profile.onboarding = JSON.parse(onboardingStr);
    }
    
    return profile;
  } catch (e) {
    console.error("Failed to load profile", e);
    return {};
  }
}

// Save profile to localStorage
export function saveProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

// Update a specific section of the profile
export function updateProfileSection<K extends keyof StudentProfile>(
  section: K,
  data: StudentProfile[K]
): StudentProfile {
  const profile = loadProfile();
  profile[section] = { ...profile[section], ...data } as StudentProfile[K];
  saveProfile(profile);
  return profile;
}

// Add an activity
export function addActivity(activity: Omit<Activity, "id">): StudentProfile {
  const profile = loadProfile();
  const newActivity: Activity = { ...activity, id: Date.now().toString() };
  profile.activities = [...(profile.activities || []), newActivity];
  saveProfile(profile);
  return profile;
}

// Add a school
export function addSchool(school: Omit<School, "id">): StudentProfile {
  const profile = loadProfile();
  const newSchool: School = { ...school, id: Date.now().toString() };
  profile.schools = [...(profile.schools || []), newSchool];
  saveProfile(profile);
  return profile;
}

// Calculate profile completeness
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

// Calculate dashboard zone for progressive graduation
// Zone 0: Empty - just name from onboarding
// Zone 1: Has data in 1 area (schools OR profile OR goals)
// Zone 2: Has data in 2+ areas
// Zone 3: Has meaningful data in all 3 areas
export type DashboardZone = 0 | 1 | 2 | 3;

export type ZoneStatus = {
  zone: DashboardZone;
  areas: {
    schools: { filled: boolean; count: number };
    profile: { filled: boolean; hasAcademics: boolean; hasActivities: boolean; hasAwards: boolean };
    goals: { filled: boolean; count: number };
  };
  filledCount: number;
  nextSteps: string[];
};

export function calculateZone(profile: StudentProfile): ZoneStatus {
  // Check each area
  const hasSchools = (profile.schools?.length || 0) > 0 || !!profile.onboarding?.dreamSchool;
  const schoolCount = (profile.schools?.length || 0) + (profile.onboarding?.dreamSchool ? 1 : 0);
  
  const hasAcademics = !!(profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted || profile.testing?.sat || profile.testing?.act);
  const hasActivities = (profile.activities?.length || 0) > 0;
  const hasAwards = (profile.awards?.length || 0) > 0;
  const hasProfile = hasAcademics || hasActivities || hasAwards;
  
  const hasGoals = (profile.goals?.length || 0) > 0;
  const goalCount = profile.goals?.length || 0;
  
  // Count filled areas
  const filledAreas = [hasSchools, hasProfile, hasGoals].filter(Boolean).length;
  
  // Determine zone
  let zone: DashboardZone = 0;
  if (filledAreas >= 3) {
    zone = 3;
  } else if (filledAreas >= 2) {
    zone = 2;
  } else if (filledAreas >= 1) {
    zone = 1;
  }
  
  // Determine next steps
  const nextSteps: string[] = [];
  if (!hasSchools) nextSteps.push("Add schools to your list");
  if (!hasAcademics) nextSteps.push("Add your GPA or test scores");
  if (!hasActivities) nextSteps.push("Add your activities");
  if (!hasGoals) nextSteps.push("Set your first goal");
  
  return {
    zone,
    areas: {
      schools: { filled: hasSchools, count: schoolCount },
      profile: { filled: hasProfile, hasAcademics, hasActivities, hasAwards },
      goals: { filled: hasGoals, count: goalCount },
    },
    filledCount: filledAreas,
    nextSteps,
  };
}

// Mock chances calculator
export function calculateChances(profile: StudentProfile, schoolName: string): {
  chance: number;
  tier: "reach" | "target" | "safety" | "unknown";
  breakdown: { factor: string; status: "strong" | "ok" | "weak" | "missing"; impact: string }[];
  confidence: "low" | "medium" | "high";
} {
  // Base chance varies by school selectivity (mock data)
  const schoolSelectivity: Record<string, number> = {
    "stanford": 4,
    "harvard": 3,
    "yale": 5,
    "mit": 4,
    "princeton": 5,
    "ucla": 12,
    "berkeley": 14,
    "michigan": 20,
    "nyu": 15,
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
    } else if (gpa >= 3.5) {
      breakdown.push({ factor: "GPA", status: "ok", impact: "0%" });
    } else {
      baseChance -= 3;
      breakdown.push({ factor: "GPA", status: "weak", impact: "-3%" });
    }
  } else {
    breakdown.push({ factor: "GPA", status: "missing", impact: "?" });
  }
  
  // SAT impact
  if (profile.testing?.sat) {
    dataPoints++;
    const sat = profile.testing.sat;
    if (sat >= 1550) {
      baseChance += 6;
      breakdown.push({ factor: "SAT", status: "strong", impact: "+6%" });
    } else if (sat >= 1500) {
      baseChance += 4;
      breakdown.push({ factor: "SAT", status: "strong", impact: "+4%" });
    } else if (sat >= 1400) {
      baseChance += 1;
      breakdown.push({ factor: "SAT", status: "ok", impact: "+1%" });
    } else {
      baseChance -= 2;
      breakdown.push({ factor: "SAT", status: "weak", impact: "-2%" });
    }
  } else if (profile.testing?.act) {
    dataPoints++;
    const act = profile.testing.act;
    if (act >= 35) {
      baseChance += 6;
      breakdown.push({ factor: "ACT", status: "strong", impact: "+6%" });
    } else if (act >= 33) {
      baseChance += 3;
      breakdown.push({ factor: "ACT", status: "strong", impact: "+3%" });
    } else {
      breakdown.push({ factor: "ACT", status: "ok", impact: "+1%" });
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
    } else if (profile.activities.length >= 3) {
      baseChance += 2;
      breakdown.push({ factor: "Activities", status: "ok", impact: "+2%" });
    } else {
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
  
  // Clamp chance
  const chance = Math.max(1, Math.min(baseChance, 95));
  
  // Determine tier
  let tier: "reach" | "target" | "safety" | "unknown" = "unknown";
  if (chance < 15) tier = "reach";
  else if (chance < 40) tier = "target";
  else tier = "safety";
  
  // Confidence based on how much data we have
  let confidence: "low" | "medium" | "high" = "low";
  if (dataPoints >= 4) confidence = "high";
  else if (dataPoints >= 2) confidence = "medium";
  
  return { chance, tier, breakdown, confidence };
}

// Add a goal
export function addGoal(goal: Omit<Goal, "id">): StudentProfile {
  const profile = loadProfile();
  const newGoal: Goal = { ...goal, id: Date.now().toString() };
  profile.goals = [...(profile.goals || []), newGoal];
  saveProfile(profile);
  return profile;
}

// Parse user input for profile data
export type ParsedData = {
  type: "gpa" | "sat" | "act" | "activity" | "award" | "school" | "goal" | "unknown";
  data: any;
  confidence: "high" | "medium" | "low";
  original: string;
};

export function parseUserInput(text: string): ParsedData {
  const lower = text.toLowerCase();
  
  // GPA patterns
  const gpaMatch = text.match(/(\d+\.?\d*)\s*(gpa|grade point)/i) || 
                   text.match(/gpa\s*(of|is|:)?\s*(\d+\.?\d*)/i);
  if (gpaMatch) {
    const gpaValue = parseFloat(gpaMatch[1] || gpaMatch[2]);
    const isWeighted = lower.includes("weighted") || gpaValue > 4.0;
    return {
      type: "gpa",
      data: { 
        value: gpaValue, 
        isWeighted,
        label: isWeighted ? "Weighted GPA" : "Unweighted GPA"
      },
      confidence: "high",
      original: text
    };
  }
  
  // SAT patterns
  const satMatch = text.match(/(\d{3,4})\s*(on|sat|on the sat|super\s*score)/i) ||
                   text.match(/sat\s*(score|is|of|:)?\s*(\d{3,4})/i);
  if (satMatch || (lower.includes("sat") && text.match(/\d{3,4}/))) {
    const scoreMatch = text.match(/\d{3,4}/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0]);
      if (score >= 400 && score <= 1600) {
        return {
          type: "sat",
          data: { value: score, label: "SAT Score" },
          confidence: "high",
          original: text
        };
      }
    }
  }
  
  // ACT patterns
  const actMatch = text.match(/(\d{1,2})\s*(on|act|on the act|composite)/i) ||
                   text.match(/act\s*(score|is|of|:)?\s*(\d{1,2})/i);
  if (actMatch || (lower.includes("act") && text.match(/\d{1,2}/))) {
    const scoreMatch = text.match(/\d{1,2}/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0]);
      if (score >= 1 && score <= 36) {
        return {
          type: "act",
          data: { value: score, label: "ACT Score" },
          confidence: "high",
          original: text
        };
      }
    }
  }
  
  // Activity patterns (leadership keywords)
  const leadershipKeywords = ["president", "captain", "founder", "leader", "head", "director", "chief", "vp", "vice president"];
  const activityKeywords = ["club", "team", "organization", "volunteer", "intern", "member", "participate"];
  
  const hasLeadership = leadershipKeywords.some(k => lower.includes(k));
  const hasActivity = activityKeywords.some(k => lower.includes(k)) || hasLeadership;
  
  if (hasActivity) {
    return {
      type: "activity",
      data: { 
        title: text,
        isLeadership: hasLeadership,
        label: hasLeadership ? "Leadership Activity" : "Activity"
      },
      confidence: hasLeadership ? "high" : "medium",
      original: text
    };
  }
  
  // Award patterns
  const awardKeywords = ["won", "winner", "award", "prize", "finalist", "semifinalist", "qualifier", "medal", "1st place", "2nd place", "3rd place", "first place", "national merit", "aime", "usamo", "olympiad"];
  const hasAward = awardKeywords.some(k => lower.includes(k));
  
  if (hasAward) {
    const isNational = lower.includes("national") || lower.includes("usamo") || lower.includes("aime") || lower.includes("olympiad");
    return {
      type: "award",
      data: { 
        title: text,
        level: isNational ? "national" : "regional",
        label: isNational ? "National Award" : "Award"
      },
      confidence: "medium",
      original: text
    };
  }
  
  // Goal patterns
  const goalKeywords = {
    research: ["research", "lab", "simr", "rsi", "simons", "scientist", "publication"],
    competition: ["competition", "olympiad", "aime", "usamo", "usaco", "science bowl", "mathcounts", "qualifier"],
    leadership: ["start a", "found", "lead", "president of", "create a", "launch"],
    project: ["project", "app", "website", "business", "nonprofit", "initiative"],
  };
  
  for (const [category, keywords] of Object.entries(goalKeywords)) {
    if (keywords.some(k => lower.includes(k))) {
      return {
        type: "goal",
        data: {
          title: text,
          category: category as Goal["category"],
          label: `${category.charAt(0).toUpperCase() + category.slice(1)} Goal`
        },
        confidence: "medium",
        original: text
      };
    }
  }
  
  // School interest patterns
  const schoolKeywords = ["want to go to", "dream school", "interested in", "apply to", "applying to", "chances at", "get into"];
  const hasSchoolIntent = schoolKeywords.some(k => lower.includes(k));
  
  // Common school names
  const commonSchools = ["stanford", "harvard", "yale", "mit", "princeton", "columbia", "uchicago", "chicago", "penn", "upenn", "duke", "caltech", "northwestern", "jhu", "johns hopkins", "brown", "cornell", "dartmouth", "ucla", "berkeley", "uc berkeley", "michigan", "nyu", "usc", "georgia tech", "cmu", "carnegie mellon", "notre dame", "vanderbilt", "rice", "emory", "washu", "tufts", "boston college", "unc", "virginia", "uva"];
  const foundSchool = commonSchools.find(s => lower.includes(s));
  
  if (hasSchoolIntent || foundSchool) {
    if (foundSchool) {
      // Normalize school name
      const schoolNames: Record<string, string> = {
        "stanford": "Stanford",
        "harvard": "Harvard",
        "yale": "Yale",
        "mit": "MIT",
        "princeton": "Princeton",
        "columbia": "Columbia",
        "uchicago": "UChicago",
        "chicago": "UChicago",
        "penn": "UPenn",
        "upenn": "UPenn",
        "duke": "Duke",
        "caltech": "Caltech",
        "northwestern": "Northwestern",
        "jhu": "Johns Hopkins",
        "johns hopkins": "Johns Hopkins",
        "brown": "Brown",
        "cornell": "Cornell",
        "dartmouth": "Dartmouth",
        "ucla": "UCLA",
        "berkeley": "UC Berkeley",
        "uc berkeley": "UC Berkeley",
        "michigan": "Michigan",
        "nyu": "NYU",
        "usc": "USC",
        "georgia tech": "Georgia Tech",
        "cmu": "Carnegie Mellon",
        "carnegie mellon": "Carnegie Mellon",
        "notre dame": "Notre Dame",
        "vanderbilt": "Vanderbilt",
        "rice": "Rice",
        "emory": "Emory",
        "washu": "WashU",
        "tufts": "Tufts",
        "boston college": "Boston College",
        "unc": "UNC Chapel Hill",
        "virginia": "UVA",
        "uva": "UVA",
      };
      
      return {
        type: "school",
        data: { 
          name: schoolNames[foundSchool] || foundSchool,
          label: `Interested in ${schoolNames[foundSchool] || foundSchool}`
        },
        confidence: "high",
        original: text
      };
    }
  }
  
  return {
    type: "unknown",
    data: { text },
    confidence: "low",
    original: text
  };
}
