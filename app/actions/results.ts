"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";

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
 */
export async function getAllVoteResults(): Promise<ResultsData> {
  try {
    // If Supabase is not configured, return empty results
    if (!isSupabaseConfigured() || !supabase) {
      return {
        totalVoters: 0,
        totalVotes: 0,
        proposalVotes: [],
      };
    }

    // Get all proposals with their vote_count (updated by triggers)
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

    // Count total votes using SQL COUNT (no limit issue)
    const { count: totalVotes, error: votesCountError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true });

    if (votesCountError) {
      console.error("Error counting votes:", votesCountError);
    }

    // Count unique voters using optimized SQL function (no limit issue, single query)
    const { data: uniqueVotersData, error: uniqueVotersError } = await supabase
      .rpc("count_distinct_voters");

    if (uniqueVotersError) {
      console.error("Error counting unique voters:", uniqueVotersError);
    }

    const uniqueVoters = uniqueVotersData || 0;

    // Use vote_count from proposals table (updated by triggers)
    const proposalVotes: ProposalVoteCount[] = (proposalsData || []).map((proposal) => ({
      proposalId: proposal.id,
      voteCount: proposal.vote_count || 0,
    }));

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
