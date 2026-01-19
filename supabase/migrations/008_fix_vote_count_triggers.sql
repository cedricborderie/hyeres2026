-- Migration: Fix vote count triggers and recalculate vote counts
-- Created: 2024
-- Description: Ensures triggers are active and recalculates vote_count for all proposals

-- Step 1: Ensure the function exists
CREATE OR REPLACE FUNCTION update_proposal_vote_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE proposals
  SET vote_count = (
    SELECT COUNT(*) FROM votes WHERE proposal_id = OLD.proposal_id
  ),
  updated_at = NOW()
  WHERE id = OLD.proposal_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Drop and recreate the delete trigger to ensure it's active
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_delete ON votes;

CREATE TRIGGER trigger_update_vote_count_after_delete
AFTER DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count_on_delete();

-- Step 3: Recalculate vote_count for all proposals (in case of inconsistencies)
UPDATE proposals
SET vote_count = (
  SELECT COUNT(*) FROM votes WHERE votes.proposal_id = proposals.id
),
updated_at = NOW();

-- Verify: Show vote counts
SELECT 
  p.id,
  p.title,
  p.vote_count as stored_count,
  COUNT(v.id) as actual_count
FROM proposals p
LEFT JOIN votes v ON v.proposal_id = p.id
GROUP BY p.id, p.title, p.vote_count
ORDER BY p.id;
