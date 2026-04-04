'use server'; //componente de servidor, se ejecuta en el servidor, no en el cliente

import { Userschema } from '../schemas/userSchema';
import { UserType } from '../types/userType';

export async function createUserActions(data: UserType) {
  const response = Userschema.safeParse(data);

  if (!response.success) {
    console.log(response.error);
    return {
      success: '',
      error: 'Error al crear el usuario',
    };
  }
  return {
    success: 'Usuario creado correctamente',
    error: '',
  };
}
