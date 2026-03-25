import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const user = await prisma.user.findFirst({ where: { verificationToken: token } })
    if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })

    if (user.emailVerified) return NextResponse.json({ message: 'Email already verified' })

    const now = new Date()
    if (!user.verificationTokenExpires || user.verificationTokenExpires < now) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null, verificationTokenExpires: null },
    })

    return NextResponse.json({ message: 'Email verified' })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
