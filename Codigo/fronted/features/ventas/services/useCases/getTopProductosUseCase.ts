import { ventasRepository } from '../repositories/ventasRepository';
import { PeriodoTopProductos } from '../../schemas/ventasSchema';

class GetTopProductosUseCase {
  async execute(limit: number, periodo: PeriodoTopProductos) {
    return ventasRepository.getTopProductos(limit, periodo);
  }
}
export const getTopProductosUseCase = new GetTopProductosUseCase();
