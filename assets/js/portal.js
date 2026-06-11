/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
async function loadRegistry() {
    return window.REGISTRY || [];
}

function renderBadges(badges) {
    if (!badges || badges.length === 0) return null;
    const wrapper = document.createElement('div');
    wrapper.className = 'badges-wrapper';
    for (const b of badges) {
        const span = document.createElement('span');
        let classes = 'badge';
        if (b.grey) classes += ' grey';
        if (b.text === 'Évaluation' || b.text === 'Gestion de classe' || b.text === 'Animation' || b.text === 'Outils libres' || b.text === 'Ressources') {
            classes += ' prof';
        }
        span.className = classes;
        span.textContent = b.text;
        wrapper.appendChild(span);
    }
    return wrapper;
}

function renderTags(tags) {
    if (!tags || tags.length === 0) return null;
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
    const classes = ['card'];
    if (app.isAlpha) classes.push('alpha-app');
    if (app.isExternal) classes.push('external');
    if (app.isTeacher) classes.push('teacher');

    const a = document.createElement('a');
    a.href = app.href;
    if (app.target) a.target = app.target;
    if (app.rel) a.rel = app.rel;
    a.className = classes.join(' ');
    a.setAttribute('data-level', app.dataLevel || '');
    if (app.id) a.setAttribute('data-id', app.id);
    if (app.id === 'app-reseau-tri' || app.id === 'app-jeu-grue') {
        a.style.display = 'none';
    }

    const badgesElement = renderBadges(app.badges);
    if (badgesElement) a.appendChild(badgesElement);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    if (app.icon) {
        const i = document.createElement('i');
        i.setAttribute('data-fa', app.icon);
        if (app.iconStyle) i.setAttribute('style', app.iconStyle);
        titleDiv.appendChild(i);
        // Ensure there is a space if there's text after the icon, as in the template
        titleDiv.appendChild(document.createTextNode(' '));
    }
    titleDiv.appendChild(document.createTextNode(app.title || ''));
    a.appendChild(titleDiv);

    if (app.desc) {
        const descDiv = document.createElement('div');
        descDiv.className = 'card-desc';
        descDiv.textContent = app.desc;
        a.appendChild(descDiv);
    }

    const tagsElement = renderTags(app.tags);
    if (tagsElement) a.appendChild(tagsElement);

    if (app.ref) {
        const refDiv = document.createElement('div');
        refDiv.className = 'card-ref';
        const refIcon = document.createElement('i');
        refIcon.setAttribute('data-fa', 'book-open-reader');
        refDiv.appendChild(refIcon);
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
        a.setAttribute('style', app.style);
    }

    const mainIconDiv = document.createElement('div');
    mainIconDiv.className = 'card-icon-main';
    if (app.c1Icon) {
        const i = document.createElement('i');
        i.setAttribute('data-fa', app.c1Icon);
        i.setAttribute('style', 'color: #fff;');
        mainIconDiv.appendChild(i);
    }
    a.appendChild(mainIconDiv);

    const smallIconsDiv = document.createElement('div');
    smallIconsDiv.className = 'card-icons-small';
    smallIconsDiv.setAttribute('style', 'color: #fff;');
    for (const icon of (app.c1SmallIcons || [])) {
        const i = document.createElement('i');
        i.setAttribute('data-fa', icon);
        smallIconsDiv.appendChild(i);
        smallIconsDiv.appendChild(document.createTextNode('\n                    '));
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
