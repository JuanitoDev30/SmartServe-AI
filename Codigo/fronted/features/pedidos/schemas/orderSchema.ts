export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  nombre: string;
  cantidad: number;
  subTotal: number;
  total: number;
}

export interface Order {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioTelefono?: string;
  items: OrderItem[];
  estado: OrderStatus;
  direccion: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  metodoPago: string;
  notas?: string;
}
