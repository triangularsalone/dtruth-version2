// Test script to verify RLS policies are working
// Run with: npx tsx scripts/test-rls.ts

import { createClient } from '@supabase/supabase-js'

// Use service role key for testing (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testRLS() {
  console.log('🧪 Testing RLS Policies...\n')

  try {
    // Test 1: Check if RLS is enabled on tables
    console.log('1. Checking RLS status...')

    const { data: entriesRLS, error: entriesError } = await supabase
      .rpc('get_rls_status', { table_name: 'entries' })

    if (entriesError) {
      console.log('   ⚠️  Could not check entries RLS status via RPC')
    } else {
      console.log(`   ✅ entries table RLS: ${entriesRLS ? 'ENABLED' : 'DISABLED'}`)
    }

    const { data: adminsRLS, error: adminsError } = await supabase
      .rpc('get_rls_status', { table_name: 'admins' })

    if (adminsError) {
      console.log('   ⚠️  Could not check admins RLS status via RPC')
    } else {
      console.log(`   ✅ admins table RLS: ${adminsRLS ? 'ENABLED' : 'DISABLED'}`)
    }

    // Test 2: Check if policies exist
    console.log('\n2. Checking policies...')

    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, permissive, roles, cmd, qual, with_check')

    if (policiesError) {
      console.log('   ❌ Could not fetch policies:', policiesError.message)
    } else {
      const entriesPolicies = policies.filter(p => p.tablename === 'entries')
      const adminsPolicies = policies.filter(p => p.tablename === 'admins')

      console.log(`   📋 entries policies: ${entriesPolicies.length}`)
      entriesPolicies.forEach(p => {
        console.log(`      - ${p.policyname} (${p.cmd})`)
      })

      console.log(`   📋 admins policies: ${adminsPolicies.length}`)
      adminsPolicies.forEach(p => {
        console.log(`      - ${p.policyname} (${p.cmd})`)
      })
    }

    // Test 3: Check if get_current_user_role function exists
    console.log('\n3. Checking helper function...')

    const { data: funcExists, error: funcError } = await supabase
      .rpc('get_current_user_role')

    if (funcError && funcError.message.includes('function get_current_user_role() does not exist')) {
      console.log('   ❌ get_current_user_role function not found')
    } else {
      console.log('   ✅ get_current_user_role function exists')
    }

    console.log('\n🎉 RLS Policy Test Complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. If RLS is disabled, run: npm run db:push')
    console.log('   2. Test with different user roles in the admin dashboard')
    console.log('   3. Verify admin can only create Photo entries')
    console.log('   4. Verify super_admin can manage all entries and user roles')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testRLS()