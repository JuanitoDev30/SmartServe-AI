'use client';

import { CalendarX2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Reserva } from '@/features/reservas/schemas/reservaSchema';
import {
  formatDuracion,
  formatRangoHorario,
} from '@/features/reservas/utils/fechas';
import {
  ORIGEN_RESERVA_CONFIG,
  ZONA_MESA_CONFIG,
} from '../shared/constants/reservaConstants';
import { ReservaEstadoBadge } from './reservaEstadoBadge';

interface ReservasTableProps {
  reservas: Reserva[];
  isLoading: boolean;
  onView: (reserva: Reserva) => void;
  onEdit: (reserva: Reserva) => void;
}

export function ReservasTable({
  reservas,
  isLoading,
  onView,
  onEdit,
}: ReservasTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-t border-border">
            {[
              'Horario',
              'Cliente',
              'Mesa',
              'Personas',
              'Estado',
              'Origen',
              'Acciones',
            ].map(columna => (
              <th
                key={columna}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap"
              >
                {columna}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-muted-foreground"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Cargando reservas...
                </div>
              </td>
            </tr>
          ) : reservas.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <CalendarX2 className="size-6" />
                  No se encontraron reservas
                </div>
              </td>
            </tr>
          ) : (
            reservas.map(reserva => {
              const zona = ZONA_MESA_CONFIG[reserva.mesa.zona];
              const origen = ORIGEN_RESERVA_CONFIG[reserva.origen];

              return (
                <tr
                  key={reserva.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">
                      {formatRangoHorario(
                        reserva.fechaHora,
                        reserva.duracionMinutos,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuracion(reserva.duracionMinutos)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-foreground">
                      {reserva.cliente.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reserva.cliente.telefono}
                    </p>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        #{reserva.mesa.numero}
                      </span>
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          zona.className,
                        )}
                      >
                        {zona.label}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {reserva.numeroPersonas}
                  </td>

                  <td className="px-4 py-4">
                    <ReservaEstadoBadge estado={reserva.estado} />
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium',
                        origen.className,
                      )}
                    >
                      {origen.label}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onView(reserva)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => onEdit(reserva)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
