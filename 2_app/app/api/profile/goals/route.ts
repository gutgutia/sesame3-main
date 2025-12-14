import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

/**
 * GET /api/profile/goals
 * Get all goals for the current user
 */
export async function GET() {
  try {
    const profileId = await requireProfile();
    
    const goals = await prisma.goal.findMany({
      where: { studentProfileId: profileId },
      include: {
        tasks: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json(goals);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

/**
 * POST /api/profile/goals
 * Create a new goal
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const body = await request.json();
    
    // Get the next display order
    const lastGoal = await prisma.goal.findFirst({
      where: { studentProfileId: profileId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (lastGoal?.displayOrder ?? -1) + 1;
    
    const goal = await prisma.goal.create({
      data: {
        studentProfileId: profileId,
        title: body.title,
        description: body.description,
        category: body.category,
        status: body.status || "planning",
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        startedAt: body.startedAt ? new Date(body.startedAt) : undefined,
        priority: body.priority,
        impactDescription: body.impactDescription,
        relatedPillar: body.relatedPillar,
        displayOrder: body.displayOrder ?? nextOrder,
      },
      include: {
        tasks: true,
      },
    });
    
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
