import { getMesasAction } from '@/features/mesas/actions/getMesasActions';
import { MesasDashboard } from '@/features/dashboard/Mesas/mesasDashboard';

export const metadata = {
  title: 'Mesas - Dashboard',
  description: 'Configuración de las mesas del salón',
};

export default async function MesasPage() {
  const mesasResult = await getMesasAction();

  return <MesasDashboard mesas={mesasResult.data ?? []} />;
}
