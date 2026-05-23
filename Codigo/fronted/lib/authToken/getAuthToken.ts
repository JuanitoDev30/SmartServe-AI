import { auth } from '@/auth';

export async function getAuthToken(): Promise<string | null> {
  const session = await auth();
  // console.log('SESSION:', JSON.stringify(session, null, 2)); // 👈
  return (session as any)?.accessToken ?? null;
}
