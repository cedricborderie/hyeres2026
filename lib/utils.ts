import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Session ID management for anonymous voting
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionId = localStorage.getItem("hyeres_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("hyeres_session_id", sessionId);
  }

  return sessionId;
}

// Vote storage management (localStorage for now, will sync with Supabase)
export function hasVoted(proposalId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const sessionId = getSessionId();
  const votes = getVotedProposals();
  return votes.has(proposalId);
}

export function getVotedProposals(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  const sessionId = getSessionId();
  const votesJson = localStorage.getItem(`votes_${sessionId}`);
  
  if (!votesJson) {
    return new Set();
  }

  try {
    const votes = JSON.parse(votesJson) as string[];
    return new Set(votes);
  } catch {
    return new Set();
  }
}

export function saveVote(proposalId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessionId = getSessionId();
  const votes = getVotedProposals();
  votes.add(proposalId);

  localStorage.setItem(`votes_${sessionId}`, JSON.stringify(Array.from(votes)));
}

export function removeVote(proposalId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const sessionId = getSessionId();
  const votes = getVotedProposals();
  votes.delete(proposalId);

  localStorage.setItem(`votes_${sessionId}`, JSON.stringify(Array.from(votes)));
}

// Get unique voter count (number of session_ids that have voted)
export function getUniqueVoterCount(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  // For now, we count 1 if current session has voted, otherwise 0
  // In production with Supabase, this will count distinct session_ids
  const votes = getVotedProposals();
  return votes.size > 0 ? 1 : 0;
}
