import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // Use cookies for authentication
  timeout: 30000,
});

let csrfToken: string | null = null;

// CSRF Token management
api.interceptors.request.use(async (config) => {
  // Get CSRF token on first request or if it's missing
  if (!csrfToken && config.method !== 'get') {
    try {
      const response = await axios.get('/auth/csrf-token', { 
        baseURL: api.defaults.baseURL,
        withCredentials: true 
      });
      csrfToken = response.data.token;
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
  }

  // Add CSRF token to headers
  if (csrfToken && config.method !== 'get') {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Clear CSRF token on 403 (invalid CSRF)
    if (error?.response?.status === 403) {
      csrfToken = null;
    }

    // Redirect to login on 401 (unauthorized)
    if (error?.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);