import { PerfilPage } from '@/features/dashboard/perfil/perfilPage';
import { getPerfilAction } from '@/features/perfil/actions/getPerfilAction';

export const metadata = {
  title: 'Mi Perfil - Panel Administrativo',
};

export default async function Perfil() {
  const result = await getPerfilAction();

  return (
    <PerfilPage initialData={result.success ? (result.data ?? null) : null} />
  );
}
