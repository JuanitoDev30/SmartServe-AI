import { ProductType } from '@/features/users/schemas/productSchema';

export interface IProductRepository {
  getAll(): Promise<ProductType[]>;
  getById(id: string): Promise<ProductType>;
  create(data: ProductType): Promise<ProductType>;
  update(id: string, data: ProductType): Promise<ProductType>;
  delete(id: string): Promise<void>;
}
