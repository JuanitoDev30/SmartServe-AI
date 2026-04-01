import { DashboardLayout } from '@/features/dashboard/dashboardLayout';

export const metadata = {
  title: 'Dashboard - Panel Administrativo',
  description: 'Panel de administracion para gestionar pedidos y analytics',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
