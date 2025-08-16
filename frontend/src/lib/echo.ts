// src/lib/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for laravel-echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
window.Pusher = Pusher;

// Minimal config shape we care about
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
  // Any other laravel-echo options:
  [k: string]: unknown;
}>;

let echoInstance: Echo | null = null;

/**
 * Initialize (or reuse) a singleton Echo instance.
 * Uses REVERB_* envs. No secrets or IDs are exposed on the client.
 */
export function initEcho(overrides: EchoOverrides = {}): Echo {
  if (echoInstance) return echoInstance;

  const token =
    sessionStorage.getItem('token') ||
    localStorage.getItem('token') ||
    '';

  const scheme = (import.meta.env.VITE_REVERB_SCHEME || 'http').toLowerCase();
  const isTLS = scheme === 'https';

  const host = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';
  const portEnv = Number(import.meta.env.VITE_REVERB_PORT || (isTLS ? 443 : 6001));
  const key = import.meta.env.VITE_REVERB_APP_KEY;

  if (!key) {
    // Fail fast with a clear message in dev
    // (This prevents silent “app key missing” socket errors.)
    throw new Error('VITE_REVERB_APP_KEY is missing in frontend .env');
  }

  const base: EchoOverrides = {
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: isTLS ? null : portEnv,    // plain WS when scheme=http
    wssPort: isTLS ? portEnv : null,   // WSS when scheme=https
    forceTLS: isTLS,                   // false locally (http)
    enabledTransports: isTLS ? ['wss'] : ['ws'],
    disableStats: true,
    withCredentials: false,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: token
        ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        : { Accept: 'application/json' },
    },
  };

  echoInstance = new Echo({ ...base, ...overrides }) as Echo;
  return echoInstance;
}

/** Get the current Echo instance (throws if not initialized). */
export function getEcho(): Echo {
  if (!echoInstance) throw new Error('Echo not initialized. Call initEcho() first.');
  return echoInstance;
}

/** Subscribe to the authenticated user’s private channel. */
export function subscribeToUserChannel(userId: string | number) {
  const echo = getEcho();
  return echo.private(`user.${userId}`);
}

/** Cleanly disconnect & reset (e.g., on logout). */
export function disconnectEcho() {
  if (!echoInstance) return;
  try {
    // Leave all known channels
    // @ts-ignore — leave() exists on Echo
    echoInstance.leaveAllChannels?.();
  } catch {}
  // @ts-ignore — disconnect exists on Echo connector
  echoInstance.connector?.disconnect?.();
  echoInstance = null;
}
