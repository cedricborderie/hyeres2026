-- Migration: Check and fix RLS policies on votes table
-- Created: 2024
-- Description: Verify RLS is enabled and policies don't block service_role

-- Step 1: Check if RLS is enabled on votes table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'votes';

-- Step 2: Check existing RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'votes';

-- Step 3: If RLS is enabled, we need to ensure service_role can bypass it
-- Service role should bypass RLS by default, but let's verify

-- Step 4: Check current grants and permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- Step 5: If RLS is blocking, we can either:
-- Option A: Disable RLS for votes (if not needed)
-- ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Option B: Create a policy that allows service_role to insert
-- (But service_role should bypass RLS by default)

-- Step 6: Test insertion (should work with service_role)
-- Uncomment to test:
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', 'test-rls-check-' || gen_random_uuid()::text)
-- ON CONFLICT DO NOTHING
-- RETURNING *;
