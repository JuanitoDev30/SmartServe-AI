'use server';

import { updateOrderUseCase } from '../services/useCases/updateOrderUseCase';
import { EstadoPedido } from '../schemas/orderSchema';

export async function updateOrderAction(id: string, estado: EstadoPedido) {
  try {
    const result = await updateOrderUseCase.execute(id, { estado });
    return { success: true, data: result };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error al actualizar pedido';
    return { success: false, error: message };
  }
}
