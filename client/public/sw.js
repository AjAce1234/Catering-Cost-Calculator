// This is the service worker for the Catering Cost Calculator app
const CACHE_NAME = 'catering-cost-calculator-v2';
// Will be populated dynamically during build
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/',
  '/assets/index.css',
  '/assets/index.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-icon.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network with network-first strategy for API
self.addEventListener('fetch', (event) => {
  // For API calls, try network first, then fallback to cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request.clone())
        .then((response) => {
          // Cache the successful API response
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network request fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For non-API requests, try cache first, then network (cache-first strategy)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request because it's a one-time use stream
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest)
            .then((response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response because it's a one-time use stream
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // If fetch fails (offline), try to serve the index for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
              }
              
              // For image requests, return a fallback image if available
              if (event.request.destination === 'image') {
                return caches.match('/icons/icon-192.png');
              }
            });
        })
    );
  }
});