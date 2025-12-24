import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    ViteImageOptimizer({
      // Optimize images in assets folder
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      // Configuration for different image types
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      logStats: true,
    }),
  ],
  // base: '/api/ui/'
});
