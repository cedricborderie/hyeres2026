-- Migration: Force fix all permissions and RLS issues
-- Created: 2024
-- Description: Comprehensive fix for permission denied errors

-- Step 1: Disable RLS completely
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;
DROP POLICY IF EXISTS "Allow public selects on votes" ON votes;
DROP POLICY IF EXISTS "Allow public deletes on votes" ON votes;
DROP POLICY IF EXISTS "service_role_can_insert_votes" ON votes;

-- Step 3: Grant ALL permissions to service_role explicitly
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- Step 4: Revoke INSERT from anon and authenticated (security)
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- Step 5: Grant SELECT and DELETE to anon and authenticated (for reads and deletes)
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;

-- Step 6: Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'votes';
-- Should return false

-- Step 7: Verify no policies exist
SELECT 
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'votes';
-- Should return no rows

-- Step 8: Verify permissions
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
-- service_role: INSERT, SELECT, UPDATE, DELETE, TRIGGER, TRUNCATE, REFERENCES (all)

-- Step 9: Test insertion (uncomment to test manually)
-- This MUST work if everything is correct
-- Note: session_id is UUID type, not TEXT
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', gen_random_uuid())
-- ON CONFLICT DO NOTHING
-- RETURNING *;

-- Step 10: Clean up test if needed
-- DELETE FROM votes WHERE session_id LIKE 'test-force-fix-%';
