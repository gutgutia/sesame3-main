// Authentication helpers
// Currently returns mock data for development
// Will be replaced with real Supabase auth when ready

import { cookies } from "next/headers";
import { prisma } from "./db";

// Default dev user if none selected
const DEFAULT_DEV_USER_ID = "test-user-new";
const DEV_USER_COOKIE = "sesame_dev_user_id";

// Test user definitions
const TEST_USERS: Record<string, { email: string; name: string }> = {
  "test-user-new": { email: "new@test.sesame.com", name: "Alex (New)" },
  "test-user-onboarded": { email: "onboarded@test.sesame.com", name: "Jordan (Onboarded)" },
  "test-user-building": { email: "building@test.sesame.com", name: "Sarah (Building)" },
  "test-user-complete": { email: "complete@test.sesame.com", name: "Max (Complete)" },
};

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Get the current authenticated user
 * For development: reads from cookie or uses default
 * For production: will validate Supabase session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: Replace with real Supabase auth in production
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return null;
  
  // For development, check for dev user cookie
  const cookieStore = await cookies();
  const devUserId = cookieStore.get(DEV_USER_COOKIE)?.value || DEFAULT_DEV_USER_ID;
  
  const userInfo = TEST_USERS[devUserId];
  if (!userInfo) {
    // Unknown user ID, fall back to default
    return {
      id: DEFAULT_DEV_USER_ID,
      email: TEST_USERS[DEFAULT_DEV_USER_ID].email,
      name: TEST_USERS[DEFAULT_DEV_USER_ID].name,
    };
  }
  
  return {
    id: devUserId,
    email: userInfo.email,
    name: userInfo.name,
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
