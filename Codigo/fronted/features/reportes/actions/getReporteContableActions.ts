import { AxiosError } from 'axios';
import { getReporteContableUseCase } from '../services/useCases/getReporteContableUseCase';

export async function getReporteContableAction(mes: number, anio: number) {
  try {
    const data = await getReporteContableUseCase.execute(mes, anio);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener reporte contable')
        : 'Error al obtener reporte contable';
    return { success: false, error: message };
  }
}
