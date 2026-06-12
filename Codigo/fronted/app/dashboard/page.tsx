import { auth } from '@/auth';
import { DashboardOverview } from '@/features/dashboard/dashboardOverview';
import { getOverviewAction } from '@/features/overView/actions/getOverViewActions';
import { getGraficaVentasAction } from '@/features/ventas/actions/getGraficaVentasActions';
import { getTopProductosAction } from '@/features/ventas/actions/getTopProductosVentasActions';

export const metadata = {
  title: 'Vista General - Dashboard',
  description: 'Vista general del negocio',
};

export default async function DashboardPage() {
  const [result, graficaResult, topProductosResult, session] =
    await Promise.all([
      getOverviewAction(),
      getGraficaVentasAction('semana'),
      getTopProductosAction(5, 'mes'),
      auth(),
    ]);

  return (
    <DashboardOverview
      initialData={result.success ? (result.data ?? null) : null}
      initialGrafica={
        graficaResult.success ? (graficaResult.data ?? null) : null
      }
      initialTopProductos={
        topProductosResult.success ? (topProductosResult.data ?? null) : null
      }
      userName={session?.user?.name ?? null}
    />
  );
}
