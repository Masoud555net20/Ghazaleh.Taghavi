// Service Worker for performance optimization and caching
const CACHE_NAME = 'ghazaleh-legal-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/globals.css',
  '/styles/base.css',
  '/styles/typography.css',
  '/styles/accessibility.css',
  '/styles/animations.css',
  '/styles/responsive.css',
  '/styles/components.css',
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/4.webp',
  '/5.jpg',
  'https://cdn.tailwindcss.com'
];

// Font assets for caching
const FONT_ASSETS = [
  '/Font/IranNastaliq.ttf',
  '/Font/Iranian Sans.ttf',
  '/Font/Shabnam-Medium.woff',
  '/Font/Shabnam-Bold.woff',
  '/Font/Shabnam-Thin.woff',
  '/Font/Vazirmatn[wght].woff2',
  '/Font/Samim-Medium.woff',
  '/Font/Samim-Bold.woff',
  '/Font/Nahid.woff',
  '/Font/Nahid.woff2'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open('fonts-cache').then((cache) => {
        console.log('Service Worker: Caching font assets');
        return cache.addAll(FONT_ASSETS);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== 'fonts-cache') {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Font requests - cache first
    if (url.pathname.includes('/Font/')) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open('fonts-cache').then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
      );
      return;
    }

    // Static assets - cache first, network fallback
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          }).catch(() => {
            // Return cached version if available
            return caches.match(request);
          });
        })
      );
      return;
    }

    // Images - cache with network fallback
    if (request.destination === 'image') {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          }).catch(() => {
            // Return a placeholder for failed images
            return new Response('', { status: 200 });
          });
        })
      );
      return;
    }

    // Default strategy for other requests
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // Handle background sync tasks
      doBackgroundSync()
    );
  }
});

function doBackgroundSync() {
  return Promise.resolve()
    .then(() => {
      console.log('Service Worker: Background sync completed');
    })
    .catch((error) => {
      console.error('Service Worker: Background sync failed', error);
    });
}

// Push notifications for updates
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});
