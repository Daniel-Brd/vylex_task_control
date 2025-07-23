import axios, { type InternalAxiosRequestConfig, isAxiosError, type AxiosError } from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
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
    if (isAxiosError(error)) {
      const status = error.response?.status;
      switch (status) {
        case 401:
          console.error('Unauthorized. Redirecting to login...');
          break;
        case 403:
          console.error('Forbidden access.');
          break;
        case 500:
          console.error('Internal server error.');
          break;
        default:
          console.error(`An Axios error occurred: ${status}`);
      }
    } else {
      console.error(`An unexpected error occurred: ${error.message}`);
    }

    return Promise.reject(error);
  },
);
