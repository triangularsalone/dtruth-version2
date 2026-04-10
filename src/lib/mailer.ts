import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const nextBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || ""

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

const normalizeRedirectUrl = (path: string) => {
  if (!nextBaseUrl) return path
  return `${nextBaseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`
}

export async function sendPartnershipDecisionEmail(payload: {
  recipientEmail: string
  name: string
  status: "approved" | "declined"
  nextStepUrl?: string | null
  adminMessage?: string | null
}) {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.warn("Skipping partnership decision email because Supabase admin client is not configured.")
    return
  }

  const redirectTo = payload.nextStepUrl
    ? normalizeRedirectUrl(payload.nextStepUrl)
    : normalizeRedirectUrl(`/partner/status?email=${encodeURIComponent(payload.recipientEmail)}`)

  if (payload.status === "approved") {
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(payload.recipientEmail, {
      redirectTo,
    })

    if (error) {
      console.warn("Supabase invite email failed, falling back to magic link:", error)
      const { error: fallbackError } = await supabaseAdmin.auth.admin.generateLink({
        email: payload.recipientEmail,
        type: "magiclink",
        options: { redirectTo },
      })
      if (fallbackError) {
        console.error("Fallback magic link email failed:", fallbackError)
        throw fallbackError
      }
    }
    return
  }

  const { error } = await supabaseAdmin.auth.admin.generateLink({
    email: payload.recipientEmail,
    type: "magiclink",
    options: { redirectTo },
  })

  if (error) {
    console.error("Supabase magic link email failed:", error)
    throw error
  }
}
