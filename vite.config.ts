import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget = "http://127.0.0.1:5000";

export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
