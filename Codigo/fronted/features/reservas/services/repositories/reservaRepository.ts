import { getApiWithAuth } from '@/db/apiWithAuth';

import {
  CreateReservaInput,
  Disponibilidad,
  DisponibilidadQuery,
  EstadoReserva,
  Reserva,
  ReservaFilters,
  ReservaStats,
  UpdateReservaInput,
} from '../../schemas/reservaSchema';
import { ReservaRepositoryInterface } from './reservaRepositoryInterface';

class ReservaRepository implements ReservaRepositoryInterface {
  async getAll(filters: ReservaFilters = {}): Promise<Reserva[]> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reserva', { params: filters });
    return data;
  }

  async getAgenda(fecha?: string): Promise<Reserva[]> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reserva/agenda', {
      params: fecha ? { fecha } : {},
    });
    return data;
  }

  async getProximas(): Promise<Reserva[]> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reserva/proximas');
    return data;
  }

  async getById(id: string): Promise<Reserva> {
    const api = await getApiWithAuth();
    const { data } = await api.get(`/reserva/${id}`);
    return data;
  }

  async getByCliente(clienteId: string): Promise<Reserva[]> {
    const api = await getApiWithAuth();
    const { data } = await api.get(`/reserva/cliente/${clienteId}`);
    return data;
  }

  async getStats(): Promise<ReservaStats> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reserva/stats');
    return data;
  }

  async getDisponibilidad(query: DisponibilidadQuery): Promise<Disponibilidad> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/reserva/disponibilidad', {
      params: query,
    });
    return data;
  }

  async create(dto: CreateReservaInput): Promise<Reserva> {
    const api = await getApiWithAuth();
    const { data } = await api.post('/reserva', dto);
    return data;
  }

  async update(id: string, dto: UpdateReservaInput): Promise<Reserva> {
    const api = await getApiWithAuth();
    const { data } = await api.patch(`/reserva/${id}`, dto);
    return data;
  }

  async cambiarEstado(
    id: string,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ): Promise<Reserva> {
    const api = await getApiWithAuth();
    const { data } = await api.patch(`/reserva/${id}/estado`, {
      estado,
      ...(motivoCancelacion ? { motivoCancelacion } : {}),
    });
    return data;
  }

  async remove(id: string): Promise<{ mensaje: string }> {
    const api = await getApiWithAuth();
    const { data } = await api.delete(`/reserva/${id}`);
    return data;
  }
}

export const reservaRepository = new ReservaRepository();
