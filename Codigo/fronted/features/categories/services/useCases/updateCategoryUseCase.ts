import { categoryRepository } from '../repositorys/categoryRepository';
import { CategoryRepositoryInterface } from '../repositorys/categotyRepositoryInterface';
import { CategoryFormData } from '../../schemas/categorySchema';

class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepositoryInterface) {}

  async execute(id: string, data: CategoryFormData): Promise<void> {
    await this.categoryRepository.update(id, data);
  }
}

export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);