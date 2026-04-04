import {
  IUserRepository,
  usersRepository,
} from '../repositories/users-repository';

class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {
    // Aquí podrías inyectar dependencias si es necesario
  }

  async execute(): Promise<string[]> {
    // Aquí iría la lógica para obtener los usuarios, por ejemplo, una llamada a una API
    return await this.userRepository.getUserList();
  }
}

export const getUsersUseCase = new GetUsersUseCase(usersRepository);
