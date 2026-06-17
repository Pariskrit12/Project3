import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/users": "http://localhost:9000",
      "/post/": "http://localhost:9000",
      "/comment": "http://localhost:9000",
      "/community": "http://localhost:9000",
      "/notification/": "http://localhost:9000",
      "/chat": "http://localhost:9000",
      "/socket.io": {
        target: "http://localhost:9000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
