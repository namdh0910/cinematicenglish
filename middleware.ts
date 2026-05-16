import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path is an admin path
  if (pathname.startsWith('/admin')) {
    // 2. Exclude the login page from protection to avoid infinite loops
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 3. Mock Auth Check: Check for an auth cookie
    // In production, this would be 'sb-access-token' or similar
    const authCookie = request.cookies.get('admin-session');

    if (!authCookie) {
      // Not logged in -> redirect to admin login
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Note: Checking specific role ('admin') usually happens inside the Layout
    // or through an API call in the middleware for stricter security.
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
