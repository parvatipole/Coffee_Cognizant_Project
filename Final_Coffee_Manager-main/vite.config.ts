import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Standard Vite port
    open: true, // Automatically open browser
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
  // Optimize dependencies for faster development
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
