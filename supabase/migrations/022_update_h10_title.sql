-- Migration: Update H10 title only
-- Created: 2025-01-24
-- Description: Update only the title of proposal H10 without affecting votes

UPDATE proposals 
SET 
  title = 'H10. Anticiper le retrait du trait de côte',
  updated_at = NOW()
WHERE id = 'h10' AND category_id = '00000000-0000-0000-0000-000000000001';

-- Verify the update
SELECT id, title, vote_count 
FROM proposals 
WHERE id = 'h10';
