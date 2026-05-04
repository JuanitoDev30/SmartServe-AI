import { Pedido } from '../../schemas/orderSchema';
import { orderRepository } from '../repositories/orderRepository';
import { OrderRepositoryInterface } from '../repositories/orderRepositoryInterface';

class GetOrderUseCase {
  constructor(private readonly orderRepositoy: OrderRepositoryInterface) {}

  async execute(): Promise<Pedido[]> {
    return this.orderRepositoy.getAll();
  }
}

export const getOrderUseCase = new GetOrderUseCase(orderRepository);
