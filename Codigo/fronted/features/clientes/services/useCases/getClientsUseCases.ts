import { clientRepository } from '../repositories/clientRepository';
import { ClienteFilters, PaginatedClientes } from '../../schemas/clientSchema';

class GetClientesUseCase {
  async execute(filters: ClienteFilters): Promise<PaginatedClientes> {
    return clientRepository.getAll(filters);
  }
}

export const getClientesUseCase = new GetClientesUseCase();
