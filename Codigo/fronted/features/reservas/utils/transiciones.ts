import { EstadoReserva } from '../schemas/reservaSchema';

// Espejo de las transiciones del backend (reserva.service.ts): la UI solo
// ofrece acciones que el servidor va a aceptar.
export const TRANSICIONES_VALIDAS: Record<EstadoReserva, EstadoReserva[]> = {
  PENDIENTE: ['CONFIRMADA', 'CANCELADA', 'NO_ASISTIO'],
  CONFIRMADA: ['SENTADA', 'CANCELADA', 'NO_ASISTIO'],
  SENTADA: ['COMPLETADA'],
  COMPLETADA: [],
  CANCELADA: [],
  NO_ASISTIO: [],
};

export const ESTADOS_CERRADOS: EstadoReserva[] = [
  'COMPLETADA',
  'CANCELADA',
  'NO_ASISTIO',
];

export const getEstadosPermitidos = (
  estadoActual: EstadoReserva,
): EstadoReserva[] => TRANSICIONES_VALIDAS[estadoActual];

export const esEditable = (estado: EstadoReserva): boolean =>
  !ESTADOS_CERRADOS.includes(estado);
