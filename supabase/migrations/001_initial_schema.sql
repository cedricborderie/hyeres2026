-- Migration: Initial schema for Hyères 2026 Citizen Platform
-- Created: 2024
-- Description: Creates tables for categories, proposals, and votes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: categories
-- Stores the three main categories: Habitat, Mobilité, Agriculture
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  color_theme VARCHAR(7) NOT NULL, -- Hex color code (e.g., #0ea5e9)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposals
-- Stores political proposals with their details
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL, -- Short description for cards
  content_text TEXT NOT NULL, -- Long detailed content
  external_link VARCHAR(500), -- Optional external link
  vote_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: votes
-- Stores anonymous votes using session_id (stored in localStorage)
-- Constraint: A session_id can only vote once per proposal_id
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  session_id UUID NOT NULL, -- Anonymous user identifier from localStorage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, session_id) -- Ensures one vote per session per proposal
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_category_id ON proposals(category_id);
CREATE INDEX IF NOT EXISTS idx_proposals_vote_count ON proposals(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes(session_id);

-- Function to update vote_count when a vote is added
CREATE OR REPLACE FUNCTION update_proposal_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE proposals
  SET vote_count = (
    SELECT COUNT(*) FROM votes WHERE proposal_id = NEW.proposal_id
  ),
  updated_at = NOW()
  WHERE id = NEW.proposal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update vote_count when a vote is removed
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

-- Triggers to automatically update vote_count
CREATE TRIGGER trigger_update_vote_count_after_insert
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count();

CREATE TRIGGER trigger_update_vote_count_after_delete
AFTER DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count_on_delete();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on categories and proposals
CREATE TRIGGER trigger_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_proposals_updated_at
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO categories (id, name, slug, color_theme) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Habitat', 'habitat', '#0ea5e9'),
  ('00000000-0000-0000-0000-000000000002', 'Mobilité', 'mobilite', '#22c55e'),
  ('00000000-0000-0000-0000-000000000003', 'Agriculture', 'agriculture', '#eab308')
ON CONFLICT (id) DO NOTHING;

-- Note: Proposals will be inserted via the admin interface or through a seed script
-- Example of how to insert a proposal:
-- INSERT INTO proposals (category_id, title, description, content_text) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'Title', 'Description', 'Full content text');

-- Comments for documentation
COMMENT ON TABLE categories IS 'Main categories for proposals: Habitat, Mobilité, Agriculture';
COMMENT ON TABLE proposals IS 'Political proposals that citizens can vote on';
COMMENT ON TABLE votes IS 'Anonymous votes from users identified by session_id (from localStorage)';
COMMENT ON COLUMN votes.session_id IS 'UUID stored in localStorage to identify anonymous users. One vote per session_id per proposal.';
COMMENT ON CONSTRAINT votes_proposal_id_session_id_key ON votes IS 'Ensures a session_id can only vote once per proposal';
