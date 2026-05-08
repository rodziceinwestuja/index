
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'serve-root-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const request = req as typeof req & { url?: string };
          if (request.url === '/') {
            request.url = '/index.html';
          }
          next();
        });
      },
    },
    react(),
  ],
  // WAŻNE: Ponieważ używasz własnej domeny (rodziceinwestuja.pl), base musi być '/'
  // Gdybyś używał adresu rodziceinwestuja.github.io/index, base musiałoby być '/index/'
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-vendor';
          }

          return 'vendor';
        },
      },
    },
  }
});
