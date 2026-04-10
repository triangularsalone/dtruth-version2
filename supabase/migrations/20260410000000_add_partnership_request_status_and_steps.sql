-- Add approval workflow to partnership request records
ALTER TABLE IF EXISTS partnership_requests
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

ALTER TABLE IF EXISTS partnership_requests
  ADD COLUMN IF NOT EXISTS admin_message text;

ALTER TABLE IF EXISTS partnership_requests
  ADD COLUMN IF NOT EXISTS next_step_url text;

CREATE INDEX IF NOT EXISTS idx_partnership_requests_status ON partnership_requests(status);
