import { getProductsUseCase } from '@/features/productos/services/useCases/getProductUseCase';

interface ProductsActionsProps {
  page: number;
  pageSize: number;
  search?: string;
}

export async function getProductsAction({
  page,
  pageSize,
  search,
}: ProductsActionsProps) {
  return await getProductsUseCase.execute({ page, pageSize, search });
}
