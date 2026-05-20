import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendPartnershipDecisionEmail } from "@/lib/mailer"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const partnershipId = params.id
  if (!partnershipId) {
    return NextResponse.json({ error: "Partnership request ID is required." }, { status: 400 })
  }

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
    const body = await request.json()
    const action = typeof body.action === "string" ? body.action.trim().toLowerCase() : ""
    const adminMessage = typeof body.adminMessage === "string" ? body.adminMessage.trim() : ""
    const nextStepUrl = typeof body.nextStepUrl === "string" ? body.nextStepUrl.trim() : null

    if (!action || !["approve", "decline"].includes(action)) {
      return NextResponse.json({ error: "Action must be either approve or decline." }, { status: 400 })
    }

    const status = action === "approve" ? "approved" : "declined"
    const defaultAdminMessage =
      action === "approve"
        ? "Your partnership request has been approved. Please continue to the next steps page to complete onboarding and scheduling."
        : "Your partnership request was reviewed and declined. We appreciate your interest and will share alternative resources if available."

    const { data, error } = await supabaseAdmin
      .from("partnership_requests")
      .update({
        status,
        admin_message: adminMessage || defaultAdminMessage,
        next_step_url: action === "approve" ? nextStepUrl || "/partner/next-steps" : null,
      })
      .eq("id", partnershipId)
      .select("id, name, email, status, admin_message, next_step_url")
      .single()

    if (error) {
      console.error("Unable to update partnership request status:", error)
      return NextResponse.json({ error: error.message || "Unable to update status." }, { status: 500 })
    }

    if (data?.email) {
      try {
        await sendPartnershipDecisionEmail({
          recipientEmail: data.email,
          name: data.name,
          status: data.status as "approved" | "declined",
          nextStepUrl: data.next_step_url,
          adminMessage: data.admin_message,
        })
      } catch (emailError: any) {
        console.error("Failed to send partnership decision email:", emailError)
      }
    }

    return NextResponse.json({ success: true, request: data })
  } catch (error: any) {
    console.error("Admin partnership update error:", error)
    return NextResponse.json(
      { error: error?.message || "Unable to update partnership request." },
      { status: 500 }
    )
  }
}
