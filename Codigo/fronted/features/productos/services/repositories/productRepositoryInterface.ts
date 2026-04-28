import {
  ProductFormData,
  ProductType,
} from '@/features/productos/schemas/productSchema';

export interface IProductRepository {
  getAll({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<ProductType[]>;
  getById(id: string): Promise<ProductType>;
  create(
    data: ProductFormData,
  ): Promise<{ success: boolean; data?: any; error?: string }>;
  update(id: string, data: ProductFormData): Promise<ProductType>;
  delete(id: string): Promise<void>;
}
