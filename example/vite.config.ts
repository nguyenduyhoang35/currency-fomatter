import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "kurrency-kit": path.resolve(__dirname, "../src/index.tsx"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
