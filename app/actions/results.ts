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

    // Get all votes to count unique voters and total votes
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("proposal_id, session_id");

    if (votesError) {
      console.error("Error fetching votes:", votesError);
    }

    // Count unique session IDs for total voters
    const uniqueSessionIds = new Set<string>();
    if (votesData) {
      votesData.forEach((vote) => {
        if (vote.session_id) {
          uniqueSessionIds.add(vote.session_id);
        }
      });
    }

    // Use vote_count from proposals table (updated by triggers)
    const proposalVotes: ProposalVoteCount[] = (proposalsData || []).map((proposal) => ({
      proposalId: proposal.id,
      voteCount: proposal.vote_count || 0,
    }));

    const uniqueVoters = uniqueSessionIds.size;
    const totalVotes = votesData?.length || 0;

    return {
      totalVoters: uniqueVoters,
      totalVotes: totalVotes,
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
