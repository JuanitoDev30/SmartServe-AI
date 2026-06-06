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

  instance.interceptors.request.use(config => {
    return config;
  });

  return instance;
}
