import { AxiosError } from 'axios';
import { ChangePasswordInput } from '../schemas/perfilSchema';
import { changePasswordUseCase } from '../services/useCases/changePasswordUseCase';

export async function changePasswordAction(dto: ChangePasswordInput) {
  try {
    await changePasswordUseCase.execute(dto);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? 'Error al cambiar contraseña')
        : 'Error al cambiar contraseña';
    return { success: false, error: message };
  }
}
