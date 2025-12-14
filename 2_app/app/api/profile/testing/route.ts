import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/auth";

/**
 * GET /api/profile/testing
 * Get the current user's testing section (SAT, ACT, AP scores, etc.)
 */
export async function GET() {
  try {
    const profileId = await requireProfile();
    
    const testing = await prisma.testing.findUnique({
      where: { studentProfileId: profileId },
      include: {
        apScores: true,
        subjectTests: true,
      },
    });
    
    return NextResponse.json(testing || {});
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error fetching testing:", error);
    return NextResponse.json({ error: "Failed to fetch testing" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/testing
 * Update or create the testing section
 */
export async function PUT(request: NextRequest) {
  try {
    const profileId = await requireProfile();
    const body = await request.json();
    
    // Handle AP scores separately if provided
    const { apScores, subjectTests, ...testingData } = body;
    
    const testing = await prisma.testing.upsert({
      where: { studentProfileId: profileId },
      update: {
        satTotal: testingData.satTotal,
        satMath: testingData.satMath,
        satReading: testingData.satReading,
        satEssay: testingData.satEssay,
        satDate: testingData.satDate ? new Date(testingData.satDate) : undefined,
        satSuperscored: testingData.satSuperscored,
        actComposite: testingData.actComposite,
        actEnglish: testingData.actEnglish,
        actMath: testingData.actMath,
        actReading: testingData.actReading,
        actScience: testingData.actScience,
        actWriting: testingData.actWriting,
        actDate: testingData.actDate ? new Date(testingData.actDate) : undefined,
        actSuperscored: testingData.actSuperscored,
        psatTotal: testingData.psatTotal,
        psatDate: testingData.psatDate ? new Date(testingData.psatDate) : undefined,
        nmsqtQualified: testingData.nmsqtQualified,
        planningToTakeSat: testingData.planningToTakeSat,
        planningToTakeAct: testingData.planningToTakeAct,
        plannedSatDate: testingData.plannedSatDate ? new Date(testingData.plannedSatDate) : undefined,
        plannedActDate: testingData.plannedActDate ? new Date(testingData.plannedActDate) : undefined,
      },
      create: {
        studentProfileId: profileId,
        satTotal: testingData.satTotal,
        satMath: testingData.satMath,
        satReading: testingData.satReading,
        satEssay: testingData.satEssay,
        satDate: testingData.satDate ? new Date(testingData.satDate) : undefined,
        satSuperscored: testingData.satSuperscored ?? false,
        actComposite: testingData.actComposite,
        actEnglish: testingData.actEnglish,
        actMath: testingData.actMath,
        actReading: testingData.actReading,
        actScience: testingData.actScience,
        actWriting: testingData.actWriting,
        actDate: testingData.actDate ? new Date(testingData.actDate) : undefined,
        actSuperscored: testingData.actSuperscored ?? false,
        psatTotal: testingData.psatTotal,
        psatDate: testingData.psatDate ? new Date(testingData.psatDate) : undefined,
        nmsqtQualified: testingData.nmsqtQualified,
        planningToTakeSat: testingData.planningToTakeSat ?? false,
        planningToTakeAct: testingData.planningToTakeAct ?? false,
        plannedSatDate: testingData.plannedSatDate ? new Date(testingData.plannedSatDate) : undefined,
        plannedActDate: testingData.plannedActDate ? new Date(testingData.plannedActDate) : undefined,
      },
      include: {
        apScores: true,
        subjectTests: true,
      },
    });
    
    return NextResponse.json(testing);
  } catch (error) {
    if (error instanceof Error && error.message === "Profile not found") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.error("Error updating testing:", error);
    return NextResponse.json({ error: "Failed to update testing" }, { status: 500 });
  }
}
