import { CreateReservaInput, Reserva } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class CreateReservaUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(data: CreateReservaInput): Promise<Reserva> {
    return this.reservaRepository.create(data);
  }
}

export const createReservaUseCase = new CreateReservaUseCase(reservaRepository);
