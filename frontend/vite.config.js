import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

function escapeRegex(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export default defineConfig(({ mode }) => {
  const apiBase = process.env.VITE_API_BASE_URL || ''

  const runtimeCaching = [
    {
      urlPattern: /\.(?:js|css|html|png|jpg|svg|ico|webp)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
  ]

  if (apiBase) {
    runtimeCaching.unshift({
      urlPattern: new RegExp(`^${escapeRegex(apiBase)}`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    })
  }

  return {
    base: '/',
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
      // 👇 مهم: امنع تكرار نسخ React داخل الباندل
      dedupe: ['react', 'react-dom'],
    },
    server: {
  
    host: '::',
    port: 3000,
  },
    optimizeDeps: {
      // 👇 خليه يـpre-bundle للمكتبات اللي تعمل مشاكل وقت التشغيل
      include: ['react', 'react-dom', 'lucide-react'],
      // لو عندك مكتبات UI مبنية من shadcn/ui أو غيره:
      // include: ['react', 'react-dom', 'lucide-react', '@radix-ui/react-slot', '@radix-ui/react-dialog', ...]
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: { enabled: mode === 'development' },
        manifest: { /* … كما عندك … */ },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          globIgnores: ['**/welcome-image2-*.png'],
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,webp}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching,
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
             manualChunks: { 
          react: ['react', 'react-dom', 'lucide-react'],
          pdf: ['@react-pdf-viewer/core', 'pdfjs-dist', '@/components/PDFViewer'],
 
          vendor: ['socket.io-client', 'laravel-echo'],
        },
        },
      },
    },
  }
})
