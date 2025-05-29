import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/broadcasting': 'http://127.0.0.1:8000',
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
      },
    },
    host: '::',
    port: 3000,
  },

  optimizeDeps: {
    include: ['socket.io-client', 'laravel-echo'],
  },

  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
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
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{js,css,html}',
        ],
        globIgnores: [
          '**/node_modules/**/*',
          'sw.js',
          'workbox-*.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/.*$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' },
          },
          {
            urlPattern: /\.(?:js|css|html)$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-assets' },
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
}));
