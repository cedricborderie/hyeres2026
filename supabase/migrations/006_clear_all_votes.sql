-- Migration: Clear all votes
-- Created: 2024
-- Description: Delete all votes from the votes table to start fresh

-- Delete all votes
DELETE FROM votes;

-- Reset vote_count for all proposals
UPDATE proposals SET vote_count = 0;

-- Verify
SELECT COUNT(*) as remaining_votes FROM votes;
SELECT COUNT(*) as total_proposals FROM proposals;
