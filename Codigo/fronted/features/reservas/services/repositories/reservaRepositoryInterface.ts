import {
  CreateReservaInput,
  Disponibilidad,
  DisponibilidadQuery,
  EstadoReserva,
  Reserva,
  ReservaFilters,
  ReservaStats,
  UpdateReservaInput,
} from '../../schemas/reservaSchema';

export interface ReservaRepositoryInterface {
  getAll(filters?: ReservaFilters): Promise<Reserva[]>;
  getAgenda(fecha?: string): Promise<Reserva[]>;
  getProximas(): Promise<Reserva[]>;
  getById(id: string): Promise<Reserva>;
  getByCliente(clienteId: string): Promise<Reserva[]>;
  getStats(): Promise<ReservaStats>;
  getDisponibilidad(query: DisponibilidadQuery): Promise<Disponibilidad>;
  create(dto: CreateReservaInput): Promise<Reserva>;
  update(id: string, dto: UpdateReservaInput): Promise<Reserva>;
  cambiarEstado(
    id: string,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ): Promise<Reserva>;
  remove(id: string): Promise<{ mensaje: string }>;
}
