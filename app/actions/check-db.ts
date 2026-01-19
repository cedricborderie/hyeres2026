"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase/server";

export interface DatabaseStatus {
  isConfigured: boolean;
  proposalsCount: number;
  categoriesCount: number;
  votesCount: number;
  sampleProposalIds: string[];
  error?: string;
}

/**
 * Server Action to check the database status and verify if migrations have been run.
 */
export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        isConfigured: false,
        proposalsCount: 0,
        categoriesCount: 0,
        votesCount: 0,
        sampleProposalIds: [],
        error: "Supabase n'est pas configuré. Vérifiez les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      };
    }

    // Check proposals
    const { data: proposals, error: proposalsError, count: proposalsCount } = await supabase
      .from("proposals")
      .select("id", { count: "exact" })
      .limit(10);

    if (proposalsError) {
      return {
        isConfigured: true,
        proposalsCount: 0,
        categoriesCount: 0,
        votesCount: 0,
        sampleProposalIds: [],
        error: `Erreur lors de la lecture des propositions: ${proposalsError.message}. Vérifiez que les migrations SQL ont été exécutées.`,
      };
    }

    // Check categories
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    if (categoriesError) {
      console.error("Error checking categories:", categoriesError);
    }

    // Check votes
    const { count: votesCount, error: votesError } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true });

    if (votesError) {
      console.error("Error checking votes:", votesError);
    }

    const sampleProposalIds = proposals?.map((p) => p.id) || [];

    return {
      isConfigured: true,
      proposalsCount: proposalsCount || 0,
      categoriesCount: categoriesCount || 0,
      votesCount: votesCount || 0,
      sampleProposalIds,
    };
  } catch (error) {
    console.error("Unexpected error checking database:", error);
    return {
      isConfigured: false,
      proposalsCount: 0,
      categoriesCount: 0,
      votesCount: 0,
      sampleProposalIds: [],
      error: `Erreur inattendue: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
