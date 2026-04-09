'use server';
import { ProductFormData } from '@/features/products/schemas/productSchema';
import { createProductsUseCase } from '../services/useCases/createProductUseCase';
import { revalidatePath } from 'next/cache';

export async function createProductActions(data: ProductFormData) {
  try {
    const result = await createProductsUseCase.execute(data);
    // console.log(result);
    revalidatePath('/dashboard/inventario');
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error.message || 'Error creating product',
    };
  }
}
