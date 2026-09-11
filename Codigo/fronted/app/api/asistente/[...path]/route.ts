/**
 * Proxy del asistente.
 *
 * Por que un proxy y no llamar al agente directo desde el navegador:
 *
 * - El agente queda en la red interna. Nadie puede gastarte tokens del modelo
 *   apuntando al endpoint desde fuera.
 * - No hay CORS que configurar: para el navegador todo es el mismo origen.
 * - La IP que ve el limitador es la del visitante, no la del servidor de
 *   Next.js, gracias a la cabecera que se reenvia abajo. Sin eso, todos los
 *   clientes comparten una sola cuota.
 *
 * Para que el agente haga caso a esa cabecera hay que poner
 * TRUST_FORWARDED_FOR=true en su .env, y entonces el agente NO debe quedar
 * accesible directamente desde internet: si lo esta, cualquiera falsifica la
 * cabecera y se salta el limite por IP.
 */

import { NextResponse, type NextRequest } from 'next/server';

const AGENT_URL = process.env.AGENT_URL ?? 'http://localhost:8000';

export async function POST(
  request: NextRequest,
  ctx: RouteContext<'/api/asistente/[...path]'>,
) {
  const { path } = await ctx.params;
  const target = `${AGENT_URL}/${path.join('/')}`;

  const forwardedFor =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    '';

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
      },
      body: await request.text(),
      // El agente puede tardar: encadena varias llamadas al modelo por turno.
      signal: AbortSignal.timeout(120_000),
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        ...(response.headers.has('Retry-After')
          ? { 'Retry-After': response.headers.get('Retry-After')! }
          : {}),
      },
    });
  } catch {
    return NextResponse.json(
      { detail: 'El asistente no responde en este momento.' },
      { status: 503 },
    );
  }
}
