import { getApiWithAuth } from '@/db/apiWithAuth';
import {
  Perfil,
  UpdatePerfilInput,
  ChangePasswordInput,
} from '../../schemas/perfilSchema';
import { PerfilRepositoryInterface } from './perfilRepositoryInterface';

class PerfilRepository implements PerfilRepositoryInterface {
  async getPerfil(): Promise<Perfil> {
    const api = await getApiWithAuth();
    const { data } = await api.get('/administrador/perfil');
    return data;
  }

  async updatePerfil(dto: UpdatePerfilInput): Promise<Perfil> {
    const api = await getApiWithAuth();
    const { data } = await api.patch('/administrador/perfil', dto);
    return data;
  }

  async changePassword(dto: ChangePasswordInput): Promise<void> {
    const api = await getApiWithAuth();
    await api.patch('/administrador/perfil/password', dto);
  }
}

export const perfilRepository = new PerfilRepository();
