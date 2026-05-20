import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'inkprint_session'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasCookie = Boolean(req.cookies.get(SESSION_COOKIE))
  const isProtected =
    path.startsWith('/app') ||
    path.startsWith('/admin') ||
    path.startsWith('/onboarding') ||
    path.startsWith('/settings')

  if (isProtected && !hasCookie) {
    const url = new URL('/login', req.nextUrl.origin)
    url.searchParams.set('next', path)
    return NextResponse.redirect(url, 303)
  }
  return NextResponse.next()
}

export const config = {
  // Fast-path gate. The full session check (DB lookup, expiry, status) runs in
  // the gated page's server component via requireSession().
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/onboarding/:path*',
    '/onboarding',
    '/settings/:path*',
  ],
}
