import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret')

const publicRoutes = [
  '/login',
  '/register',
  '/verify-email',
  '/',
  '/innovation-for-salvation',
  '/traction',
  '/archives',
  '/admin/login',
  '/admin/register',
  '/api/login',
  '/api/register',
  '/api/verify-email',
  '/api/resend-verification'
]

const adminRoutes = ['/admin/dashboard', '/admin/users', '/admin/documents', '/admin/settings', '/admin/archive', '/admin/media', '/admin/reports', '/admin/upload']

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (err) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const user = await verifyAuth(request)

  if (!user) {
    // Redirect to login if not authenticated
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check admin-specific routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const userRole = user.role as string | undefined
    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
