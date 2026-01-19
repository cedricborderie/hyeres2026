-- Migration: Create newsletter subscriptions table
-- Created: 2025-01-18
-- Description: Creates table to store newsletter email subscriptions

-- Table: newsletter_subscriptions
-- Stores email addresses for newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- Trigger for updated_at (drop if exists to allow re-running migration)
DROP TRIGGER IF EXISTS trigger_newsletter_updated_at ON newsletter_subscriptions;

CREATE TRIGGER trigger_newsletter_updated_at
BEFORE UPDATE ON newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE newsletter_subscriptions IS 'Email addresses subscribed to the newsletter';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'Unique email address for newsletter subscription';
