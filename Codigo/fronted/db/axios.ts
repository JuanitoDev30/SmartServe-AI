import axios from 'axios';

const api = axios.create({
  baseURL: 'https://local/host:3001/api.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: El "Portero" de tus peticiones
api.interceptors.request.use(config => {
  // Aquí puedes automatizar la inyección de tokens de seguridad
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
