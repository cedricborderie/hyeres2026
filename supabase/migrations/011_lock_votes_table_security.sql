-- Migration: Lock votes table for security - Gatekeeper pattern
-- Created: 2024
-- Description: Revoke direct INSERT permissions on votes table. Only server (service role) can write.

-- Step 1: Revoke INSERT permissions on votes table for anon and authenticated roles
-- This prevents direct API access - only server actions with service role can insert
REVOKE INSERT ON votes FROM anon;
REVOKE INSERT ON votes FROM authenticated;

-- Step 2: Ensure foreign key constraint exists (should already exist from migration 001)
-- Verify and add if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'votes_proposal_id_fkey' 
    AND conrelid = 'votes'::regclass
  ) THEN
    ALTER TABLE votes 
    ADD CONSTRAINT votes_proposal_id_fkey 
    FOREIGN KEY (proposal_id) 
    REFERENCES proposals(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Keep SELECT and DELETE permissions for RLS policies to work
-- (RLS policies will control who can read/delete their own votes)
GRANT SELECT ON votes TO anon, authenticated;
GRANT DELETE ON votes TO anon, authenticated;

-- Verify permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
ORDER BY grantee, privilege_type;
