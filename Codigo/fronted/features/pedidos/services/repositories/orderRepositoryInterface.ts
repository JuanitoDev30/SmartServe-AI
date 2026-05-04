// features/dashboard/pedidos/services/repositories/orderRepositoryInterface.ts
import { Pedido, EstadoPedido } from '../../schemas/orderSchema';

export interface UpdatePedidoDTO {
  estado?: EstadoPedido;
  direccion?: string;
  notas?: string;
}

export interface OrderRepositoryInterface {
  getAll(): Promise<Pedido[]>;
  getById(id: string): Promise<Pedido>;
  getByEstado(estado: EstadoPedido): Promise<Pedido[]>;
  update(id: string, dto: UpdatePedidoDTO): Promise<Pedido>;
}
