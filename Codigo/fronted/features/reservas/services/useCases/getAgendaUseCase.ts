import { Reserva } from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class GetAgendaUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  /** Reservas de un día concreto (YYYY-MM-DD); por defecto, hoy */
  async execute(fecha?: string): Promise<Reserva[]> {
    return this.reservaRepository.getAgenda(fecha);
  }
}

export const getAgendaUseCase = new GetAgendaUseCase(reservaRepository);
