import { categoryRepository } from '../repositorys/categoryRepository';
import { CategoryFormData } from '../../schemas/categorySchema';

export const createCategoryUseCase = {
  async execute(data: CategoryFormData) {
    try {
      const result = await categoryRepository.create(data);
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error creating category'
      };
    }
  }
};