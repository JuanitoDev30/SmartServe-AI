export interface IUserRepository {
  getUserList(): Promise<string[]>;
  updateUser(
    id: string,
    data: Partial<{ name: string; email: string }>,
  ): Promise<void>;
}

class UsersRepository implements IUserRepository {
  async getUserList(): Promise<string[]> {
    // Simulación de una llamada a una API para obtener la lista de usuarios
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['Usuario1', 'Usuario2', 'Usuario3']);
      }, 1000);
    });

    //   try {
    //   const response = await api.get('/products');
    //   return response.data;
    // } catch (error) {
    //   console.error("Error cargando productos:", error);
    //   return null;
    // }
  }

  async updateUser(
    id: string,
    data: Partial<{ name: string; email: string }>,
  ): Promise<void> {
    // Simulación de una llamada a una API para actualizar un usuario
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Usuario con ID ${id} actualizado con los datos:`, data);
        resolve();
      }, 1000);
    });

    //   try {
    //     const response = await api.patch('/producto/${id}', data);
    //     return response.data;
    // } catch (error) {
    //     console.error("Error actualizando producto:", error);
    //     return null;
    // }
  }

  async createUser(data: { name: string; email: string }): Promise<void> {
    // Simulación de una llamada a una API para crear un usuario
    return new Promise(resolve => {
      setTimeout(() => {
        //console.log('Usuario creado con los datos:', data);
        resolve();
      }, 1000);
    });

    //   try {
    //     const response = await api.post('/producto', data);
    //     return response.data;
    // } catch (error) {
    //     console.error("Error creando producto:", error);
    //     return null;
    // }
  }
}

export const usersRepository = new UsersRepository();
