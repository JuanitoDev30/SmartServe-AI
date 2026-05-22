import { AxiosError } from 'axios';
import { getTopProductosUseCase } from '../services/useCases/getTopProductosUseCase';
import { PeriodoTopProductos } from '../schemas/ventasSchema';

export async function getTopProductosAction(
  limit = 5,
  periodo: PeriodoTopProductos = 'mes',
) {
  try {
    const data = await getTopProductosUseCase.execute(limit, periodo);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener top productos')
        : 'Error al obtener top productos';
    return { success: false, error: message };
  }
}
