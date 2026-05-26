import { type TimeFilter } from '@/features/overView/schemas/types';

export const estadoConfig: Record<
  string,
  { label: string; color: string; dotColor: string; bg: string }
> = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'text-orange-600',
    dotColor: 'bg-orange-500',
    bg: 'bg-orange-500/10',
  },
  CONFIRMADO: {
    label: 'Confirmado',
    color: 'text-blue-600',
    dotColor: 'bg-blue-500',
    bg: 'bg-blue-500/10',
  },
  EN_PREPARACION: {
    label: 'En Preparación',
    color: 'text-blue-600',
    dotColor: 'bg-blue-500',
    bg: 'bg-blue-500/10',
  },
  EN_CAMINO: {
    label: 'En Camino',
    color: 'text-cyan-600',
    dotColor: 'bg-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  ENTREGADO: {
    label: 'Entregado',
    color: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'text-red-600',
    dotColor: 'bg-red-500',
    bg: 'bg-red-500/10',
  },
};

export const timeFilterLabels: Record<TimeFilter, string> = {
  hoy: 'Hoy',
  semana: 'Esta semana',
  mes: 'Este mes',
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
