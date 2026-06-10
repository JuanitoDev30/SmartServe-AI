import { create } from 'zustand';

interface AuthStore {
  sessionExpired: boolean;
  setSessionExpired: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  sessionExpired: false,
  setSessionExpired: value => set({ sessionExpired: value }),
}));
