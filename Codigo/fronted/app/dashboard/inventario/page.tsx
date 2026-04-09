import { InventoryDashboard } from '@/features/dashboard/inventory/inventoryDashboard';
import { getProductsAction } from '@/features/products/actions/getProductActions';

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
  const getProducts = await getProductsAction({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  });

  return <InventoryDashboard productsResponse={getProducts} />;
}
