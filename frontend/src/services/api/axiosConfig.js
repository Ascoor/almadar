import axios from 'axios';
import { toast } from 'sonner';
import API_CONFIG from '../../config/config';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
  withXSRFToken: true,
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

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    toast.error('لا يوجد اتصال بالإنترنت', {
      description: 'تعذر إرسال الطلب. يرجى المحاولة بعد عودة الشبكة.',
      duration: 4000,
    });

    const offlineError = new axios.Cancel('Network offline');
    offlineError.code = 'ERR_OFFLINE';
    offlineError.isOffline = true;
    return Promise.reject(offlineError);
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
  },
);

export default api;
