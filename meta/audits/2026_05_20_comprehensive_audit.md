# 🔍 Audit de Code Global — Suite Éducation Numérique

> **Date :** 20 mai 2026 · **Auditeur :** Antigravity (Claude Opus 4.6 Thinking)
> **Contexte :** HEP-VS (AP-EdNum), Valais, Suisse
> **Périmètre :** Suite EdNum complète — 6 webapps stables (`webapps/`), 5 apps alpha (`alpha/webapps/`), 2 outils enseignant (`webapps/teacher/`), framework partagé (`assets/`), pipeline CI/CD, distribution npm

---

## 1. Résumé exécutif

### 📊 Tableau de bord technique

| Domaine | Score | Tendance | Éléments clés |
|---|:---:|:---:|---|
| **Architecture** | 9.5/10 | ⬆ | Vanilla stack pur, zéro build-step, modules JS bien découpés |
| **Offline / PWA** | 9/10 | ⬆ | SWR + cache-busting MD5 automatisé, mais absence de notification de mise à jour |
| **Sécurité (CSP)** | 7/10 | → | Escaping XSS systématique, mais `onclick` inline ubiquitaires (18+ occurrences) |
| **Accessibilité** | 8/10 | → | WCAG AA globalement respecté, lacunes sur le D&D clavier et `role="search"` |
| **Performance** | 9.5/10 | ⬆ | CSS compilé, FA subset optimisé, pas de `@import` sériel |
| **Tests** | 8.5/10 | ⬆ | 9 suites E2E Playwright + 2 suites unit Node.js, CI/CD avec path-filter |
| **Maintenabilité** | 8/10 | → | Registre centralisé, mais apps alpha monolithiques (31-56 Ko inline) |
| **Distribution** | 9/10 | ⬆ | Package npm `@ednum/suite-ednum` + AGPL-3.0 |

> **Score technique global : 8.6 / 10**

### 🏆 Résolutions majeures depuis les audits précédents

1. **`@import` CSS éliminés** — Le script `generate-sw-manifest.js` (L31-61) compile désormais `tokens.css`, `base.css`, `components.css` et `utilities.css` en un seul `shared.css` bundlé. Les HTML chargent directement ce fichier unique. La cascade de requêtes réseau est éradiquée.
2. **Cache-busting automatisé** — `generate-sw-manifest.js` (L100-119) calcule un hash MD5 de l'ensemble des fichiers et l'injecte dans `CACHE_NAME`. Le versioning manuel est un problème résolu (`ednum-451b05fb`).
3. **Handlers inline purgés de `scores.js`** — La modale de statistiques (L227-253) utilise désormais `addEventListener` via des IDs dédiés (`btn-close-score-modal`, `btn-reset-scores-action`). Le commentaire en L242 confirme explicitement la conformité CSP.
4. **Toast unifié** — `toast.js` est un module centralisé (78 lignes) gérant tous les types de notification avec icônes FA7 et transition CSS propre.
5. **Registre applicatif centralisé** — `registry.js` (856 lignes) définit toutes les apps dans un tableau JSON unique, permettant de générer dynamiquement les portails `index.html` et `indexC1.html` via `portal.js`.

---

## 2. Sécurité & Conformité CSP

### 🔴 2.1 Gestionnaires d'événements `onclick` inline — 35+ occurrences restantes

**Sévérité : Élevée** · **Effort : Moyen**

L'audit précédent signalait ce problème uniquement dans `scores.js` — il y a été corrigé. Cependant, une recherche exhaustive révèle que **le problème est systémique** dans le reste de la base de code.

#### Bouton statistiques — 17 occurrences identiques

Chaque webapp contient un ou plusieurs boutons `ScoreManager.showModal()` avec un handler inline :

```html
<!-- Pattern identique dans 6 webapps stables + 4 alpha -->
<button class="icon-action-btn" onclick="ScoreManager.showModal()">
```

**Fichiers concernés :**
- `webapps/binaire_studio.html` (L672, L688, L719)
- `webapps/binaire_message.html` (L719, L797)
- `webapps/binaire_codage.html` (L1027)
- `webapps/bit_de_parite.html` (L707, L764)
- `webapps/simulateur_automate.html` (L398, L468, L568, L630)
- `webapps/routage_reseau.html` (L695)
- `alpha/webapps/jeu_de_la_grue.html` (L958)
- `alpha/webapps/machine_a_trier.html` (L353)
- `alpha/webapps/pixels_binaires.html` (L458)
- `alpha/webapps/reseau_de_tri.html` (L597)

#### Applications alpha — handlers de commande inline

`jeu_de_la_grue.html` expose 8 `onclick` inline sur les boutons de programmation (L931-948) :
```html
<button onclick="addInstruction('up')">
<button onclick="deleteLastInstruction()">
<button onclick="executeProgram()">
```

`machine_a_chiffrer.html` expose 6 `onclick` inline (L596-661) sur des actions de copie, effacement et chiffrement.

`bareme.html` (teacher) utilise des `onclick` inline pour l'export, la copie et l'impression (L454-494).

#### `automate-skins.js` — `event.stopPropagation()` inline (L284)

Un `onclick="event.stopPropagation()"` dans du HTML injecté via `innerHTML` dans le panneau de personnalisation de tapis.

**Impact :** Impossible de déployer une politique `Content-Security-Policy` sans `'unsafe-inline'` dans la directive `script-src`. Cela réduit la protection contre les injections XSS de type DOM-based.

**Recommandation :**
1. **Boutons stats** : Centraliser l'attachement dans `ScoreManager.init()` avec une délégation d'événements globale :
```js
document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="show-stats"]')) {
        ScoreManager.showModal();
    }
});
```
2. **Apps alpha** : Migrer progressivement vers `addEventListener` lors de chaque touchée de fichier.
3. **Objectif** : Pouvoir ajouter `<meta http-equiv="Content-Security-Policy" content="script-src 'self'">` à terme.

---

### 🟡 2.2 Usage de `innerHTML` — Contrôlé mais étendu

L'analyse montre **50+ utilisations** de `innerHTML` dans `assets/js/`, principalement dans le module automate. Les cas se répartissent en deux catégories :

1. **Sans risque** — Injection de contenu statique (SVGs, HTML de template) sans données utilisateur :
   - `automate-skins.js` : SVGs de commande directionnelle (L155-161), listes de skins/mats
   - `automate-engine.js` : Construction de grilles, strips de programme
   - `url-params.js` : Boutons avec icônes FA (L701, L810, L824, L853)

2. **Sécurisé par escaping** — Les données de `localStorage` passent systématiquement par `ScoreManager._escapeHtml()` (L56-60, utilisé L317, L344, L349, L354, L377, L381-383, L439).

3. **⚠ Point d'attention** — `portal.js` injecte le contenu de `registry.js` via `innerHTML` (L79-108). Bien que `registry.js` soit un fichier statique local, si un jour les données proviennent d'une source externe, cette injection serait vulnérable. Le risque actuel est **négligeable**.

---

## 3. Architecture & Performance

### ✅ 3.1 Compilation CSS — Problème résolu

L'ancien audit recommandait d'éliminer les `@import` sériels. C'est fait : `generate-sw-manifest.js` intègre une fonction `compileCSS()` (L31-61) qui concatène automatiquement les 4 fichiers source en un seul `shared.css`. Le header du fichier généré (L3-10) avertit clairement de ne pas modifier directement le bundle.

Aucune directive `@import` résiduelle n'a été trouvée dans `assets/css/`.

### ✅ 3.2 Cache-busting automatique — Problème résolu

Le versioning du cache est désormais basé sur un hash MD5 de l'ensemble des assets (L100-119 de `generate-sw-manifest.js`). Le `CACHE_NAME` actuel `ednum-451b05fb` est auto-généré. L'ancien pattern `ednum-v1` codé en dur a disparu.

### 🟡 3.3 Service Worker — Absence de notification de mise à jour

**Sévérité : Moyenne** · **Effort : Moyen**

Le Service Worker (`sw.js`) implémente correctement :
- Le pré-caching de 53 assets à l'installation (L4-54)
- La purge des anciens caches à l'activation (L65-77)
- La stratégie Stale-While-Revalidate en fetch (L79-103)
- Le `event.waitUntil()` pour maintenir le worker vivant (L93-97)

**Problème** : Il n'y a **aucun listener `message`** pour `skipWaiting` dans `sw.js` (recherche grep confirmée : 0 résultat). L'enregistrement dans `theme.js` (L128-148) se limite à un appel de `register()` sans aucune écoute d'`updatefound`.

**Conséquence concrète** : Lorsqu'une mise à jour est déployée, l'enseignant qui ouvre l'application sur son TBI obtient l'ancienne version en cache. La nouvelle version n'est activée qu'après la fermeture de **tous** les onglets du domaine et un rechargement. Dans un contexte scolaire, cela peut signifier qu'un bug corrigé restera actif pendant toute la journée de classe.

**Recommandation** — Implémenter le pattern `skipWaiting` + notification utilisateur :

1. Ajouter dans `sw.js` :
```js
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') self.skipWaiting();
});
```

2. Enrichir l'enregistrement dans `theme.js` (après L144) pour détecter `updatefound` → `installed` et afficher un toast interactif via `showToast()`.

### 🟡 3.4 `playwright` comme dépendance de production

**Sévérité : Faible** · **Effort : Trivial**

Dans `package.json` (L62-64), `playwright` est listé en `dependencies` au lieu de `devDependencies` :
```json
"dependencies": {
    "playwright": "^1.60.0"
}
```

Playwright est un framework de test de 100+ Mo. Le mettre en `dependencies` signifie que chaque `npx @ednum/suite-ednum` installera Playwright et ses binaires de navigateur, ce qui est aberrant pour un simple serveur statique.

**Recommandation :** Déplacer `playwright` dans `devDependencies` aux côtés de `jsdom`.

### 🟢 3.5 Manifeste PWA — Correct mais minimaliste

Le `manifest.json` est fonctionnel (3 icônes, `display: standalone`, `start_url: ./index.html`). Cependant, il manque :
- `orientation: "portrait"` (pertinent pour tablettes en classe)
- `categories: ["education"]`
- `lang: "fr"`
- `screenshots` (pour l'installabilité améliorée sur Android/ChromeOS)

---

## 4. Qualité de code & Maintenabilité

### 🟢 4.1 Modules JS partagés — Architecture exemplaire

La modularisation du code partagé est un point fort majeur :

| Module | Taille | Responsabilité |
|---|---|---|
| `theme.js` | 149 L | Thème clair/sombre/contraste, menu réglages, SW, reset cache |
| `scores.js` | 448 L | ScoreManager centralisé (stats, streaks, difficulté adaptative, modal graphiques donut) |
| `toast.js` | 78 L | Notifications unifiées avec icônes FA7 |
| `url-params.js` | 890 L | Paramètres URL + Share Modal complet avec QR, presets, options contextuelles |
| `confetti.js` | ~160 L | Célébrations (feux d'artifice, confettis) |
| `audio.js` | ~110 L | Web Audio API, démarrage muet |
| `swipe.js` | ~50 L | Navigation tactile entre onglets |
| `portal.js` | ~170 L | Rendu dynamique des cartes depuis `registry.js` |
| `fa-subset.js` | 100 Ko | Subset FA7 Pro auto-généré |

Le module automate est proprement découpé en 4 fichiers (`automate-engine.js`, `automate-skins.js`, `automate-ui.js`, `automate-main.js`) avec `automate.css` dédié (70 Ko).

### 🟡 4.2 Taille des fichiers HTML — Monolithes applicatifs

Bien que les modules partagés soient factorisés, chaque webapp embarque encore **tout son CSS et JS spécifique inline** dans le fichier HTML :

| Fichier | Taille |
|---|---|
| `binaire_codage.html` | 58 Ko |
| `jeu_de_la_grue.html` | 56 Ko |
| `binaire_message.html` | 55 Ko |
| `routage_reseau.html` | 51 Ko |
| `reseau_de_tri.html` | 50 Ko |
| `binaire_studio.html` | 49 Ko |
| `bit_de_parite.html` | 47 Ko |
| `simulateur_automate.html` | 44 Ko |
| `machine_a_trier.html` | 43 Ko |
| `machine_a_chiffrer.html` | 40 Ko |
| `index.html` | 41 Ko |

Chaque fichier contient un bloc `<style>` unique (confirmé par grep : 13 fichiers avec `<style>`). C'est une **décision architecturale consciente** documentée dans `code-patterns.md` (L13 : « No local styles in HTML files (except for single-use pages) ») — mais la réalité montre que toutes les webapps ont des styles locaux.

**Recommandation :** Pour les 6 webapps stables, envisager une extraction progressive des CSS spécifiques vers des fichiers dédiés (`automate.css` est le modèle à suivre). Cela améliorerait la cachabilité par le navigateur : le CSS ne serait téléchargé qu'une fois, tandis que les mises à jour du HTML ne forceraient pas le re-téléchargement du CSS.

### 🟡 4.3 Robustesse du script FontAwesome — `generate_fa_subset.js`

Le script est fonctionnellement correct et l'architecture d'injection de l'icône personnalisée `border-all-slash` (L57-61) et du remplacement complet de `createIcons` (L63-172) est ingénieuse.

**Problèmes identifiés :**

1. **Échec brutal sans `FA_SUBSET_DIR`** (L16-21) — Le script affiche un message d'erreur clair et sort avec `process.exit(1)`. C'est déjà un comportement correct, contrairement à ce que l'audit précédent suggérait. La recommandation de l'ancien audit (proposer un subset par défaut) reste pertinente pour faciliter les contributions tierces, mais n'est pas un bug.

2. **Regex fragile** (L61) — Le remplacement du marqueur de fin du dictionnaire d'icônes utilise :
```js
content = content.replace(/,?\n  };\n/, ',\n' + newIcons + '  };\n');
```
Ce pattern dépend de l'indentation exacte du fichier généré. Si la structure du fichier source change, l'injection échouera silencieusement.

3. **Recherche de `functionStartToken` par string exact** (L63) — Même fragilité : la chaîne complète de la signature de `createIcons` est codée en dur. Tout changement cosmétique dans le fichier source cassera l'injection.

**Recommandation :** Ajouter des assertions (`if (startIndex === -1)`) avec `process.exit(1)` et un message d'erreur explicite, plutôt que de laisser le script produire un fichier tronqué.

### 🟢 4.4 Zéro `console.log` en production

Recherche grep confirmée : **aucun** `console.log` dans `assets/js/` ni dans `webapps/`. La discipline documentée dans `decisions.md` (L28) est scrupuleusement respectée.

### 🟢 4.5 CI/CD — Pipeline bien architecturé

Le workflow GitHub Actions (`e2e-tests.yml`, 149 lignes) utilise `dorny/paths-filter` pour n'exécuter que les suites de tests pertinentes :

| Job | Déclencheur | Suites exécutées |
|---|---|---|
| `test-basic` | `index.html`, `assets/**` | `test_basic.py`, `test_teacher.py`, `test_confetti.py`, `test_theme.py`, `test_webapps.py` |
| `test-scores` | `assets/js/**`, `webapps/**` | `test_scores.py` |
| `test-automate` | `simulateur_automate.html`, `assets/img/mats/**` | `test_automate.py` |
| `test-binaire-codage` | `binaire_codage.html` | `test_binaire_codage.py` |
| `test-alpha-webapps` | `alpha/webapps/**` | `test_alpha_webapps.py` |

**Point d'attention :** Les tests ne sont déclenchés que sur `pull_request` vers `main`. Il n'y a pas de job déclenché sur `push` direct — si un développeur push directement sur `main` (sans PR), les tests ne sont jamais exécutés.

**Couverture :** 9 fichiers de tests E2E (Playwright/pytest) + 2 fichiers de tests unitaires Node.js (`test_shuffle.js`, `test_toast.js`). Les webapps suivantes n'ont **aucun test E2E dédié** :
- `binaire_message.html` (Mots secrets)
- `binaire_studio.html` (Pixel Studio)
- `bit_de_parite.html` (Bit de parité)
- `routage_reseau.html` (Routage réseau)

---

## 5. Accessibilité (A11y) & Expérience TBI

### 🟢 5.1 Conformité tactile — WCAG 2.5.5 respecté

La règle `button { min-width: 44px; min-height: 44px; }` dans `shared.css` (L58-61) garantit globalement des cibles tactiles conformes. Les `.icon-action-btn` héritent de `min-width: 44px; min-height: 44px;` (L370-371).

### 🟢 5.2 Accessibilité clavier de base — Bonne couverture

- Skip-link présent (`.skip-link`, L994-1009 de `shared.css`)
- Focus rings globaux via `:focus-visible` (L69-73)
- Fermeture modale par `Escape` (dans `scores.js` L281-288 et `url-params.js`)
- Classe `.sr-only` disponible (L1476-1486)

### 🟡 5.3 Sémantique ARIA — Lacunes

1. **Pas de `role="search"`** sur les portails — Le champ de recherche/filtre de `index.html` (si existant) n'est pas encapsulé dans un `<form role="search">` ni un landmark équivalent. Grep confirmé : 0 résultat pour `role="search"`.

2. **Labels de toggle partiel** — Dans `url-params.js`, les `<label class="share-option-label" for="opt-...">` ciblent correctement les `<input id="opt-...">`. Cependant, le `<label>` qui encapsule le toggle switch (`.share-toggle`) ne possède pas d'`aria-label` descriptif. Un lecteur d'écran annoncera « checkbox » sans préciser que c'est un interrupteur à bascule.

3. **Absence de `aria-live` pour les toasts** — Le conteneur `#c2-toast-container` n'a pas d'attribut `aria-live="polite"`. Les notifications ne seront pas annoncées par les lecteurs d'écran.

### 🟡 5.4 Drag & Drop sans alternative clavier

Le simulateur d'automate permet de glisser-déposer des obstacles et trésors sur la grille. Cette interaction est **exclusivement tactile/souris**. Un élève naviguant au clavier ne peut pas positionner d'éléments sur la grille.

L'ancien audit recommandait une alternative séquentielle clavier (sélection + flèches + Entrée). Cette recommandation reste pleinement valide.

### 🟢 5.5 Mode Haute Lisibilité — Implémentation robuste

Le mode `high-contrast` (L77-249 de `shared.css`) est l'une des implémentations les plus complètes observées pour un projet de cette taille :
- Polices en 20px, `font-weight: 700`, `letter-spacing: 0.05em`
- Bordures 3-4px noir sur tous les éléments interactifs
- Suppression de tous les `box-shadow`, `text-shadow`
- Inversion des couleurs au hover (fond noir, texte blanc)
- Gestion des cartes avec styles inline (L197-217) via `!important`
- Correction des icônes duotone (L191-194)

---

## 6. Design System & CSS

### 🟢 6.1 Tokens et échelle de `border-radius` — Exemplaire

Le système de rayons (`tokens.css` via L12-28 de `shared.css`) est parfaitement documenté avec 8 niveaux sémantiques de `--radius-xs` (4px) à `--radius-full` (50%). Chaque composant utilise le bon niveau.

### 🟢 6.2 Glassmorphism cohérent

Les variables `--glass-blur`, `--glass-border`, `--glass-shadow` (L15-17) sont utilisées de manière cohérente dans les modales, dropdowns, et barres de navigation mobile. Le `backdrop-filter: blur(20px)` est appliqué aux dropdowns (L318), et le mode mobile utilise `var(--glass-blur)` (L685).

### 🟡 6.3 Couleurs hardcodées résiduelles

Malgré l'utilisation massive de CSS variables, certaines couleurs sont encore codées en dur dans `shared.css` :

- `#667eea` pour les focus rings (L70) — devrait être `var(--accent, #667eea)`
- `#e2e8f0` pour les bordures de tab-btn (L924) — devrait être `var(--card-border, #e2e8f0)`
- `#22c55e`, `#f59e0b`, `#ef4444` pour les couleurs de statistiques (L639-645) — pourraient être des tokens `--color-success`, `--color-warning`, `--color-error`
- `oklch(1 0 0 / 0.9)` pour le hover (L375) — utilise la notation oklch moderne, mais n'est pas liée à une variable

**Impact :** Faible — les couleurs sont cohérentes. Mais les tokens améliorerait la thémabilité future.

### 🟢 6.4 Responsive & TBI — Bien traité

- Le mode mobile convertit les `.tabs` en barre de navigation fixe en bas (L664-725) avec une gestion élégante du `containing block` et des problèmes de `position: fixed` dans les conteneurs animés (L666-671)
- Le breakpoint TBI (≥1200px, L728-746) augmente la taille de police à 18px et les éléments interactifs à 1.1em
- Les boutons utilisent `clamp()` pour les tailles dynamiques (L290 pour le titre)

---

## 7. Distribution npm

### 🟢 7.1 Package `@ednum/suite-ednum` — Bien configuré

Le `package.json` est correctement structuré :
- Scope `@ednum`, publication publique (L56-58)
- `bin` pointant vers `bin/ednum.js` (L34-36)
- Whitelist `files` explicite excluant `meta/`, `.github/`, etc. (L37-48)
- `engines: "node": ">=18.0.0"` (L49-51)

### 🟠 7.2 Anomalie de dépendances

Comme mentionné en §3.4, `playwright` est en `dependencies`. De plus, `jsdom` (devDependency) est utilisé pour les tests unitaires Node.js, ce qui est correct.

Le `merci.html` (21 Ko) est inclus dans le manifeste SW (L9) et potentiellement dans le package npm via `files` — vérifier s'il est intentionnellement distribué.

---

## 8. Plan d'action prioritaire

### 🔴 Impact immédiat / Effort faible

| # | Action | Fichiers | Effort |
|---|---|---|---|
| 1 | Déplacer `playwright` de `dependencies` vers `devDependencies` | `package.json` | 1 min |
| 2 | Ajouter `aria-live="polite"` au conteneur Toast | `toast.js` | 2 min |
| 3 | Ajouter assertions dans `generate_fa_subset.js` pour l'injection | `generate_fa_subset.js` | 10 min |

### 🟡 Impact élevé / Effort moyen

| # | Action | Fichiers | Effort |
|---|---|---|---|
| 4 | Implémenter `skipWaiting` + notification de mise à jour | `sw.js`, `theme.js` | 1h |
| 5 | Remplacer les `onclick="ScoreManager.showModal()"` par délégation centralisée | `scores.js` + 11 HTML | 2h |
| 6 | Ajouter `push` à `main` comme déclencheur CI en plus de `pull_request` | `e2e-tests.yml` | 5 min |
| 7 | Écrire les tests E2E manquants (binaire_message, binaire_studio, bit_de_parite, routage_reseau) | `meta/tests/e2e/` | 4h |

### 🟢 Long terme / Alignement architectural

| # | Action | Fichiers | Effort |
|---|---|---|---|
| 8 | Extraire les CSS inline des webapps stables vers des fichiers `.css` dédiés | `webapps/*.html` | 1 jour |
| 9 | Migrer les `onclick` inline des apps alpha vers `addEventListener` | `alpha/webapps/` | 4h |
| 10 | Enrichir le `manifest.json` (`orientation`, `lang`, `screenshots`) | `manifest.json` | 15 min |
| 11 | Fournir une alternative clavier pour le D&D sur grille | `automate-engine.js`, `automate-ui.js` | 1 jour |
| 12 | Factoriser les patterns CSS communs des apps alpha (modals, boutons, grilles) | `assets/css/components.css` | 4h |

---

## 9. Éléments de félicitation

Cette section documente les pratiques **exemplaires** observées dans la base de code, afin qu'elles soient préservées et étendues.

### 🌟 Zéro dépendance runtime
La pile est strictement Vanilla HTML/CSS/JS. Aucun framework, aucun bundler, aucun transpileur. Le serveur npm (`bin/ednum.js`) n'utilise que les modules built-in Node.js (`http`, `fs`, `path`, `url`, `child_process`). C'est une prouesse de discipline et un modèle de pérennité.

### 🌟 Subset FontAwesome intelligent
Le système de `fa-subset.js` (100 Ko) offre les icônes FA7 Pro (solid + duotone) avec injection SVG intelligente, gestion de l'ARIA automatique, et support des icônes personnalisées — le tout sans aucune dépendance CDN ni fichier de police de plusieurs Mo. La compatibilité Safari est gérée (unités `px` explicites dans les attributs SVG, `overflow: visible`).

### 🌟 Difficulté adaptative pédagogique
Le `ScoreManager.checkAdaptiveDifficulty()` implémente un mécanisme de *nudge* qui propose automatiquement à l'élève de monter en difficulté après 3 réussites consécutives du premier coup. Le popup utilise des modales accessibles avec ARIA et une option de refus claire. Ce mécanisme est désactivable par URL (`noNudges=1`).

### 🌟 Share Modal contextuel
`url-params.js` (890 lignes) implémente un système de partage complet avec :
- Détection automatique des fonctionnalités disponibles dans l'application courante
- 3 presets pédagogiques (Mission, Entraînement, Inclusif)
- Génération de QR code (lazy-loaded via `QRious`)
- Toggles visuels modernes avec micro-copy descriptif
- Options spécifiques par application (affichées/masquées dynamiquement)

---

### Note méthodologique

Cet audit a été réalisé par analyse statique exhaustive du code source, incluant :
- Lecture intégrale de 18 fichiers clés (CSS, JS, YAML, JSON)
- Recherches `grep` systématiques sur `onclick`, `console.log`, `innerHTML`, `@import`, `skipWaiting`, `role="search"`, `for=`, `<style`
- Vérification croisée avec les fichiers de mémoire du projet (`project-context.md`, `decisions.md`, `code-patterns.md`)
- Comptage et localisation précise de chaque finding (fichier + numéro de ligne)

*Audit de code réalisé le 20 mai 2026 par Claude Opus 4.6 (Thinking) via Antigravity IDE.*
