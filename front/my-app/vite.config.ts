import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined;
const REPO_NAME = 'FrontendElements';

export default defineConfig({
  //base: '/FrontendElements/',
  base: isTauri ? '/' : '/FrontendElements/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ChemLab',
        short_name: 'ChemLab',
        description: 'Химическая лаборатория с расчетом смесей',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: `/${REPO_NAME}/`,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/staticimages': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
});
