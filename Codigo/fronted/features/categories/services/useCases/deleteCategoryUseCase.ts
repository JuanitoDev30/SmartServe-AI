import { categoryRepository } from '../repositorys/categoryRepository';

export const deleteCategoryUseCase = {
  async execute(id: string) {
    try {
      await categoryRepository.delete(id);
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error deleting category'
      };
    }
  }
};