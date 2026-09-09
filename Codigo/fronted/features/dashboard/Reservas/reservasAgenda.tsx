'use client';

import { motion } from 'framer-motion';
import { CalendarX2, Clock, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Reserva } from '@/features/reservas/schemas/reservaSchema';
import {
  formatHora,
  formatRangoHorario,
} from '@/features/reservas/utils/fechas';
import {
  ESTADO_RESERVA_CONFIG,
  ORIGEN_RESERVA_CONFIG,
} from '../shared/constants/reservaConstants';
import { ReservaEstadoBadge } from './reservaEstadoBadge';

interface ReservasAgendaProps {
  reservas: Reserva[];
  onSelect: (reserva: Reserva) => void;
}

/** Agrupa las reservas por hora de inicio para pintar la línea de tiempo */
function agruparPorHora(reservas: Reserva[]) {
  const franjas = new Map<string, Reserva[]>();

  [...reservas]
    .sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
    )
    .forEach(reserva => {
      const hora = `${new Date(reserva.fechaHora).getHours()}`.padStart(2, '0');
      const franja = `${hora}:00`;
      franjas.set(franja, [...(franjas.get(franja) ?? []), reserva]);
    });

  return [...franjas.entries()];
}

export function ReservasAgenda({ reservas, onSelect }: ReservasAgendaProps) {
  const franjas = agruparPorHora(reservas);

  if (franjas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted">
          <CalendarX2 className="size-6 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-foreground">
          Sin reservas en esta franja
        </p>
        <p className="text-sm text-muted-foreground">
          Cambia de día o crea una reserva nueva.
        </p>
      </div>
    );
  }

  const ultimaFranja = franjas[franjas.length - 1][1];
  const ultimaReserva = ultimaFranja[ultimaFranja.length - 1];

  return (
    <div className="p-4 sm:p-6">
      {franjas.map(([franja, reservasFranja], indiceFranja) => (
        <div key={franja} className="relative flex gap-4 sm:gap-6">
          {/* Rail horario */}
          <div className="flex w-14 shrink-0 flex-col items-end sm:w-16">
            <span className="text-sm font-semibold text-foreground">
              {franja}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {reservasFranja.length}{' '}
              {reservasFranja.length === 1 ? 'reserva' : 'reservas'}
            </span>
          </div>

          <div className="relative flex-1 pb-6">
            {/* Línea vertical continua entre franjas */}
            <span
              className={cn(
                'absolute -left-3 top-2 w-px bg-border sm:-left-4',
                indiceFranja === franjas.length - 1 ? 'h-0' : 'h-full',
              )}
            />
            <span className="absolute -left-[15px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-card sm:-left-[19px]" />

            <div className="space-y-3">
              {reservasFranja.map((reserva, indice) => {
                const config = ESTADO_RESERVA_CONFIG[reserva.estado];
                const origen = ORIGEN_RESERVA_CONFIG[reserva.origen];

                return (
                  <motion.button
                    key={reserva.id}
                    type="button"
                    onClick={() => onSelect(reserva)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: indice * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="group relative flex w-full gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
                  >
                    {/* Acento de estado */}
                    <span
                      className={cn(
                        'absolute inset-y-0 left-0 w-1',
                        config.dot,
                      )}
                    />

                    <div className="ml-2 flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-foreground">
                            {reserva.cliente.nombre}
                          </p>
                          <span
                            className={cn(
                              'hidden rounded-full border px-2 py-0.5 text-[10px] font-medium sm:inline-flex',
                              origen.className,
                            )}
                          >
                            {origen.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {formatRangoHorario(
                              reserva.fechaHora,
                              reserva.duracionMinutos,
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="size-3.5" />
                            {reserva.numeroPersonas}
                          </span>
                          <span className="text-muted-foreground/70">
                            {reserva.cliente.telefono}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                          Mesa {reserva.mesa.numero}
                        </span>
                        <ReservaEstadoBadge estado={reserva.estado} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <p className="pl-[4.5rem] text-xs text-muted-foreground sm:pl-[5.5rem]">
        Última reserva del día a las {formatHora(ultimaReserva.fechaHora)}
      </p>
    </div>
  );
}
