/*
 * Copyright (C) 2026 Animation-EdNum (HEP-VS)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * theme.js — Gestion du thème clair/sombre partagée entre toutes les pages.
 *
 * Usage : inclure ce fichier APRÈS le DOM (bas de <body>) ou avec defer.
 * Prérequis dans le HTML :
 *   - Un bouton  id="theme-toggle-btn"
 *   - Un svg     id="icon-sun"  (affiché en mode sombre)
 *   - Un svg     id="icon-moon" (affiché en mode clair)
 *
 * Persistance : localStorage('global_theme') = 'light' | 'dark'
 *
 * Note : certaines pages (routage_reseau) peuvent définir un callback
 * window.__onThemeChange(theme) pour déclencher des traitements supplémentaires.
 */

(function () {


    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('high-contrast'); document.body.classList.add('dark');
        } else {
            if (theme === 'high-contrast') { document.body.classList.remove('dark'); document.body.classList.add('high-contrast'); } else { document.body.classList.remove('dark', 'high-contrast'); }
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


    // Gestion des événements du Header
    document.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', window.toggleTheme);
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
    });
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

        navigator.serviceWorker.register(rootPath + 'sw.js').catch(() => {
            // silent fail
        });
    });
}
