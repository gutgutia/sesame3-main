import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string; taskId: string }>;
}

/**
 * PUT /api/profile/goals/[id]/tasks/[taskId]
 * Update a task
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id: goalId, taskId } = await params;
    const body = await request.json();
    
    // Verify goal ownership
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, studentProfileId: profileId },
    });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    // Verify task belongs to this goal
    const existing = await prisma.task.findFirst({
      where: { id: taskId, goalId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        completed: body.completed,
        completedAt: body.completed && !existing.completed ? new Date() : 
                     !body.completed && existing.completed ? null : 
                     undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        priority: body.priority,
        displayOrder: body.displayOrder,
      },
    });
    
    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/goals/[id]/tasks/[taskId]
 * Delete a task
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id: goalId, taskId } = await params;
    
    // Verify goal ownership
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, studentProfileId: profileId },
    });
    
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    // Verify task belongs to this goal
    const existing = await prisma.task.findFirst({
      where: { id: taskId, goalId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    await prisma.task.delete({ where: { id: taskId } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
