'use server';
import { revalidatePath } from 'next/cache';
import { CategoryFormData } from '../schemas/categorySchema';
import { updateCategoryUseCase } from '../services/useCases/updateCategoryUseCase';

export async function updateCategoryAction(
  id: string,
  data: CategoryFormData,
): Promise<any> {
  try {
    const result = await updateCategoryUseCase.execute(id, data);
    console.log(result);
    revalidatePath('/dashboard/categorias');

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error?.message || 'Error updating category',
    };
  }
}