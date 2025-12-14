import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/profile/programs/[id]
 * Update a program
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    const body = await request.json();
    
    // Verify ownership
    const existing = await prisma.program.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    
    const program = await prisma.program.update({
      where: { id },
      data: {
        name: body.name,
        organization: body.organization,
        type: body.type,
        status: body.status,
        year: body.year,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        duration: body.duration,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : undefined,
        applicationStatus: body.applicationStatus,
        description: body.description,
        selectivity: body.selectivity,
        outcome: body.outcome,
      },
    });
    
    return NextResponse.json(program);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating program:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/programs/[id]
 * Delete a program
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.program.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    
    await prisma.program.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting program:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
