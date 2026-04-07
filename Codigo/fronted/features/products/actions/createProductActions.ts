import { ProductType } from '@/features/users/schemas/productSchema';
import { createProductsUseCase } from '@/features/products/services/useCases/createProductUseCase';
import { ProductRepository } from '@/features/products/services/repositories/productRepository'; // ajusta ruta

export async function createProductActions(data: ProductType) {
  try {
    const repo = new ProductRepository();

    const createProduct = createProductsUseCase(repo);

    const result = await createProduct(data);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: 'Error creating product',
    };
  }
}