'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePedidosStore } from '@/store/pedidosStore';
import { useNotificationStore } from '@/store/notificationStore';
import { getOrderAction } from '@/features/pedidos/actions/getOrderActions';
import { Pedido } from '@/features/pedidos/schemas/orderSchema';

let socket: Socket | null = null;

export function PedidosSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setPedidos, setIsConnected, setIsLoading } = usePedidosStore();

  useEffect(() => {
    if (socket?.connected) return;

    const cargarPedidos = async () => {
      setIsLoading(true);
      try {
        const result = await getOrderAction();
        if (result.success && result.data) {
          setPedidos(result.data);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPedidos();

    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket?.emit('suscribir.pedidos');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pedido.nuevo', (pedido: Pedido) => {
      usePedidosStore.getState().agregarPedido(pedido);

      useNotificationStore.getState().addNotification({
        id: pedido.id,
        title: '🛍️ Nuevo pedido',
        message: `${pedido.cliente.nombre} realizó un pedido por ${pedido.total}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'pedido',
      });
    });

    socket.on('pedido.actualizado', (pedido: Pedido) => {
      usePedidosStore.getState().actualizarPedido(pedido);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  return <>{children}</>;
}
