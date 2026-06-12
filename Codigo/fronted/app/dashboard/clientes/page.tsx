import {
  getClientsActions,
  getClienteStatsAction,
} from '@/features/clientes/actions/getClientsActions';
import { ClienteFilters } from '@/features/clientes/schemas/clientSchema';
import { ClientesTable } from '@/features/dashboard/clientes/clientesTable';

interface ClientesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    estado?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export const metadata = {
  title: 'Clientes - Dashboard',
  descripcion: 'Gestiona y visualiza todos los clientes',
};

export default async function ClientesPage({
  searchParams,
}: ClientesPageProps) {
  const params = await searchParams;

  const filters: ClienteFilters = {
    page: params.page ? parseInt(params.page) : 1,
    limit: params.pageSize ? parseInt(params.pageSize) : 10,
    search: params.search ?? '',
    estado: params.estado as ClienteFilters['estado'],
    sortBy: (params.sortBy as ClienteFilters['sortBy']) ?? 'creadoEn',
    sortOrder: (params.sortOrder as ClienteFilters['sortOrder']) ?? 'desc',
  };

  const [clientesResult, statsResult] = await Promise.all([
    getClientsActions(filters),
    getClienteStatsAction(),
  ]);

  return (
    <ClientesTable
      initialData={
        clientesResult.success ? (clientesResult.data ?? null) : null
      }
      initialStats={statsResult.success ? (statsResult.data ?? null) : null}
      initialFilters={filters}
    />
  );
}
