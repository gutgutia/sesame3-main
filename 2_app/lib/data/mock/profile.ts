// Mock Profile Data Layer
// Uses localStorage for persistence in demo mode

import type { 
  StudentProfile, 
  Activity, 
  Award, 
  School, 
  Goal, 
  Course, 
  Program,
  ZoneStatus,
  DashboardZone,
  ChancesResult,
  ParsedData
} from '../types';
import { sampleProfile, emptyProfile } from './sample-data';

const PROFILE_KEY = 'sesame3_profile';
const ONBOARDING_KEY = 'sesame3_onboarding';
const USE_SAMPLE_KEY = 'sesame3_use_sample';

// Check if we should use sample data (for initial demo)
function shouldUseSampleData(): boolean {
  if (typeof window === 'undefined') return true;
  const useSample = localStorage.getItem(USE_SAMPLE_KEY);
  // If never set, use sample data and mark as set
  if (useSample === null) {
    localStorage.setItem(USE_SAMPLE_KEY, 'true');
    return true;
  }
  return useSample === 'true';
}

// Load profile from localStorage
export async function getProfile(userId?: string): Promise<StudentProfile | null> {
  if (typeof window === 'undefined') {
    return sampleProfile;
  }
  
  try {
    // For demo, we use sample data or localStorage
    if (shouldUseSampleData()) {
      return sampleProfile;
    }
    
    const profileStr = localStorage.getItem(PROFILE_KEY);
    if (!profileStr) return null;
    
    const profile: StudentProfile = JSON.parse(profileStr);
    
    // Merge with onboarding data
    const onboardingStr = localStorage.getItem(ONBOARDING_KEY);
    if (onboardingStr) {
      profile.onboardingData = JSON.parse(onboardingStr);
    }
    
    return profile;
  } catch (e) {
    console.error('Failed to load profile', e);
    return null;
  }
}

// Save profile to localStorage
export async function saveProfile(profile: StudentProfile): Promise<StudentProfile> {
  if (typeof window === 'undefined') return profile;
  
  try {
    // Mark that we're no longer using sample data
    localStorage.setItem(USE_SAMPLE_KEY, 'false');
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (e) {
    console.error('Failed to save profile', e);
    throw e;
  }
}

// Create a new profile
export async function createProfile(data: Partial<StudentProfile> & { firstName: string }): Promise<StudentProfile> {
  const profile: StudentProfile = {
    id: `demo-${Date.now()}`,
    userId: data.userId || `user-${Date.now()}`,
    firstName: data.firstName,
    lastName: data.lastName,
    preferredName: data.preferredName,
    grade: data.grade,
    onboardingData: data.onboardingData,
    aboutMe: data.aboutMe,
    academics: data.academics,
    testing: data.testing,
    courses: data.courses || [],
    activities: data.activities || [],
    awards: data.awards || [],
    programs: data.programs || [],
    schools: data.schools || [],
    goals: data.goals || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return saveProfile(profile);
}

// Update profile section
export async function updateProfileSection<K extends keyof StudentProfile>(
  userId: string,
  section: K,
  data: StudentProfile[K]
): Promise<StudentProfile> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const existingSection = profile[section];
  let newValue: StudentProfile[K];
  
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // For object sections like aboutMe, academics, testing - merge
    if (typeof existingSection === 'object' && existingSection !== null && !Array.isArray(existingSection)) {
      newValue = { ...existingSection, ...data } as StudentProfile[K];
    } else {
      newValue = data;
    }
  } else {
    // For arrays or primitives - replace
    newValue = data;
  }
  
  const updated: StudentProfile = {
    ...profile,
    [section]: newValue,
    updatedAt: new Date(),
  };
  
  return saveProfile(updated);
}

// Add activity
export async function addActivity(userId: string, activity: Omit<Activity, 'id'>): Promise<Activity> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const newActivity: Activity = {
    ...activity,
    id: `activity-${Date.now()}`,
    displayOrder: (profile.activities?.length || 0) + 1,
  };
  
  profile.activities = [...(profile.activities || []), newActivity];
  await saveProfile(profile);
  return newActivity;
}

// Add award
export async function addAward(userId: string, award: Omit<Award, 'id'>): Promise<Award> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const newAward: Award = {
    ...award,
    id: `award-${Date.now()}`,
    displayOrder: (profile.awards?.length || 0) + 1,
  };
  
  profile.awards = [...(profile.awards || []), newAward];
  await saveProfile(profile);
  return newAward;
}

// Add school
export async function addSchool(userId: string, school: Omit<School, 'id'>): Promise<School> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const newSchool: School = {
    ...school,
    id: `school-${Date.now()}`,
    displayOrder: (profile.schools?.length || 0) + 1,
  };
  
  profile.schools = [...(profile.schools || []), newSchool];
  await saveProfile(profile);
  return newSchool;
}

// Add goal
export async function addGoal(userId: string, goal: Omit<Goal, 'id'>): Promise<Goal> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const newGoal: Goal = {
    ...goal,
    id: `goal-${Date.now()}`,
    displayOrder: (profile.goals?.length || 0) + 1,
    tasks: goal.tasks || [],
  };
  
  profile.goals = [...(profile.goals || []), newGoal];
  await saveProfile(profile);
  return newGoal;
}

// Add course
export async function addCourse(userId: string, course: Omit<Course, 'id'>): Promise<Course> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');
  
  const newCourse: Course = {
    ...course,
    id: `course-${Date.now()}`,
  };
  
  profile.courses = [...(profile.courses || []), newCourse];
  await saveProfile(profile);
  return newCourse;
}

// Calculate dashboard zone
export function calculateZone(profile: StudentProfile | null): ZoneStatus {
  if (!profile) {
    return {
      zone: 0,
      areas: {
        schools: { filled: false, count: 0 },
        profile: { filled: false, hasAcademics: false, hasActivities: false, hasAwards: false },
        goals: { filled: false, count: 0 },
      },
      hasStory: false,
      filledCount: 0,
      nextSteps: ['Complete onboarding', 'Tell us about yourself'],
    };
  }

  const hasSchools = (profile.schools?.length || 0) > 0 || !!profile.onboardingData?.dreamSchool;
  const schoolCount = (profile.schools?.length || 0) + (profile.onboardingData?.dreamSchool ? 1 : 0);
  
  const hasAcademics = !!(profile.academics?.gpaUnweighted || profile.academics?.gpaWeighted || profile.testing?.satTotal || profile.testing?.actComposite);
  const hasActivities = (profile.activities?.length || 0) > 0;
  const hasAwards = (profile.awards?.length || 0) > 0;
  const hasProfile = hasAcademics || hasActivities || hasAwards;
  
  const hasGoals = (profile.goals?.length || 0) > 0;
  const goalCount = profile.goals?.length || 0;
  
  const hasStory = !!(profile.aboutMe?.story && profile.aboutMe.story.length > 20);
  
  const filledAreas = [hasSchools, hasProfile, hasGoals].filter(Boolean).length;
  
  let zone: DashboardZone = 0;
  if (filledAreas >= 3) zone = 3;
  else if (filledAreas >= 2) zone = 2;
  else if (filledAreas >= 1) zone = 1;
  
  const nextSteps: string[] = [];
  if (!hasStory) nextSteps.push('Tell us about yourself');
  if (!hasSchools) nextSteps.push('Add schools to your list');
  if (!hasAcademics) nextSteps.push('Add your GPA or test scores');
  if (!hasActivities) nextSteps.push('Add your activities');
  if (!hasGoals) nextSteps.push('Set your first goal');
  
  return {
    zone,
    areas: {
      schools: { filled: hasSchools, count: schoolCount },
      profile: { filled: hasProfile, hasAcademics, hasActivities, hasAwards },
      goals: { filled: hasGoals, count: goalCount },
    },
    hasStory,
    filledCount: filledAreas,
    nextSteps,
  };
}

// Calculate chances
export function calculateChances(profile: StudentProfile | null, schoolName: string): ChancesResult {
  const schoolSelectivity: Record<string, number> = {
    stanford: 4, harvard: 3, yale: 5, mit: 4, princeton: 5,
    ucla: 12, berkeley: 14, michigan: 20, nyu: 15, 'carnegie mellon': 11,
    cmu: 11, 'georgia tech': 17, uiuc: 45,
  };
  
  const normalizedName = schoolName.toLowerCase();
  let baseChance = schoolSelectivity[normalizedName] || 15;
  
  const breakdown: ChancesResult['breakdown'] = [];
  let dataPoints = 0;
  
  if (!profile) {
    return {
      chance: baseChance,
      tier: 'unknown',
      breakdown: [
        { factor: 'GPA', status: 'missing', impact: '?' },
        { factor: 'Testing', status: 'missing', impact: '?' },
        { factor: 'Activities', status: 'missing', impact: '?' },
        { factor: 'Awards', status: 'missing', impact: '?' },
      ],
      confidence: 'low',
    };
  }
  
  // GPA impact
  if (profile.academics?.gpaUnweighted) {
    dataPoints++;
    const gpa = profile.academics.gpaUnweighted;
    if (gpa >= 3.9) {
      baseChance += 5;
      breakdown.push({ factor: 'GPA', status: 'strong', impact: '+5%' });
    } else if (gpa >= 3.7) {
      baseChance += 2;
      breakdown.push({ factor: 'GPA', status: 'ok', impact: '+2%' });
    } else if (gpa >= 3.5) {
      breakdown.push({ factor: 'GPA', status: 'ok', impact: '0%' });
    } else {
      baseChance -= 3;
      breakdown.push({ factor: 'GPA', status: 'weak', impact: '-3%' });
    }
  } else {
    breakdown.push({ factor: 'GPA', status: 'missing', impact: '?' });
  }
  
  // SAT/ACT impact
  if (profile.testing?.satTotal) {
    dataPoints++;
    const sat = profile.testing.satTotal;
    if (sat >= 1550) {
      baseChance += 6;
      breakdown.push({ factor: 'SAT', status: 'strong', impact: '+6%' });
    } else if (sat >= 1500) {
      baseChance += 4;
      breakdown.push({ factor: 'SAT', status: 'strong', impact: '+4%' });
    } else if (sat >= 1400) {
      baseChance += 1;
      breakdown.push({ factor: 'SAT', status: 'ok', impact: '+1%' });
    } else {
      baseChance -= 2;
      breakdown.push({ factor: 'SAT', status: 'weak', impact: '-2%' });
    }
  } else if (profile.testing?.actComposite) {
    dataPoints++;
    const act = profile.testing.actComposite;
    if (act >= 35) {
      baseChance += 6;
      breakdown.push({ factor: 'ACT', status: 'strong', impact: '+6%' });
    } else if (act >= 33) {
      baseChance += 3;
      breakdown.push({ factor: 'ACT', status: 'strong', impact: '+3%' });
    } else {
      breakdown.push({ factor: 'ACT', status: 'ok', impact: '+1%' });
    }
  } else {
    breakdown.push({ factor: 'Testing', status: 'missing', impact: '?' });
  }
  
  // Activities impact
  if (profile.activities && profile.activities.length > 0) {
    dataPoints++;
    const hasLeadership = profile.activities.some(a => a.isLeadership);
    if (profile.activities.length >= 5 && hasLeadership) {
      baseChance += 4;
      breakdown.push({ factor: 'Activities', status: 'strong', impact: '+4%' });
    } else if (profile.activities.length >= 3) {
      baseChance += 2;
      breakdown.push({ factor: 'Activities', status: 'ok', impact: '+2%' });
    } else {
      breakdown.push({ factor: 'Activities', status: 'ok', impact: '+1%' });
    }
  } else {
    breakdown.push({ factor: 'Activities', status: 'missing', impact: '?' });
  }
  
  // Awards impact
  if (profile.awards && profile.awards.length > 0) {
    dataPoints++;
    const hasNational = profile.awards.some(a => a.level === 'national' || a.level === 'international');
    if (hasNational) {
      baseChance += 5;
      breakdown.push({ factor: 'Awards', status: 'strong', impact: '+5%' });
    } else {
      baseChance += 2;
      breakdown.push({ factor: 'Awards', status: 'ok', impact: '+2%' });
    }
  } else {
    breakdown.push({ factor: 'Awards', status: 'missing', impact: '?' });
  }
  
  const chance = Math.max(1, Math.min(baseChance, 95));
  
  let tier: ChancesResult['tier'] = 'unknown';
  if (chance < 15) tier = 'reach';
  else if (chance < 40) tier = 'target';
  else tier = 'safety';
  
  let confidence: ChancesResult['confidence'] = 'low';
  if (dataPoints >= 4) confidence = 'high';
  else if (dataPoints >= 2) confidence = 'medium';
  
  return { chance, tier, breakdown, confidence };
}

// Parse user input (for AI chat)
export function parseUserInput(text: string): ParsedData {
  const lower = text.toLowerCase();
  
  // GPA patterns
  const gpaMatch = text.match(/(\d+\.?\d*)\s*(gpa|grade point)/i) || 
                   text.match(/gpa\s*(of|is|:)?\s*(\d+\.?\d*)/i);
  if (gpaMatch) {
    const gpaValue = parseFloat(gpaMatch[1] || gpaMatch[2]);
    const isWeighted = lower.includes('weighted') || gpaValue > 4.0;
    return {
      type: 'gpa',
      data: { value: gpaValue, isWeighted, label: isWeighted ? 'Weighted GPA' : 'Unweighted GPA' },
      confidence: 'high',
      original: text,
    };
  }
  
  // SAT patterns
  const satMatch = text.match(/(\d{3,4})\s*(on|sat|on the sat|super\s*score)/i) ||
                   text.match(/sat\s*(score|is|of|:)?\s*(\d{3,4})/i);
  if (satMatch || (lower.includes('sat') && text.match(/\d{3,4}/))) {
    const scoreMatch = text.match(/\d{3,4}/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0]);
      if (score >= 400 && score <= 1600) {
        return {
          type: 'sat',
          data: { value: score, label: 'SAT Score' },
          confidence: 'high',
          original: text,
        };
      }
    }
  }
  
  // ACT patterns
  if (lower.includes('act') && text.match(/\d{1,2}/)) {
    const scoreMatch = text.match(/\d{1,2}/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0]);
      if (score >= 1 && score <= 36) {
        return {
          type: 'act',
          data: { value: score, label: 'ACT Score' },
          confidence: 'high',
          original: text,
        };
      }
    }
  }
  
  // Activity patterns
  const leadershipKeywords = ['president', 'captain', 'founder', 'leader', 'head', 'director', 'chief', 'vp', 'vice president'];
  const activityKeywords = ['club', 'team', 'organization', 'volunteer', 'intern', 'member', 'participate'];
  
  const hasLeadership = leadershipKeywords.some(k => lower.includes(k));
  const hasActivity = activityKeywords.some(k => lower.includes(k)) || hasLeadership;
  
  if (hasActivity) {
    return {
      type: 'activity',
      data: { title: text, isLeadership: hasLeadership, label: hasLeadership ? 'Leadership Activity' : 'Activity' },
      confidence: hasLeadership ? 'high' : 'medium',
      original: text,
    };
  }
  
  // Award patterns
  const awardKeywords = ['won', 'winner', 'award', 'prize', 'finalist', 'semifinalist', 'qualifier', 'medal', '1st place', '2nd place', '3rd place', 'national merit', 'aime', 'usamo', 'olympiad'];
  const hasAward = awardKeywords.some(k => lower.includes(k));
  
  if (hasAward) {
    const isNational = lower.includes('national') || lower.includes('usamo') || lower.includes('aime') || lower.includes('olympiad');
    return {
      type: 'award',
      data: { title: text, level: isNational ? 'national' : 'regional', label: isNational ? 'National Award' : 'Award' },
      confidence: 'medium',
      original: text,
    };
  }
  
  // School patterns
  const commonSchools = ['stanford', 'harvard', 'yale', 'mit', 'princeton', 'columbia', 'berkeley', 'ucla', 'nyu', 'cmu', 'carnegie mellon', 'georgia tech'];
  const foundSchool = commonSchools.find(s => lower.includes(s));
  
  if (foundSchool || lower.includes('want to go to') || lower.includes('dream school')) {
    const schoolNames: Record<string, string> = {
      stanford: 'Stanford', harvard: 'Harvard', yale: 'Yale', mit: 'MIT', princeton: 'Princeton',
      columbia: 'Columbia', berkeley: 'UC Berkeley', ucla: 'UCLA', nyu: 'NYU',
      cmu: 'Carnegie Mellon', 'carnegie mellon': 'Carnegie Mellon', 'georgia tech': 'Georgia Tech',
    };
    return {
      type: 'school',
      data: { name: foundSchool ? schoolNames[foundSchool] : text, label: `Interested in ${foundSchool ? schoolNames[foundSchool] : 'school'}` },
      confidence: foundSchool ? 'high' : 'medium',
      original: text,
    };
  }
  
  return { type: 'unknown', data: { text }, confidence: 'low', original: text };
}

// Reset to sample data (for demo)
export async function resetToSampleData(): Promise<StudentProfile> {
  if (typeof window === 'undefined') return sampleProfile;
  localStorage.setItem(USE_SAMPLE_KEY, 'true');
  localStorage.removeItem(PROFILE_KEY);
  return sampleProfile;
}

// Clear all demo data
export async function clearDemoData(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(USE_SAMPLE_KEY);
}
