// src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function initEcho(config = {}) {
  if (echoInstance) return echoInstance;

  // ✅ اجلب التوكن من sessionStorage أو localStorage
const token = sessionStorage.getItem('token');

  const defaultConfig = {
    broadcaster: 'reverb',

    id: import.meta.env.VITE_REVERB_APP_ID,
    key: import.meta.env.VITE_REVERB_APP_KEY,
    cluster: import.meta.env.VITE_REVERB_CLUSTER,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
   forceTLS: false, // ✅ استخدام TLS (HTTPS/WSS)
  disableStats: false,
  enabledTransports: ['ws'], // ✅ السماح بالاتصال الآمن
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '', // ✅ أضف التوكن هنا
      },
    },
  };

  echoInstance = new Echo({ ...defaultConfig, ...config });
  return echoInstance;
}

export function subscribeToUserChannel(userId) {
  if (!echoInstance) {
    throw new Error('Echo not initialized');
  }
  return echoInstance.private(`user.${userId}`);
}
