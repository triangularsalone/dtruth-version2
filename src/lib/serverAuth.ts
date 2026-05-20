import { verifyToken } from './jwt'
import { cookies } from 'next/headers'

export async function getServerUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = verifyToken(token as string)
    return payload
  } catch (err) {
    return null
  }
}

export async function requireAuth() {
  const user = await getServerUser()
  if (!user) {
    // Next.js App Router: use redirect from next/navigation in server component where called
    return null
  }
  return user
}
