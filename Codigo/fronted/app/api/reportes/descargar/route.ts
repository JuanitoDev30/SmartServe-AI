import { NextRequest } from 'next/server';
import { descargarReporteUseCase } from '@/features/reportes/services/useCases/descargarReporteUseCase';

export const runtime = 'nodejs';

type FormatoReporte = 'excel' | 'pdf';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const tipo = searchParams.get('tipo');
    const formato = searchParams.get('formato') as FormatoReporte | null;

    if (!tipo) {
      return Response.json(
        { message: 'El parámetro tipo es requerido' },
        { status: 400 },
      );
    }

    if (!formato || !['excel', 'pdf'].includes(formato)) {
      return Response.json({ message: 'Formato inválido' }, { status: 400 });
    }

    const params = Object.fromEntries(
      [...searchParams.entries()].filter(
        ([key]) => key !== 'tipo' && key !== 'formato',
      ),
    );

    const response = await descargarReporteUseCase.execute(
      tipo,
      params,
      formato,
    );

    return new Response(response.data, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers['content-type'] ?? 'application/octet-stream',

        'Content-Disposition':
          response.headers['content-disposition'] ?? 'attachment',
      },
    });
  } catch (error) {
    console.error('[DESCARGAR_REPORTE_ERROR]', error);

    return Response.json(
      {
        message: 'Error al descargar reporte',
      },
      {
        status: 500,
      },
    );
  }
}
