import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  base: "/bdc-real-estate/",
  envDir: "./env",
  assetsInclude: [
    "**/*.PNG",
    "**/*.ico",
    "**/*.jpg",
    "**/*.JPG",
    "**/*.gif",
    "**/*.svg",
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // in KB
  },
}));
