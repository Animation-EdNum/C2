const CACHE_NAME = 'ednum-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',

  // CSS
  './css/shared.css',

  // Fonts
  './fonts/outfit.woff2',
  './fonts/jetbrains-mono.woff2',

  // JS
  './js/lucide.min.js',
  './js/swipe.js',
  './js/theme.js',
  './js/audio.js',
  './js/confetti.js',
  './js/scores.js',

  // Webapps
  './webapps/simulateur_bluebot.html',
  './webapps/binaire_studio.html',
  './webapps/binaire_codage.html',
  './webapps/binaire_message.html',
  './webapps/routage_reseau.html',
  './webapps/bit_de_parite.html',
  './webapps/mats/city.png',

  // Alpha Webapps
  './alpha/webapps/machine_a_trier.html',
  './alpha/webapps/jeu_de_la_grue.html',
  './alpha/webapps/pixels_binaires.html',
  './alpha/webapps/pixel_studio_rvb.html',
  './alpha/webapps/reseau_de_tri.html',
  './alpha/webapps/machine_a_chiffrer.html',

  // Ressources
  './ressources/bareme.html',
  './ressources/tirage.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
