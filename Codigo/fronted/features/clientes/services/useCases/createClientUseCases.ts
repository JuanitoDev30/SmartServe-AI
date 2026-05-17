import { clientRepository } from '../repositories/clientRepository';
import { ClienteStats } from '../../schemas/clientSchema';

class GetClienteStatsUseCase {
  async execute(): Promise<ClienteStats> {
    return clientRepository.getStats();
  }
}

export const getClienteStatsUseCase = new GetClienteStatsUseCase();
