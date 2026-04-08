import { ProductFormData } from '@/features/products/schemas/productSchema';
import { ProductRepository } from '../services/repositories/productRepository';
import { createProductsUseCase } from '../services/useCases/createProductUseCase';

export async function createProductActions(data: ProductFormData) {
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
