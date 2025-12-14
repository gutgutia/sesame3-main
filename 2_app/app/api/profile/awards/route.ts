import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

/**
 * GET /api/profile/awards
 * Get all awards for the current user
 */
export async function GET() {
  try {
    const profileId = await requireProfile();
    
    const awards = await prisma.award.findMany({
      where: { studentProfileId: profileId },
      orderBy: { displayOrder: "asc" },
    });
    
    return NextResponse.json(awards);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching awards:", error);
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}

/**
 * POST /api/profile/awards
 * Create a new award
 */
export async function POST(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const body = await request.json();
    
    // Get the next display order
    const lastAward = await prisma.award.findFirst({
      where: { studentProfileId: profileId },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (lastAward?.displayOrder ?? -1) + 1;
    
    const award = await prisma.award.create({
      data: {
        studentProfileId: profileId,
        title: body.title,
        organization: body.organization,
        level: body.level,
        category: body.category,
        year: body.year,
        gradeLevel: body.gradeLevel,
        description: body.description,
        displayOrder: body.displayOrder ?? nextOrder,
      },
    });
    
    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error creating award:", error);
    return NextResponse.json({ error: "Failed to create award" }, { status: 500 });
  }
}
