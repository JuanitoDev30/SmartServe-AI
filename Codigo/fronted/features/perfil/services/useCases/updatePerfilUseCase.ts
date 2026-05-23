import { perfilRepository } from '../repositories/perfilRepository';
import { UpdatePerfilInput } from '../../schemas/perfilSchema';

class UpdatePerfilUseCase {
  async execute(data: UpdatePerfilInput) {
    return perfilRepository.updatePerfil(data);
  }
}
export const updatePerfilUseCase = new UpdatePerfilUseCase();
