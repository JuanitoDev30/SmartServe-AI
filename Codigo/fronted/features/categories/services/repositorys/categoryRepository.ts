import api from '@/db/axios';
import { CategoryType, CategoryFormData } from '../../schemas/categorySchema';

interface CategoriesActionsProps {
  page: number;
  pageSize: number;
  search?: string;
}

class CategoryRepository {
  async getAll({ page, pageSize, search }: CategoriesActionsProps): Promise<CategoryType[]> {
    const { data } = await api.get('/categoria', {
      params: { page, pageSize, search }
    });
    return data;
  }

  async getById(id: string): Promise<CategoryType> {
    const { data } = await api.get(`/categoria/${id}`);
    return data;
  }

  async create(data: CategoryFormData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await api.post('/categoria', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Error creando categoría'
      };
    }
  }

  async update(id: string, data: CategoryFormData): Promise<any> {
    try {
      const response = await api.patch(`/categoria/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Error actualizando categoría';
      throw new Error(message);
    }
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/categoria/${id}`);
  }
}

export const categoryRepository = new CategoryRepository();