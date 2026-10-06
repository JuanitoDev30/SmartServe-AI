/**
 * Proxy del enlace "Confirmo que voy" de los correos de recordatorio.
 *
 * El enlace apunta a este front (la URL publica del tunel o del dominio) y no
 * al agente, que queda en la red interna. Se reenvia tal cual: el agente
 * valida la firma del enlace y responde la pagina HTML. No pide la clave de
 * la demo: se abre desde el correo, en el telefono del paciente.
 */

import { NextResponse, type NextRequest } from 'next/server';

const AGENT_URL = process.env.AGENT_URL ?? 'http://localhost:8000';

async function forward(request: NextRequest, method: 'GET' | 'POST') {
  const target = `${AGENT_URL}/citas/confirmar${request.nextUrl.search}`;
  try {
    const response = await fetch(target, {
      method,
      signal: AbortSignal.timeout(30_000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch {
    return new NextResponse('El servicio no responde en este momento.', { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  return forward(request, 'GET');
}

export async function POST(request: NextRequest) {
  return forward(request, 'POST');
}
