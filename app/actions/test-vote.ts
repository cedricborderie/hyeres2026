"use server";

import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

/**
 * Server Action to test vote insertion (diagnostic)
 * This helps verify that the admin client is properly configured
 */
export async function testVoteInsertion(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Check if admin is configured
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return {
        success: false,
        message: "Admin client not configured",
        details: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      };
    }

    // Get session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("voter_session")?.value || "test-session-" + Date.now();

    // Try to insert a test vote
    const { data, error } = await supabaseAdmin
      .from("votes")
      .insert({
        proposal_id: "h1", // Assuming h1 exists
        session_id: sessionId,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: `Insert failed: ${error.message}`,
        details: {
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
        },
      };
    }

    // Delete the test vote
    if (data) {
      await supabaseAdmin
        .from("votes")
        .delete()
        .eq("id", data.id);
    }

    return {
      success: true,
      message: "Test vote insertion successful!",
      details: {
        insertedVote: data,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      details: {
        error: error.toString(),
      },
    };
  }
}
