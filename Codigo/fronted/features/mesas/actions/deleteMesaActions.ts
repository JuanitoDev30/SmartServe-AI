'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { deleteMesaUseCase } from '../services/useCases/deleteMesaUseCase';

export async function deleteMesaAction(id: string) {
  try {
    const result = await deleteMesaUseCase.execute(id);
    revalidatePath('/dashboard/mesas');
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al eliminar la mesa'),
    };
  }
}
