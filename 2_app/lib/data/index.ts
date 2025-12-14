// Data Abstraction Layer
// Automatically switches between mock (demo) and real (production) data

import { isDemoMode } from '@/lib/config';

// Re-export types (always available)
export * from './types';

// Conditional exports based on demo mode
// Note: For server components, use the specific imports below
// This file provides the unified interface

import * as mockData from './mock';
import * as realData from './real';

// Profile operations
export const getProfile = isDemoMode ? mockData.getProfile : realData.getProfile;
export const saveProfile = isDemoMode ? mockData.saveProfile : realData.saveProfile;
export const createProfile = isDemoMode ? mockData.createProfile : realData.createProfile;
export const updateProfileSection = isDemoMode ? mockData.updateProfileSection : realData.updateProfileSection;

// Add operations
export const addActivity = isDemoMode ? mockData.addActivity : realData.addActivity;
export const addAward = isDemoMode ? mockData.addAward : realData.addAward;
export const addSchool = isDemoMode ? mockData.addSchool : realData.addSchool;
export const addGoal = isDemoMode ? mockData.addGoal : realData.addGoal;
export const addCourse = isDemoMode ? mockData.addCourse : realData.addCourse;

// Calculations (same logic for both modes)
export const calculateZone = mockData.calculateZone;
export const calculateChances = mockData.calculateChances;
export const parseUserInput = mockData.parseUserInput;

// Demo-specific utilities
export const resetToSampleData = mockData.resetToSampleData;
export const clearDemoData = mockData.clearDemoData;

// Sample data (for reference/seeding)
export { sampleProfile, sampleSchools } from './mock/sample-data';
