import {
  Disponibilidad,
  DisponibilidadQuery,
} from '../../schemas/reservaSchema';
import { reservaRepository } from '../repositories/reservaRepository';
import { ReservaRepositoryInterface } from '../repositories/reservaRepositoryInterface';

class GetDisponibilidadUseCase {
  constructor(private readonly reservaRepository: ReservaRepositoryInterface) {}

  async execute(query: DisponibilidadQuery): Promise<Disponibilidad> {
    return this.reservaRepository.getDisponibilidad(query);
  }
}

export const getDisponibilidadUseCase = new GetDisponibilidadUseCase(
  reservaRepository,
);
