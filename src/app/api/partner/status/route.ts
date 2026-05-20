import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase environment variables are not configured." }, { status: 500 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Unable to initialize Supabase client." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("partnership_requests")
      .select("status, admin_message, next_step_url, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message || "Unable to load partnership request." }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "No partnership request found for this email." }, { status: 404 })
    }

    return NextResponse.json({ success: true, request: data })
  } catch (error: any) {
    console.error("Partnership status lookup error:", error)
    return NextResponse.json({ error: error?.message || "Unable to check partnership status." }, { status: 500 })
  }
}
