import "server-only";
import { createClient } from "@supabase/supabase-js";

// Supabase client for server-side operations
// Only accessible on the server (enforced by "server-only" import)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if variables are available
// This allows the app to work even if Supabase is not configured
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};
