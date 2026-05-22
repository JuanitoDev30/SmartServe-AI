'use server';

import { AxiosError } from 'axios';
import { getOverviewUseCase } from '../services/useCases/getOverViewUseCase';

export async function getOverviewAction() {
  try {
    const data = await getOverviewUseCase.execute();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener overview')
        : 'Error al obtener overview';
    return { success: false, error: message };
  }
}
