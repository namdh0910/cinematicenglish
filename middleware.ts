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

  // Define protected routes (dashboard and learn will be protected client-side with a cinematic glass modal)
  const protectedStudentRoutes = ['/practice', '/classroom', '/chat', '/community', '/exam', '/feed', '/journal']
  const isProtectedStudent = protectedStudentRoutes.some(r => url.pathname.startsWith(r) || url.pathname === r)
  
  const isTeacherRoute = url.pathname.startsWith('/teacher') || url.pathname === '/teacher'
  const isAdminRoute = url.pathname.startsWith('/admin') && url.pathname !== '/admin/login'

  // Fetch role if logged in
  let role = 'guest'
  if (session?.user?.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    role = profile?.role || 'student'
  }

  // 1. GUEST ENFORCEMENT
  if (role === 'guest') {
    if (isProtectedStudent || isTeacherRoute || isAdminRoute) {
      url.pathname = '/login'
      url.searchParams.set('from', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    // Guest accessing /login or /signup is allowed
    return res
  }

  // 2. LOGGED IN REDIRECTS (from auth pages)
  if (role !== 'guest' && (url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/admin/login')) {
    if (role === 'admin') url.pathname = '/admin'
    else if (role === 'teacher') url.pathname = '/teacher'
    else url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 3. ADMIN ENFORCEMENT
  if (role === 'admin') {
    // Admins can access everything, but let's say they stay in admin.
    // If we want to strictly route admins:
    return res
  }

  // 4. TEACHER ENFORCEMENT
  if (role === 'teacher') {
    if (isAdminRoute) {
      url.pathname = '/teacher'
      return NextResponse.redirect(url)
    }
    return res // Teachers can access student routes and teacher routes
  }

  // 5. STUDENT ENFORCEMENT
  if (role === 'student') {
    if (isTeacherRoute || isAdminRoute) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return res
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images|audio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
