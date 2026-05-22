import { AxiosError } from 'axios';
import { getResumenVentasUseCase } from '../services/useCases/getResumenVentasUseCase';

export async function getResumenVentasAction() {
  try {
    const data = await getResumenVentasUseCase.execute();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener resumen')
        : 'Error al obtener resumen';
    return { success: false, error: message };
  }
}
