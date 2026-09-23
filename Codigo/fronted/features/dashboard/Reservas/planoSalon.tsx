'use client';

import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Clock, LayoutGrid, Plus, Radio, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Mesa } from '@/features/mesas/schemas/mesaSchema';
import type { Reserva } from '@/features/reservas/schemas/reservaSchema';
import { esHoy, formatHora, formatRangoHorario } from '@/features/reservas/utils/fechas';

import {
  ESTADO_RESERVA_CONFIG,
  ZONA_MESA_CONFIG,
} from '../shared/constants/reservaConstants';
import { MesaPlano } from '../shared/plano/mesaPlano';
import { PlanoLienzo } from '../shared/plano/planoLienzo';
import {
  ESTADOS_MESA,
  ESTADO_MESA_CONFIG,
  type EstadoMesa,
} from '../shared/plano/planoConstants';
import { areasDeZona, colocarMesas } from '../shared/plano/planoGeometria';
import {
  calcularOcupacion,
  franjaDelDia,
  resumenPlano,
  type OcupacionMesa,
} from '../shared/plano/ocupacionMesas';

const PASO_MINUTOS = 15;

/** Minuto de época actual: cambia una vez por minuto, no en cada render */
const minutoDelReloj = () => Math.floor(Date.now() / 60_000);

const suscribirAlReloj = (alCambiar: () => void) => {
  const id = setInterval(alCambiar, 30_000);
  return () => clearInterval(id);
};

interface PlanoSalonProps {
  mesas: Mesa[];
  /** Reservas del día que se está viendo */
  reservas: Reserva[];
  fecha: string;
  onSelectReserva: (reserva: Reserva) => void;
  onCrearEnMesa: (mesa: Mesa) => void;
}

/**
 * El salón como plano: las mesas donde están de verdad, pintadas según el
 * estado que tienen a la hora que marca el control. Mover esa hora deja ver
 * cómo se llena el servicio, que es lo que una tabla no cuenta.
 */
export function PlanoSalon({
  mesas,
  reservas,
  fecha,
  onSelectReserva,
  onCrearEnMesa,
}: PlanoSalonProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [mesaSeleccionada, setMesaSeleccionada] = useState<string | null>(null);

  // null = el control sigue al reloj; un número = alguien lo movió a mano
  const [minutoManual, setMinutoManual] = useState<number | null>(null);

  const { desde, hasta } = useMemo(
    () => franjaDelDia(reservas, fecha),
    [reservas, fecha],
  );

  const totalMinutos = Math.max(
    PASO_MINUTOS,
    Math.round((hasta.getTime() - desde.getTime()) / 60_000),
  );

  // El reloj entra como fuente externa: el render sigue siendo puro y en el
  // servidor vale 0, así que el HTML inicial coincide con el del cliente.
  const minutoEpoca = useSyncExternalStore(
    suscribirAlReloj,
    minutoDelReloj,
    () => 0,
  );

  const hayReloj = minutoEpoca > 0;
  const hoy = esHoy(fecha);

  const minutoDeAhora = useMemo(() => {
    if (!hayReloj) return 0;

    const transcurrido = Math.round(
      (minutoEpoca * 60_000 - desde.getTime()) / 60_000,
    );
    return Math.min(Math.max(transcurrido, 0), totalMinutos);
  }, [hayReloj, minutoEpoca, desde, totalMinutos]);

  // Todo se deriva: en vivo mientras nadie toque el control, y el día que se
  // ve reinicia el componente entero (va con key={fecha} desde el dashboard).
  const siguiendoAhora = minutoManual === null && hoy;
  const minuto = minutoManual ?? (hoy ? minutoDeAhora : 0);

  const instante = useMemo(
    () => new Date(desde.getTime() + minuto * 60_000),
    [desde, minuto],
  );

  const colocadas = useMemo(() => colocarMesas(mesas), [mesas]);
  const areas = useMemo(() => areasDeZona(colocadas), [colocadas]);

  const ocupaciones = useMemo(() => {
    const mapa = new Map<string, OcupacionMesa>();
    for (const mesa of mesas) {
      mapa.set(mesa.id, calcularOcupacion(mesa, reservas, instante));
    }
    return mapa;
  }, [mesas, reservas, instante]);

  const resumen = useMemo(
    () => resumenPlano([...ocupaciones.values()], mesas),
    [ocupaciones, mesas],
  );

  // Ocupación paso a paso: la barra que se ve sobre el control de hora
  const densidad = useMemo(() => {
    const pasos = Math.ceil(totalMinutos / PASO_MINUTOS);
    const activas = mesas.filter(mesa => mesa.activa);
    if (activas.length === 0) return [];

    return Array.from({ length: pasos + 1 }, (_, i) => {
      const t = new Date(desde.getTime() + i * PASO_MINUTOS * 60_000);

      const tomadas = activas.filter(mesa => {
        const estado = calcularOcupacion(mesa, reservas, t).estado;
        return estado === 'OCUPADA' || estado === 'RESERVADA';
      }).length;

      return { minuto: i * PASO_MINUTOS, ratio: tomadas / activas.length };
    });
  }, [totalMinutos, mesas, reservas, desde]);

  const seleccionada = mesaSeleccionada
    ? mesas.find(mesa => mesa.id === mesaSeleccionada)
    : undefined;

  const ocupacionSeleccionada = seleccionada
    ? ocupaciones.get(seleccionada.id)
    : undefined;

  if (mesas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted">
          <LayoutGrid className="size-6 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-foreground">
          Todavía no hay mesas registradas
        </p>
        <p className="text-sm text-muted-foreground">
          Crea las mesas del salón y acomódalas en el plano para verlas aquí.
        </p>
      </div>
    );
  }

  const detalleDeMesa = (ocupacion: OcupacionMesa, mesa: Mesa) => {
    if (ocupacion.estado === 'INACTIVA') return 'cerrada';
    if (ocupacion.actual) return formatHora(ocupacion.actual.fechaHora);
    if (ocupacion.estado === 'PROXIMA' && ocupacion.proxima) {
      return formatHora(ocupacion.proxima.fechaHora);
    }
    return `${mesa.capacidad}p`;
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Control de hora */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {formatHora(instante)}
            </span>
            {siguiendoAhora && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Radio className="size-3 animate-pulse" />
                En vivo
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {resumen.ocupacion}%
              </span>{' '}
              ocupación
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-4" />
              <span className="font-semibold text-foreground">
                {resumen.comensales}
              </span>{' '}
              en mesa
            </span>

            {hoy && (
              <button
                type="button"
                onClick={() => setMinutoManual(null)}
                disabled={siguiendoAhora}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  siguiendoAhora
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                Ahora
              </button>
            )}
          </div>
        </div>

        {/* Densidad del servicio: dónde se concentra la carga del día */}
        <div className="mt-4 flex h-10 items-end gap-px">
          {densidad.map(punto => {
            const activo = Math.abs(punto.minuto - minuto) < PASO_MINUTOS / 2;

            return (
              <button
                key={punto.minuto}
                type="button"
                onClick={() => setMinutoManual(punto.minuto)}
                title={`${formatHora(new Date(desde.getTime() + punto.minuto * 60_000))} · ${Math.round(punto.ratio * 100)}%`}
                className="group flex h-full flex-1 items-end"
              >
                <span
                  className={cn(
                    'w-full rounded-sm transition-colors',
                    activo
                      ? 'bg-primary'
                      : 'bg-primary/25 group-hover:bg-primary/50',
                  )}
                  style={{ height: `${Math.max(punto.ratio * 100, 4)}%` }}
                />
              </button>
            );
          })}
        </div>

        <input
          type="range"
          min={0}
          max={totalMinutos}
          step={PASO_MINUTOS}
          value={minuto}
          onChange={event => setMinutoManual(Number(event.target.value))}
          aria-label="Hora del salón"
          className="mt-2 w-full accent-primary"
        />

        <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{formatHora(desde)}</span>
          <span>{formatHora(hasta)}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        {/* Plano */}
        <PlanoLienzo
          svgRef={svgRef}
          areas={areas}
          onFondoPointerDown={() => setMesaSeleccionada(null)}
        >
          {colocadas.map(colocada => {
            const ocupacion = ocupaciones.get(colocada.mesa.id);
            if (!ocupacion) return null;

            return (
              <MesaPlano
                key={colocada.mesa.id}
                colocada={colocada}
                estado={ocupacion.estado}
                detalle={detalleDeMesa(ocupacion, colocada.mesa)}
                seleccionada={colocada.mesa.id === mesaSeleccionada}
                onClick={() => setMesaSeleccionada(colocada.mesa.id)}
              />
            );
          })}
        </PlanoLienzo>

        {/* Panel lateral */}
        <div className="space-y-4">
          {/* Leyenda */}
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estado del salón
            </p>

            <ul className="mt-3 space-y-2">
              {ESTADOS_MESA.map(estado => {
                const config = ESTADO_MESA_CONFIG[estado];
                const conteo: Record<EstadoMesa, number> = {
                  OCUPADA: resumen.ocupadas,
                  RESERVADA: resumen.reservadas,
                  PROXIMA: resumen.proximas,
                  LIBRE: resumen.libres,
                  INACTIVA: resumen.inactivas,
                };

                return (
                  <li
                    key={estado}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className={cn('size-2 rounded-full', config.punto)} />
                    {config.label}
                    <span className="ml-auto font-medium tabular-nums text-foreground">
                      {conteo[estado]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detalle de la mesa elegida */}
          {seleccionada && ocupacionSeleccionada ? (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Mesa {seleccionada.numero}
                  </p>
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    {seleccionada.capacidad} personas
                  </p>
                </div>

                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                    ZONA_MESA_CONFIG[seleccionada.zona].className,
                  )}
                >
                  {ZONA_MESA_CONFIG[seleccionada.zona].label}
                </span>
              </div>

              {seleccionada.descripcion && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {seleccionada.descripcion}
                </p>
              )}

              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reservas del día
                </p>

                {ocupacionSeleccionada.delDia.length === 0 ? (
                  <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Libre todo el día
                  </p>
                ) : (
                  ocupacionSeleccionada.delDia.map(reserva => {
                    const config = ESTADO_RESERVA_CONFIG[reserva.estado];
                    const esLaActual =
                      ocupacionSeleccionada.actual?.id === reserva.id;

                    return (
                      <button
                        key={reserva.id}
                        type="button"
                        onClick={() => onSelectReserva(reserva)}
                        className={cn(
                          'w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                          esLaActual
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-transparent bg-muted/50 hover:bg-muted',
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              'size-1.5 shrink-0 rounded-full',
                              config.dot,
                            )}
                          />
                          <span className="font-medium text-foreground">
                            {formatRangoHorario(
                              reserva.fechaHora,
                              reserva.duracionMinutos,
                            )}
                          </span>
                          <span className="ml-auto shrink-0 text-muted-foreground">
                            {reserva.numeroPersonas}p
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-muted-foreground">
                          {reserva.cliente.nombre}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {seleccionada.activa && (
                <button
                  type="button"
                  onClick={() => onCrearEnMesa(seleccionada)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <Plus className="size-3.5" />
                  Reservar esta mesa
                </button>
              )}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
              Toca una mesa en el plano para ver sus reservas del día.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
