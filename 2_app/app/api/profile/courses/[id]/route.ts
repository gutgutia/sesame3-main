import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/profile/courses/[id]
 * Get a specific course
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    const course = await prisma.course.findFirst({
      where: {
        id,
        studentProfileId: profileId,
      },
    });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json(course);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/courses/[id]
 * Update a course
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    const body = await request.json();
    
    // Verify ownership
    const existing = await prisma.course.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    const course = await prisma.course.update({
      where: { id },
      data: {
        name: body.name,
        subject: body.subject,
        level: body.level,
        status: body.status,
        academicYear: body.academicYear,
        semester: body.semester,
        gradeLevel: body.gradeLevel,
        grade: body.grade,
        gradeNumeric: body.gradeNumeric,
        planningNotes: body.planningNotes,
        isCore: body.isCore,
        credits: body.credits,
      },
    });
    
    return NextResponse.json(course);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/courses/[id]
 * Delete a course
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.course.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    await prisma.course.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
