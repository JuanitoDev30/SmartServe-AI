'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { UpdateLayoutInput } from '../schemas/mesaSchema';
import { updateLayoutMesasUseCase } from '../services/useCases/updateLayoutMesasUseCase';

export async function updateLayoutMesasAction(data: UpdateLayoutInput) {
  try {
    const mesas = await updateLayoutMesasUseCase.execute(data);
    revalidatePath('/dashboard/mesas');
    revalidatePath('/dashboard/reservas');
    return { success: true, data: mesas };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al guardar el plano del salón'),
    };
  }
}
