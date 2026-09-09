'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { getMesasUseCase } from '../services/useCases/getMesasUseCase';
import { getMesaStatsUseCase } from '../services/useCases/getMesaStatsUseCase';

export async function getMesasAction(soloActivas?: boolean) {
  try {
    const data = await getMesasUseCase.execute(soloActivas);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener las mesas'),
      data: [],
    };
  }
}

export async function getMesaStatsAction() {
  try {
    const data = await getMesaStatsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener estadísticas'),
    };
  }
}
