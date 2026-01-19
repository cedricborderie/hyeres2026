"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";

export interface VoteResult {
  success: boolean;
  message?: string;
  voteCount?: number;
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
    // If Supabase is not configured, return error
    if (!isSupabaseConfigured() || !supabase) {
      console.error("Supabase not configured:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseClient: supabase ? "exists" : "null",
      });
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

    // Check if proposal exists in Supabase
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

    // Insert vote into Supabase
    const { error, data } = await supabase
      .from("votes")
      .insert({
        proposal_id: proposalId,
        session_id: sessionId,
      })
      .select()
      .single();

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

    // Get updated vote count
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

    // Delete vote from Supabase
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId);

    if (deleteError) {
      console.error("Supabase remove vote error:", {
        error: deleteError,
        errorCode: deleteError.code,
        errorMessage: deleteError.message,
        errorDetails: deleteError.details,
        errorHint: deleteError.hint,
        proposalId,
        sessionId,
      });
      
      // Check if it's a permission error (RLS)
      if (deleteError.code === "42501" || deleteError.message?.includes("permission") || deleteError.message?.includes("policy") || deleteError.message?.includes("row-level security")) {
        return {
          success: false,
          message: "Erreur de permissions. Les politiques de sécurité (RLS) bloquent la suppression. Exécutez la migration 009_enable_vote_deletion_rls.sql dans Supabase.",
        };
      }
      
      return {
        success: false,
        message: `Erreur lors de la suppression du vote: ${deleteError.message || "Veuillez réessayer."}`,
      };
    }

    // Wait a moment for the deletion to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify deletion was successful by checking if vote still exists
    const { data: stillExists, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking if vote still exists:", checkError);
      // If we can't check, assume deletion was successful (optimistic)
    }
    
    if (stillExists) {
      // Vote still exists - deletion failed silently
      console.error("Vote still exists after delete attempt:", { 
        proposalId, 
        sessionId,
        stillExists,
      });
      return {
        success: false,
        message: "Impossible de supprimer le vote. Le vote existe toujours dans la base de données. Vérifiez les politiques RLS.",
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
