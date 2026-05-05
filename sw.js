const CACHE_NAME = 'ednum-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/favicon.svg',
    './assets/icon-192.png',
    './assets/icon-512.png',

    // CSS
    './assets/css/shared.css',

    // JS
    './assets/js/audio.js',
    './assets/js/confetti.js',
    './assets/js/fa-subset.js',
    './assets/js/scores.js',
    './assets/js/swipe.js',
    './assets/js/theme.js',
    './assets/js/toast.js',

    // Fonts
    './assets/fonts/jetbrains-mono.woff2',
    './assets/fonts/outfit.woff2',

    // Alpha Webapps
    './alpha/webapps/jeu_de_la_grue.html',
    './alpha/webapps/machine_a_chiffrer.html',
    './alpha/webapps/machine_a_trier.html',
    './alpha/webapps/pixel_studio_rvb.html',
    './alpha/webapps/pixels_binaires.html',
    './alpha/webapps/reseau_de_tri.html',

    // Webapps
    './webapps/binaire_codage.html',
    './webapps/binaire_message.html',
    './webapps/binaire_studio.html',
    './webapps/bit_de_parite.html',
    './webapps/routage_reseau.html',
    './webapps/simulateur_bluebot.html',

    // Ressources
    './webapps/teacher/bareme.html',
    './webapps/teacher/tirage.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(ASSETS);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => {
                    return name !== CACHE_NAME;
                }).map(name => {
                    return caches.delete(name);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });

            // S'assurer que le service worker reste en vie jusqu'à la fin de la mise à jour du cache
            event.waitUntil(
                fetchPromise.catch(() => {
                    // Ignorer les erreurs (ex: hors ligne)
                })
            );

            // Retourner le cache s'il existe, sinon attendre la réponse réseau
            return cachedResponse || fetchPromise;
        })
    );
});
