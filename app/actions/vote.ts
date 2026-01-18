"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/server";

export interface VoteResult {
  success: boolean;
  message?: string;
  voteCount?: number;
}

/**
 * Server Action to check if the current session has voted for a proposal.
 * 
 * @param proposalId - The ID of the proposal to check
 * @returns true if the session has voted, false otherwise
 */
export async function hasVotedForProposal(proposalId: string): Promise<boolean> {
  try {
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

      // Other errors
      console.error("Supabase vote error:", error);
      return {
        success: false,
        message: "Erreur lors du vote. Veuillez réessayer.",
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
