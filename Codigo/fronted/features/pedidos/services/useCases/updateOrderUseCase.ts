import { UpdateOrderDTO } from '../repositories/orderRepositoryInterface';
import { OrderRepositoryInterface } from '../repositories/orderRepositoryInterface';
import { orderRepository } from '../repositories/orderRepository';

class UpdateOrderUseCase {
constructor(private readonly orderRepository: OrderRepositoryInterface) {}

async execute(id: string, data: UpdateOrderDTO): Promise<void> {
await this.orderRepository.update(id, data);
}
}

export const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);
