import { Reserva, ReservaFilters } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class GetReservasUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(filters?: ReservaFilters): Promise<Reserva[]> {
    return this.reservaRepository.getAll(filters);
  }
}

export const getReservasUseCase = new GetReservasUseCase(reservaRepository);
