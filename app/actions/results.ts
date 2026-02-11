"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export interface ProposalVoteCount {
  proposalId: string;
  voteCount: number;
}

export interface ResultsData {
  totalVoters: number;
  totalVotes: number;
  proposalVotes: ProposalVoteCount[];
}

/**
 * Server Action to get all vote results from Supabase.
 * Returns vote counts for all proposals and total statistics.
 * Uses admin client for votes (protected by RLS) and anon client for proposals (public).
 */
export async function getAllVoteResults(): Promise<ResultsData> {
  try {
    // Need both clients: anon for proposals (public), admin for votes (RLS protected)
    if (!isSupabaseConfigured() || !supabase) {
      return {
        totalVoters: 0,
        totalVotes: 0,
        proposalVotes: [],
      };
    }

    // Get all proposals with their vote_count (public data, anon client OK)
    const { data: proposalsData, error: proposalsError } = await supabase
      .from("proposals")
      .select("id, vote_count");

    if (proposalsError) {
      console.error("Error fetching proposals:", proposalsError);
      return {
        totalVoters: 0,
        totalVotes: 0,
        proposalVotes: [],
      };
    }

    // Use vote_count from proposals table (updated by triggers) - no RLS issue
    const proposalVotes: ProposalVoteCount[] = (proposalsData || []).map((proposal) => ({
      proposalId: proposal.id,
      voteCount: proposal.vote_count || 0,
    }));

    // For votes table operations, use admin client (RLS protected)
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      // Fallback: sum up from proposals.vote_count
      const totalVotes = proposalVotes.reduce((sum, p) => sum + p.voteCount, 0);
      return {
        totalVoters: 0,
        totalVotes,
        proposalVotes,
      };
    }

    // Count total votes using admin client (bypasses RLS)
    const { count: totalVotes, error: votesCountError } = await supabaseAdmin
      .from("votes")
      .select("*", { count: "exact", head: true });

    if (votesCountError) {
      console.error("Error counting votes:", votesCountError);
    }

    // Count unique voters using admin client (bypasses RLS)
    const { data: uniqueVotersData, error: uniqueVotersError } = await supabaseAdmin
      .rpc("count_distinct_voters");

    if (uniqueVotersError) {
      console.error("Error counting unique voters:", uniqueVotersError);
    }

    const uniqueVoters = uniqueVotersData || 0;

    return {
      totalVoters: uniqueVoters,
      totalVotes: totalVotes || 0,
      proposalVotes,
    };
  } catch (error) {
    console.error("Unexpected error fetching results:", error);
    return {
      totalVoters: 0,
      totalVotes: 0,
      proposalVotes: [],
    };
  }
}
