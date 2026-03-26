import { verifyToken } from './jwt'
import { cookies } from 'next/headers'

export function getServerUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = verifyToken(token as string)
    return payload
  } catch (err) {
    return null
  }
}

export function requireAuth() {
  const user = getServerUser()
  if (!user) {
    // Next.js App Router: use redirect from next/navigation in server component where called
    return null
  }
  return user
}
