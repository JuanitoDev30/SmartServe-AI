import { getCategoriesAction } from '@/features/categories/actions/getCategoryActions';
import { getProductsAction } from '@/features/productos/actions/getProductActions';
import { CategoryDashboard } from '@/features/dashboard/categories';

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;

  const [categories, products] = await Promise.all([
    getCategoriesAction({
      page: Number(params.page ?? 1),
      pageSize: Number(params.pageSize ?? 20),
    }),

    getProductsAction({
      page: 1,
      pageSize: 100,
    }),
  ]);

  return (
    <CategoryDashboard
      categoriesResponse={categories}
      productsResponse={products}
    />
  );
}
