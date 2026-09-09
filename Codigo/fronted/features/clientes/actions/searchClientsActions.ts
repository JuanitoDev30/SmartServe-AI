'use server';

import { getActionErrorMessage } from '@/lib/utils/actionError';
import { getClientesUseCase } from '../services/useCases/getClientsUseCases';

/**
 * Búsqueda ligera de clientes para selectores (formulario de reservas).
 * Vive aparte de getClientsActions porque esa se consume desde el
 * servidor y esta necesita ser invocable desde el cliente.
 */
export async function searchClientesAction(search: string, limit = 6) {
  try {
    const data = await getClientesUseCase.execute({
      search,
      page: 1,
      limit,
      sortBy: 'creadoEn',
      sortOrder: 'desc',
    });

    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      error: getActionErrorMessage(error, 'Error al buscar clientes'),
      data: [],
    };
  }
}
