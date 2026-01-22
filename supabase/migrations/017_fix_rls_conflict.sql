-- Migration: Fix RLS conflict between migrations 009 and 011
-- Created: 2024
-- Description: Remove obsolete RLS policies and ensure service_role can insert

-- Step 1: Drop the obsolete INSERT policy from migration 009
-- This policy allowed anon/authenticated to insert, but migration 011 revoked INSERT
-- So this policy is now obsolete and conflicts with our security model
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;

-- Step 2: Keep SELECT and DELETE policies (they're still needed for anon/authenticated)
-- These policies are OK because anon/authenticated still have SELECT and DELETE permissions

-- Step 3: Since we're using service_role for inserts (which bypasses RLS),
-- and anon/authenticated can't insert anyway (permissions revoked),
-- we can either:
-- Option A: Disable RLS completely (recommended)
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Option B: Keep RLS but ensure service_role can insert (uncomment if you prefer)
-- CREATE POLICY IF NOT EXISTS "service_role_can_insert_votes"
-- ON votes FOR INSERT
-- TO service_role
-- WITH CHECK (true);

-- Step 4: Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'votes';
-- Should return false

-- Step 5: Verify policies (should be empty or only SELECT/DELETE)
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'votes';

-- Step 6: Verify permissions are correct
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- Expected result:
-- anon: SELECT, DELETE (no INSERT)
-- authenticated: SELECT, DELETE (no INSERT)
-- service_role: INSERT, SELECT, UPDATE, DELETE (all permissions)

-- Step 7: Test insertion (uncomment to test)
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', 'test-rls-fix-' || gen_random_uuid()::text)
-- ON CONFLICT DO NOTHING
-- RETURNING *;
