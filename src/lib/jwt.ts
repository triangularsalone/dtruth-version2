import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env
if (!JWT_SECRET) console.warn('Missing JWT_SECRET environment variable')

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string)
  } catch (err) {
    return null
  }
}

export default { signToken, verifyToken }
