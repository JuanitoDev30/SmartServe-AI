import { ventasRepository } from '../repositories/ventasRepository';

class GetMetodosPagoUseCase {
  async execute() {
    return ventasRepository.getMetodosPago();
  }
}
export const getMetodosPagoUseCase = new GetMetodosPagoUseCase();
