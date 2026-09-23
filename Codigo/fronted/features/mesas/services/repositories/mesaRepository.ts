import { getApiWithAuth } from '@/db/apiWithAuth';

import {
  CreateMesaInput,
  Mesa,
  MesaStats,
  UpdateLayoutInput,
  UpdateMesaInput,
} from '../../schemas/mesaSchema';
import { MesaRepositoryInterface } from './mesaRepositoryInterface';

class MesaRepository implements MesaRepositoryInterface {
  async getAll(soloActivas?: boolean): Promise<Mesa[]> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/mesa', {
      params: soloActivas ? { soloActivas: true } : {},
    });
    return data;
  }

  async getById(id: string): Promise<Mesa> {
    const api = await getApiWithAuth();
    const { data } = await api.get(`/mesa/${id}`);
    return data;
  }

  async getStats(): Promise<MesaStats> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/mesa/stats');
    return data;
  }

  async create(dto: CreateMesaInput): Promise<Mesa> {
    const api = await getApiWithAuth();
    const { data } = await api.post('/mesa', dto);
    return data;
  }

  async update(id: string, dto: UpdateMesaInput): Promise<Mesa> {
    const api = await getApiWithAuth();
    const { data } = await api.patch(`/mesa/${id}`, dto);
    return data;
  }

  async updateLayout(dto: UpdateLayoutInput): Promise<Mesa[]> {
    const api = await getApiWithAuth();
    const { data } = await api.patch('/mesa/layout', dto);
    return data;
  }

  async cambiarDisponibilidad(id: string, activa: boolean): Promise<Mesa> {
    const api = await getApiWithAuth();
    const { data } = await api.patch(
      `/mesa/${id}/${activa ? 'activar' : 'desactivar'}`,
    );
    return data;
  }

  async remove(id: string): Promise<{ mensaje: string }> {
    const api = await getApiWithAuth();
    const { data } = await api.delete(`/mesa/${id}`);
    return data;
  }
}

export const mesaRepository = new MesaRepository();
