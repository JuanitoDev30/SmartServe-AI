'use server';

import { AxiosError } from 'axios';
import { searchRepository } from '../services/repositories/searchRepository';
import { SearchRepositoryInterface } from '../services/repositories/searchRepositoryInterface';

export async function searchAction(q: string): Promise<{
  success: boolean;
  data?: SearchRepositoryInterface;
  error?: string;
}> {
  try {
    const data = await searchRepository.search(q);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error en la búsqueda')
        : 'Error en la búsqueda';
    return { success: false, error: message };
  }
}
