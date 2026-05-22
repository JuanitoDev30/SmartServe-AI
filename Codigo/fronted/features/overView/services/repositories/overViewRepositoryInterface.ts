import { Overview } from '../../schemas/overViewSchema';

export interface OverviewRepositoryInterface {
  getOverview(): Promise<Overview>;
}
