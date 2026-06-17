import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const apiProxy = (target) => ({
  target,
  changeOrigin: true,
  bypass: (req) => {
    if (req.headers.accept?.includes("text/html")) return req.url;
  },
});

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/users": apiProxy("http://localhost:9000"),
      "/post/": apiProxy("http://localhost:9000"),
      "/comment": apiProxy("http://localhost:9000"),
      "/community": apiProxy("http://localhost:9000"),
      "/notification/": apiProxy("http://localhost:9000"),
      "/chat": apiProxy("http://localhost:9000"),
      "/socket.io": {
        target: "http://localhost:9000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
