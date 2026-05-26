const TZ = 'America/Bogota';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Solo fecha: 15 ene 2024 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/** Fecha + hora: 15 ene 2024, 10:30 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** Tiempo de mensaje: 10:30 */
export function formatMessageTime(timestamp: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

/** Hoy / Ayer / lun / 15 ene */
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);

  // Comparamos días en el timezone de Colombia, no en UTC
  const nowCO = new Date(new Date().toLocaleString('sv-SE', { timeZone: TZ }));
  const dateCO = new Date(d.toLocaleString('sv-SE', { timeZone: TZ }));

  nowCO.setHours(0, 0, 0, 0);
  dateCO.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (nowCO.getTime() - dateCO.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) {
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: TZ,
      weekday: 'short',
    }).format(d);
  }
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
  }).format(d);
}

/** Timestamp local Colombia para mensajes nuevos — sin Z, no se interpreta como UTC */
export function nowLocalISO(): string {
  return new Date().toLocaleString('sv-SE', { timeZone: TZ }).replace(' ', 'T');
}
