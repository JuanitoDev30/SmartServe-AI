import { ReportesDashboard } from '@/features/dashboard/reportes/reportesDashboard';

export const metadata = {
  title: 'Reportes - Dashboard',
  description: 'Genera y visualiza tus reportes en el panel administrativo.',
};

export default function ReportesPage() {
  return <ReportesDashboard />;
}
