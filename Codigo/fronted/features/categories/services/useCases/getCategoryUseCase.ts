import { categoryRepository } from "../repositorys/categoryRepository";   
import { CategoryRepositoryInterface } from "../repositorys/categotyRepositoryInterface"; 

class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepositoryInterface) {}

  async execute({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) {
    return await this.categoryRepository.getAll({ page, pageSize, search });
  }
}

export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);