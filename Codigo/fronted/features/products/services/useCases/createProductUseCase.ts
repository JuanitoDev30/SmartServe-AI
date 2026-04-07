
// use-cases/createProducts.usecase.ts

import { ProductType } from '@/features/users/schemas/productSchema';
import { IProductRepository } from '../repositories/productRepositoryInterface';

export const createProductsUseCase = (repo: IProductRepository) => {
  return async (data: ProductType) => {
    return await repo.create(data);
  };
};
