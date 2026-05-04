// features/dashboard/pedidos/actions/getOrdersAction.ts
'use server';

import { getOrderUseCase } from '../services/useCases/getOrderUseCase';

export async function getOrderAction() {
  try {
    const result = await getOrderUseCase.execute();
    return { success: true, data: result };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error al obtener pedidos';
    return { success: false, error: message, data: [] };
  }
}
