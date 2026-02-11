-- Migration: Enable RLS on all tables with secure policies
-- Created: 2025
-- Description: Fix security vulnerabilities by enabling RLS and creating restrictive policies
-- 
-- This migration:
-- 1. Enables RLS on all public tables
-- 2. Creates restrictive policies that protect sensitive data
-- 3. Ensures service_role can bypass RLS for server-side operations

-- ============================================================================
-- VOTES TABLE - Most sensitive (contains session_id)
-- ============================================================================

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;
DROP POLICY IF EXISTS "Allow public selects on votes" ON votes;
DROP POLICY IF EXISTS "Allow public deletes on votes" ON votes;
DROP POLICY IF EXISTS "service_role_can_insert_votes" ON votes;
DROP POLICY IF EXISTS "Public can count" ON votes;
DROP POLICY IF EXISTS "Public can vote" ON votes;
DROP POLICY IF EXISTS "anon_select_votes" ON votes;
DROP POLICY IF EXISTS "anon_delete_votes" ON votes;

-- NO policies for anon/authenticated on votes table
-- All operations go through supabaseAdmin (service_role) which bypasses RLS
-- This protects session_id from being exposed via the API

-- Revoke direct access from anon and authenticated
REVOKE ALL ON TABLE votes FROM anon;
REVOKE ALL ON TABLE votes FROM authenticated;

-- Grant all to service_role (used by supabaseAdmin)
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- ============================================================================
-- PROPOSALS TABLE - Public read access (no sensitive data)
-- ============================================================================

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "anon_select_proposals" ON proposals;
DROP POLICY IF EXISTS "authenticated_select_proposals" ON proposals;
DROP POLICY IF EXISTS "Public can read proposals" ON proposals;

-- Allow public read access (proposals are public data)
CREATE POLICY "Public can read proposals"
ON proposals
FOR SELECT
TO anon, authenticated
USING (true);

-- Grant SELECT to anon and authenticated
GRANT SELECT ON TABLE proposals TO anon, authenticated;

-- Grant all to service_role for admin operations
GRANT ALL PRIVILEGES ON TABLE proposals TO service_role;

-- ============================================================================
-- CATEGORIES TABLE - Public read access (no sensitive data)
-- ============================================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
DROP POLICY IF EXISTS "authenticated_select_categories" ON categories;
DROP POLICY IF EXISTS "Public can read categories" ON categories;

-- Allow public read access (categories are public data)
CREATE POLICY "Public can read categories"
ON categories
FOR SELECT
TO anon, authenticated
USING (true);

-- Grant SELECT to anon and authenticated
GRANT SELECT ON TABLE categories TO anon, authenticated;

-- Grant all to service_role for admin operations
GRANT ALL PRIVILEGES ON TABLE categories TO service_role;

-- ============================================================================
-- NEWSLETTER_SUBSCRIPTIONS TABLE - Insert only (emails are sensitive)
-- ============================================================================

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "authenticated_insert_newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscriptions;

-- Allow public to subscribe (insert only, no read/update/delete)
CREATE POLICY "Public can subscribe"
ON newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Grant INSERT only to anon and authenticated
REVOKE ALL ON TABLE newsletter_subscriptions FROM anon;
REVOKE ALL ON TABLE newsletter_subscriptions FROM authenticated;
GRANT INSERT ON TABLE newsletter_subscriptions TO anon, authenticated;

-- Grant all to service_role for admin operations (export, etc.)
GRANT ALL PRIVILEGES ON TABLE newsletter_subscriptions TO service_role;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('votes', 'proposals', 'categories', 'newsletter_subscriptions');

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify permissions
SELECT 
  table_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name IN ('votes', 'proposals', 'categories', 'newsletter_subscriptions')
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;
