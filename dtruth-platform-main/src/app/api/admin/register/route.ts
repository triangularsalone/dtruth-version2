import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Temporarily hardcode values for testing
const supabaseUrl = "https://jrropkmxxpaxgjdaoput.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impycm9wa214eHBheGdqZGFvcHV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI4MDk0NiwiZXhwIjoyMDg5ODU2OTQ2fQ.NHmsPC6sszDujyOY8MFRcCU2Zpplj2tX6JMoRxOjDOw"

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate role
    if (role && !['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or super_admin' },
        { status: 400 }
      )
    }

    console.log('Attempting to create user:', { email, fullName, role })
    console.log('Service key starts with:', supabaseServiceKey.substring(0, 20) + '...')

    // Create user in Supabase Auth (service role admin path)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        role: role || 'admin',
      },
      email_confirm: true,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: `Auth error: ${authError.message}` },
        { status: 500 }
      )
    }

    if (!authData.user) {
      console.error('No user data returned from auth creation')
      return NextResponse.json(
        { error: 'Failed to create user account - no user data returned' },
        { status: 500 }
      )
    }

    console.log('User created successfully:', authData.user.id, authData.user.email)

    // Verify the user was actually created by fetching it
    const { data: verifyUser, error: verifyError } = await supabase.auth.admin.getUserById(authData.user.id)

    if (verifyError) {
      console.error('User verification failed:', verifyError)
      return NextResponse.json(
        { error: `User creation verification failed: ${verifyError.message}` },
        { status: 500 }
      )
    }

    if (!verifyUser.user) {
      console.error('User verification returned no user')
      return NextResponse.json(
        { error: 'User was not found after creation' },
        { status: 500 }
      )
    }

    console.log('User created successfully:', authData.user.id, authData.user.email)

    // Now insert into the admins table
    console.log('Inserting admin record into database...')
    const { error: dbError } = await supabase
      .from('admins')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          role: role || 'admin',
          is_active: true,
        }
      ])

    if (dbError) {
      console.error('Database insertion error:', dbError)
      // Don't fail the whole operation if DB insertion fails
      // The user was created successfully in Auth
      console.log('User created in Auth but failed to insert into admins table')
    } else {
      console.log('Admin record inserted successfully')
    }

    // Verify the user was actually created by fetching it
    const { data: verifyUserResult, error: verifyUserError } = await supabase.auth.admin.getUserById(authData.user.id)

    if (verifyUserError) {
      console.error('User verification failed:', verifyUserError)
      return NextResponse.json(
        { error: `User creation verification failed: ${verifyUserError.message}` },
        { status: 500 }
      )
    }

    if (!verifyUserResult.user) {
      console.error('User verification returned no user')
      return NextResponse.json(
        { error: 'User was not found after creation' },
        { status: 500 }
      )
    }

    console.log('User verified successfully:', verifyUser.user.id)

    return NextResponse.json({
      message: 'Admin account created successfully. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}