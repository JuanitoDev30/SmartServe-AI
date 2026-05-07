'use server';

import { PedidoFormValues } from '@/lib/validations/order';
import { updateOrderUseCase } from '../services/useCases/updateOrderUseCase';

import { AxiosError } from 'axios';
// import { revalidatePath } from 'next/cache';

export async function updateOrderAction(id: string, data: PedidoFormValues) {
  try {
    const result = await updateOrderUseCase.execute(id, data);
    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Backend error:', error.response?.data);
      const message =
        error.response?.data?.message ?? 'Error al actualizar pedido';

      // revalidatePath('/pedido');
      return {
        success: false,
        error: Array.isArray(message) ? message.join(', ') : message,
      };
    }

    const message =
      error instanceof Error ? error.message : 'Error al actualizar pedido';
    return { success: false, error: message };
  }
}
