import { getApiWithAuth } from '@/db/apiWithAuth';
import { SearchRepositoryInterface } from './searchRepositoryInterface';

class SearchRepository {
  async search(q: string): Promise<SearchRepositoryInterface> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/search', { params: { q } });
    return data;
  }
}

export const searchRepository = new SearchRepository();
