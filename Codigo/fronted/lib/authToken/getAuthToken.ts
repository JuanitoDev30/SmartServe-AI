//import 'server-only';
import { auth } from '@/auth';

export async function getAuthToken(): Promise<string | null> {
  const session = await auth();

  return session?.accessToken ?? null;
}
