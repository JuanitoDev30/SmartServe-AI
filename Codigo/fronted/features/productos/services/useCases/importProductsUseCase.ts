import { IProductRepository } from '../repositories/productRepositoryInterface';
import { productRepository } from '../repositories/productRepository';

class ImportProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(formData: FormData) {
    return await this.productRepository.bulkImport(formData);
  }
}

export const importProductsUseCase = new ImportProductsUseCase(
  productRepository,
);
