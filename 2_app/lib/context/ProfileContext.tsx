"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/**
 * Profile data structure (matches API response)
 */
export interface ProfileData {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  preferredName?: string | null;
  grade?: string | null;
  graduationYear?: number | null;
  highSchoolName?: string | null;
  highSchoolCity?: string | null;
  highSchoolState?: string | null;
  highSchoolType?: string | null;
  aboutMe?: {
    story?: string | null;
    values?: string[];
    interests?: string[];
    personality?: string | null;
    background?: string | null;
    aspirations?: string | null;
  } | null;
  academics?: {
    gpaUnweighted?: number | null;
    gpaWeighted?: number | null;
    gpaScale?: number | null;
    classRank?: number | null;
    classSize?: number | null;
    apCourseCount?: number | null;
    honorsCourseCount?: number | null;
  } | null;
  testing?: {
    satTotal?: number | null;
    satMath?: number | null;
    satReading?: number | null;
    actComposite?: number | null;
    actEnglish?: number | null;
    actMath?: number | null;
    actReading?: number | null;
    actScience?: number | null;
    psatTotal?: number | null;
    apScores?: Array<{ subject: string; score: number; year?: number }>;
  } | null;
  activities?: Array<{
    id: string;
    title: string;
    organization?: string | null;
    category?: string | null;
    description?: string | null;
    isLeadership?: boolean;
    isSpike?: boolean;
    hoursPerWeek?: number | null;
    weeksPerYear?: number | null;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    organization?: string | null;
    level?: string | null;
    year?: number | null;
  }>;
  courses?: Array<{
    id: string;
    name: string;
    subject?: string | null;
    level?: string | null;
    status?: string | null;
    grade?: string | null;
  }>;
  programs?: Array<{
    id: string;
    name: string;
    organization?: string | null;
    type?: string | null;
    status?: string | null;
  }>;
  goals?: Array<{
    id: string;
    title: string;
    category?: string | null;
    status?: string | null;
    tasks?: Array<{ id: string; title: string; completed: boolean }>;
  }>;
  schoolList?: Array<{
    id: string;
    tier?: string | null;
    status?: string | null;
    school?: {
      id: string;
      name: string;
      city?: string | null;
      state?: string | null;
    } | null;
  }>;
}

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * ProfileProvider - Loads and caches profile data for the entire app
 * 
 * Benefits:
 * - Single fetch on app load instead of per-page
 * - Instant page navigation (no loading states)
 * - Consistent data across all components
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch full profile from API
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - that's okay, just no profile
          setProfile(null);
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      setProfile(data);
      
      console.log(`[ProfileContext] Loaded in ${Date.now() - startTime}ms`);
    } catch (err) {
      console.error("[ProfileContext] Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Refresh profile (call after updates)
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Optimistic update (update local state immediately)
  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook to access profile data
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

/**
 * Hook to get specific profile sections with loading state
 */
export function useProfileSection<K extends keyof ProfileData>(section: K) {
  const { profile, isLoading } = useProfile();
  return {
    data: profile?.[section] ?? null,
    isLoading,
  };
}
