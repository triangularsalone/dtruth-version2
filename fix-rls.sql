DROP POLICY IF EXISTS "Users can view own admin record" ON admins;
DROP POLICY IF EXISTS "Allow super_admin to read admins" ON admins;
DROP POLICY IF EXISTS "Allow super_admin to update admin roles" ON admins;

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_current_user_role() RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM admins WHERE id = auth.uid();
  IF user_role IS NULL THEN
    SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  END IF;
  RETURN COALESCE(user_role, 'viewer');
END;
$$;

DROP POLICY IF EXISTS "Allow super_admin full access to entries" ON entries;
DROP POLICY IF EXISTS "Allow admin and super_admin to manage entries" ON entries;
DROP POLICY IF EXISTS "Allow authenticated users to read published entries" ON entries;

CREATE POLICY "Allow super_admin full access to entries" ON entries
  FOR ALL TO authenticated USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "Allow admin and super_admin to manage entries" ON entries
  FOR ALL TO authenticated USING (get_current_user_role() IN ('admin','super_admin'))
  WITH CHECK (get_current_user_role() IN ('admin','super_admin'));

CREATE POLICY "Allow authenticated users to read published entries" ON entries
  FOR SELECT TO authenticated USING (status = 'Published');

-- Normalize roles if necessary
UPDATE admins SET role = 'super_admin' WHERE LOWER(role) IN ('super admin','super_admin','superadmin');
UPDATE admins SET role = 'admin' WHERE LOWER(role) IN ('admin');
UPDATE profiles SET role = 'super_admin' WHERE LOWER(role) IN ('super admin','super_admin','superadmin');
UPDATE profiles SET role = 'admin' WHERE LOWER(role) IN ('admin');
UPDATE profiles SET role = 'viewer' WHERE role NOT IN ('admin','super_admin','viewer');
