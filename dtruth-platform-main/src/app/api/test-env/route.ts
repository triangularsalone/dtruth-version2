import { NextResponse } from 'next/server'

export async function GET() {
  console.log('SUPABASE_SERVICE_ROLE_KEY in API:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'LOADED' : 'NOT LOADED')
  console.log('Length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)

  return NextResponse.json({
    serviceRoleKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
  })
}