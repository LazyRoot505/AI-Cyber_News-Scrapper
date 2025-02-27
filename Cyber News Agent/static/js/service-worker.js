// Service Worker for CyberNews Hub
const CACHE_NAME = 'cybernews-v1';
const STATIC_ASSETS = [
    '/',
    '/static/css/styles.css',
    '/static/js/service-worker.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:wght@400;700&display=swap'
];

const API_CACHE_NAME = 'cybernews-api-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(name => {
                        return name !== CACHE_NAME && 
                               name !== API_CACHE_NAME;
                    }).map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    // Handle API requests
    if (event.request.url.includes('/api/')) {
        event.respondWith(handleApiRequest(event.request));
        return;
    }

    // Handle static assets
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

// Handle API requests with network-first strategy and caching
async function handleApiRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        const responseToCache = networkResponse.clone();
        
        // Cache the response with timestamp
        const cache = await caches.open(API_CACHE_NAME);
        const data = {
            response: responseToCache,
            timestamp: Date.now()
        };
        await cache.put(request, new Response(JSON.stringify(data)));
        
        return networkResponse;
    } catch (error) {
        // If network fails, try cache
        const cache = await caches.open(API_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            const data = await cachedResponse.json();
            
            // Check if cache is still valid
            if (Date.now() - data.timestamp < API_CACHE_DURATION) {
                return new Response(JSON.stringify(data.response));
            }
        }
        
        // If no valid cache, show offline content
        return new Response(JSON.stringify({
            error: 'You are offline',
            offline: true,
            timestamp: Date.now()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/static/images/icon.png',
        badge: '/static/images/badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View Alert'
            },
            {
                action: 'close',
                title: 'Dismiss'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('CyberNews Alert', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/?alert=' + event.notification.data.primaryKey)
        );
    }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-bookmarks') {
        event.waitUntil(syncBookmarks());
    }
});

// Sync bookmarks when online
async function syncBookmarks() {
    const cache = await caches.open(API_CACHE_NAME);
    const offlineBookmarks = await cache.match('offline-bookmarks');
    
    if (offlineBookmarks) {
        const bookmarks = await offlineBookmarks.json();
        
        // Sync each bookmark
        await Promise.all(bookmarks.map(async bookmark => {
            try {
                await fetch('/api/news/' + bookmark.id + '/bookmark', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookmark)
                });
            } catch (error) {
                console.error('Failed to sync bookmark:', error);
            }
        }));
        
        // Clear offline bookmarks
        await cache.delete('offline-bookmarks');
    }
}
