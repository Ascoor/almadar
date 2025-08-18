// src/lib/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
window.Pusher = Pusher;

type EchoOverrides = Partial<{
  broadcaster: 'reverb' | 'pusher';
  key: string;
  wsHost: string;
  wsPort: number | null;
  wssPort: number | null;
  forceTLS: boolean;
  enabledTransports: Array<'ws'>;
  disableStats: boolean;
  withCredentials: boolean;
  authEndpoint: string;
  auth: { headers: Record<string, string> };
  [k: string]: unknown;
}>;

let echoInstance: Echo | null = null;

export function initEcho(overrides: EchoOverrides = {}): Echo {
  if (echoInstance) return echoInstance;

  const token =
    sessionStorage.getItem('token') ||
    localStorage.getItem('token') ||
    '';

  const scheme = (import.meta.env.VITE_REVERB_SCHEME || 'http').toLowerCase();
  const isTLS = scheme === 'https';
  const host = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';
  const port = Number(import.meta.env.VITE_REVERB_PORT || (isTLS ? 443 : 8080));
  const key = import.meta.env.VITE_REVERB_APP_KEY;

  if (!key) {
    throw new Error('VITE_REVERB_APP_KEY is missing in frontend .env');
  }

  const config: EchoOverrides = {
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: isTLS ? null : port,
    wssPort: isTLS ? port : null,
    forceTLS: isTLS,
    enabledTransports: isTLS ? ['wss'] : ['ws'],
    disableStats: true,
    withCredentials: false,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: token
        ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        : { Accept: 'application/json' },
    },
    ...overrides, // يسمح بالكتابة فوق أي إعدادات إذا أرسلها المستخدم
  };

  echoInstance = new Echo(config as any);
  return echoInstance;
}

export function getEcho(): Echo {
  if (!echoInstance) throw new Error('Echo not initialized. Call initEcho() first.');
  return echoInstance;
}

export function subscribeToUserChannel(userId: string | number) {
  const echo = getEcho();
  return echo.private(`user.${userId}`);
}

export function disconnectEcho() {
  if (!echoInstance) return;
  try {
    // Leave all channels
    // @ts-ignore
    echoInstance.leaveAllChannels?.();
  } catch {}
  // @ts-ignore
  echoInstance.connector?.disconnect?.();
  echoInstance = null;
}
