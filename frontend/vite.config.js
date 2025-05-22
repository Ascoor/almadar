// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
        proxy: {
      // مثال لتوجيه الطلبات إلى Laravel API
      '/broadcasting': 'http://127.0.0.1:8000',
      '/socket.io': {
        target: 'http://localhost:8080',  // التأكد من أن WebSocket يعمل بشكل صحيح
        ws: true,
      },
    },
    host: "::",
    port: 3000,
  },
    optimizeDeps: {
    include: ['socket.io-client', 'laravel-echo'],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
}));
