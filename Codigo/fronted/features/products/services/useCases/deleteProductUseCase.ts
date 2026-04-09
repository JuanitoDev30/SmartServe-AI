import { productRepository } from '../repositories/productRepository';
import { IProductRepository } from '../repositories/productRepositoryInterface';

class DeleteProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}

export const deleteProductsUseCase = new DeleteProductsUseCase(
  productRepository,
);
