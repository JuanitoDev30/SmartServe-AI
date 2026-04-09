'use server';
import { revalidatePath } from 'next/cache';
import { ProductFormData } from '../schemas/productSchema';
import { updateProductUseCase } from '../services/useCases/updateProductUseCase';


export async function updateProductActions(
  id: string,
  data: ProductFormData,
): Promise<any> {
  try {
   const result = await updateProductUseCase.execute(id, data);
    console.log(result)
    revalidatePath('/inventario'); 

    return {
      success: true,
      data: result, 
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error?.message || 'Error updating product',
    };
  }
}
