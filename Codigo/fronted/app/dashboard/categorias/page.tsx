import { getCategoriesAction } from '@/features/categories/actions/getCategoryActions';
import { CategoryDashboard } from '@/features/dashboard/categories';

interface CategoriesPageProps {
  searchParams: Promise<{
    page: number;
    pageSize: number;
    search: string;
  }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const categories = await getCategoriesAction({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  });

  return <CategoryDashboard categoriesResponse={categories} />;
}
