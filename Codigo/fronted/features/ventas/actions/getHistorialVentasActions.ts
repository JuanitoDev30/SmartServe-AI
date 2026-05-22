import { AxiosError } from 'axios';
import { getHistorialVentasUseCase } from '../services/useCases/getHistorialVentasUseCase';

export async function getHistorialVentasAction(
  page = 1,
  pageSize = 10,
  fechaInicio?: string,
  fechaFin?: string,
) {
  try {
    const data = await getHistorialVentasUseCase.execute(
      page,
      pageSize,
      fechaInicio,
      fechaFin,
    );
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener historial')
        : 'Error al obtener historial';
    return { success: false, error: message };
  }
}
