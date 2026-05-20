# 🔍 Audit de Code Global — Suite Éducation Numérique C2

> **Date :** 20 mai 2026 · **Auditeur :** Antigravity (Gemini 3.5 Flash)  
> **Contexte :** HEP-VS (AP-EdNum), Valais, Suisse  
> **Périmètre :** Suite C2 complète (Portails généraux, applications élèves dans `webapps/`, modules expérimentaux dans `alpha/webapps/`, ressources enseignant dans `webapps/teacher/`, framework d'assets partagés dans `assets/`, tests E2E/Unitaires et automatisation CI/CD)

---

## 1. Résumé exécutif & Progression historique

Depuis les premiers audits d'avril et début mai 2026, la suite **C2** de l'HEP-VS a connu une progression technique et structurelle remarquable. 

### 🏆 Succès majeurs et résolutions
1. **Démantèlement du monolithe `simulateur_bluebot.html`** : L'ancien fichier de 237 Ko regroupant tout le code HTML, CSS et JS a été entièrement refactorisé. La logique est désormais proprement segmentée en modules partagés de haute qualité dans `assets/js/automate/` (`automate-engine.js`, `automate-skins.js`, `automate-ui.js`, `automate-main.js`) et le style extrait dans `assets/css/automate.css`.
2. **Pipeline de tests CI/CD E2E de pointe** : L'implémentation de la suite Playwright/pytest et de la configuration de GitHub Actions (`e2e-tests.yml`) avec filtrage ciblé par fichier (`dorny/paths-filter`) permet une validation de non-régression extrêmement rapide et hautement optimisée en cas de modification.
3. **Résolution des bugs critiques** : 
   - Le correctif garantissant que le skin `botanique` se débloque correctement dans tous les modes interactifs de l'automate (et pas seulement le mode simulateur) a été fusionné avec succès.
   - Les injections de Service Worker dupliquées dans `theme.js` ont été résolues au profit d'un cycle de vie unifié.
   - L'unification du gestionnaire de notifications Toast (`toast.js`) a éradiqué la duplication de code et réparé les problèmes de contraste visuel (toasts invisibles en mode clair dans `binaire_studio`).
   - L'escaping HTML systématique dans `scores.js` a sécurisé le module contre toute faille XSS potentielle liée à des injections via `localStorage`.

### 📊 Tableau de bord technique de la suite C2

| Métrique / Élément | Statut | Commentaire / Impact |
|---|---|---|
| **Architecture** | **Excellent** | Pile 100% Vanilla (HTML, CSS Variables, ES6+ native). Zéro dépendance bloquante. |
| **Maintenabilité** | **Élevé** (↑) | Splitting du simulateur en modules JS et CSS isolés. |
| **Couverture de Tests** | **Très Élevé** (↑) | Tests unitaires Node.js natifs et tests E2E Playwright couvrant les scénarios complexes. |
| **Stratégie Hors-Ligne (PWA)** | **Robuste** | Service Worker configuré avec Stale-While-Revalidate et manifest local. |
| **Sécurité (CSP / Injection)** | **Moyen-Élevé** | Escaping DOM en place. Quelques gestionnaires d'événements inline subsistent. |
| **Performance de chargement** | **Élevé** | Amélioration radicale grâce au tree-shaking des icônes FontAwesome (`fa-subset.js`). |

> **Score technique global estimé : 9.0 / 10** *(Progression nette par rapport au 7.5 / 10 du mois d'avril).*

---

## 2. Audit d'Architecture & Performance

### ⚡ 2.1 Limitation des requêtes render-blocking via `@import` dans `shared.css`
Le système de styles de la suite C2 repose sur un fichier racine `assets/css/shared.css` qui orchestre l'importation de 4 sous-fichiers :
```css
@import url('tokens.css');
@import url('base.css');
@import url('components.css');
@import url('utilities.css');
```
Bien que cette structure soit d'une élégance et d'une clarté conceptuelle parfaites en développement, elle engendre un comportement sous-optimal dans le navigateur. Les directives `@import` natives imposent des requêtes réseau en cascade : le navigateur doit télécharger et analyser `shared.css`, puis sérialiser le téléchargement de `tokens.css`, `base.css`, etc. Cela rallonge inutilement le temps de render-blocking critique de la page (FCP - *First Contentful Paint*).

**Recommandation :**
*   **Option A (Sans étape de build) :** Dans chaque fichier HTML, charger directement les stylesheets de manière parallèle via des balises `<link>` séparées, éliminant ainsi le recours aux `@import` d'un fichier intermédiaire :
    ```html
    <link rel="stylesheet" href="../assets/css/tokens.css">
    <link rel="stylesheet" href="../assets/css/base.css">
    <link rel="stylesheet" href="../assets/css/components.css">
    <link rel="stylesheet" href="../assets/css/utilities.css">
    ```
*   **Option B (Avec étape de build minimaliste) :** Ajouter un script simple en Node (ex. `meta/scripts/compile-css.js`) pour concaténer ces quatre fichiers dans un unique `shared.bundle.css` optimisé lors du déploiement en production, en conservant l'organisation propre en fichiers séparés pour le développement local.

---

### 📡 2.2 UX de Revalidation PWA : Activation instantanée du Service Worker
La suite C2 emploie une stratégie réseau **Stale-While-Revalidate (SWR)** dans `sw.js`. C'est un choix idéal pour une PWA offline-first en classe, car l'application répond instantanément à partir du cache local, tout en vérifiant et téléchargeant les mises à jour en tâche de fond.

Cependant, le cycle de vie du Service Worker comporte une limite majeure dans sa configuration actuelle :
> [!WARNING]
> Lorsqu'un nouvel enseignant ou élève charge la page après le déploiement d'une correction de bug ou d'une nouvelle fonctionnalité, le Service Worker télécharge la mise à jour en arrière-plan, mais **ne l'active pas immédiatement** pour ne pas perturber la session active. L'utilisateur utilise donc la version obsolète (parfois buggée) et ne découvrira la version corrigée qu'au **deuxième rechargement complet** de la page (ou après fermeture de tous les onglets).

#### Solution : Notification visuelle de mise à jour avec activation manuelle
Il est fortement recommandé d'implémenter un détecteur de mise à jour dans `theme.js` qui informe l'utilisateur (via un bandeau discret ou un Toast interactif) de la présence d'une nouvelle version et lui propose de redémarrer instantanément l'application.

##### Étape 1 : Écouter la mise à jour dans `sw.js`
Ajouter un écouteur de messages dans `sw.js` pour forcer l'activation immédiate :
```js
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
```

##### Étape 2 : Détecter et avertir dans `assets/js/theme.js`
Modifier la fonction d'enregistrement du Service Worker pour détecter la disponibilité d'une mise à jour :
```js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        let rootPath = './';
        const rootLink = document.querySelector('link[rel="root"]');
        if (rootLink) {
            rootPath = rootLink.getAttribute('href');
            if (!rootPath.endsWith('/')) rootPath += '/';
        }

        navigator.serviceWorker.register(rootPath + 'sw.js').then(reg => {
            // Surveiller les mises à jour ultérieures
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Un nouveau service worker a été installé (mise à jour dispo !)
                        showUpdateNotification(newWorker);
                    }
                });
            });
        }).catch(() => {
            // silent fail
        });
    });
}

function showUpdateNotification(worker) {
    // Créer une bannière de notification interactive (ex: via toast.js amélioré ou modal)
    const banner = document.createElement('div');
    banner.className = 'c2-toast info update-prompt';
    banner.style.pointerEvents = 'auto';
    banner.innerHTML = `
        <span>Nouvelle version disponible !</span>
        <button id="btn-reload-pwa" class="btn btn-small btn-new" style="margin-left: 10px; padding: 4px 8px; font-size: 0.85em;">Mettre à jour</button>
    `;
    
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    container.appendChild(banner);

    document.getElementById('btn-reload-pwa').addEventListener('click', () => {
        // Envoyer le message d'activation au service worker
        worker.postMessage('skipWaiting');
        
        // Écouter le changement de contrôleur pour recharger la page proprement
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    });
}
```

---

### 🏷️ 2.3 Automatisation du versioning du cache dans `generate-sw-manifest.js`
Actuellement, `sw.js` utilise une variable codée en dur pour identifier le cache : `const CACHE_NAME = 'ednum-v1';`. Lors de la modification des ressources de l'application, le script `generate-sw-manifest.js` reconstruit proprement la liste `ASSETS`, mais le développeur doit se souvenir d'incrémenter manuellement `CACHE_NAME` dans `sw.js` pour forcer la suppression des anciens caches réseau par les navigateurs clients.

**Recommandation :**
Modifier `generate-sw-manifest.js` pour qu'il injecte dynamiquement un timestamp de génération ou une somme de contrôle (hash md5 des fichiers) directement dans la déclaration de la constante `CACHE_NAME` du Service Worker :
```js
// Dans generate-sw-manifest.js
const versionHash = Date.now().toString(36); // Génère un identifiant unique basé sur la date
const cacheRegex = /const CACHE_NAME = '[\s\S]*?';/;
swContent = swContent.replace(cacheRegex, `const CACHE_NAME = 'ednum-${versionHash}';`);
```
Ceci garantit un cycle de cache-busting infaillible et 100% automatisé à chaque exécution du script de mise à jour des manifests.

---

## 3. Audit de Qualité de Code & Maintenance

### 🔒 3.1 Élimination des gestionnaires d'événements inline (Conformité CSP)
Bien que les risques d'injection de script soient désormais parfaitement circonscrits grâce à la fonction de filtrage de caractères `_escapeHtml` dans le gestionnaire de scores (`scores.js`), il subsiste des déclarations d'événements inline au sein du HTML injecté pour la boîte de dialogue de statistiques :
```js
// assets/js/scores.js:234
<button class="ui-btn-close" onclick="ScoreManager.closeModal()" aria-label="Fermer">✖</button>
// assets/js/scores.js:236
<button class="btn-reset-scores" onclick="ScoreManager.resetScores()">Réinitialiser les scores</button>
```
Les attributs `onclick` inline lient le fonctionnement de l'application à la présence d'une variable globale (`ScoreManager`) et contreviennent aux standards modernes de sécurité en interdisant le déploiement d'une politique de sécurité de contenu stricte (CSP - *Content Security Policy*) sans l'attribut permissif `'unsafe-inline'`.

**Recommandation :**
Retirer les attributs `onclick` des chaînes HTML de `scores.js` et attacher les écouteurs d'événements via la méthode DOM standard `addEventListener` immédiatement après l'injection dans le document :
```js
injectModalHtml() {
    if (document.getElementById('score-details-modal')) return;

    const modalHtml = `
        <div id="score-details-modal" class="ui-modal-overlay" aria-hidden="true" role="dialog" aria-labelledby="score-modal-title">
            <div class="ui-modal-content" id="score-modal-content">
                <h2 id="score-modal-title">📊 Statistiques détaillées</h2>
                <button class="ui-btn-close" id="btn-close-scores" aria-label="Fermer">✖</button>
                <div id="score-modal-body"></div>
                <button class="btn-reset-scores" id="btn-reset-scores-action">Réinitialiser les scores</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Attacher les écouteurs d'événements proprement
    document.getElementById('btn-close-scores').addEventListener('click', () => this.closeModal());
    document.getElementById('btn-reset-scores-action').addEventListener('click', () => this.resetScores());
    
    this.addSwipeToClose();
}
```

---

### 📦 3.2 Transition et factorisation des applications Alpha
Les webapps expérimentales situées sous `alpha/webapps/` (`machine_a_trier.html`, `jeu_de_la_grue.html`, `reseau_de_tri.html`) affichent une inventivité pédagogique exceptionnelle et une excellente robustesse fonctionnelle. Cependant, elles comportent encore d'importants blocs de styles CSS et de scripts JS embarqués directement dans leurs fichiers HTML individuels. 

Dans l'optique de la stabilisation de ces outils et de leur future intégration en tant qu'applications stabilisées majeures dans `webapps/` :
- **CSS global :** Plusieurs centaines de lignes de styles (comme les modaux personnalisés, les boutons d'action ou les grilles cartographiques) pourraient être factorisées. Nous recommandons de centraliser les patterns répétitifs dans `assets/css/components.css` et `assets/css/utilities.css` afin d'alléger la taille de ces applications.
- **Grille et Drag-and-Drop :** Plusieurs scripts locaux dans les modules expérimentaux recréent de mini-gestionnaires de grilles de jeu ou de drag-and-drop. Introduire une abstraction paramétrable minimaliste dans un fichier JS partagé (ex. `assets/js/grid-utils.js`) simplifierait considérablement la maintenance à long terme.

---

### 🛠️ 3.3 Robustesse et résilience de l'outil de génération d'icônes `generate_fa_subset.js`
Le script `meta/scripts/generate_fa_subset.js` est une formidable prouesse technique. Il analyse l'ensemble du répertoire de code à la recherche des balises FontAwesome `<i data-fa="...">` ou `<i class="fa-...">` et génère un subset d'icônes ultra-optimisé dans `assets/js/fa-subset.js`. Cela permet de profiter de la puissance esthétique de FontAwesome 7 Pro sans s'encombrer d'un chargement de fichier de plusieurs mégaoctets en situation hors-ligne.

Cependant, le script dépend étroitement d'une variable d'environnement `FA_SUBSET_DIR` pointant vers le dépôt propriétaire de FontAwesome. Si un développeur tiers clone le projet localement et tente de lancer une modification sans disposer de ce répertoire spécifique, le script échoue.

**Recommandation :**
Ajouter des mécanismes de repli (*fallbacks*) conviviaux et de meilleures alertes de diagnostic pour les développeurs externes :
- Détecter de manière claire si `FA_SUBSET_DIR` ou les ressources minimales sont absentes et afficher un message d'explication pédagogique dans la console.
- Proposer de télécharger ou d'employer un sous-ensemble par défaut d'icônes open-source pré-générées pour permettre l'exécution et les tests en local sans posséder de licence FontAwesome Pro.

---

## 4. Accessibilité (A11y) & Expérience sur Tableau Blanc Interactif (TBI)

Les écoles primaires font un usage massif de **Tableaux Blancs Interactifs (TBI)** et de tablettes tactiles. L'ergonomie de la suite C2 sur ces supports doit faire l'objet d'une attention constante.

### 🎯 4.1 Retours visuels et zones de clic adaptées sur TBI
- **Zones tactiles larges** : La suite respecte scrupuleusement le standard WCAG avec des tailles minimales de `44px x 44px` pour les boutons. C'est une excellente pratique qui évite les frustrations des enfants devant un écran tactile TBI parfois imprécis.
- **Micro-animations d'appui** : Pour les élèves manipulant des éléments physiques ou des boutons virtuels (ex. le pavé de commande de l'automate), l'absence de retour haptique physique sur écran tactile rend indispensable un retour visuel d'activation instantané. Les effets de transition active (`:active { transform: scale(0.95); }`) dans le fichier `assets/css/components.css` sont excellents mais mériteraient d'être étendus à la grille tactile de pilotage pour confirmer le clic sur TBI.

### ⌨️ 4.2 Améliorations WCAG 2.1 AA pour les lecteurs d'écran
Pour renforcer l'inclusivité numérique et assurer une parfaite conformité avec les directives d'accessibilité en milieu scolaire :
- **Liaison explicite des étiquettes (`<label>`)** : S'assurer que tous les commutateurs personnalisés de la boîte de dialogue de partage (`url-params.js`) possèdent un attribut `for` pointant vers l'identifiant exact de la balise `<input type="checkbox">` associée. Cela permet aux lecteurs d'écran d'énoncer clairement l'intitulé de la commande lors de la prise de focus.
- **Indicateur de rôle de recherche** : Pour le moteur de recherche d'activités sur les pages portails d'accueil (`index.html` / `indexC1.html`), structurer le conteneur du champ de saisie avec la balise sémantique `<form role="search">` ou l'attribut ARIA correspondant.
- **Support clavier pour le Drag-and-Drop** : Dans le simulateur d'automate, l'interaction consistant à glisser-déposer des obstacles ou des trésors directement sur la grille interactive est très intuitive sur tablette. Cependant, elle est inaccessible à un élève naviguant exclusivement au clavier. Il serait idéal d'offrir une alternative de pose séquentielle au clavier (ex. sélectionner un trésor puis appuyer sur `Entrée` après s'être déplacé dans la grille avec les flèches directionnelles).

---

## 5. Plan d'action prioritaire & Backlog

Pour guider les futures itérations de développement sur la suite C2, voici les recommandations classées par impact et niveau d'effort requis :

### 🔴 Impact Immédiat / Effort Faible (À réaliser en priorité)
1.  **Parallélisation des CSS :** Remplacer les `@import` sériels dans `shared.css` par l'injection directe des balises `<link>` correspondantes dans les en-têtes HTML afin d'optimiser le premier rendu d'affichage (FCP).
2.  **Versioning automatisé du cache :** Mettre à jour `generate-sw-manifest.js` pour insérer automatiquement une clé de hashage unique dans `CACHE_NAME` afin d'éviter toute erreur de cache humaine en production.
3.  **Nettoyage CSP des écouteurs d'événements :** Retirer les attributs `onclick` inline de la structure modale dans `scores.js` et les lier via des sélecteurs DOM standard `addEventListener`.

### 🟡 Impact Élevé / Effort Moyen (Prochaines sessions)
4.  **Prompt d'activation SW :** Configurer les écouteurs de mise à jour de Service Worker dans `theme.js` et implémenter le message de notification `skipWaiting` pour forcer le rafraîchissement applicatif au premier clic sur le TBI de la classe.
5.  **Robustesse locale du subset FontAwesome :** Modifier le script `generate_fa_subset.js` pour tolérer l'absence de la variable d'environnement `FA_SUBSET_DIR` en fournissant un message d'erreur d'accompagnement clair ou un jeu d'icônes par défaut.

### 🟢 Long Terme / Alignement Architectural
6.  **Rationalisation de la suite Alpha :** Concevoir un plan de factorisation CSS et JS des applications au fur et à mesure de leur maturation en vue de leur sortie de la phase "Alpha", en créant un module partagé `assets/js/grid-utils.js`.
7.  **Inclusivité WCAG étendue :** Fournir des alternatives clavier interactives pour le positionnement d'objets sur les grilles de simulation.

---

### Conclusion générale
La suite **C2** de l'HEP-VS est un modèle remarquable de développement web moderne. Elle prouve de façon incontestable que l'utilisation d'une pile logicielle de pointe **100% Vanilla et sans aucune dépendance framework externe** permet d'obtenir des performances visuelles exceptionnelles, une réactivité hors-ligne totale et une fiabilité à toute épreuve dans un contexte scolaire. 

Les ajustements suggérés dans cet audit n'ont pas pour but de restructurer un système défaillant, mais plutôt de parfaire et de raffiner une architecture déjà particulièrement saine, performante et magnifiquement maintenue.

*Audit de code réalisé par analyse statique approfondie de l'intégralité du dépôt source local C2.*
