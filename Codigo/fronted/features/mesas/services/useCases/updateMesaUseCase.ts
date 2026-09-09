import { Mesa, UpdateMesaInput } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class UpdateMesaUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(id: string, data: UpdateMesaInput): Promise<Mesa> {
    return this.mesaRepository.update(id, data);
  }
}

export const updateMesaUseCase = new UpdateMesaUseCase(mesaRepository);
