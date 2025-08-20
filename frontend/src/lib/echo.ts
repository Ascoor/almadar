import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const createEcho = (token: string) => {
  (window as any).Pusher = Pusher;
  return new Echo({
    broadcaster: 'pusher', // أو reverb
    key: import.meta.env.VITE_PUSHER_KEY,
    wsHost: import.meta.env.VITE_WS_HOST,
    wsPort: Number(import.meta.env.VITE_WS_PORT ?? 443),
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
    auth: { headers: { Authorization: `Bearer ${token}` } },
    enabledTransports: ['ws','wss'],
  });
};

export const initEcho = () => {
  const token = JSON.parse(sessionStorage.getItem('token') || 'null');
  return token ? createEcho(token) : createEcho('');
};

export const subscribeToUserChannel = (echo: any, userId: number, handler: (...args: any[]) => void) => {
  return echo.private(`user.${userId}`).listen('.permissions.updated', handler);
};
