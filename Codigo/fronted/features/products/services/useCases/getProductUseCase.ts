// use-cases/getProducts.usecase.ts

import { IProductRepository } from '../repositories/productRepositoryInterface';

export const getProductsUseCase = (repo: IProductRepository) => {
  return async () => {
    return await repo.getAll();
  };
};
