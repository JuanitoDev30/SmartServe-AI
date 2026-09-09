import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class DeleteMesaUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(id: string): Promise<{ mensaje: string }> {
    return this.mesaRepository.remove(id);
  }
}

export const deleteMesaUseCase = new DeleteMesaUseCase(mesaRepository);
