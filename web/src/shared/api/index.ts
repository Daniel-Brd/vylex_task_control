import axios, { type InternalAxiosRequestConfig, isAxiosError, type AxiosError } from 'axios';
import { toast } from 'sonner';

const API_URL = (import.meta.env.VITE_API_URL as string) || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ACCESS_TOKEN_KEY = 'access_token';

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (isAxiosError(error)) {
      return Promise.reject(error);
    }
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError | Error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      toast.error('Sessão expirada. Redirecionando para a página de login.');

      localStorage.removeItem(ACCESS_TOKEN_KEY);

      setTimeout(() => {
        window.location.href = '/login';
      }, 5000);

      return new Promise(() => {});
    }
    return Promise.reject(error);
  },
);
