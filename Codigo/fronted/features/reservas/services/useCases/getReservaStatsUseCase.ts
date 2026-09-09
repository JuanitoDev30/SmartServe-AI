import { ReservaStats } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class GetReservaStatsUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(): Promise<ReservaStats> {
    return this.reservaRepository.getStats();
  }
}

export const getReservaStatsUseCase = new GetReservaStatsUseCase(
  reservaRepository,
);
