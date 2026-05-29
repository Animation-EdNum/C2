/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * theme.js — Gestion du thème clair/sombre/contraste élevé partagée entre toutes les pages.
 *
 * Usage : inclure ce fichier APRÈS le DOM (bas de <body>) ou avec defer.
 * Prérequis dans le HTML :
 *   - Un bouton  id="theme-toggle-btn"
 *   - Un svg     id="icon-sun"  (affiché en mode sombre)
 *   - Un svg     id="icon-moon" (affiché en mode clair)
 *
 * Persistance : localStorage('global_theme') = 'light' | 'dark' | 'high-contrast'
 */

(function () {

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('high-contrast');
            document.body.classList.add('dark');
        } else if (theme === 'high-contrast') {
            document.body.classList.remove('dark');
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('dark', 'high-contrast');
        }
        localStorage.setItem('global_theme', theme);

        const iconSun = document.getElementById('icon-sun');
        const iconMoon= document.getElementById('icon-moon');
        if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'block' : 'none';
        if (iconMoon) iconMoon.style.display = theme === 'light' ? 'block' : 'none';

        const themeToggleText = document.getElementById('themeToggleText');
        if (themeToggleText) {
            if (theme === 'dark') themeToggleText.textContent = 'Clair';
            else themeToggleText.textContent = 'Sombre';
        }

        // Mettre à jour le texte du bouton contraste élevé s'il existe
        const hcToggleText = document.getElementById('hcToggleText');
        if (hcToggleText) {
            if (theme === 'high-contrast') {
                hcToggleText.textContent = 'Désactiver contraste';
            } else {
                hcToggleText.textContent = 'Contraste élevé';
            }
        }

        // Mettre à jour l'icône du bouton contraste élevé s'il existe
        const hcBtn = document.getElementById('high-contrast-toggle-btn');
        if (hcBtn) {
            const hcIcon = hcBtn.querySelector('i');
            if (hcIcon) {
                if (theme === 'high-contrast') {
                    hcIcon.setAttribute('data-fa', 'circle-check');
                } else {
                    hcIcon.setAttribute('data-fa', 'eye');
                }
                window.fa?.createIcons?.();
            }
        }

        if (typeof window.__onThemeChange === 'function') {
            window.__onThemeChange(theme);
        }
    }

    const saved = localStorage.getItem('global_theme') || 'light';
    setTheme(saved);

    window.toggleTheme = function () {
        if (document.body.classList.contains('dark')) {
            setTheme('light');
        } else if (document.body.classList.contains('high-contrast')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    window.toggleHighContrast = function () {
        if (document.body.classList.contains('high-contrast')) {
            setTheme('light');
        } else {
            setTheme('high-contrast');
        }
    };

    // Gestion des événements du Header
    function initHeaderEvents() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', window.toggleTheme);

            // Inscription proactive du bouton Contraste Élevé si un menu dropdown existe
            const dropdownContent = themeBtn.parentElement;
            if (dropdownContent && dropdownContent.classList.contains('settings-dropdown-content')) {
                if (!document.getElementById('high-contrast-toggle-btn')) {
                    // Créer un diviseur avant le bouton
                    const divider = document.createElement('div');
                    divider.className = 'dropdown-divider';
                    divider.id = 'hc-dropdown-divider';
                    dropdownContent.insertBefore(divider, themeBtn.nextSibling);

                    // Créer le bouton Contraste Élevé
                    const hcBtn = document.createElement('button');
                    hcBtn.className = 'menu-item-btn';
                    hcBtn.id = 'high-contrast-toggle-btn';
                    hcBtn.setAttribute('aria-label', 'Activer/Désactiver le contraste élevé');
                    
                    const savedTheme = localStorage.getItem('global_theme') || 'light';
                    const initialText = savedTheme === 'high-contrast' ? 'Désactiver contraste' : 'Contraste élevé';
                    const initialIcon = savedTheme === 'high-contrast' ? 'circle-check' : 'eye';

                    const hcIcon = document.createElement('i');
                    hcIcon.setAttribute('data-fa', initialIcon);
                    hcBtn.appendChild(hcIcon);

                    const hcText = document.createElement('span');
                    hcText.id = 'hcToggleText';
                    hcText.textContent = initialText;
                    hcBtn.appendChild(hcText);

                    // Insérer le bouton après le diviseur
                    dropdownContent.insertBefore(hcBtn, divider.nextSibling);

                    hcBtn.addEventListener('click', window.toggleHighContrast);
                    window.fa?.createIcons?.();
                }
            }
        }

        const optionsBtn = document.getElementById('options-menu-btn');
        const optionsContent = document.querySelector('.settings-dropdown-content');
        if (optionsBtn && optionsContent) {
            optionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsContent.classList.toggle('show');
            });
        }

        // Fermeture automatique du menu si on clique ailleurs
        document.addEventListener('click', (event) => {
            const content = document.querySelector('.settings-dropdown-content.show');
            if (content && !event.target.closest('.settings-dropdown')) {
                content.classList.remove('show');
            }
        });

        const resetCacheBtn = document.getElementById('reset-cache-btn');
        if (resetCacheBtn) {
            resetCacheBtn.addEventListener('click', async () => {
                if (confirm("Êtes-vous sûr de vouloir réinitialiser l'application ? Cela effacera toutes les données sauvegardées (scores, progression, cache).")) {
                    // Clear localStorage and sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();

                    // Clear cookies
                    document.cookie.split(";").forEach(function (c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });

                    // Clear caches
                    if ('caches' in window) {
                        try {
                            const cacheNames = await caches.keys();
                            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
                        } catch (e) {
                            // ignore error
                        }
                    }

                    // Unregister service workers
                    if ('serviceWorker' in navigator) {
                        try {
                            const registrations = await navigator.serviceWorker.getRegistrations();
                            for (let registration of registrations) {
                                await registration.unregister();
                            }
                        } catch (e) {
                            // ignore error
                        }
                    }

                    // Reload after a short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
            });
        }
    }

    // Sécurisation contre la condition de course PWA (Service Worker) : check readyState
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderEvents);
    } else {
        initHeaderEvents();
    }
})();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Find the relative path to the root from the current page.
        // Assuming all pages are either at root, or 1 level deep (e.g., webapps/),
        // or 2 levels deep (alpha/webapps/, webapps/teacher/).
        let rootPath = './';
        const rootLink = document.querySelector('link[rel="root"]');
        if (rootLink) {
            rootPath = rootLink.getAttribute('href');
            // Ensure rootPath ends with a slash for appending 'sw.js'
            if (!rootPath.endsWith('/')) {
                rootPath += '/';
            }
        }

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });

        navigator.serviceWorker.register(rootPath + 'sw.js').then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // A new update is available
                        if (typeof showToast === 'function') {
                            const content = document.createElement('div');
                            content.style.display = 'flex';
                            content.style.flexDirection = 'column';
                            content.style.gap = '10px';
                            
                            const text = document.createElement('span');
                            text.textContent = 'Une mise à jour de la Suite EdNum est disponible.';
                            
                            const btn = document.createElement('button');
                            btn.className = 'btn btn-primary btn-small';
                            btn.textContent = 'Mettre à jour maintenant';
                            btn.style.width = 'fit-content';
                            btn.addEventListener('click', () => {
                                newWorker.postMessage('skipWaiting');
                            });
                            
                            content.appendChild(text);
                            content.appendChild(btn);
                            
                            showToast(content, 'info', 86400000); // 24 hours
                        }
                    }
                });
            });
        }).catch(() => {
            // silent fail
        });
    });
}
