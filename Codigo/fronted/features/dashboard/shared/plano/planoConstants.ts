import {
  CalendarClock,
  CircleSlash,
  Clock3,
  Sparkles,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

import type { FormaMesa, ZonaMesa } from '@/features/mesas/schemas/mesaSchema';

/**
 * El backend guarda la geometría en unidades de grilla, no en píxeles: así
 * el plano se puede reescalar sin migrar datos. CELDA es la equivalencia
 * que usa el SVG.
 */
export const CELDA = 24;

/**
 * Tamaño del salón, en unidades de grilla. Da sitio de sobra a las cinco
 * zonas repartidas por el auto-acomodo. La proporción tiene que coincidir
 * con la clase `aspect-*` del lienzo o el plano se deforma.
 */
export const PLANO_ANCHO = 64;
export const PLANO_ALTO = 44;

export const ESTADOS_MESA = [
  'OCUPADA',
  'RESERVADA',
  'PROXIMA',
  'LIBRE',
  'INACTIVA',
] as const;

export type EstadoMesa = (typeof ESTADOS_MESA)[number];

interface EstadoMesaConfig {
  label: string;
  /** Clases SVG del cuerpo de la mesa */
  superficie: string;
  borde: string;
  silla: string;
  /** Color del número de mesa */
  texto: string;
  /** Punto sólido para la leyenda */
  punto: string;
  icon: LucideIcon;
}

export const ESTADO_MESA_CONFIG: Record<EstadoMesa, EstadoMesaConfig> = {
  OCUPADA: {
    label: 'Ocupada',
    superficie: 'fill-primary/25',
    borde: 'stroke-primary',
    silla: 'fill-primary/40',
    texto: 'fill-primary',
    punto: 'bg-primary',
    icon: Utensils,
  },
  RESERVADA: {
    label: 'Reservada',
    superficie: 'fill-blue-500/20',
    borde: 'stroke-blue-500',
    silla: 'fill-blue-500/35',
    texto: 'fill-blue-600 dark:fill-blue-400',
    punto: 'bg-blue-500',
    icon: CalendarClock,
  },
  PROXIMA: {
    label: 'Próxima',
    superficie: 'fill-amber-500/20',
    borde: 'stroke-amber-500',
    silla: 'fill-amber-500/35',
    texto: 'fill-amber-600 dark:fill-amber-400',
    punto: 'bg-amber-500',
    icon: Clock3,
  },
  LIBRE: {
    label: 'Libre',
    superficie: 'fill-emerald-500/15',
    borde: 'stroke-emerald-500/70',
    silla: 'fill-emerald-500/30',
    texto: 'fill-emerald-600 dark:fill-emerald-400',
    punto: 'bg-emerald-500',
    icon: Sparkles,
  },
  INACTIVA: {
    label: 'Fuera de servicio',
    superficie: 'fill-muted',
    borde: 'stroke-border',
    silla: 'fill-muted',
    texto: 'fill-muted-foreground',
    punto: 'bg-muted-foreground',
    icon: CircleSlash,
  },
};

export const FORMA_MESA_CONFIG: Record<FormaMesa, { label: string }> = {
  REDONDA: { label: 'Redonda' },
  CUADRADA: { label: 'Cuadrada' },
  RECTANGULAR: { label: 'Rectangular' },
};

/** Tinte del área que agrupa las mesas de una misma zona */
export const ZONA_PLANO_CONFIG: Record<
  ZonaMesa,
  { area: string; etiqueta: string }
> = {
  INTERIOR: {
    area: 'fill-muted/40 stroke-border',
    etiqueta: 'fill-muted-foreground',
  },
  TERRAZA: {
    area: 'fill-emerald-500/5 stroke-emerald-500/30',
    etiqueta: 'fill-emerald-600 dark:fill-emerald-400',
  },
  BARRA: {
    area: 'fill-amber-500/5 stroke-amber-500/30',
    etiqueta: 'fill-amber-600 dark:fill-amber-400',
  },
  VIP: {
    area: 'fill-violet-500/5 stroke-violet-500/30',
    etiqueta: 'fill-violet-600 dark:fill-violet-400',
  },
  PRIVADO: {
    area: 'fill-blue-500/5 stroke-blue-500/30',
    etiqueta: 'fill-blue-600 dark:fill-blue-400',
  },
};

/** Una reserva que arranca dentro de esta ventana marca la mesa como próxima */
export const MINUTOS_PROXIMA = 45;
