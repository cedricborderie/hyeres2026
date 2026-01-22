-- Migration: Ensure service_role has all permissions on votes table
-- Created: 2024
-- Description: Fix permissions issue - ensure service_role can insert votes

-- Step 1: Grant ALL permissions to service_role explicitly
-- This ensures service_role can insert, update, delete, and select
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- Step 2: Revoke INSERT from anon and authenticated (security)
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- Step 3: Keep SELECT and DELETE for RLS policies to work
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;

-- Step 4: Also grant usage on the sequence (if using serial/uuid)
-- This is usually not needed for UUID, but doesn't hurt
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Step 5: Verify the permissions
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- Expected result after this migration:
-- anon: SELECT, DELETE (no INSERT)
-- authenticated: SELECT, DELETE (no INSERT)
-- service_role: INSERT, SELECT, UPDATE, DELETE, TRIGGER (all permissions)

-- Step 6: Test insertion with service_role (uncomment to test)
-- This should work if you're connected as service_role
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', 'test-service-role-' || gen_random_uuid()::text)
-- ON CONFLICT DO NOTHING
-- RETURNING *;
