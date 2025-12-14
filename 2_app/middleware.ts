import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Demo mode check (allow access without auth)
// Defaults to true in development, false in production
const isDemoMode = 
  process.env.NEXT_PUBLIC_DEMO_MODE !== undefined 
    ? process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    : process.env.NODE_ENV !== 'production';

// Routes that require authentication
const protectedRoutes = ["/", "/plan", "/profile", "/schools", "/discover", "/advisor"];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In demo mode, allow all access (skip auth checks)
  if (isDemoMode) {
    return NextResponse.next();
  }

  // Production mode: enforce authentication
  const { supabaseResponse, user } = await updateSession(request);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing auth route while authenticated
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Allow onboarding route for authenticated users without complete profile
  // (This logic can be enhanced later)

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
