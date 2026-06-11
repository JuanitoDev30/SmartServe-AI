//import 'server-only';
import { getSession } from 'next-auth/react';
import { auth } from '@/auth';

export async function getAuthToken(): Promise<string | null> {
  // En servidor (page, layout, server component)
  if (typeof window === 'undefined') {
    try {
      const session = await auth();

      return session?.accessToken ?? null;
    } catch {
      return null;
    }
  }

  // En cliente (server actions llamadas desde componentes cliente)
  const session = await getSession();
  return session?.accessToken ?? null;
}
