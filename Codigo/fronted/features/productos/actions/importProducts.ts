'use server';

import { revalidatePath } from 'next/cache';
import { importProductsUseCase } from '../services/useCases/importProductsUseCase';

export async function importProductsAction(formData: FormData) {
  try {
    const result = await importProductsUseCase.execute(formData);

    revalidatePath('/dashboard/inventario');

    return result;
  } catch (error: any) {
    return {
      success: 0,
      errors: [
        {
          fila: 0,
          nombre: '',
          errores: [error.message ?? 'Error importando productos'],
        },
      ],
      created: [],
    };
  }
}
