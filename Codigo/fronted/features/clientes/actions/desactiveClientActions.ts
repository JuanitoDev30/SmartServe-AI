'use server';
import { revalidatePath } from 'next/cache';
import { AxiosError } from 'axios';

import { desactiveClientUseCase } from '../services/useCases/desactiveClientUseCase';

export async function desactiveClientAction(clientId: string) {
  try {
    const client = await desactiveClientUseCase.execute(clientId);

    revalidatePath('/dashboard/clientes');

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Error al desactivar cliente'
        : 'Error al desactivar cliente';

    return {
      success: false,
      error: Array.isArray(message) ? message.join(', ') : message,
    };
  }
}
