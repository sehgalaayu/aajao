-- Audience list for exact host nudges
ALTER TABLE events
ADD COLUMN IF NOT EXISTS invite_audience JSONB NOT NULL DEFAULT '[]'::jsonb;
