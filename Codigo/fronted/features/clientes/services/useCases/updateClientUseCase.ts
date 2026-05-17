import { Cliente, UpdateClienteInput } from '../../schemas/clientSchema';
import { clientRepository } from '../repositories/clientRepository';

class UpdateClientUseCase {
  async execute(id: string, data: UpdateClienteInput): Promise<Cliente> {
    return clientRepository.update(id, data);
  }
}

export const updateClientUseCase = new UpdateClientUseCase();
