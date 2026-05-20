import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client is not configured' },
        { status: 500 }
      )
    }

    // Use Supabase's built-in resend functionality
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to resend verification email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Verification email resent successfully' })
  } catch (err: any) {
    console.error('Server error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
