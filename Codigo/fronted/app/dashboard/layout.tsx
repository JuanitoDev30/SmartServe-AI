// app/dashboard/layout.tsx
import { auth } from '@/auth';
import { DashboardLayout } from '@/features/dashboard/dashboardLayout';
import { getPerfilAction } from '@/features/perfil/actions/getPerfilAction';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, perfilResult] = await Promise.all([
    auth(),
    getPerfilAction(),
  ]);

  if (!session?.user) redirect('/login');

  return (
    <DashboardLayout
      user={session.user}
      initialPerfil={perfilResult.success ? (perfilResult.data ?? null) : null}
    >
      {children}
    </DashboardLayout>
  );
}
