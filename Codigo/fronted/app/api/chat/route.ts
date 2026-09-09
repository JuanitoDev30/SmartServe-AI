import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE_URL = process.env.AGENT_URL;
const AGENT_TOKEN = process.env.AGENT_TOKEN;

const agentHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${AGENT_TOKEN}`,
};

// ── Enviar mensaje (n8n) ──
export async function POST(request: NextRequest) {
  try {
    const { message, contactId, history } = await request.json();

    const response = await fetch(process.env.N8N_CHAT_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, contactId, history }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);

    return NextResponse.json(
      { error: 'Error procesando mensaje' },
      { status: 500 },
    );
  }
}

// ── Resetear sesión del agente ──
export async function DELETE() {
  if (!AGENT_BASE_URL) {
    return NextResponse.json(
      { error: 'AGENT_URL no está configurada' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${AGENT_BASE_URL}/reset`, {
      method: 'POST',
      headers: agentHeaders,
    });

    if (!response.ok) throw new Error(`Agent error: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error resetting agent:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

// ── Traza de herramientas usadas por el agente ──
export async function GET() {
  if (!AGENT_BASE_URL) {
    return NextResponse.json(
      { tool_trace: [], length: 0 },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${AGENT_BASE_URL}/tool-trace`, {
      method: 'GET',
      headers: agentHeaders,
    });

    if (!response.ok) throw new Error(`Agent error: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tool trace:', error);
    return NextResponse.json({ tool_trace: [], length: 0 }, { status: 500 });
  }
}
