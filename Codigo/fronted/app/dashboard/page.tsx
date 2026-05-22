import { auth } from '@/auth';
import { DashboardOverview } from '@/features/dashboard/dashboardOverview';
import { getOverviewAction } from '@/features/overView/actions/getOverViewActions';

export const metadata = {
  title: 'Overview - Panel Administrativo',
  description: 'Vista general del negocio',
};
export default async function DashboardPage() {
  const [result, session] = await Promise.all([getOverviewAction(), auth()]);

  return (
    <DashboardOverview
      initialData={result.success ? (result.data ?? null) : null}
      userName={session?.user?.name ?? null}
    />
  );
}
