'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { CreateMesaInput } from '../schemas/mesaSchema';
import { createMesaUseCase } from '../services/useCases/createMesaUseCase';

export async function createMesaAction(data: CreateMesaInput) {
  try {
    const mesa = await createMesaUseCase.execute(data);
    revalidatePath('/dashboard/mesas');
    return { success: true, data: mesa };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al crear la mesa'),
    };
  }
}
