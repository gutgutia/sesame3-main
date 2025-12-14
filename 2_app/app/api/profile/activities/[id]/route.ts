import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/profile/activities/[id]
 * Get a specific activity
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    const activity = await prisma.activity.findFirst({
      where: {
        id,
        studentProfileId: profileId,
      },
    });
    
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    
    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/activities/[id]
 * Update an activity
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    const body = await request.json();
    
    // Verify ownership
    const existing = await prisma.activity.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: body.title,
        organization: body.organization,
        category: body.category,
        yearsActive: body.yearsActive,
        startGrade: body.startGrade,
        endGrade: body.endGrade,
        hoursPerWeek: body.hoursPerWeek,
        weeksPerYear: body.weeksPerYear,
        description: body.description,
        achievements: body.achievements,
        isLeadership: body.isLeadership,
        isSpike: body.isSpike,
        isContinuing: body.isContinuing,
        displayOrder: body.displayOrder,
      },
    });
    
    return NextResponse.json(activity);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/activities/[id]
 * Delete an activity
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.activity.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    
    await prisma.activity.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
