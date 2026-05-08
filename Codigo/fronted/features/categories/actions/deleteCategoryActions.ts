'use server';
import { deleteCategoryUseCase } from '../services/useCases/deleteCategoryUseCase';
import { revalidatePath } from 'next/cache';
import { AxiosError } from 'axios';

type DeleteCategoryResponse =
  | { success: true }
  | { success: false; error: string };

export async function deleteCategoryAction(
  id: string,
): Promise<DeleteCategoryResponse> {
  try {
    await deleteCategoryUseCase.execute(id);
    revalidatePath('/dashboard/categorias');
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message ?? 'Error al eliminar la categoría';
      return { success: false, error: message };
    }
    const message =
      error instanceof Error ? error.message : 'Error al eliminar la categoría';
    return { success: false, error: message };
  }
}
