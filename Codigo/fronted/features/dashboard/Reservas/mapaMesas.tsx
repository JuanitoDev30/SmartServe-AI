'use client';

import { Plus, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Mesa } from '@/features/mesas/schemas/mesaSchema';
import type { Reserva } from '@/features/reservas/schemas/reservaSchema';
import { formatHora } from '@/features/reservas/utils/fechas';
import { ESTADOS_CERRADOS } from '@/features/reservas/utils/transiciones';
import {
  ESTADO_RESERVA_CONFIG,
  ZONA_MESA_CONFIG,
} from '../shared/constants/reservaConstants';

interface MapaMesasProps {
  mesas: Mesa[];
  reservas: Reserva[];
  onSelectReserva: (reserva: Reserva) => void;
  onCrearEnMesa: (mesa: Mesa) => void;
}

/** Vista de salón: cada mesa con las reservas que tiene ese día */
export function MapaMesas({
  mesas,
  reservas,
  onSelectReserva,
  onCrearEnMesa,
}: MapaMesasProps) {
  if (mesas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Todavía no hay mesas registradas
        </p>
        <p className="text-sm text-muted-foreground">
          Crea las mesas del salón para empezar a asignar reservas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
      {mesas.map(mesa => {
        const reservasMesa = reservas
          .filter(reserva => reserva.mesa.id === mesa.id)
          .sort(
            (a, b) =>
              new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
          );

        const vigentes = reservasMesa.filter(
          reserva => !ESTADOS_CERRADOS.includes(reserva.estado),
        );

        const enMesa = reservasMesa.some(
          reserva => reserva.estado === 'SENTADA',
        );

        const zona = ZONA_MESA_CONFIG[mesa.zona];

        return (
          <div
            key={mesa.id}
            className={cn(
              'flex flex-col rounded-xl border bg-card p-4 transition-colors',
              !mesa.activa && 'opacity-60',
              enMesa
                ? 'border-primary/50 ring-1 ring-primary/20'
                : 'border-border',
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Mesa {mesa.numero}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  {mesa.capacidad} personas
                </p>
              </div>

              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  zona.className,
                )}
              >
                {zona.label}
              </span>
            </div>

            <div className="mt-3 flex-1 space-y-1.5">
              {!mesa.activa ? (
                <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  Fuera de servicio
                </p>
              ) : reservasMesa.length === 0 ? (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Libre todo el día
                </p>
              ) : (
                reservasMesa.map(reserva => {
                  const config = ESTADO_RESERVA_CONFIG[reserva.estado];

                  return (
                    <button
                      key={reserva.id}
                      type="button"
                      onClick={() => onSelectReserva(reserva)}
                      className="flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                    >
                      <span
                        className={cn(
                          'size-1.5 shrink-0 rounded-full',
                          config.dot,
                        )}
                      />
                      <span className="font-medium text-foreground">
                        {formatHora(reserva.fechaHora)}
                      </span>
                      <span className="truncate text-muted-foreground">
                        {reserva.cliente.nombre}
                      </span>
                      <span className="ml-auto shrink-0 text-muted-foreground">
                        {reserva.numeroPersonas}p
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] text-muted-foreground">
                {vigentes.length} activa{vigentes.length === 1 ? '' : 's'}
              </span>

              {mesa.activa && (
                <button
                  type="button"
                  onClick={() => onCrearEnMesa(mesa)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <Plus className="size-3.5" />
                  Reservar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
