import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.baseURL?.endsWith("/api") && typeof config.url === "string" && config.url.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);
