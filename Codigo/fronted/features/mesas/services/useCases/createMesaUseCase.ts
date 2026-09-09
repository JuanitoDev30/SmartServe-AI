import { CreateMesaInput, Mesa } from '../../schemas/mesaSchema';
import { mesaRepository } from '../repositories/mesaRepository';
import { MesaRepositoryInterface } from '../repositories/mesaRepositoryInterface';

class CreateMesaUseCase {
  constructor(private readonly mesaRepository: MesaRepositoryInterface) {}

  async execute(data: CreateMesaInput): Promise<Mesa> {
    return this.mesaRepository.create(data);
  }
}

export const createMesaUseCase = new CreateMesaUseCase(mesaRepository);
