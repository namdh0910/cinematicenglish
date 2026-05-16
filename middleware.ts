// middleware.ts
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing (e.g. during build or before config), 
  // bypass middleware to prevent 500 errors.
  if (!supabaseUrl || !supabaseAnonKey) {
    return res
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 1. Not logged in → redirect to admin login
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
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // 3. Already logged in + going to /admin/login → redirect to dashboard
  if (session && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
