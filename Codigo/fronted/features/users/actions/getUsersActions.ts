import { getUsersUseCase } from '../services/useCases/getUsers-useCases';

export async function getUserActions(): Promise<string[]> {
  return getUsersUseCase.execute();
}
