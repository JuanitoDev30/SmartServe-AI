import { Perfil } from '@/features/perfil/schemas/perfilSchema';
import { create } from 'zustand';

interface PerfilStore {
  perfil: Perfil | null;
  setPerfil: (perfil: Perfil) => void;
  updatePerfil: (data: Partial<Perfil>) => void;
  clearPerfil: () => void;
}

export const usePerfilStore = create<PerfilStore>(set => ({
  perfil: null,

  setPerfil: perfil => set({ perfil }),

  updatePerfil: data =>
    set(state => ({
      perfil: state.perfil ? { ...state.perfil, ...data } : null,
    })),

  clearPerfil: () => set({ perfil: null }),
}));
