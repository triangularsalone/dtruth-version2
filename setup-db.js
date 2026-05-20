const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jrropkmxxpaxgjdaoput.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impycm9wa214eHBheGdqZGFvcHV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI4MDk0NiwiZXhwIjoyMDg5ODU2OTQ2fQ.NHmsPC6sszDujyOY8MFRcCU2Zpplj2tX6JMoRxOjDOw'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  try {
    console.log('Creating profiles table...')

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            full_name TEXT,
            role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin', 'super_admin')),
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (profilesError) {
      console.log('Error creating profiles table:', profilesError)
    } else {
      console.log('✅ Profiles table created')
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
      `
    })

    if (indexError) {
      console.log('Error creating indexes:', indexError)
    } else {
      console.log('✅ Indexes created')
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;'
    })

    if (rlsError) {
      console.log('Error enabling RLS:', rlsError)
    } else {
      console.log('✅ RLS enabled')
    }

    // Create RLS policies
    const policies = [
      `CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);`,
      `CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);`,
      `CREATE POLICY "Super admin can manage all profiles" ON profiles FOR ALL TO authenticated USING (get_current_user_role() = 'super_admin') WITH CHECK (get_current_user_role() = 'super_admin');`
    ]

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy })
      if (policyError) {
        console.log('Error creating policy:', policy, policyError)
      } else {
        console.log('✅ Policy created')
      }
    }

    console.log('Database setup complete!')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

createTables()