import { create } from 'zustand';
import { Pedido } from '@/features/pedidos/schemas/orderSchema';

interface PedidosStore {
  pedidos: Pedido[];
  isConnected: boolean;
  isLoading: boolean;
  setPedidos: (pedidos: Pedido[]) => void;
  agregarPedido: (pedido: Pedido) => void;
  actualizarPedido: (pedido: Pedido) => void;
  setIsConnected: (connected: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const usePedidosStore = create<PedidosStore>(set => ({
  pedidos: [],
  isConnected: false,
  isLoading: false,

  setPedidos: pedidos => set({ pedidos }),
  agregarPedido: pedido =>
    set(state => ({ pedidos: [...state.pedidos, pedido] })),
  actualizarPedido: pedidoActualizado =>
    set(state => {
      console.log('🟡 actualizarPedido llamado:', pedidoActualizado.id); // 👈
      return {
        pedidos: state.pedidos.map(pedido =>
          pedido.id === pedidoActualizado.id ? pedidoActualizado : pedido,
        ),
      };
    }),
  setIsConnected: connected => set({ isConnected: connected }),
  setIsLoading: loading => set({ isLoading: loading }),
}));
