const CACHE_NAME = 'abhi-devfolio-cache-v1';
// This list should be updated if new assets are added.
const urlsToCache = [
  '/',
  '/index.html',
  '/?hs=true', // precache home screen
  '/index.tsx',
  '/manifest.json',
  '/public/icon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  // Import map URLs
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/react-dom@^19.1.0/',
  'https://esm.sh/react@^19.1.0/',
  'https://esm.sh/@google/genai',
  'https://esm.sh/react-github-calendar@^4.1.5',
  'https://esm.sh/jspdf@2.5.1',
  'https://esm.sh/react-router-dom@^6.24.1',
  'https://esm.sh/react-icons@5.2.1/',
  // Key Images
  'https://avatars.githubusercontent.com/u/68281476?v=4'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        const cachePromises = urlsToCache.map(url => {
            return cache.add(url).catch(err => {
                // Log caching errors but don't let a single failure break the whole install
                console.warn(`Failed to cache ${url}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // If we get a valid response, clone it, cache it, and return it
        if (networkResponse && networkResponse.ok) {
            // Check for 'cors' type for cross-origin requests
            if (event.request.url.startsWith('http')) {
                 cache.put(event.request, networkResponse.clone());
            }
        }
        return networkResponse;
      }).catch(err => {
          console.error('Fetch failed:', err);
          // This will be caught by the outer catch block if there's no cached response
          throw err;
      });

      // Return cached response immediately if available, and update cache in background
      return cachedResponse || fetchPromise;
    }).catch(() => {
        // This catch handles cases where both cache and network fail.
        // You could return a generic fallback page here if you have one.
        console.log('Fetch failed; no cached version available.');
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
   return self.clients.claim();
});
