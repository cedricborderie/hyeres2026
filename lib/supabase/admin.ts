import "server-only";
import { createClient } from "@supabase/supabase-js";

// Supabase Admin Client with Service Role Key
// Only accessible on the server (enforced by "server-only" import)
// This bypasses RLS and is used for server-side operations

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase admin client only if variables are available
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Helper to check if admin client is configured
export const isSupabaseAdminConfigured = () => {
  return !!(supabaseUrl && supabaseServiceRoleKey);
};
