-- Create partnership requests table for storing movement interest submissions
CREATE TABLE IF NOT EXISTS partnership_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    organization text,
    message text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_partnership_requests_email ON partnership_requests(email);
CREATE INDEX IF NOT EXISTS idx_partnership_requests_created_at ON partnership_requests(created_at);