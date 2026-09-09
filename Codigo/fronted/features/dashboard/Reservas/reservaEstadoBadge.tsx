import { cn } from '@/lib/utils';
import { ESTADO_RESERVA_CONFIG } from '../shared/constants/reservaConstants';
import type { EstadoReserva } from '@/features/reservas/schemas/reservaSchema';

interface ReservaEstadoBadgeProps {
  estado: EstadoReserva;
  className?: string;
  conIcono?: boolean;
}

export function ReservaEstadoBadge({
  estado,
  className,
  conIcono = true,
}: ReservaEstadoBadgeProps) {
  const config = ESTADO_RESERVA_CONFIG[estado];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.badge,
        className,
      )}
    >
      {conIcono ? (
        <Icon className="size-3.5" />
      ) : (
        <span className={cn('size-1.5 rounded-full', config.dot)} />
      )}
      {config.label}
    </span>
  );
}
