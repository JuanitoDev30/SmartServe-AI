import {
  ProductFormData,
  ProductType,
} from '@/features/products/schemas/productSchema';

export interface IProductRepository {
  getAll(): Promise<ProductType[]>;
  getById(id: string): Promise<ProductType>;
  create(data: ProductFormData): Promise<ProductType>;
  update(id: string, data: ProductFormData): Promise<ProductType>;
  delete(id: string): Promise<void>;
}
