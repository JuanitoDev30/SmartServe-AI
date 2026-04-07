// repositories/productRepository.ts

import api from '@/db/axios';
import { IProductRepository } from './productRepositoryInterface';

import {
  ProductType,
  ProductFormData,
} from '@/features/users/schemas/productSchema';

export class ProductRepository implements IProductRepository {

  async getAll(): Promise<ProductType[]> {
    const { data } = await api.get('/producto');
    return data;
  }

  async getById(id: string): Promise<ProductType> {
    const { data } = await api.get(`/producto/${id}`);
    return data;
  }

 
  async create(data: ProductFormData): Promise<any> {
    try {
      const response = await api.post('/producto', data);

      return {
        success: true,
        data: response.data,
      };

    } catch (error: any) {
      console.log("ERROR EN CREATE:", error?.response?.data);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          'Error creando producto',
      };
    }
  }

 
  async update(id: string, data: ProductFormData): Promise<ProductType> {
    const { data: updated } = await api.put(`/producto/${id}`, data);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/producto/${id}`);
  }
}