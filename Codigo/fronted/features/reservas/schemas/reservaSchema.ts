// Fuente única de tipos de reservas

import { Mesa } from '@/features/mesas/schemas/mesaSchema';

export const ESTADOS_RESERVA = [
  'PENDIENTE',
  'CONFIRMADA',
  'SENTADA',
  'COMPLETADA',
  'CANCELADA',
  'NO_ASISTIO',
] as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

export const ORIGENES_RESERVA = ['DASHBOARD', 'AGENTE', 'WEB'] as const;

export type OrigenReserva = (typeof ORIGENES_RESERVA)[number];

export interface ClienteReserva {
  id: string;
  nombre: string;
  telefono: string;
  email?: string | null;
}

export interface Reserva {
  id: string;
  cliente: ClienteReserva;
  mesa: Mesa;
  fechaHora: string;
  duracionMinutos: number;
  numeroPersonas: number;
  estado: EstadoReserva;
  origen: OrigenReserva;
  notas?: string | null;
  motivoCancelacion?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ReservaStats {
  hoy: {
    total: number;
    pendientes: number;
    confirmadas: number;
    sentadas: number;
    comensales: number;
  };
  ocupacion: {
    mesasOcupadas: number;
    mesasActivas: number;
    porcentaje: number;
  };
  mes: {
    total: number;
    variacion: number;
    canceladas: number;
    variacionCanceladas: number;
    noAsistio: number;
  };
}

export interface MesaDisponibilidad {
  mesa: Mesa;
  disponible: boolean;
  motivo: string | null;
}

export interface Disponibilidad {
  inicio: string;
  fin: string;
  mesas: MesaDisponibilidad[];
  totalDisponibles: number;
}

export interface DisponibilidadQuery {
  fechaHora: string;
  duracionMinutos?: number;
  numeroPersonas?: number;
  excluirReservaId?: string;
}

export interface ReservaFilters {
  estado?: EstadoReserva;
  fecha?: string;
  mesaId?: string;
  clienteId?: string;
}

export interface CreateReservaInput {
  clienteId?: string;
  cliente?: {
    nombre: string;
    telefono: string;
    email?: string;
  };
  mesaId?: string;
  fechaHora: string;
  duracionMinutos?: number;
  numeroPersonas: number;
  notas?: string;
  origen?: OrigenReserva;
}

export interface UpdateReservaInput {
  mesaId?: string;
  fechaHora?: string;
  duracionMinutos?: number;
  numeroPersonas?: number;
  notas?: string;
  cliente?: {
    nombre?: string;
    telefono?: string;
    email?: string;
  };
}
