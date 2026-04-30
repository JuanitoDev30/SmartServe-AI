import { CreateOrderDTO } from '../repositories/orderRepositoryInterface';
import { OrderRepositoryInterface } from '../repositories/orderRepositoryInterface';
import { orderRepository } from '../repositories/orderRepository';
import { Order } from '../../schemas/orderSchema';

class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(data: CreateOrderDTO): Promise<{
    success: boolean;
    data?: Order;
    error?: string;
  }> {
    return await this.orderRepository.create(data);
  }
}

export const createOrderUseCase = new CreateOrderUseCase(orderRepository);
