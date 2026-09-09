import { getMesasAction } from '@/features/mesas/actions/getMesasActions';
import { ReservasDashboard } from '@/features/dashboard/Reservas/reservasDashboard';

export const metadata = {
  title: 'Reservas - Dashboard',
  description: 'Agenda de reservas y ocupación del salón',
};

export default async function ReservasPage() {
  const mesasResult = await getMesasAction();

  return <ReservasDashboard mesas={mesasResult.data ?? []} />;
}
