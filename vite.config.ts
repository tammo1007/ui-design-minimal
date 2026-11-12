import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Multi-page demo: / (landing), /dashboard/, /styleguide/. Static, deployable anywhere (GitHub Pages, Vercel, Netlify).
export default defineConfig({
  base: process.env.LG_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dashboard: resolve(__dirname, "dashboard/index.html"),
        styleguide: resolve(__dirname, "styleguide/index.html"),
      },
    },
  },
});
