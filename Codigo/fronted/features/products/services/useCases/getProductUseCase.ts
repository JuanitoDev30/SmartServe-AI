// use-cases/getProducts.usecase.ts

import { productRepository } from '../repositories/productRepository';
import { IProductRepository } from '../repositories/productRepositoryInterface';

// export const getProductsUseCase = (repo: IProductRepository) => {
//   return async () => {
//     return await repo.getAll();
//   };
// };

class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) {
    return await this.productRepository.getAll({ page, pageSize, search });
  }
}

export const getProductsUseCase = new GetProductsUseCase(productRepository);
