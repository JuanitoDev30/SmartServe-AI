import { categoryRepository } from '../repositorys/categoryRepository';
import { CategoryFormData } from '../../schemas/categorySchema';
import { CategoryRepositoryInterface } from '../repositorys/categotyRepositoryInterface';

class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async execute(data: CategoryFormData): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.categoryRepository.create(data);
  }
}

export const createCategoryUseCase = new CreateCategoryUseCase(
  categoryRepository,
);
