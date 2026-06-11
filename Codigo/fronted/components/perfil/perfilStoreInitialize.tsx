// src/features/perfil/components/PerfilStoreInitializer.tsx
'use client';

import { Perfil } from '@/features/perfil/schemas/perfilSchema';
import { usePerfilStore } from '@/store/perfilStore';
import { useEffect } from 'react';

interface Props {
  perfil: Perfil;
}

export function PerfilStoreInitializer({ perfil }: Props) {
  const setPerfil = usePerfilStore(state => state.setPerfil);

  useEffect(() => {
    setPerfil(perfil);
  }, []);

  return null;
}
