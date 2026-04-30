import { ProductFormData } from '@/features/productos/schemas/productSchema';
import { IProductRepository } from '../repositories/productRepositoryInterface';
import { productRepository } from '../repositories/productRepository';

class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, data: ProductFormData): Promise<void> {
    await this.productRepository.update(id, data);
  }
}

export const updateProductUseCase = new UpdateProductUseCase(productRepository);
