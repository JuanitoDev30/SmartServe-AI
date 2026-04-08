import { ProductRepository } from '@/features/products/services/repositories/productRepository';
import { deleteProductsUseCase } from '@/features/products/services/useCases/deleteProductUseCase';

type DeleteProductResponse =
  | { success: true }
  | { success: false; error: string };

export async function deleteProductActions(
  id: string,
): Promise<DeleteProductResponse> {
  try {
    const repo = new ProductRepository();
    const deleteProduct = deleteProductsUseCase(repo);

    await deleteProduct(id);

    return { success: true };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error?.message || 'Error al eliminar el producto',
    };
  }
}
