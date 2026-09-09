'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { deleteReservaUseCase } from '../services/useCases/deleteReservaUseCase';

export async function deleteReservaAction(id: string) {
  try {
    const result = await deleteReservaUseCase.execute(id);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al eliminar la reserva'),
    };
  }
}
