import { CategoryFormData, CategoryType } from '../../schemas/categorySchema';

export interface CategoryRepositoryInterface {
  getAll({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<CategoryType[]>;
  getById(id: string): Promise<CategoryType>;
  create(
    data: CategoryFormData,
  ): Promise<{ success: boolean; data?: any; error?: string }>;
  update(id: string, data: CategoryFormData): Promise<CategoryType>;
  delete(id: string): Promise<void>;
}
