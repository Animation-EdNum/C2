const CACHE_NAME = 'ednum-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.svg',
    './icon-192.png',
    './icon-512.png',

    // CSS
    './css/shared.css',

    // JS
    './js/audio.js',
    './js/confetti.js',
    './js/lucide.min.js',
    './js/scores.js',
    './js/swipe.js',
    './js/theme.js',

    // Fonts
    './fonts/jetbrains-mono.woff2',
    './fonts/outfit.woff2',

    // Webapps
    './webapps/binaire_codage.html',
    './webapps/binaire_message.html',
    './webapps/binaire_studio.html',
    './webapps/bit_de_parite.html',
    './webapps/routage_reseau.html',
    './webapps/simulateur_bluebot.html',
    './webapps/train_pirate.html',

    // Ressources
    './ressources/bareme.html',
    './ressources/tirage.html'
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
        caches.match(event.request)
            .then(response => {
                // Retourne la réponse du cache si trouvée
                if (response) {
                    return response;
                }

                // Sinon, on fait la requête réseau
                return fetch(event.request).then(
                    function(response) {
                        // On vérifie qu'on a bien reçu une réponse valide
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // On clone la réponse car elle ne peut être consommée qu'une fois
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
