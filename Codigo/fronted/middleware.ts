import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(req => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // Si está en login y ya tiene sesión → redirigir al dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Si intenta acceder al dashboard sin sesión → redirigir al login
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
