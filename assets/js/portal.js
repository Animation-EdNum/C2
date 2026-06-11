/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
async function loadRegistry() {
    return window.REGISTRY || [];
}

function renderBadges(badges) {
    if (!badges || badges.length === 0) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'badges-wrapper';
    badges.forEach(b => {
        const span = document.createElement('span');
        let classes = ['badge'];
        if (b.grey) classes.push('grey');
        if (['Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Ressources'].includes(b.text)) {
            classes.push('prof');
        }
        span.className = classes.join(' ');
        span.textContent = b.text;
        wrapper.appendChild(span);
    });
    return wrapper;
}

function renderTags(tags) {
    if (!tags || tags.length === 0) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'card-tags';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        wrapper.appendChild(span);
    });
    return wrapper;
}

function renderIndexCard(app) {
    const a = document.createElement('a');
    a.href = app.href;
    if (app.target) a.target = app.target;
    if (app.rel) a.rel = app.rel;

    const classes = ['card'];
    if (app.isAlpha) classes.push('alpha-app');
    if (app.isExternal) classes.push('external');
    if (app.isTeacher) classes.push('teacher');
    a.className = classes.join(' ');

    if (app.dataLevel) a.dataset.level = app.dataLevel;
    if (app.id) a.dataset.id = app.id;
    if (app.id === 'app-reseau-tri' || app.id === 'app-jeu-grue') {
        a.style.display = 'none';
    }

    const badgesEl = renderBadges(app.badges);
    if (badgesEl) a.appendChild(badgesEl);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    if (app.icon) {
        const i = document.createElement('i');
        i.dataset.fa = app.icon;
        if (app.iconStyle) i.setAttribute('style', app.iconStyle);
        titleDiv.appendChild(i);
        // Add a space after icon if text follows, similar to the template literal formatting
        titleDiv.appendChild(document.createTextNode(' '));
    }
    titleDiv.appendChild(document.createTextNode(app.title));
    a.appendChild(titleDiv);

    if (app.desc) {
        const descDiv = document.createElement('div');
        descDiv.className = 'card-desc';
        descDiv.textContent = app.desc;
        a.appendChild(descDiv);
    }

    const tagsEl = renderTags(app.tags);
    if (tagsEl) a.appendChild(tagsEl);

    if (app.ref) {
        const refDiv = document.createElement('div');
        refDiv.className = 'card-ref';
        const i = document.createElement('i');
        i.dataset.fa = 'book-open-reader';
        refDiv.appendChild(i);
        refDiv.appendChild(document.createTextNode(' ' + app.ref));
        a.appendChild(refDiv);
    }

    return a;
}

function renderC1Card(app) {
    const a = document.createElement('a');
    a.href = app.href;
    a.className = 'card';
    if (app.style) a.setAttribute('style', app.style);

    const iconMainDiv = document.createElement('div');
    iconMainDiv.className = 'card-icon-main';
    if (app.c1Icon) {
        const i = document.createElement('i');
        i.dataset.fa = app.c1Icon;
        i.style.color = '#fff';
        iconMainDiv.appendChild(i);
    }
    a.appendChild(iconMainDiv);

    const iconsSmallDiv = document.createElement('div');
    iconsSmallDiv.className = 'card-icons-small';
    iconsSmallDiv.style.color = '#fff';
    (app.c1SmallIcons || []).forEach(icon => {
        const i = document.createElement('i');
        i.dataset.fa = icon;
        iconsSmallDiv.appendChild(i);
    });
    a.appendChild(iconsSmallDiv);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = app.title;
    a.appendChild(titleDiv);

    return a;
}

window.renderPortal = async function(mode) {
    const registry = await loadRegistry();

    if (mode === 'index') {
        const studentActivitiesContainer = document.querySelector('#view-students .searchable-grid');

        let studentExternalContainer = null;
        const studentHeaders = document.querySelectorAll('#view-students h2');
        for (const h of studentHeaders) {
            if (h.textContent.includes('Ressources externes')) {
                studentExternalContainer = h.parentElement.nextElementSibling;
                break;
            }
        }

        const teacherToolsContainer = document.querySelector('#view-teachers .searchable-grid');

        let teacherExternalContainer = null;
        const teacherHeaders = document.querySelectorAll('#view-teachers h2');
        for (const h of teacherHeaders) {
            if (h.textContent.includes('Ressources externes')) {
                teacherExternalContainer = h.parentElement.nextElementSibling;
                break;
            }
        }

        if (studentActivitiesContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_activities');
            studentActivitiesContainer.replaceChildren(...apps.map(renderIndexCard));
        }
        if (studentExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'students_external');
            studentExternalContainer.replaceChildren(...apps.map(renderIndexCard));
        }
        if (teacherToolsContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_tools');
            teacherToolsContainer.replaceChildren(...apps.map(renderIndexCard));
        }
        if (teacherExternalContainer) {
            const apps = registry.filter(a => a.inIndex && a.category === 'teachers_external');
            teacherExternalContainer.replaceChildren(...apps.map(renderIndexCard));
        }

        window.fa?.createIcons?.();

        // Trigger filters
        if (typeof window.executeFilters === 'function') {
            window.executeFilters();
        }
        if (typeof window.initRecentApps === 'function') {
            window.initRecentApps();
        }

    } else if (mode === 'c1') {
        const grid = document.querySelector('main .grid');
        if (grid) {
            const apps = registry.filter(a => a.inC1);
            grid.replaceChildren(...apps.map(renderC1Card));
        }

        window.fa?.createIcons?.();
    }
};


// PWA Installation Logic
function initPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');

    if (installBtn) {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Empêche l'affichage automatique de l'invite d'installation par Chrome mini-infobar
            e.preventDefault();
            // Stash l'événement pour pouvoir le déclencher plus tard.
            deferredPrompt = e;
            // Affiche le bouton d'installation
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Affiche le prompt
                deferredPrompt.prompt();
                // Attend que l'utilisateur réponde au prompt
                const { outcome } = await deferredPrompt.userChoice;
                // L'événement ne peut être utilisé qu'une seule fois, on le réinitialise
                deferredPrompt = null;
                // On cache le bouton
                installBtn.style.display = 'none';
            }
        });

        window.addEventListener('appinstalled', () => {
            // L'application a été installée
            installBtn.style.display = 'none';
            deferredPrompt = null;
        });
    }
}

// Initialize PWA install logic when DOM is ready or portal is rendered
document.addEventListener('DOMContentLoaded', initPWAInstall);
