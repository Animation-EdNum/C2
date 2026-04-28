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
    const iconSun = document.getElementById('icon-sun');
    const iconMoon= document.getElementById('icon-moon');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('global_theme', theme);

        if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'block' : 'none';
        if (iconMoon) iconMoon.style.display = theme === 'dark' ? 'none'  : 'block';

        const themeToggleText = document.getElementById('themeToggleText');
        if (themeToggleText) {
            themeToggleText.textContent = theme === 'dark' ? 'Mode Clair' : 'Mode Sombre';
        }

        if (typeof window.__onThemeChange === 'function') {
            window.__onThemeChange(theme);
        }
    }

    const saved = localStorage.getItem('global_theme') || 'light';
    setTheme(saved);

    window.toggleTheme = function () {
        setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
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
