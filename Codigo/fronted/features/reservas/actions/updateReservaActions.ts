'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { EstadoReserva, UpdateReservaInput } from '../schemas/reservaSchema';
import { updateReservaUseCase } from '../services/useCases/updateReservaUseCase';
import { cambiarEstadoReservaUseCase } from '../services/useCases/cambiarEstadoReservaUseCase';

export async function updateReservaAction(
  id: string,
  data: UpdateReservaInput,
) {
  try {
    const reserva = await updateReservaUseCase.execute(id, data);
    return { success: true, data: reserva };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al actualizar la reserva'),
    };
  }
}

export async function cambiarEstadoReservaAction(
  id: string,
  estado: EstadoReserva,
  motivoCancelacion?: string,
) {
  try {
    const reserva = await cambiarEstadoReservaUseCase.execute(
      id,
      estado,
      motivoCancelacion,
    );
    return { success: true, data: reserva };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al cambiar el estado'),
    };
  }
}
