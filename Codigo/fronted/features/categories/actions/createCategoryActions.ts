'use server';
import { CategoryFormData } from '../schemas/categorySchema';
import { createCategoryUseCase } from '../services/useCases/createCategoryUseCase';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(data: CategoryFormData) {
  try {
    const result = await createCategoryUseCase.execute(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Error creating category',
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
      error: error.message || 'Error creating category',
    };
  }
}