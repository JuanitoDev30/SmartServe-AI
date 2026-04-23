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

    //console.log('BACKEND RAW', data);

    return NextResponse.json({
      message: data.message,
    });
  } catch (error) {
    console.error('Error in chat API:', error);

    return NextResponse.json(
      { error: 'Error procesando mensaje' },
      { status: 500 },
    );
  }
}
