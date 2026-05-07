'use client';
import { getOrderAction } from '@/features/pedidos/actions/getOrderActions';
import { Pedido } from '@/features/pedidos/schemas/orderSchema';
import { usePedidosStore } from '@/store/pedidosStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from './useToast';

let socket: Socket | null = null;

export const usePedidosSocket = () => {
  const { setPedidos, setIsConnected, setIsLoading } = usePedidosStore();

  useEffect(() => {
    if (socket?.connected) {
      return;
    }

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
      console.log('Conectado:', socket?.id);
      setIsConnected(true);
      socket?.emit('suscribir.pedidos');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pedido.nuevo', (pedido: Pedido) => {
      usePedidosStore.getState().agregarPedido(pedido);

      useNotificationStore.getState().addNotification({
        id: crypto.randomUUID(),
        title: 'Nuevo pedido',
        message: `Pedido #${pedido.id.slice(0, 6)} recibido`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'pedido',
      });

      toast({
        title: 'Nuevo pedido recibido',
        description: `${pedido.cliente.nombre} realizó un pedido`,
        duration: 5000,
      });
    });

    socket.on('pedido.actualizado', (pedido: Pedido) => {
      console.log('🔴 pedido.actualizado recibido:', pedido.id);
      usePedidosStore.getState().actualizarPedido(pedido);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);
};
