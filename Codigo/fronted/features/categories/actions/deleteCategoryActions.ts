'use server';
import { deleteCategoryUseCase } from '../services/useCases/deleteCategoryUseCase';
import { revalidatePath } from 'next/cache';

export async function deleteCategoryAction(id: string) {
  try {
    const result = await deleteCategoryUseCase.execute(id);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Error deleting category',
      };
    }

    revalidatePath('/dashboard/categorias');

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || 'Error deleting category',
    };
  }
}