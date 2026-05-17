import { ClienteRepositoryInterface } from './clientRepositoryInterface';
import api from '@/db/axios';
import {
  Cliente,
  CreateClienteInput,
  UpdateClienteInput,
  ClienteFilters,
  PaginatedClientes,
  ClienteStats,
} from '../../schemas/clientSchema';

class ClienteRepository implements ClienteRepositoryInterface {
  async getAll(filters: ClienteFilters): Promise<PaginatedClientes> {
    const { limit, ...rest } = filters;
    const { data } = await api.get('/cliente', {
      params: { ...rest, pageSize: limit },
    });
    return data;
  }

  async getById(id: string): Promise<Cliente> {
    const { data } = await api.get(`/cliente/${id}`);
    return data;
  }

  async getStats(): Promise<ClienteStats> {
    const { data } = await api.get('/cliente/stats');
    return data;
  }

  async create(data: CreateClienteInput): Promise<Cliente> {
    const { data: createdCliente } = await api.post('/cliente', data);
    return createdCliente;
  }

  async update(id: string, data: UpdateClienteInput): Promise<Cliente> {
    const { data: updatedCliente } = await api.patch(`/cliente/${id}`, data);
    return updatedCliente;
  }

  async desactivar(id: string): Promise<Cliente> {
    const { data } = await api.patch(`/cliente/${id}/desactivar`);
    return data;
  }
}

export const clientRepository = new ClienteRepository();
