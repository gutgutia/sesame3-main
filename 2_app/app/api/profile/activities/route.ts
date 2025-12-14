import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

/**
 * GET /api/profile/activities
 * Get all activities for the current user
 */
export async function GET() {
  try {
    const profileId = await requireProfile();
    
    const activities = await prisma.activity.findMany({
      where: { studentProfileId: profileId },
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

/**
 * POST /api/profile/activities
 * Create a new activity
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const body = await request.json();
    
    // Get the next display order
    const lastActivity = await prisma.activity.findFirst({
      where: { studentProfileId: profileId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (lastActivity?.displayOrder ?? -1) + 1;
    
    const activity = await prisma.activity.create({
      data: {
        studentProfileId: profileId,
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
        isLeadership: body.isLeadership ?? false,
        isSpike: body.isSpike ?? false,
        isContinuing: body.isContinuing ?? true,
        displayOrder: body.displayOrder ?? nextOrder,
      },
    });
    
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
