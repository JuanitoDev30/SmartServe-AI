'use server';
import { deleteCategoryUseCase } from '../services/useCases/deleteCategoryUseCase';
import { revalidatePath } from 'next/cache';

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
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error?.message || 'Error al eliminar la categoría',
    };
  }
}