/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const CACHE_NAME = 'ednum-b5f7ee0c';
const ASSETS = [
    './',
    './index.html',
    './indexC1.html',
    './manifest.json',
    './merci.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/apprendre_pseudocode.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/coffre_fort.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/compresseur_magique.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/detective_ia.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/dresseur_neurones.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/jeu_de_la_grue.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/machine_a_chiffrer.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/machine_a_trier.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/reseau_de_tri.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/teacher/qrcode.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/alpha/webapps/teacher/sim_dyslexie.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/automate.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/base.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/binaire_codage.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/binaire_message.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/binaire_studio.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/bit_de_parite.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/components.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/compresseur_magique.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/generateur_mot_de_passe.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/routage_reseau.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/teacher.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/tokens.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/css/utilities.css',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/favicon.svg',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/fonts/jetbrains-mono.woff2',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/fonts/outfit.woff2',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/icon-192.png',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/icon-512.png',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/img/mats/city.webp',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/img/mats/valais.webp',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/audio.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/automate/automate-engine.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/automate/automate-main.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/automate/automate-skins.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/automate/automate-ui.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/confetti.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/fa-subset.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/generateur_mot_de_passe.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/index-main.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/portal.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/registry.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/scores.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/theme.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/toast.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/url-params.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/vendor/purify.min.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/js/vendor/qrious.min.js',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/assets/logo-header.svg',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/binaire_codage.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/binaire_message.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/binaire_studio.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/bit_de_parite.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/generateur_mot_de_passe.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/routage_reseau.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/simulateur_automate.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/teacher/bareme.html',
    './C:/Users/Vivian Epiney/Documents/Antigravity/C2/C2/webapps/teacher/tirage.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
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
        }).then(() => self.clients.claim())
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

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
