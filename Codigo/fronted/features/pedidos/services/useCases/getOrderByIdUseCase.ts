import { orderRepository } from '../repositories/orderRepository';
import { OrderRepositoryInterface } from '../repositories/orderRepositoryInterface';
import { Pedido } from '../../schemas/orderSchema';

class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(id: string): Promise<Pedido> {
    return this.orderRepository.getById(id);
  }
}

export const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
