// App Configuration
// Controls demo mode and other environment-based settings

/**
 * Demo Mode
 * When true, the app uses mock data instead of the database.
 * This allows the demo to work without any backend setup.
 * 
 * Defaults to true for development, false for production
 * Set NEXT_PUBLIC_DEMO_MODE explicitly to override
 */
export const isDemoMode = 
  process.env.NEXT_PUBLIC_DEMO_MODE !== undefined 
    ? process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    : process.env.NODE_ENV !== 'production'; // Default: true in dev, false in production

/**
 * Environment
 */
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * App URLs
 */
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Feature Flags
 * Add feature flags here for gradual rollouts
 */
export const features = {
  // AI Features
  enableAIChat: true,
  enableAIStreaming: true,
  
  // Future features (disabled by default)
  enableParentAccess: false,
  enableCounselorAccess: false,
  enableCourseAdvising: false,
} as const;
