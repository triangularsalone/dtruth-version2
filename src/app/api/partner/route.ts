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
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Unable to initialize Supabase client." },
      { status: 500 }
    )
  }

  try {
    const data = await request.json()

    const name = typeof data.name === "string" ? data.name.trim() : ""
    const email = typeof data.email === "string" ? data.email.trim() : ""
    const organization = typeof data.organization === "string" ? data.organization.trim() : ""
    const message = typeof data.message === "string" ? data.message.trim() : ""

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    const insertRequest = async () => {
      return supabaseAdmin.from("partnership_requests").insert({
        name,
        email,
        organization: organization || null,
        message,
      })
    }

    const { error: dbError } = await insertRequest()

    if (dbError) {
      const isMissingTable =
        dbError.message?.includes("schema cache") ||
        dbError.message?.includes("Could not find the table") ||
        dbError.details?.includes("Could not find the table")

      if (isMissingTable) {
        console.error("Missing partnership_requests table in Supabase schema.")
        return NextResponse.json(
          {
            error: "The partnership_requests table does not exist in the connected database. Run migrations or create the table manually using supabase/migrations/20260327000000_create_partnership_requests_table.sql.",
          },
          { status: 500 }
        )
      }

      console.error("Failed to save partnership request:", dbError)
      return NextResponse.json(
        { error: dbError.message || dbError.details || "Unable to save partnership request." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Partner API error:", error)
    return NextResponse.json(
      { error: error?.message || "Unable to submit partnership request." },
      { status: 500 }
    )
  }
}
