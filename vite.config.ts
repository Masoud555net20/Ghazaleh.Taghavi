import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        sourcemap: mode === 'production' ? false : true,
        minify: 'terser',
        chunkSizeWarningLimit: 500,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // React ecosystem - بالاترین اولویت
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              // React Router
              if (id.includes('react-router')) {
                return 'router';
              }
              // Large UI libraries - جدا کردن jalaali-js برای بهبود عملکرد
              if (id.includes('jalaali-js')) {
                return 'jalaali';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              // Node modules بزرگ
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name!.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/css/i.test(ext)) {
                return `assets/css/[name]-[hash][extname]`;
              }
              if (/woff2?|eot|ttf|otf/i.test(ext)) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
          },
        },
        assetsInlineLimit: 4096,
        cssCodeSplit: true,
        reportCompressedSize: true,
      },
      plugins: [react(), VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Ghazaleh Taghavi Legal Consultation',
          short_name: 'LegalConsult',
          description: 'مشاوره حقوقی غزاله تقوی',
          theme_color: '#3b82f6',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })],
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
