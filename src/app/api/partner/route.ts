import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not configured")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
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

    const { error: dbError } = await supabaseAdmin.from("partnership_requests").insert({
      name,
      email,
      organization: organization || null,
      message,
    })

    if (dbError) {
      console.error("Failed to save partnership request:", dbError)
      return NextResponse.json(
        { error: "Unable to save partnership request." },
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
