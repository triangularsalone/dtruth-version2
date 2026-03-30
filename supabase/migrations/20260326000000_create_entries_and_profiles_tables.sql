-- Create entries table for document/content management
CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category TEXT NOT NULL DEFAULT 'archives' CHECK (
        category IN ('innovation', 'traction', 'archives')
    ),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Published', 'Pending', 'Archived')),
    media_url TEXT,
    external_link TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entries_category ON entries(category);
CREATE INDEX IF NOT EXISTS idx_entries_status ON entries(status);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
CREATE INDEX IF NOT EXISTS idx_entries_uploaded_by ON entries(uploaded_by);
-- Create profiles table for regular users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
-- Enable RLS on entries and profiles
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- RLS Policies for entries table
-- Allow all authenticated users to read published entries
CREATE POLICY "Allow authenticated users to read published entries" ON entries FOR
SELECT TO authenticated USING (status = 'Published');
-- Allow super_admin full access
CREATE POLICY "Allow super_admin full access to entries" ON entries FOR ALL TO authenticated USING (get_current_user_role() = 'super_admin') WITH CHECK (get_current_user_role() = 'super_admin');
-- Allow admin and super_admin to manage all entry categories
CREATE POLICY "Allow admin and super_admin to manage entries" ON entries FOR ALL TO authenticated USING (
    get_current_user_role() IN ('admin', 'super_admin')
) WITH CHECK (
    get_current_user_role() IN ('admin', 'super_admin')
);
-- RLS Policies for profiles table
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT TO authenticated USING (auth.uid() = id);
-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles FOR
INSERT TO authenticated WITH CHECK (auth.uid() = id);
-- Allow super_admin to manage all profiles
CREATE POLICY "Super admin can manage all profiles" ON profiles FOR ALL TO authenticated USING (get_current_user_role() = 'super_admin') WITH CHECK (get_current_user_role() = 'super_admin');
-- Create trigger for updated_at on entries
CREATE TRIGGER update_entries_updated_at BEFORE
UPDATE ON entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create storage bucket for media files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
-- RLS Policies for storage
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Allow authenticated users to view media" ON storage.objects FOR
SELECT TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Allow super_admin to manage media" ON storage.objects FOR ALL TO authenticated USING (
    bucket_id = 'media'
    AND get_current_user_role() = 'super_admin'
);