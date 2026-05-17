import {
  Cliente,
  CreateClienteInput,
  UpdateClienteInput,
  ClienteFilters,
  PaginatedClientes,
  ClienteStats,
} from '../../schemas/clientSchema';

export interface ClienteRepositoryInterface {
  getAll(filters: ClienteFilters): Promise<PaginatedClientes>;
  getById(id: string): Promise<Cliente>;
  getStats(): Promise<ClienteStats>;
  create(data: CreateClienteInput): Promise<Cliente>;
  update(id: string, data: UpdateClienteInput): Promise<Cliente>;
  desactivar(id: string): Promise<Cliente>;
}
