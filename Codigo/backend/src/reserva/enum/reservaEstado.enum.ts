export enum EstadoReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  SENTADA = 'SENTADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  NO_ASISTIO = 'NO_ASISTIO',
}

// Estados en los que la reserva sigue ocupando la mesa: se usan para
// detectar solapamientos y calcular disponibilidad.
export const ESTADOS_ACTIVOS: EstadoReserva[] = [
  EstadoReserva.PENDIENTE,
  EstadoReserva.CONFIRMADA,
  EstadoReserva.SENTADA,
];
