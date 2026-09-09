'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { UpdateMesaInput } from '../schemas/mesaSchema';
import { updateMesaUseCase } from '../services/useCases/updateMesaUseCase';
import { cambiarDisponibilidadMesaUseCase } from '../services/useCases/cambiarDisponibilidadMesaUseCase';

export async function updateMesaAction(id: string, data: UpdateMesaInput) {
  try {
    const mesa = await updateMesaUseCase.execute(id, data);
    revalidatePath('/dashboard/mesas');
    return { success: true, data: mesa };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al actualizar la mesa'),
    };
  }
}

export async function cambiarDisponibilidadMesaAction(
  id: string,
  activa: boolean,
) {
  try {
    const mesa = await cambiarDisponibilidadMesaUseCase.execute(id, activa);
    revalidatePath('/dashboard/mesas');
    return { success: true, data: mesa };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(
        error,
        'Error al cambiar la disponibilidad de la mesa',
      ),
    };
  }
}
