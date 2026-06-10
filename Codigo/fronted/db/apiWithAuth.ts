//import 'server-only';
import axios from 'axios';
import { getAuthToken } from '@/lib/authToken/getAuthToken';
export async function getApiWithAuth() {
  const token = await getAuthToken();

  const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Importación dinámica para evitar problemas con SSR
        import('@/store/authStore').then(({ useAuthStore }) => {
          useAuthStore.getState().setSessionExpired(true);
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
}
