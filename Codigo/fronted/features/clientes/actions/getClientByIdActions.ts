'use server';

import { getClienteByIdUseCase } from '../services/useCases/createClientByIdUseCase';
import { AxiosError } from 'axios';

export async function getClienteByIdAction(id: string) {
  try {
    const data = await getClienteByIdUseCase.execute(id);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener cliente')
        : 'Error al obtener cliente';
    return { success: false, error: message };
  }
}
