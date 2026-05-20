import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/users": "http://localhost:8000",
      "/post/": "http://localhost:8000",
      "/comment": "http://localhost:8000",
      "/community": "http://localhost:8000",
      "/notification/": "http://localhost:8000",
      "/socket.io": {
        target: "http://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
