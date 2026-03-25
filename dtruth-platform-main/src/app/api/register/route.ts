import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import sendVerificationEmail from '@/lib/sendVerificationEmail'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        verificationToken: token,
        verificationTokenExpires: expires,
      },
    })

    // Send verification email (don't block on failure)
    try {
      await sendVerificationEmail(email, token)
    } catch (err) {
      console.error('Email send failed:', err)
    }

    return NextResponse.json({ message: 'Registration successful. Check your email for a verification link.' })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
