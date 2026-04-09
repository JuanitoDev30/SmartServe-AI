// repositories/productRepository.ts

import api from '@/db/axios';
import { IProductRepository } from './productRepositoryInterface';

import {
  ProductType,
  ProductFormData,
} from '@/features/products/schemas/productSchema';

interface ProductsActionsProps {
  page: number;
  pageSize: number;
  search?: string;
}

class ProductRepository implements IProductRepository {
  async getAll({
    page,
    pageSize,
    search,
  }: ProductsActionsProps): Promise<ProductType[]> {
    const { data } = await api.get('/producto', {
      params: {
        page,
        pageSize,
        search,
      },
    });

    return data;
  }

  async getById(id: string): Promise<ProductType> {
    const { data } = await api.get(`/producto/${id}`);
    console.log('ESTA ES LA DATA DEL PRODUCTO', data);
    return data;
  }

  async create(data: ProductFormData): Promise<any> {
    try {
      const response = await api.post<{
        success: boolean;
        data: any;
        error: string | null;
      }>('/producto', data);
      console.log(response);

      if (!response.data.success) {
        return {
          success: false,
          error: response.data.error || 'Error creando producto',
        };
      }

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

  async update(id: string, data: ProductFormData): Promise<any> {
    try {
      const response = await api.patch(`/producto/${id}`, data);
      return response.data;
    } catch (error: any) {
      // Lanzar error con el mensaje real del backend
      const message =
        error?.response?.data?.message ||
        error.message ||
        'Error actualizando producto';
      throw new Error(message);
    }
  }
  async delete(id: string): Promise<void> {
    await api.delete(`/producto/${id}`);
  }
}

export const productRepository = new ProductRepository();
