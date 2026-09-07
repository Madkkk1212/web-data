import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect admin portal routes
  if (pathname.startsWith('/gw-mgmt-portal-x7k2')) {
    // Allow login page through
    if (pathname === '/gw-mgmt-portal-x7k2/login') {
      return NextResponse.next()
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.redirect(new URL('/gw-mgmt-portal-x7k2/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/gw-mgmt-portal-x7k2/:path*'],
}
