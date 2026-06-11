/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
async function loadRegistry() {
    return window.REGISTRY || [];
}

function renderBadges(badges) {
    if (!badges) return null;
    if (badges.length === 0) {
        const wrapper = document.createElement('div');
        wrapper.className = 'badges-wrapper';
        return wrapper;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'badges-wrapper';

    for (const b of badges) {
        const span = document.createElement('span');
        span.className = 'badge';
        if (b.grey) span.classList.add('grey');
        if (['Évaluation', 'Gestion de classe', 'Animation', 'Outils libres', 'Ressources'].includes(b.text)) {
            span.classList.add('prof');
        }
        span.textContent = b.text;
        wrapper.appendChild(span);
    }
    return wrapper;
}

function renderTags(tags) {
    if (!tags) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'card-tags';
    for (const t of tags) {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        wrapper.appendChild(span);
    }
    return wrapper;
}

function renderIndexCard(app) {
    const a = document.createElement('a');
    a.href = app.href;
    if (app.target) a.target = app.target;
    if (app.rel) a.rel = app.rel;

    a.className = 'card';
    if (app.isAlpha) a.classList.add('alpha-app');
    if (app.isExternal) a.classList.add('external');
    if (app.isTeacher) a.classList.add('teacher');

    if (app.dataLevel) a.dataset.level = app.dataLevel;
    if (app.id) a.dataset.id = app.id;

    if (app.id === 'app-reseau-tri' || app.id === 'app-jeu-grue') {
        a.style.display = 'none';
    }

    const badgesNode = renderBadges(app.badges);
    if (badgesNode) a.appendChild(badgesNode);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    if (app.icon) {
        const i = document.createElement('i');
        i.dataset.fa = app.icon;
        if (app.iconStyle) {
            i.style.cssText = app.iconStyle;
        }
        titleDiv.appendChild(i);
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

    const tagsNode = renderTags(app.tags);
    if (tagsNode) a.appendChild(tagsNode);

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
    if (app.style) {
        a.style.cssText = app.style;
    }

    const mainIconDiv = document.createElement('div');
    mainIconDiv.className = 'card-icon-main';
    if (app.c1Icon) {
        const i = document.createElement('i');
        i.dataset.fa = app.c1Icon;
        i.style.color = '#fff';
        mainIconDiv.appendChild(i);
    }
    a.appendChild(mainIconDiv);

    const smallIconsDiv = document.createElement('div');
    smallIconsDiv.className = 'card-icons-small';
    smallIconsDiv.style.color = '#fff';

    if (app.c1SmallIcons) {
        for (const icon of app.c1SmallIcons) {
            const i = document.createElement('i');
            i.dataset.fa = icon;
            smallIconsDiv.appendChild(i);
        }
    }
    a.appendChild(smallIconsDiv);

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
