import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
    preprocessorOptions: {
      css: {
        // Only process CSS files that are not in node_modules
        include: /^(?!.*node_modules).*$/,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
