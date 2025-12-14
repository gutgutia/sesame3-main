import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

/**
 * GET /api/profile/courses
 * Get all courses for the current user
 * Query params:
 *   - status: "completed" | "in_progress" | "planned" (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    const where: { studentProfileId: string; status?: string } = {
      studentProfileId: profileId,
    };
    
    if (status && ["completed", "in_progress", "planned"].includes(status)) {
      where.status = status;
    }
    
    const courses = await prisma.course.findMany({
      where,
      orderBy: [
        { status: "asc" }, // completed, in_progress, planned
        { academicYear: "desc" },
        { name: "asc" },
      ],
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

/**
 * POST /api/profile/courses
 * Create a new course
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const body = await request.json();
    
    const course = await prisma.course.create({
      data: {
        studentProfileId: profileId,
        name: body.name,
        subject: body.subject,
        level: body.level,
        status: body.status || "completed",
        academicYear: body.academicYear,
        semester: body.semester,
        gradeLevel: body.gradeLevel,
        grade: body.grade,
        gradeNumeric: body.gradeNumeric,
        planningNotes: body.planningNotes,
        isCore: body.isCore ?? false,
        credits: body.credits,
      },
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
