import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
// Ensure the API base URL always targets the Laravel /api prefix, even if the
// environment variable is provided without it (e.g., http://127.0.0.1:8000).
const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

export const api = axios.create({
  baseURL: normalizedBaseUrl,
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
