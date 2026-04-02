-- Host-managed event checklist items
ALTER TABLE events
ADD COLUMN IF NOT EXISTS what_to_carry JSONB NOT NULL DEFAULT '[]'::jsonb;
