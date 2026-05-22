import { ventasRepository } from '../repositories/ventasRepository';
import { PeriodoGrafica } from '../../schemas/ventasSchema';

class GetGraficaVentasUseCase {
  async execute(periodo: PeriodoGrafica) {
    return ventasRepository.getGrafica(periodo);
  }
}
export const getGraficaVentasUseCase = new GetGraficaVentasUseCase();
