// features/dashboard/pedidos/schemas/orderSchema.ts
export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'PSE';

export interface PedidoItem {
  id: string;
  cantidad: number;
  precioUnitario: number;
  subtotalItem: number;
  producto: {
    id: string;
    nombre: string;
    precio: number;
  };
}

export interface Pedido {
  id: string;
  estado: EstadoPedido;
  subTotal: number;
  total: number;
  direccion: string;
  metodoPago: MetodoPago;
  notas?: string;
  items: PedidoItem[];
  cliente: {
    id: string;
    nombre: string;
    telefono: string;
    email?: string;
  };
  creadoEn: string;
  actualizadoEn: string;
}
