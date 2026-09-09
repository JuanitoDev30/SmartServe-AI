import { EstadoReserva, Reserva } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class CambiarEstadoReservaUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(
    id: string,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ): Promise<Reserva> {
    return this.reservaRepository.cambiarEstado(id, estado, motivoCancelacion);
  }
}

export const cambiarEstadoReservaUseCase = new CambiarEstadoReservaUseCase(
  reservaRepository,
);
