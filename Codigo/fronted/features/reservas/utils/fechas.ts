/** Utilidades de fecha/hora locales para la agenda de reservas */

/** YYYY-MM-DD en hora local (sin pasar por UTC, que corre el día) */
export function toInputDate(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

/** HH:mm en hora local */
export function toInputTime(date: Date = new Date()): string {
  return date.toTimeString().slice(0, 5);
}

/** Combina los inputs de fecha y hora en el ISO que espera el backend */
export function combinarFechaHora(fecha: string, hora: string): string {
  return new Date(`${fecha}T${hora}:00`).toISOString();
}

/** Evita construir un ISO a partir de un input a medio escribir */
export function esFechaHoraValida(fecha: string, hora: string): boolean {
  if (!fecha || !hora) return false;
  return !Number.isNaN(new Date(`${fecha}T${hora}:00`).getTime());
}

export function sumarDias(fecha: string, dias: number): string {
  const date = new Date(`${fecha}T00:00:00`);
  date.setDate(date.getDate() + dias);
  return toInputDate(date);
}

/** 20:30 */
export function formatHora(fechaHora: string | Date): string {
  return new Date(fechaHora).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Hora de finalización según la duración reservada */
export function formatRangoHorario(
  fechaHora: string | Date,
  duracionMinutos: number,
): string {
  const inicio = new Date(fechaHora);
  const fin = new Date(inicio.getTime() + duracionMinutos * 60_000);
  return `${formatHora(inicio)} – ${formatHora(fin)}`;
}

/** viernes, 12 de septiembre */
export function formatFechaLarga(fecha: string): string {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function esHoy(fecha: string): boolean {
  return fecha === toInputDate();
}

export function formatDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}
