import api from '@/db/axios';
import { CreateProductDto } from '@/features/products/types/product';

export const productService = {
  async getProducts() {
    try {
      const response = await api.get('/producto');
      return response.data;
    } catch (error) {
      console.error('Error cargando productos:', error);
      return null;
    }
  },

  async create(data: CreateProductDto) {
    try {
      const response = await api.post('/producto', data);
      return response.data;
    } catch (error) {
      console.error('Error creando producto:', error);
      return null;
    }
  },

  async update(id: string, data: Partial<CreateProductDto>) {
    try {
      const response = await api.patch(`/producto/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return null;
    }
  },

  async delete(id: string) {
    try {
      const response = await api.delete(`/producto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return null;
    }
  },

  async getProductById(id: string) {
    try {
      const response = await api.get(`/producto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error cargando producto:', error);
      return null;
    }
  },
};
