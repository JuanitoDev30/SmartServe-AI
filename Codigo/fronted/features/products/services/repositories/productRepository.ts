// repositories/productRepository.ts

import api from '@/db/axios';
import { IProductRepository } from './productRepositoryInterface';

import {
  ProductType,
  ProductFormData,
} from '@/features/products/schemas/productSchema';

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<ProductType[]> {
    const { data } = await api.get('/producto');
    //console.log('ESTA ES LA DATA', data);
    return data;
  }

  async getById(id: string): Promise<ProductType> {
    const { data } = await api.get(`/producto/${id}`);
    console.log('ESTA ES LA DATA DEL PRODUCTO', data);
    return data;
  }

  async create(data: ProductFormData): Promise<any> {
    try {
      const response = await api.post('/producto', data);
      console.log(response);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.log('ERROR EN CREATE:', error?.response?.data);

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
    const { data: updated } = await api.patch(`/producto/${id}`, data);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/producto/${id}`);
  }
}
