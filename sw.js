/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const CACHE_NAME = 'ednum-2cb0abd7';
const ASSETS = [
    './',
    './index.html',
    './indexC1.html',
    './manifest.json',
    './merci.html',
    './alpha/webapps/apprendre_pseudocode.html',
    './alpha/webapps/coffre_fort.html',
    './alpha/webapps/compresseur_magique.html',
    './alpha/webapps/detective_ia.html',
    './alpha/webapps/dresseur_neurones.html',
    './alpha/webapps/jeu_de_la_grue.html',
    './alpha/webapps/machine_a_chiffrer.html',
    './alpha/webapps/machine_a_trier.html',
    './alpha/webapps/reseau_de_tri.html',
    './alpha/webapps/teacher/sim_dyslexie.html',
    './assets/css/automate.css',
    './assets/css/base.css',
    './assets/css/binaire_codage.css',
    './assets/css/binaire_message.css',
    './assets/css/binaire_studio.css',
    './assets/css/bit_de_parite.css',
    './assets/css/components.css',
    './assets/css/compresseur_magique.css',
    './assets/css/routage_reseau.css',
    './assets/css/teacher.css',
    './assets/css/tokens.css',
    './assets/css/utilities.css',
    './assets/favicon.svg',
    './assets/fonts/jetbrains-mono.woff2',
    './assets/fonts/outfit.woff2',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './assets/img/mats/city.png',
    './assets/img/mats/valais.png',
    './assets/js/audio.js',
    './assets/js/automate/automate-engine.js',
    './assets/js/automate/automate-main.js',
    './assets/js/automate/automate-skins.js',
    './assets/js/automate/automate-ui.js',
    './assets/js/confetti.js',
    './assets/js/fa-subset.js',
    './assets/js/portal.js',
    './assets/js/registry.js',
    './assets/js/scores.js',
    './assets/js/theme.js',
    './assets/js/toast.js',
    './assets/js/url-params.js',
    './assets/js/vendor/qrious.min.js',
    './assets/logo-header.svg',
    './webapps/binaire_codage.html',
    './webapps/binaire_message.html',
    './webapps/binaire_studio.html',
    './webapps/bit_de_parite.html',
    './webapps/routage_reseau.html',
    './webapps/simulateur_automate.html',
    './webapps/teacher/bareme.html',
    './webapps/teacher/tirage.html'
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

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
