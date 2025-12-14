// Authentication helpers
// Currently returns mock data for development
// Will be replaced with real Supabase auth when ready

import { prisma } from "./db";

// Development: Use a fixed user ID for testing
// Production: Will get user from Supabase session
const DEV_USER_ID = "dev-user-001";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Get the current authenticated user
 * For development: returns a mock user
 * For production: will validate Supabase session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: Replace with real Supabase auth
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return null;
  
  // For development, return mock user
  return {
    id: DEV_USER_ID,
    email: "dev@sesame.com",
    name: "Dev User",
  };
}

/**
 * Get or create the current user's student profile
 * Returns the profile ID for use in API calls
 */
export async function getCurrentProfileId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  
  // Try to find existing profile
  let profile = await prisma.studentProfile.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });
  
  // If no profile exists, create one
  if (!profile) {
    // First ensure user exists in database
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
    
    // Create profile
    profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        firstName: user.name?.split(" ")[0] || "Student",
        lastName: user.name?.split(" ").slice(1).join(" ") || undefined,
      },
      select: { id: true },
    });
  }
  
  return profile.id;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require profile - throws if not authenticated or no profile
 */
export async function requireProfile(): Promise<string> {
  const profileId = await getCurrentProfileId();
  if (!profileId) {
    throw new Error("Profile not found");
  }
  return profileId;
}
