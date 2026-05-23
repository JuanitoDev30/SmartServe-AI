import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// api.interceptors.request.use(config => {
//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

//export default api;
