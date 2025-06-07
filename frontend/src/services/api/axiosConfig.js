import axios from 'axios';
import API_CONFIG from '../../config/config';

let onUnauthorized = null;

export const setOnUnauthorized = (callback) => {
  onUnauthorized = callback;
};

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(sessionStorage.getItem('token'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof onUnauthorized === 'function') {
      onUnauthorized(); // 🔥 هنا ينفذ تسجيل الخروج
    }
    return Promise.reject(error);
  }
);

export default api;
