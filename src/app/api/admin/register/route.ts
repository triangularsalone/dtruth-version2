import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are not configured')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
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
    const validRoles = ['admin', 'super_admin']
    const adminRole = role && validRoles.includes(role) ? role : 'admin'

    // Create user in Supabase Auth (service role admin path)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        role: adminRole,
      },
      email_confirm: true,
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create admin record in database
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
          role: adminRole,
          is_active: true,
        }
      ])

    if (dbError) {
      console.error('Database insertion error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create admin record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Admin account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: adminRole,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}