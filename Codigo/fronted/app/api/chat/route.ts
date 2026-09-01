import { NextRequest, NextResponse } from 'next/server';

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

// import { NextRequest, NextResponse } from 'next/server';

// const AGENT_BASE_URL = process.env.AGENT_URL!;
// const AGENT_TOKEN = process.env.AGENT_TOKEN!;

// const agentHeaders = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${AGENT_TOKEN}`,
// };

// // ── Enviar mensaje ──
// export async function POST(request: NextRequest) {
//   try {
//     const { message, contactId } = await request.json();

//     const response = await fetch(`${AGENT_BASE_URL}/query`, {
//       method: 'POST',
//       headers: agentHeaders,
//       body: JSON.stringify({ message }),
//     });

//     if (!response.ok) throw new Error(`Agent error: ${response.status}`);

//     const data = await response.json();

//     return NextResponse.json({
//       message: data.response,
//       contactId,
//       tokenUsage: data.token_usage,
//       responseTime: data.response_time_seconds,
//     });
//   } catch (error) {
//     console.error('Error in chat API:', error);
//     return NextResponse.json(
//       { message: 'Lo siento, ocurrió un error. Intenta de nuevo.' },
//       { status: 500 },
//     );
//   }
// }

// // ── Resetear sesión ──
// export async function DELETE() {
//   try {
//     const response = await fetch(`${AGENT_BASE_URL}/reset`, {
//       method: 'POST',
//       headers: agentHeaders,
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error resetting agent:', error);
//     return NextResponse.json({ status: 'error' }, { status: 500 });
//   }
// }

// // ── Tool trace ──
// export async function GET() {
//   try {
//     const response = await fetch(`${AGENT_BASE_URL}/tool-trace`, {
//       method: 'GET',
//       headers: agentHeaders,
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching tool trace:', error);
//     return NextResponse.json({ tool_trace: [], length: 0 }, { status: 500 });
//   }
// }
