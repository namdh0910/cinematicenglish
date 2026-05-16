// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // 1. Not logged in → redirect to admin login if accessing admin routes
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    if (req.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return res
  }

  // 2. Logged in but accessing admin routes → check role
  if (session && req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Not admin → kick out to home
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // 3. Already logged in + going to /admin/login → redirect to admin dashboard
  if (session && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
