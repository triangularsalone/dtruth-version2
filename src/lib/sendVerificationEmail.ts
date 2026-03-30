// import sendgrid from '@sendgrid/mail'

const { SENDGRID_API_KEY, EMAIL_FROM, NEXT_PUBLIC_BASE_URL } = process.env

if (!SENDGRID_API_KEY || !EMAIL_FROM || !NEXT_PUBLIC_BASE_URL) {
  console.warn('Missing SendGrid env vars. Verification emails will fail until configured.')
}

// sendgrid.setApiKey(SENDGRID_API_KEY || '')

export async function sendVerificationEmail(email: string, token: string) {
  // Using Supabase SMTP system instead
  console.log(`Verification email would be sent to ${email} with token ${token}`)
  // Implement with nodemailer and Supabase SMTP if needed
}
  const verifyUrl = `${NEXT_PUBLIC_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`

  const html = `
  <div style="font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;">
    <div style="max-width:600px; margin:0 auto; padding:24px; border:1px solid #e5e7eb; border-radius:8px;">
      <h2 style="color:#0f172a;">Verify your email</h2>
      <p style="color:#374151;">Thanks for signing up for D'Truth. Please verify your email address to activate your account.</p>
      <div style="text-align:center; margin:24px 0;">
        <a href="${verifyUrl}" style="background-color:#4f46e5; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; display:inline-block;">Verify Email</a>
      </div>
      <p style="color:#6b7280; font-size:13px;">If the button doesn't work, paste this link into your browser:</p>
      <p style="color:#6b7280; font-size:13px; word-break:break-all;">${verifyUrl}</p>
      <hr style="border:none; border-top:1px solid #e6e7eb; margin:18px 0;" />
      <p style="color:#9ca3af; font-size:12px;">If you didn't sign up for D'Truth, you can safely ignore this email.</p>
    </div>
  </div>
  `

  const msg = {
    to: email,
    from: EMAIL_FROM as string,
    subject: "Verify your D'Truth account",
    html,
  }

  const res = await sendgrid.send(msg)
  return res
}

export default sendVerificationEmail
