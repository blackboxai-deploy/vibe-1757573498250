// Service Worker for Montessori Library System PWA
const CACHE_NAME = 'montessori-library-v1';
const urlsToCache = [
  '/',
  '/books',
  '/students', 
  '/checkout',
  '/return',
  '/reading-log',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Skip Waiting');
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming Clients');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Network First, then Cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if response is valid
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
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // If no cache, return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/offline.html') || new Response(
                `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Montessori Library - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      margin: 0;
                      padding: 20px;
                      background: linear-gradient(135deg, #ecfdf5 0%, #eff6ff 50%, #f3e8ff 100%);
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      text-align: center;
                    }
                    .container {
                      background: white;
                      padding: 40px;
                      border-radius: 20px;
                      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                      max-width: 400px;
                    }
                    .icon {
                      font-size: 4rem;
                      margin-bottom: 20px;
                    }
                    h1 {
                      color: #374151;
                      margin-bottom: 10px;
                    }
                    p {
                      color: #6B7280;
                      line-height: 1.6;
                      margin-bottom: 20px;
                    }
                    button {
                      background: linear-gradient(45deg, #10B981, #3B82F6);
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 10px;
                      font-weight: 600;
                      cursor: pointer;
                      transition: transform 0.2s;
                    }
                    button:hover {
                      transform: scale(1.05);
                    }
                    @keyframes bounce {
                      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
                      40%, 43% { transform: translate3d(0,-20px,0); }
                      70% { transform: translate3d(0,-10px,0); }
                      90% { transform: translate3d(0,-4px,0); }
                    }
                    .bounce { animation: bounce 2s infinite; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon bounce">📚</div>
                    <h1>Library Offline</h1>
                    <p>You're currently offline, but don't worry! The Montessori Library app works offline too.</p>
                    <p>Check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                  </div>
                </body>
                </html>
                `,
                {
                  headers: {
                    'Content-Type': 'text/html',
                  },
                }
              );
            }
            
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});

// Handle background sync for book returns/checkouts when back online
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background Sync', event.tag);
  
  if (event.tag === 'book-sync') {
    event.waitUntil(
      // Sync pending book transactions when back online
      syncPendingTransactions()
    );
  }
});

// Handle push notifications for overdue books
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received');
  
  const options = {
    body: event.data ? event.data.text() : 'You have overdue books to return!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'view',
        title: 'View Books',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Montessori Library', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification Click');
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/return')
    );
  }
});

// Utility function to sync pending transactions
async function syncPendingTransactions() {
  try {
    // This would typically sync with your backend API
    console.log('Service Worker: Syncing pending transactions');
    
    // Get pending transactions from IndexedDB or localStorage
    // Send to server when back online
    // Update local cache with server response
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
    throw error;
  }
}

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded');