import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/profile/awards/[id]
 * Get a specific award
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    const award = await prisma.award.findFirst({
      where: {
        id,
        studentProfileId: profileId,
      },
    });
    
    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    return NextResponse.json(award);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching award:", error);
    return NextResponse.json({ error: "Failed to fetch award" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/awards/[id]
 * Update an award
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    const body = await request.json();
    
    // Verify ownership
    const existing = await prisma.award.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    const award = await prisma.award.update({
      where: { id },
      data: {
        title: body.title,
        organization: body.organization,
        level: body.level,
        category: body.category,
        year: body.year,
        gradeLevel: body.gradeLevel,
        description: body.description,
        displayOrder: body.displayOrder,
      },
    });
    
    return NextResponse.json(award);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating award:", error);
    return NextResponse.json({ error: "Failed to update award" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/awards/[id]
 * Delete an award
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const profileId = await requireProfile();
    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.award.findFirst({
      where: { id, studentProfileId: profileId },
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }
    
    await prisma.award.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error deleting award:", error);
    return NextResponse.json({ error: "Failed to delete award" }, { status: 500 });
  }
}
