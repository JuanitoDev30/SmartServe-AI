import { orderRepository } from '../repositories/orderRepository';
import { OrderRepositoryInterface } from '../repositories/orderRepositoryInterface';

class GetOrderUseCase {
constructor(private readonly orderRepository: OrderRepositoryInterface) {}

async execute({
page,
pageSize,
search,
}: {
page: number;
pageSize: number;
search?: string;
}) {
return await this.orderRepository.getAll({ page, pageSize, search });
}
}

export const getOrderUseCase = new GetOrderUseCase(orderRepository);
