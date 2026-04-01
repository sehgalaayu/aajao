-- Add event_date column for proper date storage
-- Existing records will have NULL (fallback: display only time)
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date TEXT;

-- Optional: Add columns for referral tracking if not yet added
ALTER TABLE responses ADD COLUMN IF NOT EXISTS invited_by TEXT;
ALTER TABLE responses ADD COLUMN IF NOT EXISTS user_token TEXT;

-- Create index for faster lookups by user_token
CREATE INDEX IF NOT EXISTS idx_responses_user_token ON responses (user_token) WHERE user_token IS NOT NULL;
