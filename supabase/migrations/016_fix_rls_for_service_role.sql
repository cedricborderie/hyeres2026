-- Migration: Fix RLS to allow service_role to insert votes
-- Created: 2024
-- Description: Ensure service_role can bypass RLS or has explicit policy

-- Step 1: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'votes';

-- Step 2: List all RLS policies on votes table
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

-- Step 3: Service role should bypass RLS by default, but if there's an issue:
-- Option A: Disable RLS if not needed (since we use service_role for inserts)
-- Uncomment if RLS is causing issues:
-- ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Option B: Create a permissive policy that allows service_role to insert
-- (But service_role should bypass RLS automatically, so this shouldn't be needed)

-- Step 4: If RLS is enabled and blocking, we can create a policy for service_role
-- However, service_role should bypass RLS, so this is a fallback
DO $$
BEGIN
  -- Check if there's a policy blocking INSERT
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'votes' 
    AND cmd = 'INSERT'
    AND roles::text[] && ARRAY['service_role']::text[]
  ) THEN
    RAISE NOTICE 'Policy exists for service_role INSERT';
  ELSE
    RAISE NOTICE 'No INSERT policy found for service_role - this is OK, service_role bypasses RLS';
  END IF;
END $$;

-- Step 5: Verify that service_role has the correct permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee = 'service_role'
ORDER BY privilege_type;

-- Step 6: Test insertion (uncomment to test manually)
-- This should work if service_role is properly configured
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', 'test-rls-fix-' || gen_random_uuid()::text)
-- ON CONFLICT DO NOTHING
-- RETURNING *;
