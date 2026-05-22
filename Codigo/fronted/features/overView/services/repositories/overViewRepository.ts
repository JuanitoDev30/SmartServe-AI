import api from '@/db/axios';
import { OverviewRepositoryInterface } from './overViewRepositoryInterface';
import { Overview } from '../../schemas/overViewSchema';

class OverviewRepository implements OverviewRepositoryInterface {
  async getOverview(): Promise<Overview> {
    const { data } = await api.get('/dashboard/overview');
    return data;
  }
}

export const overviewRepository = new OverviewRepository();
