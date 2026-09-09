import { Reserva, UpdateReservaInput } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class UpdateReservaUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(id: string, data: UpdateReservaInput): Promise<Reserva> {
    return this.reservaRepository.update(id, data);
  }
}

export const updateReservaUseCase = new UpdateReservaUseCase(reservaRepository);
