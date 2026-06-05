import { AxiosError } from 'axios';
import { getReporteVentasUseCase } from '../services/useCases/getReporteVentasUseCase';

export async function getReporteVentasAction(
  fechaInicio: string,
  fechaFin: string,
) {
  try {
    const data = await getReporteVentasUseCase.execute(fechaInicio, fechaFin);

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message ||
          'Error al obtener el reporte de ventas'
        : 'Error al obtener el reporte de ventas';
    return { success: false, error: message };
  }
}
