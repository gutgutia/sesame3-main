import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, getCurrentProfileId } from "@/lib/auth";

/**
 * GET /api/profile
 * Get the current user's complete student profile
 */
export async function GET() {
  try {
    const profileId = await getCurrentProfileId();
    
    if (!profileId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        aboutMe: true,
        academics: true,
        testing: {
          include: {
            apScores: true,
            subjectTests: true,
          },
        },
        courses: {
          orderBy: [
            { status: "asc" },
            { academicYear: "desc" },
            { name: "asc" },
          ],
        },
        activities: {
          orderBy: { displayOrder: "asc" },
        },
        awards: {
          orderBy: { displayOrder: "asc" },
        },
        programs: {
          orderBy: { year: "desc" },
        },
        goals: {
          include: {
            tasks: {
              orderBy: { displayOrder: "asc" },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
        schoolList: {
          include: {
            school: true,
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update basic profile fields (name, grade, school info)
 */
export async function PUT(request: NextRequest) {
  try {
    const profileId = await getCurrentProfileId();
    
    if (!profileId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Only allow updating specific fields
    const allowedFields = [
      "firstName",
      "lastName", 
      "preferredName",
      "grade",
      "graduationYear",
      "highSchoolName",
      "highSchoolCity",
      "highSchoolState",
      "highSchoolType",
      "onboardingData",
      "onboardingCompletedAt",
    ];
    
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    const profile = await prisma.studentProfile.update({
      where: { id: profileId },
      data: updateData,
    });
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
