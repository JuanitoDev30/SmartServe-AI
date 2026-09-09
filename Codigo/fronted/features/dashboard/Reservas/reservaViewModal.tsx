'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CircleSlash,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type {
  EstadoReserva,
  Reserva,
} from '@/features/reservas/schemas/reservaSchema';
import {
  esEditable,
  getEstadosPermitidos,
} from '@/features/reservas/utils/transiciones';
import {
  formatDuracion,
  formatRangoHorario,
} from '@/features/reservas/utils/fechas';
import { formatDateTime } from '@/lib/utils/formatters';
import {
  ESTADO_RESERVA_CONFIG,
  ORIGEN_RESERVA_CONFIG,
  ZONA_MESA_CONFIG,
} from '../shared/constants/reservaConstants';
import { ReservaEstadoBadge } from './reservaEstadoBadge';

interface ReservaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: Reserva | null;
  onCambiarEstado: (
    reserva: Reserva,
    estado: EstadoReserva,
    motivoCancelacion?: string,
  ) => void;
  onEdit: (reserva: Reserva) => void;
  onDelete: (reserva: Reserva) => void;
  isSubmitting: boolean;
}

// Texto del botón según el estado al que lleva la transición
const ACCION_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE: 'Marcar pendiente',
  CONFIRMADA: 'Confirmar',
  SENTADA: 'Sentar en mesa',
  COMPLETADA: 'Completar',
  CANCELADA: 'Cancelar reserva',
  NO_ASISTIO: 'No asistió',
};

export function ReservaViewModal({
  isOpen,
  onClose,
  reserva,
  onCambiarEstado,
  onEdit,
  onDelete,
  isSubmitting,
}: ReservaViewModalProps) {
  if (!isOpen || !reserva) return null;

  const estadosPermitidos = getEstadosPermitidos(reserva.estado);
  const zona = ZONA_MESA_CONFIG[reserva.mesa.zona];
  const origen = ORIGEN_RESERVA_CONFIG[reserva.origen];

  const detalles = [
    {
      icon: Clock,
      label: 'Horario',
      value: `${formatRangoHorario(reserva.fechaHora, reserva.duracionMinutos)} · ${formatDuracion(
        reserva.duracionMinutos,
      )}`,
    },
    {
      icon: CalendarDays,
      label: 'Fecha',
      value: formatDateTime(reserva.fechaHora),
    },
    {
      icon: Users,
      label: 'Comensales',
      value: `${reserva.numeroPersonas} personas`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card px-6 py-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {reserva.cliente.nombre}
              </h2>
              <ReservaEstadoBadge estado={reserva.estado} />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  origen.className,
                )}
              >
                {origen.label}
              </span>
              <span className="text-xs text-muted-foreground">
                #{reserva.id.slice(0, 8)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Mesa */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                {reserva.mesa.numero}
              </span>
              <div>
                <p className="font-medium text-foreground">
                  Mesa {reserva.mesa.numero}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Capacidad {reserva.mesa.capacidad}
                </p>
              </div>
            </div>

            <span
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                zona.className,
              )}
            >
              {zona.label}
            </span>
          </div>

          {/* Detalles */}
          <div className="grid gap-3 sm:grid-cols-3">
            {detalles.map(detalle => (
              <div
                key={detalle.label}
                className="rounded-xl bg-muted/50 p-3 space-y-1"
              >
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <detalle.icon className="size-3.5" />
                  {detalle.label}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {detalle.value}
                </p>
              </div>
            ))}
          </div>

          {/* Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <User className="size-4" />
              <h3 className="font-medium">Contacto</h3>
            </div>
            <div className="space-y-2 rounded-xl bg-muted/50 p-4">
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                {reserva.cliente.telefono}
              </p>
              {reserva.cliente.email && (
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  {reserva.cliente.email}
                </p>
              )}
            </div>
          </div>

          {/* Notas */}
          {reserva.notas && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <FileText className="size-4" />
                <h3 className="font-medium">Notas</h3>
              </div>
              <p className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                {reserva.notas}
              </p>
            </div>
          )}

          {reserva.motivoCancelacion && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <CircleSlash className="size-4" />
                <h3 className="font-medium">Motivo de cancelación</h3>
              </div>
              <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                {reserva.motivoCancelacion}
              </p>
            </div>
          )}

          {/* Acciones de estado */}
          {estadosPermitidos.length > 0 && (
            <AccionesEstado
              reserva={reserva}
              estadosPermitidos={estadosPermitidos}
              onCambiarEstado={onCambiarEstado}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Trazabilidad */}
          <div className="space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Creada</span>
              <span>{formatDateTime(reserva.creadoEn)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Última actualización</span>
              <span>{formatDateTime(reserva.actualizadoEn)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-card px-6 py-4">
          <button
            type="button"
            onClick={() => onDelete(reserva)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>

          {esEditable(reserva.estado) ? (
            <button
              type="button"
              onClick={() => onEdit(reserva)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Pencil className="size-4" />
              Editar reserva
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Una reserva cerrada ya no se puede editar
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface AccionesEstadoProps {
  reserva: Reserva;
  estadosPermitidos: EstadoReserva[];
  onCambiarEstado: ReservaViewModalProps['onCambiarEstado'];
  isSubmitting: boolean;
}

/**
 * Vive en su propio componente para que el formulario de cancelación se
 * reinicie solo al cerrar el modal (se desmonta con él).
 */
function AccionesEstado({
  reserva,
  estadosPermitidos,
  onCambiarEstado,
  isSubmitting,
}: AccionesEstadoProps) {
  const [cancelando, setCancelando] = useState(false);
  const [motivo, setMotivo] = useState('');

  return (
    <div className="space-y-3 border-t border-border pt-5">
      <h3 className="text-sm font-medium text-foreground">Actualizar estado</h3>

      {cancelando ? (
        <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <label className="text-sm font-medium text-foreground">
            Motivo de la cancelación (opcional)
          </label>
          <textarea
            value={motivo}
            onChange={event => setMotivo(event.target.value)}
            rows={2}
            placeholder="El cliente avisó que no podrá asistir..."
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancelando(false)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Volver
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                onCambiarEstado(reserva, 'CANCELADA', motivo.trim() || undefined)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Confirmar cancelación
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {estadosPermitidos.map(estado => {
            const config = ESTADO_RESERVA_CONFIG[estado];
            const Icon = config.icon;
            const esCancelar = estado === 'CANCELADA';

            return (
              <button
                key={estado}
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  esCancelar
                    ? setCancelando(true)
                    : onCambiarEstado(reserva, estado)
                }
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50',
                  esCancelar
                    ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                    : 'border-border text-foreground hover:border-primary/40 hover:bg-primary/5',
                )}
              >
                <Icon className="size-4" />
                {ACCION_LABEL[estado]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
