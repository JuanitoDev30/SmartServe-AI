import { IProductRepository } from '../repositories/productRepositoryInterface';

export const deleteProductsUseCase =
  (repo: IProductRepository) => async (id: string) => {
    return await repo.delete(id);
  };
