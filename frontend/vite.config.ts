import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/kpl/frontend/dist/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/kpl/backend/api": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
      },
      "/kpl/backend/uploads": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
