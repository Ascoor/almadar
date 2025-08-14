import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  timeout: 30000,
});

let csrfFetched = false;

api.interceptors.request.use(async (config) => {
  if (!csrfFetched && config.method && config.method.toLowerCase() !== 'get') {
    await axios.get('/sanctum/csrf-cookie', {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
    });
    csrfFetched = true;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 419) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
