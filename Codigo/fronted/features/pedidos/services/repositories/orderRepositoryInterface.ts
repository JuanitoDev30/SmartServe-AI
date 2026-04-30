import { Order, OrderItem, OrderStatus } from '../../schemas/orderSchema';

export type CreateOrderDTO = {
  usuarioId: string;
  direccion: string;
  metodoPago: string;
  items: OrderItem[];
  notas?: string;
};

export type UpdateOrderDTO = {
  estado?: OrderStatus;
  direccion?: string;
  notas?: string;
};

export interface OrderRepositoryInterface {
  create(data: CreateOrderDTO): Promise<{ success: boolean; data?: Order; error?: string }>;
  getAll(params: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<Order[]>;
  update(id: string, data: UpdateOrderDTO): Promise<Order>;
}
