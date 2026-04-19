import { categoryRepository } from '../repositorys/categoryRepository';

interface GetCategoriesProps {
  page: number;
  pageSize: number;
  search?: string;
}

export const getCategoriesUseCase = {
  async execute({ page, pageSize, search }: GetCategoriesProps) {
    try {
      const categories = await categoryRepository.getAll({ page, pageSize, search });
      return {
        success: true,
        data: categories
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error fetching categories'
      };
    }
  }
};