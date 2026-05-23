import { perfilRepository } from '../repositories/perfilRepository';
import { ChangePasswordInput } from '../../schemas/perfilSchema';

class ChangePasswordUseCase {
  async execute(data: ChangePasswordInput) {
    return perfilRepository.changePassword(data);
  }
}
export const changePasswordUseCase = new ChangePasswordUseCase();
