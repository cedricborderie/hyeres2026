-- Migration: Fix permissions and ensure service_role can insert votes
-- Created: 2024
-- Description: Ensure service_role has all permissions on votes table after migration 011

-- Step 1: Grant all permissions to service_role (should already have them, but ensure)
GRANT ALL ON votes TO service_role;

-- Step 2: Verify that INSERT is revoked for anon and authenticated
REVOKE INSERT ON votes FROM anon;
REVOKE INSERT ON votes FROM authenticated;

-- Step 3: Ensure SELECT and DELETE are granted for RLS policies
GRANT SELECT ON votes TO anon, authenticated;
GRANT DELETE ON votes TO anon, authenticated;

-- Step 4: Verify permissions
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
