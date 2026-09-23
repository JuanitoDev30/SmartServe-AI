/** Cita ya registrada por el agente, tal como la muestra la UI. */
export interface CitaAgendada {
  id: string;
  /** Fecha y hora ya formateadas por el agente en la zona horaria de la sala de ventas. */
  cuando: string;
  duracionMinutos: number;
  estado: string;
  proyecto?: string;
  direccion?: string;
  unidad?: string;
}
