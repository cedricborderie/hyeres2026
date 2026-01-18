import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if voter_session cookie exists
  const voterSession = request.cookies.get("voter_session");

  // If no cookie, generate a new UUID and set it
  if (!voterSession) {
    const newSessionId = crypto.randomUUID();
    
    // Create response
    const response = NextResponse.next();
    
    // Set secure cookie: HttpOnly, Secure, SameSite=Strict
    response.cookies.set("voter_session", newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  }

  // Cookie exists, pass through
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
