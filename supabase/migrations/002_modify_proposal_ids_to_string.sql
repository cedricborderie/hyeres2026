-- Migration: Modify proposal IDs to VARCHAR instead of UUID
-- Created: 2024
-- Description: Changes proposal IDs from UUID to VARCHAR(50) to match lib/data.ts string IDs (h1, m1, etc.)
-- 
-- WARNING: This migration will delete all existing proposals and votes if they exist.
-- This is safe if you haven't inserted proposals yet.
-- If you have data, you'll need to migrate it manually first.

-- Step 1: Drop foreign key constraint on votes
ALTER TABLE IF EXISTS votes DROP CONSTRAINT IF EXISTS votes_proposal_id_fkey;

-- Step 2: Drop ALL triggers that might exist (with CASCADE to handle dependencies)
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_insert ON public.votes CASCADE;
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_delete ON public.votes CASCADE;
DROP TRIGGER IF EXISTS trigger_proposals_updated_at ON public.proposals CASCADE;

-- Step 3: Drop existing proposals table (CASCADE will also drop any dependent objects including triggers)
DROP TABLE IF EXISTS proposals CASCADE;

-- Step 4: Recreate proposals table with VARCHAR(50) id instead of UUID
CREATE TABLE proposals (
  id VARCHAR(50) PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL, -- Short description for cards
  content_text TEXT NOT NULL, -- Long detailed content
  external_link VARCHAR(500), -- Optional external link
  vote_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Modify votes.proposal_id from UUID to VARCHAR(50)
-- First, truncate votes table if it exists (since proposals will be recreated)
-- Note: TRUNCATE doesn't support IF EXISTS, so we check first
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'votes') THEN
    TRUNCATE TABLE votes;
  END IF;
END $$;

-- Change the column type (only if votes table exists and has proposal_id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'votes' AND column_name = 'proposal_id') THEN
    ALTER TABLE votes ALTER COLUMN proposal_id TYPE VARCHAR(50);
  END IF;
END $$;

-- Step 6: Recreate foreign key constraint
ALTER TABLE votes 
  ADD CONSTRAINT votes_proposal_id_fkey 
  FOREIGN KEY (proposal_id) 
  REFERENCES proposals(id) 
  ON DELETE CASCADE;

-- Step 7: Recreate triggers (ensure they don't exist first with explicit DROP)
-- Double-check and drop any remaining triggers
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_insert ON public.votes CASCADE;
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_delete ON public.votes CASCADE;
DROP TRIGGER IF EXISTS trigger_proposals_updated_at ON public.proposals CASCADE;

-- Now create the triggers
CREATE TRIGGER trigger_update_vote_count_after_insert
AFTER INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count();

CREATE TRIGGER trigger_update_vote_count_after_delete
AFTER DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count_on_delete();

CREATE TRIGGER trigger_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_proposals_category_id ON proposals(category_id);
CREATE INDEX IF NOT EXISTS idx_proposals_vote_count ON proposals(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes(session_id);

-- Comments for documentation
COMMENT ON TABLE proposals IS 'Political proposals that citizens can vote on';
COMMENT ON COLUMN proposals.id IS 'String ID matching lib/data.ts (e.g., h1, m1, a1)';
