/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * pwa.js — Enregistrement du Service Worker et gestion des mises à jour PWA pour la Suite EdNum.
 *
 * Responsabilités uniques :
 *   - Détection des moteurs d'indexation / bots (contournement de pré-cache)
 *   - Enregistrement autonome de sw.js
 *   - Notification non-bloquante de mise à jour (toast) et rechargement contrôlé
 *   - Vérifications périodiques et à la réactivation d'onglet
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

        // Période de grâce : appliquer la mise à jour silencieusement dans les 6s après chargement
        let justLoaded = true;
        const loadTimer = setTimeout(() => {
            justLoaded = false;
        }, 6000);
        if (loadTimer && typeof loadTimer.unref === 'function') {
            loadTimer.unref();
        }

        navigator.serviceWorker.register(rootPath + 'sw.js').then((registration) => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) {
                    return;
                }

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        if (justLoaded) {
                            newWorker.postMessage('skipWaiting');
                        } else if (typeof showToast === 'function') {
                            const content = document.createElement('div');
                            content.className = 'c2-toast-update-content';

                            const text = document.createElement('span');
                            text.textContent = 'Une mise à jour de la Suite EdNum est disponible.';

                            const btn = document.createElement('button');
                            btn.className = 'c2-toast-btn';

                            const icon = document.createElement('i');
                            icon.setAttribute('data-fa', 'arrows-rotate');

                            const label = document.createElement('span');
                            label.textContent = 'Mettre à jour maintenant';

                            btn.appendChild(icon);
                            btn.appendChild(document.createTextNode(' '));
                            btn.appendChild(label);
                            btn.addEventListener('click', () => {
                                newWorker.postMessage('skipWaiting');
                            });

                            content.appendChild(text);
                            content.appendChild(btn);

                            showToast(content, 'info', 86400000); // 24h
                        }
                    }
                });
            });

            // Vérifications proactives
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    registration.update();
                }
            });

            // Vérification périodique toutes les 60 minutes
            const intervalId = setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);
            if (intervalId && typeof intervalId.unref === 'function') {
                intervalId.unref();
            }

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
