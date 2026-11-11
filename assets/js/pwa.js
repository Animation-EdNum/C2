/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * pwa.js — Enregistrement du Service Worker et gestion des mises à jour PWA pour la Suite EdNum.
 *
 * Responsabilités uniques :
 *   - Détection des moteurs d'indexation / bots (contournement de pré-cache)
 *   - Enregistrement autonome de sw.js
 *   - Mise à jour automatique transparente sur le portail et au chargement initial
 *   - Notification non-bloquante de mise à jour (toast) pour les webapps avec session active
 *   - Prise en charge immédiate des workers déjà en attente (registration.waiting)
 *   - Vérifications périodiques, immédiates et à la réactivation d'onglet
 */

(function () {
    'use strict';

    // Contourner l'enregistrement pour les robots d'indexation
    // pour éviter de pré-mettre en cache ~2 Mo d'assets à chaque crawl pass.
    const isCrawler = /bot|spider|crawl|bingbot|googlebot|yandexbot|baiduspider|duckduckbot|headlesschrome|chrome-lighthouse|adsbot|mediapartners/i.test(navigator.userAgent);

    if (!('serviceWorker' in navigator) || isCrawler) {
        return;
    }

    function getRootPath() {
        let rootPath = './';
        const rootLink = document.querySelector('link[rel="root"]');
        if (rootLink) {
            rootPath = rootLink.getAttribute('href') || './';
            if (!rootPath.endsWith('/')) {
                rootPath += '/';
            }
        }
        return rootPath;
    }

    function initServiceWorker() {
        const rootPath = getRootPath();
        const hadPreviousController = !!navigator.serviceWorker.controller;
        let refreshing = false;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing && hadPreviousController) {
                refreshing = true;
                window.location.reload();
            }
        });

        // Détection de la page d'accueil / portail (index.html, indexC1.html, ou racine)
        const isPortal = !window.location.pathname.includes('/webapps/') && !window.location.pathname.includes('/alpha/webapps/');

        function applyUpdate(worker) {
            if (!worker) return;
            try {
                worker.postMessage('skipWaiting');
            } catch (e) {
                // ignore
            }
        }

        // Période de grâce : appliquer la mise à jour silencieusement dans les 30s après chargement
        // (permet de télécharger les 79 assets du pré-cache sans être coupé par un timer trop court)
        let justLoaded = true;
        const loadTimer = setTimeout(() => {
            justLoaded = false;
        }, 30000);
        if (loadTimer && typeof loadTimer.unref === 'function') {
            loadTimer.unref();
        }

        function promptOrAutoUpdate(worker) {
            if (!worker) return;

            // Sur le portail (lanceur sans données de session à préserver) ou lors du chargement initial :
            // mise à jour automatique immédiate sans bloquer l'utilisateur
            if (isPortal || justLoaded) {
                applyUpdate(worker);
                return;
            }

            // Dans une webapp en cours d'utilisation active : proposer le toast non-bloquant
            if (typeof showToast === 'function') {
                const content = document.createElement('div');
                content.className = 'c2-toast-update-content';

                const t = function (key, fallback) {
                    if (typeof window !== 'undefined' && window.I18N && typeof window.I18N.t === 'function') {
                        return window.I18N.t(key, fallback);
                    }
                    return fallback;
                };

                const text = document.createElement('span');
                text.textContent = t('pwa.update_available', 'Une mise à jour de la Suite EdNum est disponible.');

                const btn = document.createElement('button');
                btn.className = 'c2-toast-btn';

                const icon = document.createElement('i');
                icon.setAttribute('data-fa', 'arrows-rotate');

                const label = document.createElement('span');
                label.textContent = t('pwa.update_now', 'Mettre à jour maintenant');

                btn.appendChild(icon);
                btn.appendChild(document.createTextNode(' '));
                btn.appendChild(label);
                btn.addEventListener('click', () => {
                    applyUpdate(worker);
                });

                content.appendChild(text);
                content.appendChild(btn);

                showToast(content, 'info', 86400000); // 24h
            } else {
                // Si showToast n'est pas disponible, appliquer la mise à jour directement
                applyUpdate(worker);
            }
        }

        navigator.serviceWorker.register(rootPath + 'sw.js').then((registration) => {
            function trackWorker(worker) {
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed') {
                        promptOrAutoUpdate(worker);
                    }
                });
            }

            // 1. Un worker est DÉJÀ en attente (waiting) depuis une visite précédente
            if (registration.waiting) {
                promptOrAutoUpdate(registration.waiting);
            }

            // 2. Un worker est déjà en cours d'installation au moment de l'enregistrement
            if (registration.installing) {
                trackWorker(registration.installing);
            }

            // 3. Détection d'un nouveau worker en cours d'installation
            registration.addEventListener('updatefound', () => {
                trackWorker(registration.installing);
            });

            // 4. Vérifications proactives lors du retour sur l'onglet
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    justLoaded = true; // Réactiver la période de grâce lors du retour sur l'onglet
                    registration.update().then(() => {
                        if (registration.waiting) {
                            promptOrAutoUpdate(registration.waiting);
                        }
                        if (registration.installing) {
                            trackWorker(registration.installing);
                        }
                    }).catch(() => {});
                }
            });

            // 5. Vérification périodique toutes les 30 minutes
            const intervalId = setInterval(() => {
                registration.update().then(() => {
                    if (registration.waiting) {
                        promptOrAutoUpdate(registration.waiting);
                    }
                    if (registration.installing) {
                        trackWorker(registration.installing);
                    }
                }).catch(() => {});
            }, 30 * 60 * 1000);
            if (intervalId && typeof intervalId.unref === 'function') {
                intervalId.unref();
            }

            // 6. Forcer une vérification réseau immédiate à chaque chargement de page
            registration.update().then(() => {
                if (registration.waiting) {
                    promptOrAutoUpdate(registration.waiting);
                }
                if (registration.installing) {
                    trackWorker(registration.installing);
                }
            }).catch(() => {});

        }).catch(() => {
            // Échec silencieux
        });
    }

    if (document.readyState === 'complete') {
        initServiceWorker();
    } else {
        window.addEventListener('load', initServiceWorker);
    }
})();
