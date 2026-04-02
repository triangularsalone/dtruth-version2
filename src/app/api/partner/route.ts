import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const notificationEmail = process.env.NOTIFICATION_EMAIL_TO
const notificationRedirectTo = process.env.NOTIFICATION_EMAIL_REDIRECT_TO
  ? process.env.NOTIFICATION_EMAIL_REDIRECT_TO
  : process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")}/admin/dashboard`
  : undefined

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

async function sendSupabasePartnershipNotificationEmail(
  supabaseAdmin: ReturnType<typeof createClient>
) {
  if (!notificationEmail) {
    console.warn(
      "Skipping partnership notification email because NOTIFICATION_EMAIL_TO is not configured."
    )
    return
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      email: notificationEmail,
      type: "magiclink",
      options: notificationRedirectTo ? { redirectTo: notificationRedirectTo } : undefined,
    })

    if (error) {
      throw error
    }

    console.log("Supabase partnership notification email sent via generateLink.")
  } catch (generateError: any) {
    console.warn(
      "Supabase generateLink failed, attempting fallback inviteUserByEmail:",
      generateError
    )

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      notificationEmail,
      {
        redirectTo: notificationRedirectTo,
      }
    )

    if (inviteError) {
      throw inviteError
    }

    console.log("Supabase partnership notification email sent via inviteUserByEmail.")
  }
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
            error: "The partnership_requests table does not exist in the connected database.",
            hint: "Run migrations or create the table manually using supabase/migrations/20260327000000_create_partnership_requests_table.sql.",
            dbError: dbError.message || null,
            dbDetails: dbError.details || null,
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

    try {
      await sendSupabasePartnershipNotificationEmail(supabaseAdmin)
    } catch (emailError) {
      console.error("Partnership notification email failed:", emailError)
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
