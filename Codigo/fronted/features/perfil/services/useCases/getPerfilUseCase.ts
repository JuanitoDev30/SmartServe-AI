import { perfilRepository } from '../repositories/perfilRepository';

class GetPerfilUseCase {
  async execute() {
    return perfilRepository.getPerfil();
  }
}
export const getPerfilUseCase = new GetPerfilUseCase();
