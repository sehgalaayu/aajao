-- Host re-entry + recurring scene metadata
ALTER TABLE events
ADD COLUMN IF NOT EXISTS host_email TEXT;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS recurring_weekly BOOLEAN NOT NULL DEFAULT FALSE;

-- Helpful for host lookup checks (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_events_host_email_lower
ON events (LOWER(host_email))
WHERE host_email IS NOT NULL;
