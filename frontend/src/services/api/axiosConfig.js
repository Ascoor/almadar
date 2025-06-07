import axios from 'axios';
import API_CONFIG from '../../config/config';

// متغير لتخزين الدالة التي يتم استدعاؤها عند 401
let onUnauthorized = null;

// منع تكرار التنفيذ
let unauthorizedTriggered = false;

/**
 * تعيين الدالة التي سيتم استدعاؤها عند حصول 401 Unauthorized
 */
export const setOnUnauthorized = (callback) => {
  onUnauthorized = callback;
  unauthorizedTriggered = false;
};

// إنشاء instance جديد من axios
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * إدراج التوكن في الهيدر قبل إرسال الطلب
 */
api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(sessionStorage.getItem('token'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // تجاهل في حال وجود خطأ
  }
  return config;
});

/**
 * التعامل مع الأخطاء (خصوصًا 401 Unauthorized)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof onUnauthorized === 'function' &&
      !unauthorizedTriggered
    ) {
      unauthorizedTriggered = true;
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;
