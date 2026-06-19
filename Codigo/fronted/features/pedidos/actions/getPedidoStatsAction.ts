'use server';

import { getApiWithAuth } from '@/db/apiWithAuth';
import { AxiosError } from 'axios';

export async function getPedidoStatsAction() {
  try {
    const api = await getApiWithAuth();
    const { data } = await api.get('/pedido/stats');
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener estadísticas')
        : 'Error al obtener estadísticas';
    return { success: false, error: message };
  }
}
