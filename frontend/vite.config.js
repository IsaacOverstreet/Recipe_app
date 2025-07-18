import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import removeConsole from "vite-plugin-remove-console";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    removeConsole({
      // Only remove specific console methods
      include: ["log", "debug", "warn"], // exclude 'error'
    }),
  ],
});
