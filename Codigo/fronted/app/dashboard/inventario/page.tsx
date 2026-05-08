import { getCategoriesAction } from '@/features/categories/actions/getCategoryActions';
import { InventoryDashboard } from '@/features/dashboard/inventory/inventoryDashboard';
import { getProductsAction } from '@/features/productos/actions/getProductActions';

interface InventoryPageProps {
  searchParams: Promise<{
    page: number;
    pageSize: number;
    search: string;
  }>;
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    await getProductsAction({
      page: params.page,
      pageSize: params.pageSize,
    }),
    await getCategoriesAction({
      page: 1,
      pageSize: 100,
    }),
  ]);

  console.log(products, categories);

  return (
    <InventoryDashboard
      productsResponse={products}
      categoriesResponse={categories}
    />
  );
}
