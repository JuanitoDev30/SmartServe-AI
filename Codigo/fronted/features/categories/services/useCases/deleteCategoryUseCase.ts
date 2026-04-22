import { categoryRepository } from '../repositorys/categoryRepository';
import { CategoryRepositoryInterface } from '../repositorys/categotyRepositoryInterface';

class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}

export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);