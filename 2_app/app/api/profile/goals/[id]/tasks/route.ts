import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/profile/goals/[id]/tasks
 * Create a new task for a goal
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id: goalId } = await params;
    const body = await request.json();
    
    // Verify goal ownership
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, studentProfileId: profileId },
    });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    // Get the next display order
    const lastTask = await prisma.task.findFirst({
      where: { goalId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (lastTask?.displayOrder ?? -1) + 1;
    
    const task = await prisma.task.create({
      data: {
        goalId,
        title: body.title,
        description: body.description,
        completed: body.completed ?? false,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        priority: body.priority,
        displayOrder: body.displayOrder ?? nextOrder,
      },
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
