import { create } from 'zustand';
import { Reserva } from '@/features/reservas/schemas/reservaSchema';

interface ReservasStore {
  reservas: Reserva[];
  isConnected: boolean;
  isLoading: boolean;
  setReservas: (reservas: Reserva[]) => void;
  agregarReserva: (reserva: Reserva) => void;
  actualizarReserva: (reserva: Reserva) => void;
  eliminarReserva: (id: string) => void;
  setIsConnected: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useReservasStore = create<ReservasStore>(set => ({
  reservas: [],
  isConnected: false,
  isLoading: false,

  setReservas: reservas => set({ reservas }),

  agregarReserva: reserva =>
    set(state =>
      // El socket puede reenviar una reserva ya cargada por la agenda
      state.reservas.some(actual => actual.id === reserva.id)
        ? state
        : { reservas: [...state.reservas, reserva] },
    ),

  actualizarReserva: reservaActualizada =>
    set(state => ({
      reservas: state.reservas.map(reserva =>
        reserva.id === reservaActualizada.id ? reservaActualizada : reserva,
      ),
    })),

  eliminarReserva: id =>
    set(state => ({
      reservas: state.reservas.filter(reserva => reserva.id !== id),
    })),

  setIsConnected: connected => set({ isConnected: connected }),
  setIsLoading: loading => set({ isLoading: loading }),
}));
