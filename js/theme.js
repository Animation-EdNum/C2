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
    const btn     = document.getElementById('themeToggleBtn');
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

        // Hook optionnel pour les pages qui ont besoin d'un traitement supplémentaire
        if (typeof window.__onThemeChange === 'function') {
            window.__onThemeChange(theme);
        }
    }

    // Lecture du thème sauvegardé (défaut : clair)
    const saved = localStorage.getItem('global_theme') || 'light';
    setTheme(saved);

    if (btn) {
        btn.addEventListener('click', function () {
            setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
        });
    }
})();
