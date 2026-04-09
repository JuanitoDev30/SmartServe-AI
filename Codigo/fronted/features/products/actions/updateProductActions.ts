'use server';
import { revalidatePath } from 'next/cache';
import { ProductFormData, ProductType } from '../schemas/productSchema';
import { updateProductUseCase } from '../services/useCases/updateProductUseCase';

type UpdateProductResponse =
  | { success: true; data: ProductType }
  | { success: false; error: string };
export async function updateProductActions(
  id: string,
  data: ProductFormData,
): Promise<any> {
  try {
    await updateProductUseCase.execute(id, data);

    revalidatePath('/inventario'); // Revalidate the products page to reflect the updated product

    return {
      success: true,
      data: null, // You can replace this with the actual updated product data if needed
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error?.message || 'Error updating product',
    };
  }
}
