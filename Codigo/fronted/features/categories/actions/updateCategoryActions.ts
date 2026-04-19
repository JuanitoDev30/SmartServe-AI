'use server';
import { CategoryFormData } from '../schemas/categorySchema';
import { updateCategoryUseCase } from '../services/useCases/updateCategoryUseCase';
import { revalidatePath } from 'next/cache';

export async function updateCategoryAction(id: string, data: CategoryFormData) {
  try {
    const result = await updateCategoryUseCase.execute(id, data);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Error updating category',
      };
    }

    revalidatePath('/dashboard/categorias');

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || 'Error updating category',
    };
  }
}