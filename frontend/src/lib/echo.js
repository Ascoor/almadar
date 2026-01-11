// src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

let echoInstance = null;

export function initEcho(config = {}) {
  if (echoInstance) return echoInstance;

  // ✅ اجلب التوكن من sessionStorage أو localStorage
  const token = JSON.parse(sessionStorage.getItem('token'));

  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  const defaultConfig = {
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    cluster: import.meta.env.VITE_REVERB_CLUSTER,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    encrypted: false,
    withCredentials: true,

    disableStats: true,
    enabledTransports: ['ws'],
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
export function subscribeToUserChannel(echo, userId) {
  if (!echo) throw new Error('Echo not initialized');
  return echo.private(`user.${userId}`);
}
