import { AxiosError } from 'axios';
import { getPerfilUseCase } from '../services/useCases/getPerfilUseCase';

export async function getPerfilAction() {
  try {
    const data = await getPerfilUseCase.execute();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al obtener perfil')
        : 'Error al obtener perfil';
    return { success: false, error: message };
  }
}
