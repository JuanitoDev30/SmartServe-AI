import {
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  Utensils,
  UserRoundCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

import {
  ESTADOS_RESERVA,
  type EstadoReserva,
  type OrigenReserva,
} from '@/features/reservas/schemas/reservaSchema';
import type { ZonaMesa } from '@/features/mesas/schemas/mesaSchema';

interface EstadoReservaConfig {
  label: string;
  /** Punto/acento sólido, para barras laterales y marcadores */
  dot: string;
  /** Badge suave, legible en claro y oscuro */
  badge: string;
  icon: LucideIcon;
}

export const ESTADO_RESERVA_CONFIG: Record<EstadoReserva, EstadoReservaConfig> =
  {
    PENDIENTE: {
      label: 'Pendiente',
      dot: 'bg-amber-500',
      badge:
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: CalendarClock,
    },
    CONFIRMADA: {
      label: 'Confirmada',
      dot: 'bg-blue-500',
      badge:
        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: UserRoundCheck,
    },
    SENTADA: {
      label: 'En mesa',
      dot: 'bg-primary',
      badge: 'bg-primary/10 text-primary border-primary/20',
      icon: Utensils,
    },
    COMPLETADA: {
      label: 'Completada',
      dot: 'bg-emerald-500',
      badge:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    CANCELADA: {
      label: 'Cancelada',
      dot: 'bg-red-500',
      badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      icon: XCircle,
    },
    NO_ASISTIO: {
      label: 'No asistió',
      dot: 'bg-violet-500',
      badge:
        'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      icon: CircleSlash,
    },
  };

export type ReservaTabFilter = 'all' | EstadoReserva;

export const RESERVA_TAB_FILTERS: {
  label: string;
  value: ReservaTabFilter;
}[] = [
  { label: 'Todas', value: 'all' },
  ...ESTADOS_RESERVA.map(estado => ({
    label: ESTADO_RESERVA_CONFIG[estado].label,
    value: estado as ReservaTabFilter,
  })),
];

export const ORIGEN_RESERVA_CONFIG: Record<
  OrigenReserva,
  { label: string; className: string }
> = {
  DASHBOARD: {
    label: 'Dashboard',
    className: 'bg-muted text-muted-foreground border-border',
  },
  AGENTE: {
    label: 'Agente IA',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  WEB: {
    label: 'Web',
    className:
      'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
};

export const ZONA_MESA_CONFIG: Record<
  ZonaMesa,
  { label: string; className: string }
> = {
  INTERIOR: {
    label: 'Interior',
    className: 'bg-muted text-muted-foreground border-border',
  },
  TERRAZA: {
    label: 'Terraza',
    className:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  BARRA: {
    label: 'Barra',
    className:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  VIP: {
    label: 'VIP',
    className:
      'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  },
  PRIVADO: {
    label: 'Privado',
    className:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
};

/** Horas que se pintan en la vista de agenda */
export const FRANJAS_AGENDA = [
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
] as const;

/** Atajos de hora en el formulario */
export const HORAS_SUGERIDAS = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
] as const;
