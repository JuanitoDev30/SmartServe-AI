import { AxiosError } from 'axios';
import { updatePerfilUseCase } from '../services/useCases/updatePerfilUseCase';
import { UpdatePerfilInput } from '../schemas/perfilSchema';

export async function updatePerfilAction(dto: UpdatePerfilInput) {
  try {
    const data = await updatePerfilUseCase.execute(dto);
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al actualizar perfil')
        : 'Error al actualizar perfil';
    return { success: false, error: message };
  }
}
