/**
 * theme.js — Gestion du thème clair/sombre partagée entre toutes les pages.
 *
 * Usage : inclure ce fichier APRÈS le DOM (bas de <body>) ou avec defer.
 * Prérequis dans le HTML :
 *   - Un bouton  id="themeToggleBtn"
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
        const iconEye = document.getElementById('icon-eye');
        if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'block' : 'none';
        if (iconMoon) iconMoon.style.display = theme === 'light' ? 'block' : 'none';
        if (iconEye)  iconEye.style.display  = theme === 'high-contrast' ? 'block' : 'none';

        const themeToggleText = document.getElementById('themeToggleText');
        if (themeToggleText) {
            if (theme === 'dark') themeToggleText.textContent = 'Mode Contraste';
            else if (theme === 'high-contrast') themeToggleText.textContent = 'Mode Clair';
            else themeToggleText.textContent = 'Mode Sombre';
        }

        if (typeof window.__onThemeChange === 'function') {
            window.__onThemeChange(theme);
        }
    }

    const saved = localStorage.getItem('global_theme') || 'light';
    setTheme(saved);

    window.toggleTheme = function () {
        if (document.body.classList.contains('dark')) {
            setTheme('high-contrast');
        } else if (document.body.classList.contains('high-contrast')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };


    // Gestion des événements du Header
    document.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', window.toggleTheme);
        }

        const optionsBtn = document.getElementById('optionsMenuBtn');
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
    });
})();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Find the relative path to the root from the current page.
        // Assuming all pages are either at root, or 1 level deep (e.g., webapps/),
        // or 2 levels deep (alpha/webapps/, webapps/teacher/).
        let rootPath = './';
        if (window.location.pathname.includes('/webapps/')) {
            if (window.location.pathname.includes('/alpha/') || window.location.pathname.includes('/teacher/')) {
                rootPath = '../../';
            } else {
                rootPath = '../';
            }
        }

        navigator.serviceWorker.register(rootPath + 'sw.js').catch(() => {
            // silent fail
        });
    });
}
