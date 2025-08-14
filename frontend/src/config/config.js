const base = import.meta.env.VITE_API_BASE_URL || '';

const API_CONFIG = {
  baseURL: base.startsWith('http') ? base : `http://${base}`,
};

export default API_CONFIG;
