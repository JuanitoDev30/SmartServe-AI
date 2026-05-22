import { AxiosError } from 'axios';
import { getMetodosPagoUseCase } from '../services/useCases/getMetodosPagoUseCase';

export async function getMetodosPagoAction() {
  try {
    const data = await getMetodosPagoUseCase.execute();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener métodos de pago')
        : 'Error al obtener métodos de pago';
    return { success: false, error: message };
  }
}
