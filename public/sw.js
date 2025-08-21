// This file will be processed by Vite PWA plugin
// The plugin will generate a proper Workbox service worker
// with all the caching strategies and runtime caching configured in vite.config.ts

// Basic service worker template
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker fetching:', event.request.url);
});
