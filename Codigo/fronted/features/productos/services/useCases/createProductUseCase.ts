// use-cases/createProducts.usecase.ts

import { ProductFormData } from '@/features/products/schemas/productSchema';
import { IProductRepository } from '../repositories/productRepositoryInterface';
import { productRepository } from '../repositories/productRepository';

class CreateProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: ProductFormData): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.productRepository.create(data);
  }
}

export const createProductsUseCase = new CreateProductsUseCase(
  productRepository,
);
