import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  '/login',
  '/register',
  '/verify-email',
  '/',
  '/innovation-for-salvation',
  '/traction',
  '/archives',
  '/archive',
  '/vision',
  '/partner',
  '/admin/login',
  '/admin/register',
  '/api/login',
  '/api/register',
  '/api/verify-email',
  '/api/resend-verification',
  '/api/auth',
  '/api/test-env'
]

const adminRoutes = ['/admin/dashboard', '/admin/users', '/admin/documents', '/admin/settings', '/admin/archive', '/admin/media', '/admin/reports', '/admin/upload']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes (no auth required)
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get Supabase session from cookies
  const supabaseSession = request.cookies.get('sb-' + (process.env.NEXT_PUBLIC_SUPABASE_URL || '').split('//')[1]?.split('.')[0] || 'local_session')

  // For client-side route protection, we let the page/component handle auth via useEffect
  // Middleware just ensures public routes are accessible
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
