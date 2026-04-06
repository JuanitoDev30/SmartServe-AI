// repositories/product.repository.ts

import api from '@/db/axios';
import { IProductRepository } from './productRepositoryInterface';

import { ProductType } from '@/features/users/schemas/productSchema';

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<ProductType[]> {
    const { data } = await api.get('/producto');
    console.log(data);
    return data;
  }

  async getById(id: string): Promise<ProductType> {
    const { data } = await api.get(`/producto/${id}`);
    return data;
  }

  async create(data: ProductType): Promise<ProductType> {
    const response = await api.post('/producto', data);
    return response.data;
  }

  async update(id: string, data: ProductType): Promise<ProductType> {
    const { data: updated } = await api.put(`/producto/${id}`, data);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/producto/${id}`);
  }
}
