import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

export const signToken = async (payload: Record<string, unknown>, expiresIn = '7d'): Promise<string> => {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secret)
  return jwt
}

export const verifyToken = async (token: string): Promise<Record<string, unknown> | null> => {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as Record<string, unknown>
  } catch {
    return null
  }
}
