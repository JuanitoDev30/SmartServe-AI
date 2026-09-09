import { Reserva } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class GetReservaByIdUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(id: string): Promise<Reserva> {
    return this.reservaRepository.getById(id);
  }
}

export const getReservaByIdUseCase = new GetReservaByIdUseCase(
  reservaRepository,
);
