'use server';
import { updateClientUseCase } from '../services/useCases/updateClientUseCase';
import { UpdateClienteInput } from '../schemas/clientSchema';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function updateClientAction(id: string, data: UpdateClienteInput) {
  try {
    const result = await updateClientUseCase.execute(id, data);
    revalidatePath('/dashboard/clientes');
    return { success: true, data: result };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al actualizar cliente')
        : 'Error al actualizar cliente';
    return { success: false, error: message };
  }
}
