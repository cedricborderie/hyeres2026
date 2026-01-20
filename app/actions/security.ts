"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// JWT Secret - use environment variable or fallback for dev
const JWT_SECRET = process.env.JWT_SECRET_KEY || "dev-secret-key-change-in-production";
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// Cookie name for the human verification badge
const HUMAN_BADGE_COOKIE = "human_badge";

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
};

/**
 * Verify Turnstile token with Cloudflare API
 * @param token - The Turnstile token from the client
 * @returns true if verification succeeds, false otherwise
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}

/**
 * Server Action to verify human token and issue security cookie
 * @param token - The Turnstile token from the client
 * @returns Success status
 */
export async function verifyHumanToken(token: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Verify token with Cloudflare
    const isValid = await verifyTurnstileToken(token);

    if (!isValid) {
      return {
        success: false,
        message: "La vérification a échoué. Veuillez réessayer.",
      };
    }

    // Create JWT payload
    const payload = {
      human: true,
      verifiedAt: Date.now(),
    };

    // Sign JWT
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET_KEY);

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(HUMAN_BADGE_COOKIE, jwt, COOKIE_OPTIONS);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in verifyHumanToken:", error);
    return {
      success: false,
      message: "Erreur lors de la vérification. Veuillez réessayer.",
    };
  }
}

/**
 * Verify the human_badge cookie
 * @returns true if cookie is valid, false otherwise
 */
export async function verifyHumanBadge(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const badge = cookieStore.get(HUMAN_BADGE_COOKIE);

    if (!badge?.value) {
      return false;
    }

    // Verify JWT signature
    await jwtVerify(badge.value, JWT_SECRET_KEY);
    return true;
  } catch (error) {
    console.error("Error verifying human badge:", error);
    return false;
  }
}
