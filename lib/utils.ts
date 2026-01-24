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

// Get color values and classes based on category
export function getCategoryColorClasses(categoryId: string) {
  switch (categoryId) {
    case "habitat":
      return {
        text: "#14B8A6",
        textHover: "#0d9488",
        bg: "#14B8A6",
        bgHover: "#0d9488",
        border: "#14B8A6",
        bgLight: "#f0fdfa", // teal-50
        underline: "#14B8A6",
      };
    case "mobilites":
      return {
        text: "#EC4899",
        textHover: "#db2777",
        bg: "#EC4899",
        bgHover: "#db2777",
        border: "#EC4899",
        bgLight: "#fdf2f8", // pink-50
        underline: "#EC4899",
      };
    case "agriculture":
      return {
        text: "#b45309", // yellow-700
        textHover: "#92400e", // yellow-800
        bg: "#FFE175",
        bgHover: "#FFD54F",
        border: "#b45309", // yellow-700
        bgLight: "#fefce8", // yellow-50
        underline: "#FFE175",
      };
    default:
      return {
        text: "#008179", // primary-600
        textHover: "#006158", // primary-700
        bg: "#008179",
        bgHover: "#006158",
        border: "#008179",
        bgLight: "#e6fffd", // primary-50
        underline: "#008179",
      };
  }
}
