import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifestJson from './public/manifest.json' with { type: 'json' };
import type { ManifestOptions } from 'vite-plugin-pwa';
const manifest: Partial<ManifestOptions> = manifestJson as ManifestOptions;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
        runtimeCaching: [
          // API Calls with Background Sync
          {
            urlPattern: /^https?:\/\/(localhost:8081|localhost:3000)\/(hello|dungeon\/solve)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dungeon-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 300 // 5 minutes for API responses
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              },
              // Background Sync para requisições que falharam
              backgroundSync: {
                name: 'dungeon-api-sync',
                options: {
                  maxRetentionTime: 24 * 60 // 24 horas em minutos
                }
              }
            }
          },
          // General API pattern
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'general-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300
              },
              networkTimeoutSeconds: 3,
              backgroundSync: {
                name: 'general-api-sync',
                options: {
                  maxRetentionTime: 24 * 60
                }
              }
            }
          },
          // Static assets
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 86400 * 30 // 30 days
              }
            }
          },
          // Fonts
          {
            urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 86400 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
});