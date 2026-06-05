'use server';
import { AxiosError } from 'axios';
import { getReporteProductosUseCase } from '../services/useCases/getReporteProductosUseCase';

export async function getReporteProductosAction(
  fechaInicio: string,
  fechaFin: string,
) {
  try {
    const data = await getReporteProductosUseCase.execute(
      fechaInicio,
      fechaFin,
    );
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ??
          'Error al obtener reporte de productos')
        : 'Error al obtener reporte de productos';
    return { success: false, error: message };
  }
}
