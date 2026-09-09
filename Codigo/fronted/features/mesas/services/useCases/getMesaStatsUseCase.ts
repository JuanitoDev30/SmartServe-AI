import { MesaStats } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class GetMesaStatsUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(): Promise<MesaStats> {
    return this.mesaRepository.getStats();
  }
}

export const getMesaStatsUseCase = new GetMesaStatsUseCase(mesaRepository);
