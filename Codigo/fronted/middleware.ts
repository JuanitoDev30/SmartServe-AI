import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { DEMO_COOKIE, demoKey, demoToken } from '@/lib/demo/acceso';

export default auth(async req => {
  const { pathname } = req.nextUrl;

  // Demo publica: el chat y su API piden la clave (ver lib/demo/acceso.ts).
  const key = demoKey();
  const isChat = pathname === '/' || pathname.startsWith('/api/asistente');
  if (key && isChat && req.cookies.get(DEMO_COOKIE)?.value !== (await demoToken(key))) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ detail: 'Falta la clave de la demo.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/acceso', req.url));
  }

  const isLoggedIn = !!req.auth;
  const isLoginPage = pathname.startsWith('/login');
  const isDashboard = pathname.startsWith('/dashboard');

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login?expired=true', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/', '/api/asistente/:path*', '/dashboard/:path*', '/login'],
};
