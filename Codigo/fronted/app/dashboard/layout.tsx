import { auth } from '@/auth';
import { DashboardLayout } from '@/features/dashboard/dashboardLayout';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Dashboard - Panel Administrativo',
  description: 'Panel de administracion para gestionar pedidos y analytics',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}
