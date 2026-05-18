import { clientRepository } from '../repositories/clientRepository';
import { Cliente } from '../../schemas/clientSchema';

class GetClienteByIdUseCase {
  async execute(id: string): Promise<Cliente> {
    return clientRepository.getById(id);
  }
}

export const getClienteByIdUseCase = new GetClienteByIdUseCase();
