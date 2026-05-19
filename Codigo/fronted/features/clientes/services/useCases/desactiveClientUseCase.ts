import { Cliente } from '../../schemas/clientSchema';
import { clientRepository } from '../repositories/clientRepository';

class DesactiveClientUseCase {
  async execute(id: string): Promise<Cliente> {
    return clientRepository.desactivar(id);
  }
}

export const desactiveClientUseCase = new DesactiveClientUseCase();
