import { AxiosError } from 'axios';
import { PeriodoGrafica } from '../schemas/ventasSchema';
import { getGraficaVentasUseCase } from '../services/useCases/getGraficaVentasUseCase';

export async function getGraficaVentasAction(periodo: PeriodoGrafica) {
  try {
    const data = await getGraficaVentasUseCase.execute(periodo);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener gráfica')
        : 'Error al obtener gráfica';
    return { success: false, error: message };
  }
}
