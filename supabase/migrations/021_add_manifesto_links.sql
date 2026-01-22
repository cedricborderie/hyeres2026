-- Migration: Add manifesto PDF links to categories
-- Created: 2024
-- Description: Adds a manifesto_url column to the categories table and populates it with the official PDF links

-- Step 1: Add the manifesto_url column
ALTER TABLE categories ADD COLUMN IF NOT EXISTS manifesto_url TEXT;

-- Step 2: Update categories with manifesto URLs
-- Using UUIDs to identify categories (matching the existing schema)
UPDATE categories 
SET manifesto_url = 'https://drive.google.com/file/d/1n2sVFCvmRTWnEpWL6UkcjcDEaw1vp-7v/view?usp=drive_link' 
WHERE id = '00000000-0000-0000-0000-000000000001' OR slug = 'habitat';

UPDATE categories 
SET manifesto_url = 'https://drive.google.com/file/d/1N2h2W_e4bf9QarZBcboKNVF8N8l1hJbj/view?usp=drive_link' 
WHERE id = '00000000-0000-0000-0000-000000000002' OR slug = 'mobilites' OR slug = 'mobilite';

UPDATE categories 
SET manifesto_url = 'https://drive.google.com/file/d/1k42ZMQyEocYplVDOxULIwdKngapuldW3/view?usp=drive_link' 
WHERE id = '00000000-0000-0000-0000-000000000003' OR slug = 'agriculture';

-- Verify the updates
SELECT id, name, slug, manifesto_url FROM categories ORDER BY id;
