import api from '@/db/axios';
import {
  CreateOrderDTO,
  OrderRepositoryInterface,
  UpdateOrderDTO,
} from './orderRepositoryInterface';
import { Order } from '../../schemas/orderSchema';

class OrderRepository implements OrderRepositoryInterface {
  async create(
    data: CreateOrderDTO,
  ): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const response = await api.post('/pedido', data);
      return { success: true, data: response.data };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      return {
        success: false,
        error:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Error creando pedido',
      };
    }
  }

  async getAll({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }): Promise<Order[]> {
    const { data } = await api.get('/pedido', {
      params: {
        page,
        pageSize,
        search,
      },
    });

    return data;
  }

  async update(id: string, data: UpdateOrderDTO): Promise<Order> {
    const { data: response } = await api.patch(`/pedido/${id}`, data);
    return response;
  }
}

export const orderRepository = new OrderRepository();
