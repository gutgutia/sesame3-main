// Real Profile Data Layer
// Uses Prisma with PostgreSQL (Supabase)

import prisma from '@/lib/db';
import type { 
  StudentProfile, 
  Activity, 
  Award, 
  School, 
  Goal, 
  Course, 
  ZoneStatus,
  DashboardZone,
  ChancesResult,
  ParsedData 
} from '../types';

// Transform Prisma model to our type
function transformProfile(dbProfile: any): StudentProfile | null {
  if (!dbProfile) return null;
  
  return {
    id: dbProfile.id,
    userId: dbProfile.userId,
    firstName: dbProfile.firstName,
    lastName: dbProfile.lastName || undefined,
    preferredName: dbProfile.preferredName || undefined,
    grade: dbProfile.grade || undefined,
    graduationYear: dbProfile.graduationYear || undefined,
    highSchoolName: dbProfile.highSchoolName || undefined,
    highSchoolCity: dbProfile.highSchoolCity || undefined,
    highSchoolState: dbProfile.highSchoolState || undefined,
    highSchoolType: dbProfile.highSchoolType || undefined,
    onboardingCompletedAt: dbProfile.onboardingCompletedAt || undefined,
    onboardingData: dbProfile.onboardingData || undefined,
    aboutMe: dbProfile.aboutMe ? {
      story: dbProfile.aboutMe.story || undefined,
      values: dbProfile.aboutMe.values || [],
      interests: dbProfile.aboutMe.interests || [],
      personality: dbProfile.aboutMe.personality || undefined,
      background: dbProfile.aboutMe.background || undefined,
      aspirations: dbProfile.aboutMe.aspirations || undefined,
    } : undefined,
    academics: dbProfile.academics ? {
      gpaUnweighted: dbProfile.academics.gpaUnweighted || undefined,
      gpaWeighted: dbProfile.academics.gpaWeighted || undefined,
      gpaScale: dbProfile.academics.gpaScale || undefined,
      classRank: dbProfile.academics.classRank || undefined,
      classSize: dbProfile.academics.classSize || undefined,
      apCourseCount: dbProfile.academics.apCourseCount || undefined,
      honorsCourseCount: dbProfile.academics.honorsCourseCount || undefined,
      collegeCourseCount: dbProfile.academics.collegeCourseCount || undefined,
      transcriptUrl: dbProfile.academics.transcriptUrl || undefined,
    } : undefined,
    testing: dbProfile.testing ? {
      satTotal: dbProfile.testing.satTotal || undefined,
      satMath: dbProfile.testing.satMath || undefined,
      satReading: dbProfile.testing.satReading || undefined,
      satDate: dbProfile.testing.satDate || undefined,
      satSuperscored: dbProfile.testing.satSuperscored || false,
      actComposite: dbProfile.testing.actComposite || undefined,
      actEnglish: dbProfile.testing.actEnglish || undefined,
      actMath: dbProfile.testing.actMath || undefined,
      actReading: dbProfile.testing.actReading || undefined,
      actScience: dbProfile.testing.actScience || undefined,
      actDate: dbProfile.testing.actDate || undefined,
      actSuperscored: dbProfile.testing.actSuperscored || false,
      psatTotal: dbProfile.testing.psatTotal || undefined,
      nmsqtQualified: dbProfile.testing.nmsqtQualified || undefined,
      planningToTakeSat: dbProfile.testing.planningToTakeSat || false,
      planningToTakeAct: dbProfile.testing.planningToTakeAct || false,
      apScores: dbProfile.testing.apScores?.map((s: any) => ({
        subject: s.subject,
        score: s.score,
        year: s.year,
      })) || [],
    } : undefined,
    courses: dbProfile.courses?.map((c: any) => ({
      id: c.id,
      name: c.name,
      subject: c.subject || undefined,
      level: c.level || undefined,
      status: c.status,
      academicYear: c.academicYear || undefined,
      semester: c.semester || undefined,
      gradeLevel: c.gradeLevel || undefined,
      grade: c.grade || undefined,
      gradeNumeric: c.gradeNumeric || undefined,
      planningNotes: c.planningNotes || undefined,
      isCore: c.isCore || false,
      credits: c.credits || undefined,
    })) || [],
    activities: dbProfile.activities?.map((a: any) => ({
      id: a.id,
      title: a.title,
      organization: a.organization,
      role: a.title,
      category: a.category || undefined,
      yearsActive: a.yearsActive || undefined,
      startGrade: a.startGrade || undefined,
      endGrade: a.endGrade || undefined,
      hoursPerWeek: a.hoursPerWeek || undefined,
      weeksPerYear: a.weeksPerYear || undefined,
      description: a.description || undefined,
      achievements: a.achievements || undefined,
      isLeadership: a.isLeadership || false,
      isSpike: a.isSpike || false,
      isContinuing: a.isContinuing || true,
      displayOrder: a.displayOrder || 0,
    })) || [],
    awards: dbProfile.awards?.map((a: any) => ({
      id: a.id,
      title: a.title,
      organization: a.organization || undefined,
      level: a.level,
      category: a.category || undefined,
      year: a.year || undefined,
      gradeLevel: a.gradeLevel || undefined,
      description: a.description || undefined,
      displayOrder: a.displayOrder || 0,
    })) || [],
    programs: dbProfile.programs?.map((p: any) => ({
      id: p.id,
      name: p.name,
      organization: p.organization || undefined,
      type: p.type,
      status: p.status,
      year: p.year || undefined,
      startDate: p.startDate || undefined,
      endDate: p.endDate || undefined,
      duration: p.duration || undefined,
      applicationDeadline: p.applicationDeadline || undefined,
      description: p.description || undefined,
      selectivity: p.selectivity || undefined,
      outcome: p.outcome || undefined,
    })) || [],
    schools: dbProfile.schoolList?.map((s: any) => ({
      id: s.id,
      name: s.school?.name || '',
      shortName: s.school?.shortName || undefined,
      tier: s.tier,
      status: s.status,
      interestLevel: s.interestLevel || undefined,
      applicationType: s.applicationType || undefined,
      chance: s.calculatedChance || undefined,
      notes: s.notes || undefined,
      whyInterested: s.whyInterested || undefined,
      concerns: s.concerns || undefined,
      displayOrder: s.displayOrder || 0,
    })) || [],
    goals: dbProfile.goals?.map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description || undefined,
      category: g.category,
      status: g.status,
      targetDate: g.targetDate || undefined,
      startedAt: g.startedAt || undefined,
      completedAt: g.completedAt || undefined,
      priority: g.priority || undefined,
      impactDescription: g.impactDescription || undefined,
      relatedPillar: g.relatedPillar || undefined,
      tasks: g.tasks?.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || undefined,
        completed: t.completed,
        completedAt: t.completedAt || undefined,
        dueDate: t.dueDate || undefined,
        priority: t.priority || undefined,
        displayOrder: t.displayOrder || 0,
      })) || [],
      displayOrder: g.displayOrder || 0,
    })) || [],
    createdAt: dbProfile.createdAt,
    updatedAt: dbProfile.updatedAt,
  };
}

// Get profile by user ID
export async function getProfile(userId: string): Promise<StudentProfile | null> {
  const dbProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      aboutMe: true,
      academics: true,
      testing: {
        include: {
          apScores: true,
        },
      },
      courses: {
        orderBy: { createdAt: 'desc' },
      },
      activities: {
        orderBy: { displayOrder: 'asc' },
      },
      awards: {
        orderBy: { displayOrder: 'asc' },
      },
      programs: {
        orderBy: { createdAt: 'desc' },
      },
      schoolList: {
        include: {
          school: true,
        },
        orderBy: { displayOrder: 'asc' },
      },
      goals: {
        include: {
          tasks: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
  
  return transformProfile(dbProfile);
}

// Create profile
export async function createProfile(data: Partial<StudentProfile> & { userId: string; firstName: string }): Promise<StudentProfile> {
  const dbProfile = await prisma.studentProfile.create({
    data: {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName,
      grade: data.grade,
      graduationYear: data.graduationYear,
      highSchoolName: data.highSchoolName,
      highSchoolCity: data.highSchoolCity,
      highSchoolState: data.highSchoolState,
      highSchoolType: data.highSchoolType,
      onboardingData: data.onboardingData as any,
    },
    include: {
      aboutMe: true,
      academics: true,
      testing: true,
      courses: true,
      activities: true,
      awards: true,
      programs: true,
      schoolList: { include: { school: true } },
      goals: { include: { tasks: true } },
    },
  });
  
  return transformProfile(dbProfile)!;
}

// Save/Update profile
export async function saveProfile(profile: StudentProfile): Promise<StudentProfile> {
  const dbProfile = await prisma.studentProfile.update({
    where: { id: profile.id },
    data: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      preferredName: profile.preferredName,
      grade: profile.grade,
      graduationYear: profile.graduationYear,
      highSchoolName: profile.highSchoolName,
      highSchoolCity: profile.highSchoolCity,
      highSchoolState: profile.highSchoolState,
      highSchoolType: profile.highSchoolType,
      onboardingData: profile.onboardingData as any,
      onboardingCompletedAt: profile.onboardingCompletedAt,
    },
    include: {
      aboutMe: true,
      academics: true,
      testing: true,
      courses: true,
      activities: true,
      awards: true,
      programs: true,
      schoolList: { include: { school: true } },
      goals: { include: { tasks: true } },
    },
  });
  
  return transformProfile(dbProfile)!;
}

// Update profile section
export async function updateProfileSection<K extends keyof StudentProfile>(
  userId: string,
  section: K,
  data: StudentProfile[K]
): Promise<StudentProfile> {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });
  
  if (!profile) throw new Error('Profile not found');
  
  // Handle different sections
  if (section === 'aboutMe') {
    await prisma.aboutMe.upsert({
      where: { studentProfileId: profile.id },
      create: {
        studentProfileId: profile.id,
        ...(data as any),
      },
      update: data as any,
    });
  } else if (section === 'academics') {
    await prisma.academics.upsert({
      where: { studentProfileId: profile.id },
      create: {
        studentProfileId: profile.id,
        ...(data as any),
      },
      update: data as any,
    });
  } else if (section === 'testing') {
    await prisma.testing.upsert({
      where: { studentProfileId: profile.id },
      create: {
        studentProfileId: profile.id,
        ...(data as any),
      },
      update: data as any,
    });
  }
  
  return (await getProfile(userId))!;
}

// Add activity
export async function addActivity(userId: string, activity: Omit<Activity, 'id'>): Promise<Activity> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Profile not found');
  
  const count = await prisma.activity.count({ where: { studentProfileId: profile.id } });
  
  const created = await prisma.activity.create({
    data: {
      studentProfileId: profile.id,
      title: activity.title || activity.role || '',
      organization: activity.organization || '',
      category: activity.category,
      yearsActive: activity.yearsActive,
      startGrade: activity.startGrade,
      endGrade: activity.endGrade,
      hoursPerWeek: activity.hoursPerWeek,
      weeksPerYear: activity.weeksPerYear,
      description: activity.description,
      achievements: activity.achievements,
      isLeadership: activity.isLeadership || false,
      isSpike: activity.isSpike || false,
      isContinuing: activity.isContinuing ?? true,
      displayOrder: count + 1,
    },
  });
  
  return {
    id: created.id,
    title: created.title,
    organization: created.organization,
    category: created.category as Activity['category'],
    isLeadership: created.isLeadership,
    displayOrder: created.displayOrder,
  };
}

// Add award
export async function addAward(userId: string, award: Omit<Award, 'id'>): Promise<Award> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Profile not found');
  
  const count = await prisma.award.count({ where: { studentProfileId: profile.id } });
  
  const created = await prisma.award.create({
    data: {
      studentProfileId: profile.id,
      title: award.title,
      organization: award.organization,
      level: award.level,
      category: award.category,
      year: award.year,
      gradeLevel: award.gradeLevel,
      description: award.description,
      displayOrder: count + 1,
    },
  });
  
  return {
    id: created.id,
    title: created.title,
    level: created.level as Award['level'],
    displayOrder: created.displayOrder,
  };
}

// Add school to list
export async function addSchool(userId: string, school: Omit<School, 'id'>): Promise<School> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Profile not found');
  
  // Find or create the school in reference data
  let dbSchool = await prisma.school.findUnique({ where: { name: school.name } });
  if (!dbSchool) {
    dbSchool = await prisma.school.create({
      data: { name: school.name, shortName: school.shortName },
    });
  }
  
  const count = await prisma.studentSchool.count({ where: { studentProfileId: profile.id } });
  
  const created = await prisma.studentSchool.create({
    data: {
      studentProfileId: profile.id,
      schoolId: dbSchool.id,
      tier: school.tier,
      status: school.status || 'researching',
      interestLevel: school.interestLevel,
      applicationType: school.applicationType,
      notes: school.notes,
      whyInterested: school.whyInterested,
      concerns: school.concerns,
      displayOrder: count + 1,
    },
    include: { school: true },
  });
  
  return {
    id: created.id,
    name: created.school.name,
    tier: created.tier as School['tier'],
    status: created.status as School['status'],
    displayOrder: created.displayOrder,
  };
}

// Add goal
export async function addGoal(userId: string, goal: Omit<Goal, 'id'>): Promise<Goal> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Profile not found');
  
  const count = await prisma.goal.count({ where: { studentProfileId: profile.id } });
  
  const created = await prisma.goal.create({
    data: {
      studentProfileId: profile.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      status: goal.status || 'planning',
      targetDate: goal.targetDate,
      priority: goal.priority,
      impactDescription: goal.impactDescription,
      relatedPillar: goal.relatedPillar,
      displayOrder: count + 1,
    },
    include: { tasks: true },
  });
  
  return {
    id: created.id,
    title: created.title,
    category: created.category as Goal['category'],
    status: created.status as Goal['status'],
    tasks: [],
    displayOrder: created.displayOrder,
  };
}

// Add course
export async function addCourse(userId: string, course: Omit<Course, 'id'>): Promise<Course> {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Profile not found');
  
  const created = await prisma.course.create({
    data: {
      studentProfileId: profile.id,
      name: course.name,
      subject: course.subject,
      level: course.level,
      status: course.status,
      academicYear: course.academicYear,
      semester: course.semester,
      gradeLevel: course.gradeLevel,
      grade: course.grade,
      gradeNumeric: course.gradeNumeric,
      planningNotes: course.planningNotes,
      isCore: course.isCore || false,
      credits: course.credits,
    },
  });
  
  return {
    id: created.id,
    name: created.name,
    status: created.status as Course['status'],
  };
}

// Import zone and chances calculation from mock (same logic)
import { calculateZone, calculateChances, parseUserInput } from '../mock/profile';
export { calculateZone, calculateChances, parseUserInput };
