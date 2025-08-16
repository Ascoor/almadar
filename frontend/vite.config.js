import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // يجلب VITE_* من ملفات .env

  // اختَر إحدى طريقتين للمصادقة:
  // A) تعتمد على URL كامل في الفرونت -> احذف بروكسي /broadcasting هنا
  // B) تعتمد على مسار نسبي /broadcasting/auth -> فعّل بروكسي /broadcasting هنا
  const useProxyForAuth = false; // غيّرها لـ true إذا بتغيّر authEndpoint لمسار نسبي

  return {
    server: {
      port: 3000,
      host: '::',
      cors: true,
      proxy: useProxyForAuth
        ? {
            // سيعمل إذا كان authEndpoint='/broadcasting/auth' في echo.ts
            '/broadcasting': {
              target: 'http://127.0.0.1:8000',
              changeOrigin: true,
            },
          }
        : undefined,
      // لا حاجة لبروكسي /socket.io مع Reverb
      // hmr: { overlay: false }, // لو تحب تعطل الـ overlay
    },

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'laravel-echo',
        // لا تُدرج socket.io-client إذا لا تستخدمه
      ],
    },

    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        // أثناء التطوير، عطّل SW لتجنّب أي تعارض/كاش أثناء اختبار WS
        devOptions: { enabled: false },
        manifest: {
          short_name: 'Almadar',
          name: 'نظام إدارة مكاتب المحاماة',
          description: 'Comprehensive Law Firm Management System',
          lang: 'ar',
          dir: 'rtl',
          start_url: '.',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: '#0d3346',
          background_color: '#0d3346',
          icons: [
            { src: 'favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' },
            { src: 'splash-image.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: 'splash-image.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,webp}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/broadcasting\//],
          runtimeCaching: [
            // API الرئيسي (باستخدام env المحمّل)
            {
              urlPattern: new RegExp(`^${env.VITE_API_BASE_URL?.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}/.*`),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // أصول ثابتة
            {
              urlPattern: /\.(?:js|css|html|png|jpg|svg|ico|webp)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-assets',
                expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
            // لا حاجة لأي كاش لمسارات WS؛ Workbox لا يكاش WebSocket أصلاً
          ],
        },
      }),
    ],

    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            ui: ['lucide-react'],
            // لا تقسّم socket.io-client إذا لا تستخدمه
            // vendor: ['laravel-echo'], // اختياري
          },
        },
      },
    },
  };
});
