import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    proxy: {
      '/broadcasting': 'http://127.0.0.1:8000',
      '/socket.io': { target: 'http://localhost:8080', ws: true },
    },
    host: '::',
    port: 3000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'socket.io-client', 'laravel-echo'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: mode === 'development' },

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

        // ✅ تجاهُل الصورة الكبيرة من precache
        globIgnores: ['**/assets/welcome-image2-*.png'],

        // (اختياري) ✅ رفع الحد الأقصى قليلاً إذا احتجت مستقبلاً
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6MB

        // مسارات افتراضية للملفات (يمكن حذفها وترك Workbox يضبطها تلقائيًا)
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,webp}'],

        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        // ✅ Runtime caching للصور والـ API
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => {
              const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/,'')
              return base && url.href.startsWith(base)
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ملفات ثابتة
          {
            urlPattern: /\.(?:js|css|html)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          pdf: ['@react-pdf-viewer/core', 'pdfjs-dist', '@/components/PDFViewer'],
          ui: ['lucide-react'],
          vendor: ['socket.io-client', 'laravel-echo'],
        },
      },
    },
  },
}))
