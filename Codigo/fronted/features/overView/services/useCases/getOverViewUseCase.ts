import { Overview } from '../../schemas/overViewSchema';
import { overviewRepository } from '../repositories/overViewRepository';

class GetOverviewUseCase {
  async execute(): Promise<Overview> {
    return overviewRepository.getOverview();
  }
}

export const getOverviewUseCase = new GetOverviewUseCase();
