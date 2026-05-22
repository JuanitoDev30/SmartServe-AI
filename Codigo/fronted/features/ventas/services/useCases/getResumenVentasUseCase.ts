import { ventasRepository } from '../repositories/ventasRepository';

class GetResumenVentasUseCase {
  async execute() {
    return ventasRepository.getResumen();
  }
}
export const getResumenVentasUseCase = new GetResumenVentasUseCase();
