import { CreateOrderDTO } from '../services/repositories/orderRepositoryInterface';
import { createOrderUseCase } from '../services/useCases/createOrderUseCase';

export async function createOrderAction(data: CreateOrderDTO) {
  try {
    const result = await createOrderUseCase.execute(data);

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creando pedido';
    return {
      success: false,
      error: message,
    };
  }
}
