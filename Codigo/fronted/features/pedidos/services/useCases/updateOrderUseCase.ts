import { orderRepository } from '../repositories/orderRepository';
import {
  OrderRepositoryInterface,
  UpdatePedidoDTO,
} from '../repositories/orderRepositoryInterface';
import { Pedido } from '../../schemas/orderSchema';

class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(id: string, dto: UpdatePedidoDTO): Promise<Pedido> {
    return this.orderRepository.update(id, dto);
  }
}

export const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);
