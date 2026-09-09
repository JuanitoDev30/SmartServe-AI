'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { DisponibilidadQuery } from '../schemas/reservaSchema';
import { getDisponibilidadUseCase } from '../services/useCases/getDisponibilidadUseCase';

export async function getDisponibilidadAction(query: DisponibilidadQuery) {
  try {
    const data = await getDisponibilidadUseCase.execute(query);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al consultar disponibilidad'),
    };
  }
}
