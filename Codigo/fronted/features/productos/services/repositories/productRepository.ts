// repositories/productRepository.ts

import { getApiWithAuth } from '@/db/apiWithAuth';
import { IProductRepository } from './productRepositoryInterface';

import {
  ProductType,
  ProductFormData,
} from '@/features/productos/schemas/productSchema';
import { ImportProductsResponse } from '../../types/importProduct';

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
    try {
      console.log('REQUEST PARAMS', {
        page,
        pageSize,
        search,
      });

      const api = await getApiWithAuth();
      const { data } = await api.get('/producto', {
        params: {
          page,
          pageSize,
          search,
        },
      });

      return data;
    } catch (error: any) {
      console.log('BACKEND ERROR:', error?.response?.data);

      throw error;
    }
  }

  async getById(id: string): Promise<ProductType> {
    const api = await getApiWithAuth();
    const { data } = await api.get(`/producto/${id}`);
    // console.log('ESTA ES LA DATA DEL PRODUCTO', data);
    return data;
  }

  async create(
    data: ProductFormData,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const api = await getApiWithAuth();
      const response = await api.post('/producto', data);

      //console.log(response);

      // if (!response.data) {
      //   return {
      //     success: false,
      //     error: response.data.error || 'Error creando producto',
      //   };
      // }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      //console.log('ERROR EN CREATE:', error?.response?.data);
      // console.log(error?.response?.data?.message);
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
      const api = await getApiWithAuth();
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
    const api = await getApiWithAuth();
    await api.delete(`/producto/${id}`);
  }

  async bulkImport(formData: FormData): Promise<ImportProductsResponse> {
    const api = await getApiWithAuth();

    const { data } = await api.post('/producto/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  }
}

export const productRepository = new ProductRepository();
