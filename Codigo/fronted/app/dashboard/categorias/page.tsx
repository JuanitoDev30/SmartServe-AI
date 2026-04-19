import { getCategoriesAction } from '@/features/categories/actions/getCategoryActions';
import { CategoryDashboard } from '@/features/dashboard/categories';

export default async function CategoriesPage() {
  const result = await getCategoriesAction({ page: 1, pageSize: 100 });
  
  // Asegurar que siempre sea un array, incluso si es undefined
  const categories = result.success && result.data ? result.data : [];

  return <CategoryDashboard categoriesResponse={categories} />;
}