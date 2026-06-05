'use server';
import { AxiosError } from 'axios';
import { getReporteClientesUseCase } from '../services/useCases/getReporteClientesUseCase';

export async function getReporteClientesAction(
  fechaInicio: string,
  fechaFin: string,
) {
  try {
    const data = await getReporteClientesUseCase.execute(fechaInicio, fechaFin);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ??
          'Error al obtener reporte de clientes')
        : 'Error al obtener reporte de clientes';
    return { success: false, error: message };
  }
}
