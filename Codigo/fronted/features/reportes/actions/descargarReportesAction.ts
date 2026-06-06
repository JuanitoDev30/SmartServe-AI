'use server';
import { AxiosError } from 'axios';
import { descargarReporteUseCase } from '../services/useCases/descargarReporteUseCase';

export async function descargarReportesAction(
  tipo: string,
  params: Record<string, string>,
  formato: 'excel' | 'pdf',
) {
  try {
    const result = await descargarReporteUseCase.execute(tipo, params, formato);

    return { success: true, data: result };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ??
          'Error al obtener reporte de clientes')
        : 'Error al obtener reporte de clientes';
    return { success: false, error: message };
  }
}
