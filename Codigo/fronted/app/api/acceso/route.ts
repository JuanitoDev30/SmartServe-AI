import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_COOKIE, demoKey, demoToken } from '@/lib/demo/acceso';

export async function POST(request: NextRequest) {
  const key = demoKey();
  const form = await request.formData();
  const given = String(form.get('clave') ?? '').trim();

  if (!key || given !== key) {
    return redirect('/acceso?error=1');
  }

  const response = redirect('/');
  response.cookies.set(DEMO_COOKIE, await demoToken(key), {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

/**
 * Redireccion relativa: detras del tunel, request.url trae el host interno
 * (localhost:3005) y no el publico, y el navegador terminaria en su propio
 * localhost.
 */
function redirect(path: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}
