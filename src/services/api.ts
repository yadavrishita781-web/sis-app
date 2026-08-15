import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
export const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sis_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sis_token');
    }
    return Promise.reject(error);
  }
);

export default api;

