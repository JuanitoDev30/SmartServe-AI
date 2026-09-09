'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { ReservaFilters } from '../schemas/reservaSchema';
import { getReservasUseCase } from '../services/useCases/getReservasUseCase';
import { getAgendaUseCase } from '../services/useCases/getAgendaUseCase';
import { getReservaStatsUseCase } from '../services/useCases/getReservaStatsUseCase';
import { getReservaByIdUseCase } from '../services/useCases/getReservaByIdUseCase';

export async function getReservasAction(filters?: ReservaFilters) {
  try {
    const data = await getReservasUseCase.execute(filters);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener las reservas'),
      data: [],
    };
  }
}

/** Reservas de un día concreto (YYYY-MM-DD); por defecto, hoy */
export async function getAgendaAction(fecha?: string) {
  try {
    const data = await getAgendaUseCase.execute(fecha);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener la agenda'),
      data: [],
    };
  }
}

export async function getReservaByIdAction(id: string) {
  try {
    const data = await getReservaByIdUseCase.execute(id);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener la reserva'),
    };
  }
}

export async function getReservaStatsAction() {
  try {
    const data = await getReservaStatsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al obtener estadísticas'),
    };
  }
}
