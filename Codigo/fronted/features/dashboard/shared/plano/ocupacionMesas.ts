import type { Mesa } from '@/features/mesas/schemas/mesaSchema';
import type { Reserva } from '@/features/reservas/schemas/reservaSchema';
import { ESTADOS_CERRADOS } from '@/features/reservas/utils/transiciones';

import { MINUTOS_PROXIMA, type EstadoMesa } from './planoConstants';

export interface OcupacionMesa {
  estado: EstadoMesa;
  /** La reserva que tiene la mesa en ese instante */
  actual: Reserva | null;
  /** La siguiente que llega, si la mesa está libre ahora */
  proxima: Reserva | null;
  /** Todas las del día en esa mesa, ordenadas por hora */
  delDia: Reserva[];
}

const inicio = (reserva: Reserva) => new Date(reserva.fechaHora).getTime();

const fin = (reserva: Reserva) =>
  inicio(reserva) + reserva.duracionMinutos * 60_000;

/**
 * Estado de una mesa en un instante concreto. Es lo que permite mover el
 * control de hora y ver cómo se llena el salón a lo largo del servicio.
 */
export function calcularOcupacion(
  mesa: Mesa,
  reservas: Reserva[],
  instante: Date,
): OcupacionMesa {
  const t = instante.getTime();

  const delDia = reservas
    .filter(reserva => reserva.mesa.id === mesa.id)
    .sort((a, b) => inicio(a) - inicio(b));

  if (!mesa.activa) {
    return { estado: 'INACTIVA', actual: null, proxima: null, delDia };
  }

  // Las canceladas o cerradas ya no ocupan el salón
  const vigentes = delDia.filter(
    reserva => !ESTADOS_CERRADOS.includes(reserva.estado),
  );

  const enCurso = vigentes.filter(
    reserva => inicio(reserva) <= t && t < fin(reserva),
  );

  if (enCurso.length > 0) {
    // Si alguien ya está sentado, eso manda sobre una reserva solapada
    const sentada = enCurso.find(reserva => reserva.estado === 'SENTADA');
    const actual = sentada ?? enCurso[0];

    return {
      estado: sentada ? 'OCUPADA' : 'RESERVADA',
      actual,
      proxima: null,
      delDia,
    };
  }

  const proxima = vigentes.find(reserva => inicio(reserva) > t) ?? null;

  const esProxima =
    proxima !== null && inicio(proxima) - t <= MINUTOS_PROXIMA * 60_000;

  return {
    estado: esProxima ? 'PROXIMA' : 'LIBRE',
    actual: null,
    proxima,
    delDia,
  };
}

export interface ResumenPlano {
  ocupadas: number;
  reservadas: number;
  proximas: number;
  libres: number;
  inactivas: number;
  /** % de mesas en servicio que están ocupadas o reservadas */
  ocupacion: number;
  comensales: number;
}

export function resumenPlano(
  ocupaciones: OcupacionMesa[],
  mesas: Mesa[],
): ResumenPlano {
  const cuenta = (estado: EstadoMesa) =>
    ocupaciones.filter(o => o.estado === estado).length;

  const ocupadas = cuenta('OCUPADA');
  const reservadas = cuenta('RESERVADA');
  const activas = mesas.filter(mesa => mesa.activa).length;

  return {
    ocupadas,
    reservadas,
    proximas: cuenta('PROXIMA'),
    libres: cuenta('LIBRE'),
    inactivas: cuenta('INACTIVA'),
    ocupacion: activas
      ? Math.round(((ocupadas + reservadas) / activas) * 100)
      : 0,
    comensales: ocupaciones.reduce(
      (suma, o) => suma + (o.actual?.numeroPersonas ?? 0),
      0,
    ),
  };
}

/**
 * Franja horaria que cubre el servicio del día: de la primera reserva a la
 * última, redondeado a horas y con un mínimo razonable si el día está vacío.
 */
export function franjaDelDia(
  reservas: Reserva[],
  fecha: string,
): { desde: Date; hasta: Date } {
  const base = new Date(`${fecha}T00:00:00`);

  const crear = (hora: number) => {
    const d = new Date(base);
    d.setHours(hora, 0, 0, 0);
    return d;
  };

  if (reservas.length === 0) return { desde: crear(11), hasta: crear(23) };

  const horaInicio = Math.min(
    ...reservas.map(r => new Date(r.fechaHora).getHours()),
    12,
  );
  const horaFin = Math.max(
    ...reservas.map(r => new Date(fin(r)).getHours() + 1),
    22,
  );

  return { desde: crear(Math.max(horaInicio, 0)), hasta: crear(Math.min(horaFin, 24)) };
}
