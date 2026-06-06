import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // If user visits exactly /admin, redirect to /admin/products dashboard
  if (url.pathname === '/admin') {
    url.pathname = '/admin/products';
    return NextResponse.redirect(url);
  }

  // Protect /admin routes (except /admin/login)
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie || authCookie.value !== 'true') {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
