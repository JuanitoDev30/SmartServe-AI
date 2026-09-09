'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { CreateReservaInput } from '../schemas/reservaSchema';
import { createReservaUseCase } from '../services/useCases/createReservaUseCase';

export async function createReservaAction(data: CreateReservaInput) {
  try {
    const reserva = await createReservaUseCase.execute(data);
    return { success: true, data: reserva };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al crear la reserva'),
    };
  }
}
