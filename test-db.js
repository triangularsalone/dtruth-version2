const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jrropkmxxpaxgjdaoput.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impycm9wa214eHBheGdqZGFvcHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODA5NDYsImV4cCI6MjA4OTg1Njk0Nn0.5M3HTgwZpuSv9JqY-Ixs_eVAwBWU5kJHe9KnEY6ub4E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing database connection...')

    // Test if entries table exists
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('*')
      .limit(1)

    if (entriesError) {
      console.log('❌ Entries table does not exist or has issues:', entriesError.message)
    } else {
      console.log('✅ Entries table exists, found', entries?.length || 0, 'records')
    }

    // Test if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.log('❌ Profiles table does not exist or has issues:', profilesError.message)
    } else {
      console.log('✅ Profiles table exists, found', profiles?.length || 0, 'records')
    }

    // Test if admins table exists
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('*')
      .limit(1)

    if (adminsError) {
      console.log('❌ Admins table does not exist or has issues:', adminsError.message)
    } else {
      console.log('✅ Admins table exists, found', admins?.length || 0, 'records')
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

testConnection()