import { Mesa } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class CambiarDisponibilidadMesaUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(id: string, activa: boolean): Promise<Mesa> {
    return this.mesaRepository.cambiarDisponibilidad(id, activa);
  }
}

export const cambiarDisponibilidadMesaUseCase =
  new CambiarDisponibilidadMesaUseCase(mesaRepository);
