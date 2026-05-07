import { PedidoFormValues } from '@/lib/validations/order';
import { Pedido, EstadoPedido } from '../../schemas/orderSchema';

export type UpdatePedidoDTO = Partial<PedidoFormValues>;

export interface OrderRepositoryInterface {
  getAll(): Promise<Pedido[]>;
  getById(id: string): Promise<Pedido>;
  getByEstado(estado: EstadoPedido): Promise<Pedido[]>;
  update(id: string, dto: UpdatePedidoDTO): Promise<Pedido>;
}
