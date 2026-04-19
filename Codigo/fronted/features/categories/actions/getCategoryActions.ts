'use server';
import { getCategoriesUseCase } from '../services/useCases/getCategoryUseCase';

interface GetCategoriesActionsProps {
  page: number;
  pageSize: number;
  search?: string;
}

export async function getCategoriesAction({ page, pageSize, search }: GetCategoriesActionsProps) {
  return await getCategoriesUseCase.execute({ page, pageSize, search });
}