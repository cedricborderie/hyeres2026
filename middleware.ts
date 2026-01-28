import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VOTER_SESSION_MAX_AGE = 400 * 24 * 60 * 60; // 400 jours — persistant jusqu'en 2026

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: VOTER_SESSION_MAX_AGE,
  path: "/",
};

export function middleware(request: NextRequest) {
  const voterSession = request.cookies.get("voter_session");
  const response = NextResponse.next();

  const sessionId = voterSession?.value ?? crypto.randomUUID();
  response.cookies.set("voter_session", sessionId, cookieOptions);

  return response;
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
