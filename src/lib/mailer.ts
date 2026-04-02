import sendgrid from '@sendgrid/mail'

const { SENDGRID_API_KEY, EMAIL_FROM, NOTIFICATION_EMAIL_TO } = process.env

if (!SENDGRID_API_KEY || !EMAIL_FROM) {
  console.warn(
    'Missing SendGrid email configuration. Partnership notification emails will not be sent.'
  )
} else {
  sendgrid.setApiKey(SENDGRID_API_KEY)
}

export async function sendPartnershipNotificationEmail(payload: {
  name: string
  email: string
  organization?: string
  message: string
}) {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    console.warn('Skipping partnership notification email because SendGrid is not configured.')
    return
  }

  const recipient = NOTIFICATION_EMAIL_TO || EMAIL_FROM
  const subject = 'New partnership request received'
  const html = `
    <div style="font-family:Arial, sans-serif; color:#111827;">
      <h1 style="font-size:20px;">New Partnership Request</h1>
      <p>A new partnership request has been submitted on your website.</p>
      <ul style="list-style-type:none; padding:0;">
        <li><strong>Name:</strong> ${payload.name}</li>
        <li><strong>Email:</strong> ${payload.email}</li>
        <li><strong>Organization:</strong> ${payload.organization || 'N/A'}</li>
      </ul>
      <h2 style="font-size:16px;">Message</h2>
      <p style="white-space:pre-wrap;">${payload.message}</p>
    </div>
  `

  const text = `New Partnership Request\n\nName: ${payload.name}\nEmail: ${payload.email}\nOrganization: ${payload.organization || 'N/A'}\n\nMessage:\n${payload.message}`

  const msg = {
    to: recipient,
    from: EMAIL_FROM as string,
    subject,
    text,
    html,
  }

  await sendgrid.send(msg)
}
