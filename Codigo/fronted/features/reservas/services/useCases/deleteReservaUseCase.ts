import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class DeleteReservaUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(id: string): Promise<{ mensaje: string }> {
    return this.reservaRepository.remove(id);
  }
}

export const deleteReservaUseCase = new DeleteReservaUseCase(reservaRepository);
