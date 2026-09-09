'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { useReservasStore } from '@/store/reservasStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Reserva } from '@/features/reservas/schemas/reservaSchema';
import { formatHora } from '@/features/reservas/utils/fechas';

let socket: Socket | null = null;

/**
 * Mantiene viva la conexión de reservas en todo el dashboard: la agenda
 * carga el día seleccionado y el socket la mantiene sincronizada, además
 * de avisar de las reservas que entran por el agente.
 */
export function ReservasSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setIsConnected = useReservasStore(state => state.setIsConnected);

  useEffect(() => {
    if (socket?.connected) return;

    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/reservas`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket?.emit('suscribir.reservas');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('reserva.nueva', (reserva: Reserva) => {
      useReservasStore.getState().agregarReserva(reserva);

      useNotificationStore.getState().addNotification({
        id: reserva.id,
        title: '📅 Nueva reserva',
        message: `${reserva.cliente.nombre} · mesa ${reserva.mesa.numero} · ${formatHora(
          reserva.fechaHora,
        )} · ${reserva.numeroPersonas} personas`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'reserva',
      });
    });

    socket.on('reserva.actualizada', (reserva: Reserva) => {
      useReservasStore.getState().actualizarReserva(reserva);
    });

    socket.on('reserva.eliminada', ({ id }: { id: string }) => {
      useReservasStore.getState().eliminarReserva(id);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [setIsConnected]);

  return <>{children}</>;
}
