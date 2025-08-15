import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("auth_token");
      // optional: broadcast event
    }
    return Promise.reject(err);
  }
);
