-- Add flyer_url field to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS flyer_url text;
