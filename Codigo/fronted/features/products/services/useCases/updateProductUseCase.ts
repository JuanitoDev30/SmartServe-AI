import { ProductFormData } from '@/features/products/schemas/productSchema';
import { IProductRepository } from '../repositories/productRepositoryInterface';

export const updateProductUseCase = (repo: IProductRepository) => {
  return async (id: string, data: ProductFormData) => {
    return await repo.update(id, data);
  };
};
