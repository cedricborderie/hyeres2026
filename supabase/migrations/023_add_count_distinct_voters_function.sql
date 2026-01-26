-- Migration: Add function to count distinct voters
-- Created: 2025-01-26
-- Description: Create a SQL function to efficiently count unique voters (distinct session_id)

CREATE OR REPLACE FUNCTION count_distinct_voters()
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT session_id)
  FROM votes
  WHERE session_id IS NOT NULL;
$$;

-- Grant execute permission to authenticated users and anon
GRANT EXECUTE ON FUNCTION count_distinct_voters() TO authenticated;
GRANT EXECUTE ON FUNCTION count_distinct_voters() TO anon;
