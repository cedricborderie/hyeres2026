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
    // If Supabase is not configured, return empty array
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId) {
      return [];
    }

    const { data, error } = await supabase
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
    // If Supabase is not configured, return false (user hasn't voted)
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value;

    if (!sessionId || !proposalId) {
      return false;
    }

    const { data, error } = await supabase
      .from("votes")
      .select("id")
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no result

    // If error or no data, user hasn't voted
    if (error) {
      console.error("Error checking vote status:", error);
      return false;
    }

    // Return true only if data exists
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
        const { count } = await supabase
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

    // Get updated vote count (using anon client for read)
    const { count } = await supabase
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
    // If Supabase is not configured, return error
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        message: "Base de données non configurée. Contactez l'administrateur.",
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

    // Validate proposalId
    if (!proposalId) {
      return {
        success: false,
        message: "ID de proposition invalide.",
      };
    }

    // First, verify the vote exists and get its details for debugging
    const { data: existingVote, error: fetchError } = await supabase
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
      // Vote doesn't exist, so deletion is effectively successful
      console.log("Vote doesn't exist, already deleted or never existed:", { proposalId, sessionId });
      const { count } = await supabase
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
      existingVote,
    });

    // Delete vote from Supabase
    const { data: deletedData, error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id) // Use the vote ID directly for more reliable deletion
      .select();

    if (deleteError) {
      console.error("Supabase remove vote error:", {
        error: deleteError,
        errorCode: deleteError.code,
        errorMessage: deleteError.message,
        errorDetails: deleteError.details,
        errorHint: deleteError.hint,
        proposalId,
        sessionId,
        voteId: existingVote.id,
      });
      
      // Check if it's a permission error (RLS)
      if (deleteError.code === "42501" || deleteError.message?.includes("permission") || deleteError.message?.includes("policy") || deleteError.message?.includes("row-level security")) {
        return {
          success: false,
          message: "Erreur de permissions RLS. Exécutez la migration 009_enable_vote_deletion_rls.sql dans Supabase pour activer la suppression des votes.",
        };
      }
      
      return {
        success: false,
        message: `Erreur lors de la suppression du vote: ${deleteError.message || "Veuillez réessayer."}`,
      };
    }

    // Check if deletion returned data (means it was successful)
    if (deletedData && deletedData.length > 0) {
      console.log("Vote successfully deleted:", {
        deletedVote: deletedData[0],
        proposalId,
        sessionId,
      });
    } else {
      // No data returned - might mean deletion was blocked by RLS
      console.warn("DELETE returned no data - might be blocked by RLS:", {
        proposalId,
        sessionId,
        voteId: existingVote.id,
      });
    }

    // Wait a moment for the deletion to complete
    await new Promise(resolve => setTimeout(resolve, 300));

    // Verify deletion was successful by checking if vote still exists
    const { data: stillExists, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("id", existingVote.id)
      .maybeSingle();
    
    if (checkError && checkError.code !== "PGRST116") { // PGRST116 = no rows returned (expected)
      console.error("Error checking if vote still exists:", checkError);
    }
    
    if (stillExists) {
      // Vote still exists - deletion failed silently (likely RLS blocking)
      console.error("Vote still exists after delete attempt - RLS likely blocking:", { 
        proposalId, 
        sessionId,
        voteId: existingVote.id,
        stillExists,
      });
      return {
        success: false,
        message: "La suppression a échoué silencieusement. Les politiques RLS bloquent probablement la suppression. Exécutez la migration 009_enable_vote_deletion_rls.sql dans Supabase.",
      };
    }
    
    // Vote doesn't exist - deletion was successful
    console.log("Vote successfully removed:", { proposalId, sessionId });

    // Success: revalidate paths to update vote counts
    revalidatePath("/");
    revalidatePath("/propositions");
    revalidatePath("/bilan");
    revalidatePath("/resultats");

    // Wait a bit for the trigger to update vote_count, then get updated count
    // The trigger should update proposals.vote_count automatically
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get updated vote count from votes table (more reliable than proposals.vote_count)
    const { count } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("proposal_id", proposalId);

    // Also verify that proposals.vote_count was updated by the trigger
    const { data: proposalData } = await supabase
      .from("proposals")
      .select("vote_count")
      .eq("id", proposalId)
      .single();

    // If trigger didn't work, manually update vote_count
    if (proposalData && proposalData.vote_count !== count) {
      console.warn("Trigger didn't update vote_count, manually updating:", {
        proposalId,
        storedCount: proposalData.vote_count,
        actualCount: count,
      });
      
      await supabase
        .from("proposals")
        .update({ vote_count: count || 0 })
        .eq("id", proposalId);
    }

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
