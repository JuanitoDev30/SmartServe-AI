import { ProductFormData, ProductType } from '../schemas/productSchema';
import { ProductRepository } from '../services/repositories/productRepository';
import { updateProductUseCase } from '../services/useCases/updateProductUseCase';

type UpdateProductResponse =
  | { success: true; data: ProductType }
  | { success: false; error: string };

export async function updateProductActions(
  id: string,
  data: ProductFormData,
): Promise<UpdateProductResponse> {
  try {
    const repo = new ProductRepository();
    const updateProduct = updateProductUseCase(repo);

    const result = await updateProduct(id, data);

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
