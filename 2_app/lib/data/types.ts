// Shared Types for Student Profile Data
// These types are used by both mock and real data layers

export type Activity = {
  id: string;
  title: string;
  role?: string;
  organization?: string;
  category?: 'club' | 'sport' | 'arts' | 'volunteer' | 'work' | 'family' | 'other';
  yearsActive?: string;
  startGrade?: string;
  endGrade?: string;
  hoursPerWeek?: number;
  weeksPerYear?: number;
  description?: string;
  achievements?: string;
  isLeadership?: boolean;
  isSpike?: boolean;
  isContinuing?: boolean;
  displayOrder?: number;
};

export type Award = {
  id: string;
  title: string;
  organization?: string;
  level: 'school' | 'regional' | 'state' | 'national' | 'international';
  category?: 'academic' | 'arts' | 'athletics' | 'community' | 'other';
  year?: number;
  gradeLevel?: string;
  description?: string;
  displayOrder?: number;
};

export type Program = {
  id: string;
  name: string;
  organization?: string;
  type: 'summer' | 'research' | 'internship' | 'online' | 'competition_prep' | 'other';
  status: 'interested' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'attending' | 'completed';
  year?: number;
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  applicationDeadline?: Date;
  description?: string;
  selectivity?: 'highly_selective' | 'selective' | 'moderate' | 'open';
  outcome?: string;
};

export type Course = {
  id: string;
  name: string;
  subject?: 'Math' | 'Science' | 'English' | 'History' | 'Language' | 'Arts' | 'Other';
  level?: 'regular' | 'honors' | 'ap' | 'ib' | 'college' | 'other';
  status: 'completed' | 'in_progress' | 'planned';
  academicYear?: string;
  semester?: 'fall' | 'spring' | 'full_year' | 'summer';
  gradeLevel?: string;
  grade?: string;
  gradeNumeric?: number;
  planningNotes?: string;
  isCore?: boolean;
  credits?: number;
};

export type School = {
  id: string;
  name: string;
  shortName?: string;
  tier: 'dream' | 'reach' | 'target' | 'safety';
  interestLevel?: 'high' | 'medium' | 'low' | 'uncertain';
  status: 'researching' | 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted' | 'deferred' | 'withdrawn' | 'committed';
  applicationType?: 'ed' | 'ed2' | 'ea' | 'rea' | 'rd';
  chance?: number;
  deadline?: string;
  notes?: string;
  whyInterested?: string;
  concerns?: string;
  displayOrder?: number;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';
  displayOrder?: number;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  category: 'research' | 'competition' | 'leadership' | 'project' | 'academic' | 'application' | 'other';
  status: 'parking_lot' | 'planning' | 'in_progress' | 'completed' | 'abandoned';
  targetDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority?: 'high' | 'medium' | 'low';
  impactDescription?: string;
  relatedPillar?: string;
  tasks?: Task[];
  displayOrder?: number;
};

export type AboutMe = {
  story?: string;
  values?: string[];
  interests?: string[];
  personality?: string;
  background?: string;
  aspirations?: string;
};

export type Academics = {
  gpaUnweighted?: number;
  gpaWeighted?: number;
  gpaScale?: number;
  classRank?: number;
  classSize?: number;
  apCourseCount?: number;
  honorsCourseCount?: number;
  collegeCourseCount?: number;
  transcriptUrl?: string;
};

export type Testing = {
  satTotal?: number;
  satMath?: number;
  satReading?: number;
  satDate?: Date;
  satSuperscored?: boolean;
  actComposite?: number;
  actEnglish?: number;
  actMath?: number;
  actReading?: number;
  actScience?: number;
  actDate?: Date;
  actSuperscored?: boolean;
  psatTotal?: number;
  psatDate?: Date;
  nmsqtQualified?: boolean;
  planningToTakeSat?: boolean;
  planningToTakeAct?: boolean;
  plannedSatDate?: Date;
  plannedActDate?: Date;
  apScores?: { subject: string; score: number; year?: number }[];
};

export type OnboardingData = {
  name?: string;
  grade?: string;
  feeling?: string;
  dreamSchool?: string;
  hasDreamSchool?: boolean;
};

export type StudentProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  preferredName?: string;
  grade?: string;
  graduationYear?: number;
  highSchoolName?: string;
  highSchoolCity?: string;
  highSchoolState?: string;
  highSchoolType?: 'public' | 'private' | 'charter' | 'homeschool';
  onboardingCompletedAt?: Date;
  onboardingData?: OnboardingData;
  aboutMe?: AboutMe;
  academics?: Academics;
  testing?: Testing;
  courses?: Course[];
  activities?: Activity[];
  awards?: Award[];
  programs?: Program[];
  schools?: School[];
  goals?: Goal[];
  createdAt?: Date;
  updatedAt?: Date;
};

// Zone calculation types
export type DashboardZone = 0 | 1 | 2 | 3;

export type ZoneStatus = {
  zone: DashboardZone;
  areas: {
    schools: { filled: boolean; count: number };
    profile: { filled: boolean; hasAcademics: boolean; hasActivities: boolean; hasAwards: boolean };
    goals: { filled: boolean; count: number };
  };
  hasStory: boolean;
  filledCount: number;
  nextSteps: string[];
};

// Chances calculation types
export type ChancesResult = {
  chance: number;
  tier: 'reach' | 'target' | 'safety' | 'unknown';
  breakdown: { factor: string; status: 'strong' | 'ok' | 'weak' | 'missing'; impact: string }[];
  confidence: 'low' | 'medium' | 'high';
};

// Parsed data types (for AI parsing)
export type ParsedData = {
  type: 'gpa' | 'sat' | 'act' | 'activity' | 'award' | 'school' | 'goal' | 'course' | 'unknown';
  data: Record<string, unknown>;
  confidence: 'high' | 'medium' | 'low';
  original: string;
};

// Conversation types
export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: Record<string, unknown>[];
  toolResults?: Record<string, unknown>[];
  widgetType?: string;
  widgetData?: Record<string, unknown>;
  widgetStatus?: 'pending' | 'confirmed' | 'edited' | 'dismissed';
  createdAt: Date;
};

export type Conversation = {
  id: string;
  title?: string;
  mode?: 'general' | 'chances' | 'planning' | 'schools' | 'story' | 'courses';
  summary?: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt?: Date;
  messageCount: number;
};
