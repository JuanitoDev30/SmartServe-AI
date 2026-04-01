import type { OrderStatus } from '@/types';

/**
 * Shared utility functions for the chat feature
 */

// Avatar color palette
const avatarColors = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-600',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-lime-600',
] as const;

/**
 * Get consistent avatar color based on ID
 */
export function getAvatarColor(id: string): string {
  const index = parseInt(id) % avatarColors.length;
  return avatarColors[index];
}

/**
 * Format timestamp to readable time
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date to relative time (Hoy, Ayer, etc.)
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  }
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

/**
 * Format currency for Colombian Pesos
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get status label in Spanish
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

/**
 * Get status color class
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    confirmed:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    preparing:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    ready:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    delivered:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
