import { updateOrderUseCase } from "../services/useCases/updateOrderUseCase";
import { UpdateOrderDTO } from "../services/repositories/orderRepositoryInterface";

export async function updateOrderAction(
  id: string,
  data: UpdateOrderDTO,
) {
  try {
    await updateOrderUseCase.execute(id, data);

    return {
      success: true,
      data: null,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar el pedido";

    return {
      success: false,
      error: message,
    };
  }
}

