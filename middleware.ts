// middleware.ts
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Enforce DB Environment keys presence
  if (!supabaseUrl || !supabaseAnonKey) {
    return res
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) { return req.cookies.get(name)?.value },
      set(name: string, value: string, options: any) {
        req.cookies.set({ name, value, ...options })
        res = NextResponse.next({ request: { headers: req.headers } })
        res.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        req.cookies.set({ name, value: '', ...options })
        res = NextResponse.next({ request: { headers: req.headers } })
        res.cookies.set({ name, value: '', ...options })
      },
    },
  })

  const { data: { session } } = await supabase.auth.getSession()
  const url = req.nextUrl.clone()

  // ─── STUDENT/TEACHER ROUTES ───────────────────────────────────────────────
  // Protect /dashboard, /learn, /practice, /teacher, /classroom
  const protectedStudentRoutes = ['/dashboard', '/practice', '/classroom']
  const isProtectedStudent = protectedStudentRoutes.some(r => url.pathname.startsWith(r))

  if (!session && isProtectedStudent) {
    url.pathname = '/login'
    url.searchParams.set('from', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Protect /teacher — requires teacher or admin role
  if (session && url.pathname.startsWith('/teacher')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from login/signup
  if (session && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // ─── ADMIN ROUTES ─────────────────────────────────────────────────────────
  if (!session && url.pathname.startsWith('/admin')) {
    if (url.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return res
  }


  if (session?.user?.id && url.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Already logged in → redirect away from admin login
  if (session && url.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/dashboard',
    '/teacher/:path*',
    '/teacher',
    '/classroom/:path*',
    '/practice/:path*',
    '/login',
    '/signup',
  ]
}
