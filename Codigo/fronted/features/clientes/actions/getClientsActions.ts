import { AxiosError } from 'axios';
import { ClienteFilters } from '../schemas/clientSchema';
import { getClientesUseCase } from '../services/useCases/getClientsUseCases';
import { getClienteStatsUseCase } from '../services/useCases/createClientUseCases';
import { clientRepository } from '../services/repositories/clientRepository';

export async function getClientsActions(filters: ClienteFilters) {
  try {
    const data = await getClientesUseCase.execute(filters);
    return {
      success: true,
      data,
    };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener clientes')
        : 'Error al obtener clientes';
    return { success: false, error: message };
  }
}

export async function getClienteStatsAction() {
  try {
    const data = await getClienteStatsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener estadísticas')
        : 'Error al obtener estadísticas';
    return { success: false, error: message };
  }
}
