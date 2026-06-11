'use client';

import { PerfilAvatar } from '@/components/perfil/perfilAvatar';
import { PerfilInfoForm } from '@/components/perfil/perfilInfoForm';
import { PerfilPasswordForm } from '@/components/perfil/perfilPasswordForm';
import type { Perfil } from '@/features/perfil/schemas/perfilSchema';
import { usePerfilStore } from '@/store/perfilStore';

interface PerfilPageProps {
  initialData: Perfil | null;
}

export function PerfilPage({ initialData }: PerfilPageProps) {
  const perfil = usePerfilStore(state => state.perfil);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra tu información personal y seguridad
        </p>
      </div>

      <PerfilAvatar perfil={perfil ?? initialData} />
      <PerfilInfoForm initialData={initialData} />
      <PerfilPasswordForm />
    </div>
  );
}
