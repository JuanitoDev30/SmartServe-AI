import api from '@/db/axios';
import { Pedido, EstadoPedido } from '../../schemas/orderSchema';
import {
  OrderRepositoryInterface,
  UpdatePedidoDTO,
} from './orderRepositoryInterface';

class OrderRepository implements OrderRepositoryInterface {
  async getAll(): Promise<Pedido[]> {
    const { data } = await api.get('/pedido');
    return data;
  }

  async getById(id: string): Promise<Pedido> {
    const { data } = await api.get(`/pedido/${id}`);
    return data;
  }

  async getByEstado(estado: EstadoPedido): Promise<Pedido[]> {
    const { data } = await api.get('/pedido/estado', {
      params: { estado },
    });
    return data;
  }

  async update(id: string, dto: UpdatePedidoDTO): Promise<Pedido> {
    const { data } = await api.patch(`/pedido/${id}`, dto);
    return data;
  }
}

export const orderRepository = new OrderRepository();
