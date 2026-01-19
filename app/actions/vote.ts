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
      .single();

    // If error or no data, user hasn't voted
    if (error || !data) {
      return false;
    }

    return true;
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
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("proposal_id", proposalId)
      .eq("session_id", sessionId);

    if (error) {
      console.error("Supabase remove vote error:", {
        error,
        errorCode: error.code,
        errorMessage: error.message,
        proposalId,
        sessionId,
      });
      return {
        success: false,
        message: `Erreur lors de la suppression du vote: ${error.message || "Veuillez réessayer."}`,
      };
    }

    // Success: revalidate paths to update vote counts
    revalidatePath("/");
    revalidatePath("/propositions");
    revalidatePath("/bilan");
    revalidatePath("/resultats");

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
    console.error("Unexpected remove vote error:", error);
    return {
      success: false,
      message: "Erreur inattendue. Veuillez réessayer.",
    };
  }
}
