import {
  ChangePasswordInput,
  Perfil,
  UpdatePerfilInput,
} from '../../schemas/perfilSchema';

export interface PerfilRepositoryInterface {
  getPerfil(): Promise<Perfil>;
  updatePerfil(data: UpdatePerfilInput): Promise<Perfil>;
  changePassword(data: ChangePasswordInput): Promise<void>;
}
