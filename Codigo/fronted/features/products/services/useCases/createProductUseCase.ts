// use-cases/createProducts.usecase.ts

import {
  ProductFormData,
  ProductType,
} from '@/features/products/schemas/productSchema';
import { IProductRepository } from '../repositories/productRepositoryInterface';

export const createProductsUseCase = (repo: IProductRepository) => {
  return async (data: ProductFormData) => {
    return await repo.create(data);
  };
};
