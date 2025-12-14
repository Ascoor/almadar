import { api } from '../../lib/api';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
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
