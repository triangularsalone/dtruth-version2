-- Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- Create policies for the admins table
-- Allow service role to do everything
CREATE POLICY "Service role can do everything" ON admins FOR ALL USING (auth.role() = 'service_role');
-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can read their own admin record" ON admins FOR
SELECT USING (auth.uid() = id);
-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW());
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_admins_updated_at BEFORE
UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();