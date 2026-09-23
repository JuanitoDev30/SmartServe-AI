import { Mesa, UpdateLayoutInput } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class UpdateLayoutMesasUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(data: UpdateLayoutInput): Promise<Mesa[]> {
    return this.mesaRepository.updateLayout(data);
  }
}

export const updateLayoutMesasUseCase = new UpdateLayoutMesasUseCase(
  mesaRepository,
);
