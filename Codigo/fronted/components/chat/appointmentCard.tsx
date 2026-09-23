'use client';

import type { CitaAgendada } from '@/features/chat/schema/citaAgendada';
import { Building2, CalendarCheck, Clock, House, MapPin } from 'lucide-react';

interface AppointmentCardProps {
  cita: CitaAgendada;
}

const ESTADOS: Record<string, string> = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Realizada',
  no_show: 'No asistió',
};

/**
 * Tarjeta de la visita agendada, dentro de la burbuja del agente.
 *
 * El id de la cita no se muestra: es un UUID interno. Si el cliente pregunta
 * por su cita, el agente la encuentra con el telefono.
 */
export function AppointmentCard({ cita }: AppointmentCardProps) {
  return (
    <div className="mt-1 mb-1 overflow-hidden rounded-md border-l-4 border-primary bg-muted/70">
      <div className="flex items-center justify-between gap-3 px-3 pt-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <CalendarCheck className="size-4 text-primary" aria-hidden />
          Visita agendada
        </div>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
          {ESTADOS[cita.estado] ?? cita.estado}
        </span>
      </div>

      <dl className="space-y-1 px-3 pt-1.5 pb-2 text-[13px] text-foreground">
        <Row icon={<Clock className="size-3.5" aria-hidden />} label="Cuándo">
          <div>{capitalizar(cita.cuando)}</div>
          <div className="text-xs text-muted-foreground">
            Duración: {cita.duracionMinutos} minutos
          </div>
        </Row>
        {cita.proyecto && (
          <Row icon={<Building2 className="size-3.5" aria-hidden />} label="Proyecto">
            {cita.proyecto}
          </Row>
        )}
        {cita.unidad && (
          <Row icon={<House className="size-3.5" aria-hidden />} label="Unidad">
            {cita.unidad}
          </Row>
        )}
        {cita.direccion && (
          <Row icon={<MapPin className="size-3.5" aria-hidden />} label="Dirección">
            {cita.direccion}
          </Row>
        )}
      </dl>
    </div>
  );
}

/** "jueves 17 de septiembre" -> "Jueves 17 de septiembre". */
function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <dt className="mt-0.5 shrink-0 text-muted-foreground">
        {icon}
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
