import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5 minutes for API responses
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:css|js)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "Density Reporting Tool",
        short_name: "DRT",
        description: "A comprehensive tool for density reporting and analysis",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        categories: ["productivity", "business"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "screenshot-narrow.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: process.env.NODE_ENV === 'development' ? {
      "/api": {
        target: "http://localhost:8000", // Only used in development
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: "http://localhost:8000", // Add health endpoint proxy
        changeOrigin: true,
        secure: false,
      },
      "/home": {
        target: "http://localhost:8000", // Add home endpoint proxy
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // map @ to src
    },
  },
});