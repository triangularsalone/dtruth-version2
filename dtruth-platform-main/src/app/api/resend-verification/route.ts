import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import sendVerificationEmail from '@/lib/sendVerificationEmail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.emailVerified) return NextResponse.json({ message: 'Email already verified' })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({ where: { id: user.id }, data: { verificationToken: token, verificationTokenExpires: expires } })

    try {
      await sendVerificationEmail(email, token)
    } catch (err) {
      console.error('Resend email failed', err)
    }

    return NextResponse.json({ message: 'Verification email resent' })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
