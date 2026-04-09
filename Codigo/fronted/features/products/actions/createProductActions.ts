'use server';
import { ProductFormData } from '@/features/products/schemas/productSchema';
import { createProductsUseCase } from '../services/useCases/createProductUseCase';
import { revalidatePath } from 'next/cache';

export async function createProductActions(data: ProductFormData) {
  try {
    const result = await createProductsUseCase.execute(data);

    revalidatePath('/dashboard/inventario');

    return result;
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: 'Error creating product',
    };
  }
}
