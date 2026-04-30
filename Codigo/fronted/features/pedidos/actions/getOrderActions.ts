import { getOrderUseCase } from "../services/useCases/getOrderUseCase";

export async function getOrderAction({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  try {
    const result = await getOrderUseCase.execute({ page, pageSize, search });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al obtener pedidos";

    return {
      success: false,
      error: message,
    };
  }
}

