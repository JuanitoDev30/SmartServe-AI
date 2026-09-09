import { AxiosError } from 'axios';

/**
 * Normaliza el error de una server action: Nest devuelve `message` como
 * string o como arreglo (validaciones de class-validator).
 */
export function getActionErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    return fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
