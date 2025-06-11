const CACHE_NAME = 'ai-life-coach-v1.0.0';
const STATIC_CACHE_NAME = 'ai-life-coach-static-v1.0.0';

//static assets to cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css', 
  '/manifest.json'
];

//cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('[SW] Failed to cache:', error);
      })
  );
});

//activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(self.clients.claim());
});

//fetch event - handle offline requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  if (event.request.url.includes('/api/')) {
    //API requests
    event.respondWith(handleApiRequest(event.request));
  } else {
    //try cache first, then network
    event.respondWith(handleStaticRequest(event.request));
  }
});

async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] API offline, returning fallback');
    
    if (request.url.includes('/chat/message')) {
      return new Response(JSON.stringify({
        success: true,
        message: {
          role: 'assistant',
          content: "I'm currently offline, but I'm still here with you. When we reconnect, I'll be able to provide more personalized support. Remember that it's okay to take things one step at a time.",
          timestamp: new Date().toISOString()
        },
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      error: 'Offline - This feature requires an internet connection',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    if (request.destination === 'document') {
      return createOfflineResponse();
    }
    throw error;
  }
}

function createOfflineResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Life Coach - Offline</title>
      <style>
        body {
          font-family: system-ui;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌐 You're Offline</h1>
        <p>AI Life Coach is currently offline, but you can still access your previous conversations.</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

console.log('[SW] Service Worker loaded');
