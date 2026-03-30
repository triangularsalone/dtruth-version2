-- Add RLS policies for role-based access control
-- This migration adds Row Level Security policies to enforce admin/super_admin permissions
-- Enable RLS on entries table
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- Create a function to get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role() RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE user_role TEXT;
BEGIN -- Try to get role from admins table first
SELECT role INTO user_role
FROM admins
WHERE id = auth.uid();
-- If not found in admins, check profiles table
IF user_role IS NULL THEN
SELECT role INTO user_role
FROM profiles
WHERE id = auth.uid();
END IF;
-- Default to viewer if no role found
RETURN COALESCE(user_role, 'viewer');
END;
$$;
-- Policies for entries table
-- Allow all authenticated users to read entries (viewer, admin, super_admin)
CREATE POLICY "Allow authenticated users to read entries" ON entries FOR
SELECT TO authenticated USING (true);
-- Allow super_admin to do all operations on entries
CREATE POLICY "Allow super_admin full access to entries" ON entries FOR ALL TO authenticated USING (get_current_user_role() = 'super_admin') WITH CHECK (get_current_user_role() = 'super_admin');
-- Allow admin and super_admin to manage entries (all categories) for CRUD operations
CREATE POLICY "Allow admin and super_admin to manage entries" ON entries FOR ALL TO authenticated USING (
    get_current_user_role() IN ('admin', 'super_admin')
) WITH CHECK (
    get_current_user_role() IN ('admin', 'super_admin')
);
-- Allow authenticated viewers to read only published entries
CREATE POLICY "Allow authenticated users to read published entries" ON entries FOR SELECT TO authenticated USING (status = 'Published');
-- Policies for admins table
-- Allow super_admin to read all admin records
CREATE POLICY "Allow super_admin to read admins" ON admins FOR
SELECT TO authenticated USING (get_current_user_role() = 'Super Admin');
-- Allow super_admin to update admin roles
CREATE POLICY "Allow super_admin to update admin roles" ON admins FOR
UPDATE TO authenticated USING (get_current_user_role() = 'Super Admin') WITH CHECK (get_current_user_role() = 'Super Admin');
-- Allow users to read their own admin record
CREATE POLICY "Allow users to read own admin record" ON admins FOR
SELECT TO authenticated USING (id = auth.uid());
-- Allow authenticated users to insert their own admin record (for registration)
CREATE POLICY "Allow authenticated users to insert own admin record" ON admins FOR
INSERT TO authenticated WITH CHECK (id = auth.uid());