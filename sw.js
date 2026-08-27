/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
const CACHE_NAME = 'ednum-b0a6b987';
const ASSETS = [
    './',
    './index.html',
    './indexC1.html',
    './manifest.json',
    './merci.html',
    './home/runner/work/C2/C2/alpha/webapps/apprendre_pseudocode.html',
    './home/runner/work/C2/C2/alpha/webapps/coffre_fort.html',
    './home/runner/work/C2/C2/alpha/webapps/compresseur_magique.html',
    './home/runner/work/C2/C2/alpha/webapps/detective_ia.html',
    './home/runner/work/C2/C2/alpha/webapps/dresseur_neurones.html',
    './home/runner/work/C2/C2/alpha/webapps/jeu_de_la_grue.html',
    './home/runner/work/C2/C2/alpha/webapps/machine_a_chiffrer.html',
    './home/runner/work/C2/C2/alpha/webapps/machine_a_trier.html',
    './home/runner/work/C2/C2/alpha/webapps/reseau_de_tri.html',
    './home/runner/work/C2/C2/alpha/webapps/teacher/qrcode.html',
    './home/runner/work/C2/C2/alpha/webapps/teacher/sim_dyslexie.html',
    './home/runner/work/C2/C2/assets/css/automate.css',
    './home/runner/work/C2/C2/assets/css/base.css',
    './home/runner/work/C2/C2/assets/css/binaire_codage.css',
    './home/runner/work/C2/C2/assets/css/binaire_message.css',
    './home/runner/work/C2/C2/assets/css/binaire_studio.css',
    './home/runner/work/C2/C2/assets/css/bit_de_parite.css',
    './home/runner/work/C2/C2/assets/css/components.css',
    './home/runner/work/C2/C2/assets/css/compresseur_magique.css',
    './home/runner/work/C2/C2/assets/css/generateur_mot_de_passe.css',
    './home/runner/work/C2/C2/assets/css/routage_reseau.css',
    './home/runner/work/C2/C2/assets/css/teacher.css',
    './home/runner/work/C2/C2/assets/css/tokens.css',
    './home/runner/work/C2/C2/assets/css/utilities.css',
    './home/runner/work/C2/C2/assets/favicon.svg',
    './home/runner/work/C2/C2/assets/fonts/jetbrains-mono.woff2',
    './home/runner/work/C2/C2/assets/fonts/outfit.woff2',
    './home/runner/work/C2/C2/assets/icon-192.png',
    './home/runner/work/C2/C2/assets/icon-512.png',
    './home/runner/work/C2/C2/assets/img/mats/city.webp',
    './home/runner/work/C2/C2/assets/img/mats/valais.webp',
    './home/runner/work/C2/C2/assets/js/audio.js',
    './home/runner/work/C2/C2/assets/js/automate/automate-engine.js',
    './home/runner/work/C2/C2/assets/js/automate/automate-main.js',
    './home/runner/work/C2/C2/assets/js/automate/automate-skins.js',
    './home/runner/work/C2/C2/assets/js/automate/automate-ui.js',
    './home/runner/work/C2/C2/assets/js/confetti.js',
    './home/runner/work/C2/C2/assets/js/fa-subset.js',
    './home/runner/work/C2/C2/assets/js/generateur_mot_de_passe.js',
    './home/runner/work/C2/C2/assets/js/index-main.js',
    './home/runner/work/C2/C2/assets/js/portal.js',
    './home/runner/work/C2/C2/assets/js/registry.js',
    './home/runner/work/C2/C2/assets/js/scores.js',
    './home/runner/work/C2/C2/assets/js/theme.js',
    './home/runner/work/C2/C2/assets/js/toast.js',
    './home/runner/work/C2/C2/assets/js/url-params.js',
    './home/runner/work/C2/C2/assets/js/vendor/purify.min.js',
    './home/runner/work/C2/C2/assets/js/vendor/qrious.min.js',
    './home/runner/work/C2/C2/assets/logo-header.svg',
    './home/runner/work/C2/C2/webapps/binaire_codage.html',
    './home/runner/work/C2/C2/webapps/binaire_message.html',
    './home/runner/work/C2/C2/webapps/binaire_studio.html',
    './home/runner/work/C2/C2/webapps/bit_de_parite.html',
    './home/runner/work/C2/C2/webapps/generateur_mot_de_passe.html',
    './home/runner/work/C2/C2/webapps/routage_reseau.html',
    './home/runner/work/C2/C2/webapps/simulateur_automate.html',
    './home/runner/work/C2/C2/webapps/teacher/bareme.html',
    './home/runner/work/C2/C2/webapps/teacher/tirage.html'
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
