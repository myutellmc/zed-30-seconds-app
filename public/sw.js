// Service Worker for Zed 30 Seconds App
// Version 1.0.0

const CACHE_NAME = 'zed-30s-game-fixed-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  '/src/App.tsx',
  '/favicon.svg',
  '/favicon.ico',
  '/game-icon-48.svg',
  '/game-icon-72.svg',
  '/game-icon-96.svg',
  '/game-icon-120.svg',
  '/game-icon-144.svg',
  '/game-icon-152.svg',
  '/game-icon-180.svg',
  '/game-icon-192.svg',
  '/game-icon-512.svg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[ServiceWorker] All files cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('[ServiceWorker] Found in cache', event.request.url);
          return response;
        }
        
        console.log('[ServiceWorker] Network request', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Return offline page or basic response for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Handle background sync for timer data
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync', event.tag);
  
  if (event.tag === 'timer-sync') {
    event.waitUntil(
      // Handle any pending timer syncs
      syncTimerData()
    );
  }
});

// Handle push notifications (for timer completion alerts)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  const options = {
    body: 'Your turn is complete! Time to see the results and continue the game.',
    icon: '/game-icon-96.svg',
    badge: '/game-icon-48.svg',
    tag: 'game-turn-complete',
    requireInteraction: true,
    actions: [
      {
        action: 'continue-game',
        title: 'Continue Game'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Game Turn Complete!', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'continue-game') {
    // Open app and continue the game
    event.waitUntil(
      clients.openWindow('/?continue=true')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync timer data
async function syncTimerData() {
  try {
    // This would sync any pending timer data
    // For now, just log that sync happened
    console.log('[ServiceWorker] Timer data synced');
    return Promise.resolve();
  } catch (error) {
    console.error('[ServiceWorker] Timer sync failed', error);
    return Promise.reject(error);
  }
}