"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";

export interface NewsletterResult {
  success: boolean;
  message: string;
}

/**
 * Server Action to subscribe an email to the newsletter.
 * 
 * @param email - The email address to subscribe
 * @returns NewsletterResult with success status and message
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        message: "Veuillez entrer une adresse email valide.",
      };
    }

    // If Supabase is not configured, return error
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        message: "Service de newsletter non disponible. Contactez l'administrateur.",
      };
    }

    // Insert email into Supabase
    const { error } = await supabase
      .from("newsletter_subscriptions")
      .insert({
        email: email.toLowerCase().trim(),
      });

    // Handle unique constraint violation (email already subscribed)
    if (error) {
      // PostgreSQL error code 23505 = Unique violation
      if (error.code === "23505" || error.message.includes("unique") || error.message.includes("duplicate")) {
        return {
          success: false,
          message: "Cette adresse email est déjà inscrite à la newsletter.",
        };
      }

      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        message: `Erreur lors de l'inscription: ${error.message || "Veuillez réessayer."}`,
      };
    }

    return {
      success: true,
      message: "Inscription réussie ! Vous recevrez bientôt nos actualités.",
    };
  } catch (error) {
    console.error("Unexpected newsletter subscription error:", error);
    return {
      success: false,
      message: "Erreur inattendue. Veuillez réessayer.",
    };
  }
}
