import { getApiWithAuth } from '@/db/apiWithAuth';

import { OverviewRepositoryInterface } from './overViewRepositoryInterface';
import { Overview } from '../../schemas/overViewSchema';

class OverviewRepository implements OverviewRepositoryInterface {
  async getOverview(): Promise<Overview> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/dashboard/overview');
    return data;
  }
}

export const overviewRepository = new OverviewRepository();
