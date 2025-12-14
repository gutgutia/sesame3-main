import { type NextRequest, NextResponse } from "next/server";

// Middleware for future authentication
// Currently allows all access for development
// When ready for auth, uncomment the Supabase integration below

export async function middleware(request: NextRequest) {
  // For now, allow all access - no authentication required
  return NextResponse.next();
  
  // ============================================================
  // FUTURE: Uncomment below when ready for real authentication
  // ============================================================
  /*
  import { updateSession } from "@/lib/supabase/middleware";
  
  const protectedRoutes = ["/", "/plan", "/profile", "/schools", "/discover", "/advisor"];
  const authRoutes = ["/login", "/auth"];
  
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
