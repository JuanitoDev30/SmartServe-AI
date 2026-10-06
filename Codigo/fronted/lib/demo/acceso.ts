/**
 * Clave de la demo publica.
 *
 * Con DEMO_KEY definida, el chat y su API piden la clave: la URL del tunel se
 * puede reenviar sin control, y cada mensaje gasta tokens del modelo. Sin
 * DEMO_KEY no cambia nada (desarrollo local).
 *
 * La cookie guarda un hash de la clave, no la clave: si la cookie se filtra,
 * no revela la clave para compartirla.
 */
export const DEMO_COOKIE = 'demo_acceso';

export function demoKey(): string | undefined {
  return process.env.DEMO_KEY || undefined;
}

export async function demoToken(key: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`demo:${key}`),
  );
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
