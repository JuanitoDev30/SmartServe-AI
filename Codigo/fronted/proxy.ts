import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(req => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login?expired=true', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
