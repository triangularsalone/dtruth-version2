-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
-- Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- Create policies for admins table
-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can view own admin record" ON admins FOR
SELECT USING (auth.uid() = id);
-- Allow super admins to view all admin records
CREATE POLICY "Super admins can view all records" ON admins FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM admins
            WHERE id = auth.uid()
                AND role = 'super_admin'
                AND is_active = true
        )
    );
-- Allow super admins to insert new admin records
CREATE POLICY "Super admins can insert admin records" ON admins FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM admins
            WHERE id = auth.uid()
                AND role = 'super_admin'
                AND is_active = true
        )
    );
-- Allow super admins to update admin records
CREATE POLICY "Super admins can update admin records" ON admins FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM admins
            WHERE id = auth.uid()
                AND role = 'super_admin'
                AND is_active = true
        )
    );
-- Allow users to update their own admin record (limited fields)
CREATE POLICY "Users can update own admin record" ON admins FOR
UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admins_updated_at BEFORE
UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();