import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/profile/goals/[id]
 * Get a specific goal with its tasks
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    const goal = await prisma.goal.findFirst({
      where: {
        id,
        studentProfileId: profileId,
      },
      include: {
        tasks: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching goal:", error);
    return NextResponse.json({ error: "Failed to fetch goal" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/goals/[id]
 * Update a goal
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    const body = await request.json();
    
    // Verify ownership
    const existing = await prisma.goal.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        status: body.status,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        startedAt: body.startedAt ? new Date(body.startedAt) : undefined,
        completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
        priority: body.priority,
        impactDescription: body.impactDescription,
        relatedPillar: body.relatedPillar,
        displayOrder: body.displayOrder,
      },
      include: {
        tasks: true,
      },
    });
    
    return NextResponse.json(goal);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating goal:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/goals/[id]
 * Delete a goal and its tasks
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.goal.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    // Cascade delete will handle tasks
    await prisma.goal.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
