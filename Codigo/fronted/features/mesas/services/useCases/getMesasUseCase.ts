import { Mesa } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class GetMesasUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(soloActivas?: boolean): Promise<Mesa[]> {
    return this.mesaRepository.getAll(soloActivas);
  }
}

export const getMesasUseCase = new GetMesasUseCase(mesaRepository);
