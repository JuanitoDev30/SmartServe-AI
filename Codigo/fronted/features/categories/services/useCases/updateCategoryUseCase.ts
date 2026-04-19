import { categoryRepository } from '../repositorys/categoryRepository';
import { CategoryFormData } from '../../schemas/categorySchema';

export const updateCategoryUseCase = {
  async execute(id: string, data: CategoryFormData) {
    try {
      const result = await categoryRepository.update(id, data);
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error updating category'
      };
    }
  }
};