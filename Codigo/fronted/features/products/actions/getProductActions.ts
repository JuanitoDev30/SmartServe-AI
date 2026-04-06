// actions/getProducts.action.ts

import { ProductRepository } from '@/features/products/services/repositories/productRepository';
import { getProductsUseCase } from '@/features/products/services/useCases/getProductUseCase';

const getProducts = getProductsUseCase(new ProductRepository());

export async function getProductsAction() {
  return getProducts();
}
