import { NextResponse } from 'next/server'

// This endpoint is no longer used - email verification is handled by Supabase Auth
export async function POST() {
  return NextResponse.json({
    message: 'Email verification is now handled by Supabase Auth. Please use the Supabase dashboard to manage email templates.'
  })
}
