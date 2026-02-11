"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { verifyHumanBadge } from "./security";

export interface VoteResult {
  success: boolean;
  message?: string;
  voteCount?: number;
  error?: "CAPTCHA_REQUIRED";
}

/**
 * Server Action to get all proposal IDs that the current session has voted for.
 * 
 * @returns Array of proposal IDs that the current session has voted for
 */
export async function getVotedProposalIds(): Promise<string[]> {
  try {
    // Use admin client to read votes (session_id is sensitive data protected by RLS)
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return [];
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId) {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from("votes")
      .select("proposal_id")
      .eq("session_id", sessionId);

    if (error || !data) {
      console.error("Error fetching voted proposals:", error);
      return [];
    }

    return data.map((vote) => vote.proposal_id);
  } catch (error) {
    console.error("Error fetching voted proposals:", error);
    return [];
  }
}

/**
 * Server Action to check if the current session has voted for a proposal.
 * 
 * @param proposalId - The ID of the proposal to check
 * @returns true if the session has voted, false otherwise
 */
export async function hasVotedForProposal(proposalId: string): Promise<boolean> {
  try {
    // Use admin client to read votes (session_id is sensitive data protected by RLS)
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return false;
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId || !proposalId) {
      return false;
    }

    const { data, error } = await supabaseAdmin
      .from("votes")
      .select("id")
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId)
      .maybeSingle();

    if (error) {
      console.error("Error checking vote status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking vote status:", error);
    return false;
  }
}

/**
 * Server Action to submit a vote for a proposal.
 * Reads session_id securely from cookies (not from client input).
 * 
 * @param proposalId - The ID of the proposal to vote for
 * @returns VoteResult with success status and optional message/voteCount
 */
export async function submitVote(proposalId: string): Promise<VoteResult> {
  try {
    // DEBUG: Log at the very start
    console.log("=== VOTE DEBUG START ===");
    console.log("Environment check:", {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY 
        ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + "..." 
        : "NOT SET",
    });

    // Step A: Verify human badge cookie (Gatekeeper pattern)
    const isHuman = await verifyHumanBadge();
    
    if (!isHuman) {
      console.log("=== VOTE DEBUG: Human badge not verified ===");
      return {
        success: false,
        error: "CAPTCHA_REQUIRED",
        message: "Vérification humaine requise.",
      };
    }

    // If Supabase is not configured, return error
    if (!isSupabaseConfigured() || !supabase) {
      console.error("=== VOTE DEBUG: Supabase not configured ===", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseClient: supabase ? "exists" : "null",
      });
      return {
        success: false,
        message: "Base de données non configurée. Contactez l'administrateur.",
      };
    }

    // Check if admin client is configured (required for writing votes)
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      console.error("=== VOTE DEBUG: Supabase Admin not configured ===", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        isAdminConfigured: isSupabaseAdminConfigured(),
        hasSupabaseAdmin: !!supabaseAdmin,
      });
      return {
        success: false,
        message: "Configuration serveur incomplète. Contactez l'administrateur.",
      };
    }

    console.log("=== VOTE DEBUG: Admin client configured ===", {
      hasSupabaseAdmin: !!supabaseAdmin,
      isAdminConfigured: isSupabaseAdminConfigured(),
    });

    // Read session_id from cookies (secure, cannot be manipulated by client)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId) {
      return {
        success: false,
        message: "Session introuvable. Veuillez rafraîchir la page.",
      };
    }

    // Validate proposalId
    if (!proposalId) {
      return {
        success: false,
        message: "ID de proposition invalide.",
      };
    }

    // Check if proposal exists in Supabase (using anon client for read)
    const { data: proposalData, error: proposalError } = await supabase
      .from("proposals")
      .select("id")
      .eq("id", proposalId)
      .single();

    if (proposalError || !proposalData) {
      console.error("Proposal not found in Supabase:", {
        proposalId,
        error: proposalError,
        message: "La proposition n'existe pas dans la base de données. Assurez-vous que les migrations SQL ont été exécutées.",
      });
      return {
        success: false,
        message: `Proposition introuvable dans la base de données (ID: ${proposalId}). Veuillez vérifier que les migrations SQL ont été exécutées.`,
      };
    }

    // Insert vote into Supabase using ADMIN client (bypasses RLS)
    // Log diagnostic information
    console.log("=== VOTE DEBUG: Insertion attempt ===", {
      proposalId,
      sessionId,
      hasSupabaseAdmin: !!supabaseAdmin,
      isAdminConfigured: isSupabaseAdminConfigured(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "undefined",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "defined" : "undefined",
      serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY 
        ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + "..." 
        : "NOT SET",
    });

    const { error, data } = await supabaseAdmin!
      .from("votes")
      .insert({
        proposal_id: proposalId,
        session_id: sessionId,
      })
      .select()
      .single();

    // Log error details for debugging
    if (error) {
      console.error("=== VOTE DEBUG: Insertion ERROR ===", {
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        proposalId,
        sessionId,
        hasSupabaseAdmin: !!supabaseAdmin,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "defined" : "undefined",
      });
    }

    // Handle unique constraint violation (user already voted)
    if (error) {
      // PostgreSQL error code 23505 = Unique violation
      if (error.code === "23505" || error.message.includes("unique") || error.message.includes("duplicate")) {
        // Get current vote count for optimistic UI
        const { count } = await supabaseAdmin
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("proposal_id", proposalId);

        return {
          success: false,
          message: "Déjà voté",
          voteCount: count || 0,
        };
      }

      // Foreign key constraint violation (proposal_id doesn't exist)
      if (error.code === "23503" || error.message.includes("foreign key") || error.message.includes("violates foreign key")) {
        console.error("Supabase vote error - Proposal not found:", {
          error,
          errorCode: error.code,
          errorMessage: error.message,
          proposalId,
          sessionId,
          hint: "Les propositions ne sont peut-être pas encore insérées dans Supabase. Exécutez les migrations SQL (001, 002, 003) dans l'ordre.",
        });
        return {
          success: false,
          message: `Proposition introuvable dans la base de données (ID: ${proposalId}). Assurez-vous que les migrations SQL ont été exécutées dans Supabase.`,
        };
      }

      // Other errors - log more details for debugging
      console.error("Supabase vote error:", {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error.details,
        proposalId,
        sessionId,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "undefined",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "undefined",
      });
      return {
        success: false,
        message: `Erreur lors du vote: ${error.message || "Veuillez réessayer."}`,
      };
    }

    // Success: revalidate paths to update vote counts
    revalidatePath("/");
    revalidatePath("/propositions");

    // Get updated vote count using admin client (bypasses RLS)
    const { count } = await supabaseAdmin
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("proposal_id", proposalId);

    return {
      success: true,
      voteCount: count || 0,
    };
  } catch (error) {
    console.error("Unexpected vote error:", error);
    return {
      success: false,
      message: "Erreur inattendue. Veuillez réessayer.",
    };
  }
}

/**
 * Server Action to remove a vote for a proposal.
 * Reads session_id securely from cookies (not from client input).
 * 
 * @param proposalId - The ID of the proposal to remove the vote from
 * @returns VoteResult with success status and optional message/voteCount
 */
export async function removeVote(proposalId: string): Promise<VoteResult> {
  try {
    // Use admin client for all votes operations (session_id is sensitive, protected by RLS)
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return {
        success: false,
        message: "Configuration serveur incomplète. Contactez l'administrateur.",
      };
    }

    // Read session_id from cookies (secure, cannot be manipulated by client)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId) {
      return {
        success: false,
        message: "Session introuvable. Veuillez rafraîchir la page.",
      };
    }

    if (!proposalId) {
      return {
        success: false,
        message: "ID de proposition invalide.",
      };
    }

    // Find the vote using admin client (bypasses RLS)
    const { data: existingVote, error: fetchError } = await supabaseAdmin
      .from("votes")
      .select("id, proposal_id, session_id, created_at")
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching vote before deletion:", fetchError);
      return {
        success: false,
        message: `Erreur lors de la vérification du vote: ${fetchError.message || "Veuillez réessayer."}`,
      };
    }

    if (!existingVote) {
      console.log("Vote doesn't exist, already deleted or never existed:", { proposalId, sessionId });
      const { count } = await supabaseAdmin
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("proposal_id", proposalId);

      return {
        success: true,
        voteCount: count || 0,
      };
    }

    console.log("Attempting to delete vote:", {
      voteId: existingVote.id,
      proposalId,
      sessionId,
    });

    // Delete vote using admin client (bypasses RLS)
    const { data: deletedData, error: deleteError } = await supabaseAdmin
      .from("votes")
      .delete()
      .eq("id", existingVote.id)
      .select();

    if (deleteError) {
      console.error("Supabase remove vote error:", {
        error: deleteError,
        errorCode: deleteError.code,
        errorMessage: deleteError.message,
        proposalId,
        sessionId,
        voteId: existingVote.id,
      });

      return {
        success: false,
        message: `Erreur lors de la suppression du vote: ${deleteError.message || "Veuillez réessayer."}`,
      };
    }

    if (deletedData && deletedData.length > 0) {
      console.log("Vote successfully deleted:", {
        deletedVote: deletedData[0],
        proposalId,
        sessionId,
      });
    }

    // Success: revalidate paths to update vote counts
    revalidatePath("/");
    revalidatePath("/propositions");
    revalidatePath("/bilan");
    revalidatePath("/resultats");

    // Get updated vote count
    const { count } = await supabaseAdmin
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("proposal_id", proposalId);

    return {
      success: true,
      voteCount: count || 0,
    };
  } catch (error) {
    console.error("Unexpected remove vote error:", error);
    return {
      success: false,
      message: "Erreur inattendue. Veuillez réessayer.",
    };
  }
}
