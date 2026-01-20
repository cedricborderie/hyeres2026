"use server";

/**
 * Server Action to debug environment variables
 * This helps verify that SUPABASE_SERVICE_ROLE_KEY is loaded in production
 */
export async function debugEnvironmentVariables(): Promise<{
  hasSupabaseUrl: boolean;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  supabaseUrl: string;
  anonKeyPrefix: string;
  serviceRoleKeyPrefix: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    hasSupabaseUrl: !!supabaseUrl,
    hasAnonKey: !!anonKey,
    hasServiceRoleKey: !!serviceRoleKey,
    supabaseUrl: supabaseUrl || "NOT SET",
    anonKeyPrefix: anonKey ? anonKey.substring(0, 20) + "..." : "NOT SET",
    serviceRoleKeyPrefix: serviceRoleKey ? serviceRoleKey.substring(0, 20) + "..." : "NOT SET",
  };
}
