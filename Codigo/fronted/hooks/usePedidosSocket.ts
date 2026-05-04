'use client';
import { getOrderAction } from '@/features/pedidos/actions/getOrderActions';
import { Pedido } from '@/features/pedidos/schemas/orderSchema';
import { usePedidosStore } from '@/store/pedidosStore';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const usePedidosSocket = () => {
  const {
    pedidos,
    isConnected,
    isLoading,
    setPedidos,
    agregarPedido,
    actualizarPedido,
    setIsConnected,
    setIsLoading,
  } = usePedidosStore();

  useEffect(() => {
    // Cargar pedidos existentes

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

    // Conectar WebSocket

    socket = io(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Conectado al WebSocket de pedidos');
      setIsConnected(true);
      socket?.emit('suscribir.pedidos');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del WebSocket de pedidos');
      setIsConnected(false);
    });

    socket.on('pedido.nuevo', (pedido: Pedido) => {
      console.log('Nuevo pedido recibido:', pedido);
      agregarPedido(pedido);
    });

    socket.on('pedido.actualizado', (pedido: Pedido) => {
      console.log('Pedido actualizado recibido:', pedido);
      actualizarPedido(pedido);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  return { pedidos, isConnected, isLoading };
};
