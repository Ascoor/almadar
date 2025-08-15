import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  server: {
    host: "::",        // listen on IPv6/IPv4 (use "0.0.0.0" if you prefer)
    port: 3000,
    hmr: { overlay: true },
    // Optional: proxy Laravel API to avoid CORS in dev
    // proxy: {
    //   "/api": { target: "http://localhost:8000", changeOrigin: true },
    //   "/sanctum": { target: "http://localhost:8000", changeOrigin: true },
    // },
  },
});
