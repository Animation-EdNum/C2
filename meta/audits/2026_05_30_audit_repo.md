# 🔍 Audit de Code Global — Suite Éducation Numérique

> **Date :** 30 mai 2026 · **Auditeur :** Claude Opus 4.8 (via Antigravity)
> **Contexte :** HEP-VS (AP-EdNum), Valais, Suisse · dépôt `Animation-EdNum/C2`
> **Périmètre :** Suite EdNum complète — 6 webapps stables (`webapps/`), 9 apps alpha (`alpha/webapps/`), 2 outils enseignant (`webapps/teacher/`), framework partagé (`assets/`), serveur npm (`bin/`), pipeline CI/CD
> **Méthode :** analyse statique + validation par `grep`/`npm test` de l'état réel du code (et non par confiance dans l'audit précédent du 20 mai).

---

## 1. Résumé exécutif

### 📊 Tableau de bord technique

| Domaine | Score | Tendance | Éléments clés |
|---|:---:|:---:|---|
| **Architecture** | 9.5/10 | → | Vanilla pur, zéro build runtime, modules JS bien découpés |
| **Offline / PWA** | 9.5/10 | ⬆ | SWR + cache-busting SHA-256, **notification de MAJ désormais implémentée** |
| **Sécurité (CSP)** | 7/10 | ⬆ | `onclick` inline quasi-éradiqués (4 restants), mais CSP en `unsafe-inline` + absente des webapps |
| **Accessibilité** | 8.5/10 | ⬆ | `aria-live` ajouté, WCAG AA respecté ; D&D clavier toujours absent |
| **Performance** | 9.5/10 | → | Pas de `@import`, FA subset, fonts locales |
| **Tests** | 8.5/10 | → | 13 suites E2E Playwright + 5 suites unit Node ; **49/49 unit passent** |
| **Maintenabilité** | 8/10 | → | Registre centralisé ; webapps toujours monolithiques (CSS/JS inline) |
| **Distribution** | 9.5/10 | ⬆ | `@ednum/suite-ednum` propre, `playwright` désormais en devDeps |

> **Score technique global : 8.9 / 10** (vs 8.6 le 20 mai)

### 🏆 Résolutions confirmées depuis l'audit du 20 mai

L'équipe a traité l'essentiel du plan d'action précédent — vérifié dans le code actuel :

1. ✅ **Notification de mise à jour SW** — `sw.js` (L113-117) écoute désormais `message`/`skipWaiting`, et `theme.js` (L227-249) gère `updatefound` → `installed` → `postMessage('skipWaiting')` + `controllerchange`. Le problème « bug en cache toute la journée de classe » est **résolu**.
2. ✅ **`onclick` inline purgés** — De 35+ occurrences à **4** (toutes dans `bareme.html`) + 2 dans du HTML injecté. Réduction de ~90 %.
3. ✅ **`aria-live="polite"`** ajouté au conteneur Toast (`toast.js` L23).
4. ✅ **`playwright` déplacé en `devDependencies`** (`package.json` L59-62) — `npx @ednum/suite-ednum` n'embarque plus 100+ Mo de binaires navigateur.
5. ✅ **`manifest.json` enrichi** — `lang: "fr"`, `orientation`, `screenshots` (3, wide+narrow) désormais présents.
6. ✅ **Cache-busting SHA-256** — `generate-sw-manifest.js` (L69-86) calcule un hash et l'injecte dans `CACHE_NAME` (`ednum-ca5298f0`).
7. ✅ **Zéro `@import` CSS** et **zéro `console.log`** en production (greps confirmés : 0).

---

## 2. Sécurité

### 🟡 2.1 CSP présente mais affaiblie par `unsafe-inline`, et absente des webapps

**Sévérité : Moyenne** · **Effort : Élevé**

`index.html` (L23-24) introduit une `Content-Security-Policy` — bonne intention, mais :

```html
content="default-src 'self'; script-src 'self' 'unsafe-inline';
         style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
```

Deux limites :

1. **`'unsafe-inline'` neutralise la protection.** Tant que `script-src` autorise l'inline, la CSP n'arrête aucune injection de `<script>`. C'est nécessaire aujourd'hui car les webapps embarquent toutes des blocs `<script>` et `<style>` inline (13 fichiers avec `<style>`, 1-3 blocs `<script>` par page).
2. **La CSP n'existe que dans `index.html`.** Aucune des 6 webapps stables, ni les apps alpha, ni `indexC1.html` ne portent l'en-tête. La page la moins exposée est protégée ; les pages interactives qui manipulent l'`URL` (via `url-params.js`) ne le sont pas.

**Recommandation :**
- Court terme : propager la même balise CSP (même imparfaite) à toutes les pages, et l'ajouter au fichier `_headers` pour qu'elle s'applique au déploiement statique (Cloudflare/Netlify-style).
- Moyen terme : extraire les blocs `<script>` inline des webapps vers des fichiers `.js` dédiés (voir §4.1) pour pouvoir retirer `'unsafe-inline'` de `script-src` — la vraie victoire de sécurité.

### 🟡 2.2 `onclick` inline résiduels — 4 + 2

**Sévérité : Faible** · **Effort : Faible**

- `webapps/teacher/bareme.html` : `onclick="exportImage()"` (L457), `copyTable()` (L461), `handlePrint()` (L465), `toggleAdvanced()` (L497) + 6 `oninput`/`onchange` (L492-530). Cet outil est le dernier à n'avoir pas été migré vers `addEventListener`.
- HTML injecté via `innerHTML` : `automate-engine.js` L2381 (`onclick="handleSpeechBubbleClick(event)"` dans une bulle de dialogue) et `automate-skins.js` L284 (`onclick="event.stopPropagation()"`).

**Impact :** ces 6 handlers de `bareme.html` sont le seul obstacle restant pour une CSP `script-src 'self'` sur cet outil. **Recommandation :** terminer la migration sur `bareme.html` (cohérence avec les 5 autres webapps déjà migrées).

### 🟡 2.3 `innerHTML` — 36 occurrences dans `assets/js/`

**Sévérité : Faible** (risque actuel négligeable) · **Effort : N/A**

36 usages, concentrés dans le module automate et `url-params.js`. Répartition inchangée depuis le 20 mai :
- **Sans donnée utilisateur** : SVGs, templates statiques, grilles — pas de vecteur d'injection.
- **Données `localStorage`** : passent par `ScoreManager._escapeHtml()`.
- **Point de vigilance** : `portal.js` injecte le contenu de `registry.js` (fichier statique local). Sûr aujourd'hui ; le resterait moins si `registry.js` devenait une source distante.

Aucune action urgente. À surveiller si une fonctionnalité accepte un jour du texte libre rendu en HTML.

### 🟢 2.4 Serveur npm (`bin/ednum.js`) — Robuste pour son usage

Le serveur local (127.0.0.1 uniquement) implémente : anti-directory-traversal (L106), validation d'`Origin` CSRF (L65-78), rate-limiting 200 req/min avec purge `unref()` (L43-52), HSTS, refus des méthodes non-GET/HEAD. Pour un serveur statique local, c'est au-delà du nécessaire — aucune réserve.

### 🟢 2.5 CI sécurité — Actions tierces épinglées par SHA

`security.yml` et `e2e-tests.yml` épinglent **toutes** les actions GitHub par hash de commit complet (`actions/checkout@34e114…`, `dorny/paths-filter@6852f9…`, `Webba-Creative-Technologies/vice@f3cd13…`). C'est la bonne pratique anti-supply-chain. ⚠ Seule note : l'action `vice` est un tiers peu connu doté de `contents: write` + `pull-requests: write` — s'assurer que ce hash correspond bien à une version auditée.

---

## 3. Architecture & Performance

### 🟢 3.1 Service Worker — Cycle de vie complet

Le `sw.js` couvre désormais l'intégralité du cycle PWA : pré-cache de ~55 assets (L4-62), purge des anciens caches à l'activation (L73-85), stratégie Stale-While-Revalidate (L87-111), et **`skipWaiting` (L113-117)**. Couplé à la gestion `updatefound` de `theme.js`, c'est une implémentation PWA de référence.

### 🟢 3.2 Cache-busting SHA-256 — Automatisé

`generate-sw-manifest.js` (L69-86) hashe les assets et réécrit `CACHE_NAME` via regex avec **fallback** (L84-86 : si le pattern `ednum-*` ne matche pas, retombe sur `CACHE_NAME = '*'`). Robuste.

### 🟡 3.3 Régression de documentation : `shared.css` n'existe plus

**Sévérité : Faible** · **Effort : Trivial**

L'audit du 20 mai et le `README.md` (L116) décrivent un bundle compilé `assets/css/shared.css` généré par `generate-sw-manifest.js`. **Ce fichier n'existe plus** et le script ne compile plus de CSS (aucune fonction `compileCSS`). Les pages chargent désormais 4 `<link>` séparés :

```html
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/utilities.css">
```

**Ce n'est pas un problème de performance** (les `<link>` sont récupérés en parallèle, pas en série comme `@import`, et le SW les met en cache). En revanche c'est une **dérive de documentation** : le README décrit une architecture qui n'est plus celle du code.

**Recommandation :** mettre à jour `README.md` (L115-116) pour décrire le chargement multi-fichiers réel, ou réintroduire la compilation si le bundle unique était voulu.

### 🟡 3.4 CI : pas de protection contre push direct non testé

Bien que `e2e-tests.yml` se déclenche maintenant sur `push: [main]` **et** `pull_request`, le filtrage par chemin (`dorny/paths-filter`) signifie qu'un push touchant un fichier hors filtres (ex : `bin/`, `manifest.json`, `sw.js`) **ne déclenche aucune suite**. Idem : aucun test ne couvre `bin/ednum.js` (le serveur). **Recommandation :** ajouter un job « smoke » minimal toujours exécuté (lint HTML + démarrage de `bin/ednum.js` + requête 200), indépendant des filtres.

---

## 4. Qualité de code & Maintenabilité

### 🟡 4.1 Webapps monolithiques — CSS & JS toujours inline

**Sévérité : Faible** · **Effort : Élevé**

Inchangé depuis le 20 mai : chaque webapp embarque son CSS spécifique (`<style>`, 13 fichiers) et son JS spécifique (`<script>`, 1-3 blocs) en inline. Tailles : `binaire_studio.html` 52 Ko, `binaire_message.html` 44 Ko, etc.

C'est une décision assumée (`code-patterns.md`), mais elle a deux coûts : (1) bloque le retrait de `'unsafe-inline'` de la CSP (§2.1), (2) empêche la mise en cache navigateur fine (toute édition HTML re-télécharge tout le CSS/JS). Le module `automate` (CSS + JS externalisés en 4 fichiers) reste le modèle à généraliser.

### 🟢 4.2 Modules partagés — Architecture exemplaire (mise à jour des tailles)

| Module | Lignes | Responsabilité |
|---|---:|---|
| `url-params.js` | 922 | Paramètres URL + Share Modal (QR, presets, options contextuelles) |
| `registry.js` | 975 | Registre central de toutes les apps (source des portails) |
| `scores.js` | 589 | ScoreManager (stats, streaks, difficulté adaptative, donut) |
| `theme.js` | 264 | Thème clair/sombre/contraste, SW + notification de MAJ |
| `confetti.js` | 187 | Célébrations |
| `portal.js` | 153 | Rendu dynamique des cartes depuis `registry.js` |
| `audio.js` | 104 | Web Audio API |
| `toast.js` | 79 | Notifications (avec `aria-live`) |
| `fa-subset.js` | — (121 Ko) | Subset FA7 Pro auto-généré |

Module automate : `automate-engine.js` (124 Ko ⚠), `automate-skins.js` (101 Ko ⚠), `automate-ui.js` (48 Ko), `automate-main.js` (7 Ko). **Note :** `automate-engine.js` et `automate-skins.js` deviennent très volumineux — un découpage par responsabilité (moteur de jeu vs rendu vs puzzles) faciliterait la maintenance et les revues.

### 🟢 4.3 Tests — Unit 49/49 verts

`npm run test:unit` : **49 tests, 0 échec** (suites `theme`, `toast`, `confetti`, `portal`, `shuffle`). Côté E2E : 13 fichiers Playwright/pytest couvrant désormais binaire_message, binaire_studio, bit_de_parite, routage_reseau (lacunes du précédent audit **comblées**). Bonne santé globale.

### 🟢 4.4 Robustesse `generate_fa_subset.js`

Le point du 20 mai (regex/string fragiles pour l'injection) reste pertinent mais mineur. À traiter opportunément en ajoutant des assertions `if (idx === -1) process.exit(1)`.

---

## 5. Accessibilité (A11y) & Expérience TBI

### 🟢 5.1 Progrès confirmés
- `aria-live="polite"` sur les toasts (annonce lecteur d'écran) ✅
- Cibles tactiles 44px, skip-link, `:focus-visible`, fermeture modale `Escape`, mode haute lisibilité complet — maintenus.

### 🟡 5.2 Lacunes persistantes
1. **D&D sans alternative clavier** — Le placement d'obstacles/trésors sur la grille du simulateur reste exclusivement souris/tactile. Un élève au clavier est bloqué. *(Recommandation : sélection + flèches + Entrée.)*
2. **`role="search"`** toujours absent (grep : 0) sur le filtre des portails.

---

## 6. Plan d'action prioritaire

### 🔴 Impact / Effort faible
| # | Action | Fichiers | Effort |
|---|---|---|---|
| 1 | Corriger la doc `shared.css` (architecture CSS réelle) | `README.md` L115-116 | 5 min |
| 2 | Migrer les 6 handlers inline de `bareme.html` vers `addEventListener` | `webapps/teacher/bareme.html` | 30 min |
| 3 | Propager la balise CSP à toutes les pages + `_headers` | `*.html`, `_headers` | 30 min |

### 🟡 Impact élevé / Effort moyen
| # | Action | Fichiers | Effort |
|---|---|---|---|
| 4 | Job CI « smoke » toujours exécuté (démarre `bin/ednum.js`, vérifie 200) | `e2e-tests.yml` | 1h |
| 5 | Extraire `<script>`/`<style>` inline des webapps stables → fichiers dédiés | `webapps/*.html` | 1-2 j |
| 6 | Une fois (5) fait : retirer `'unsafe-inline'` de `script-src` | CSP | 30 min |

### 🟢 Long terme
| # | Action | Fichiers | Effort |
|---|---|---|---|
| 7 | Alternative clavier au D&D sur grille | `automate-engine.js`, `automate-ui.js` | 1 j |
| 8 | Découper `automate-engine.js`/`automate-skins.js` (>100 Ko) | `assets/js/automate/` | 1 j |
| 9 | Ajouter `role="search"` au filtre des portails | `index.html`, `indexC1.html` | 15 min |

---

## 7. Éléments de félicitation

- 🌟 **Réactivité sur le plan d'action** — 7 des findings prioritaires du 20 mai sont résolus en 10 jours (SW update, onclick, aria-live, playwright, manifest, cache-busting).
- 🌟 **Zéro dépendance runtime** — Pile strictement Vanilla ; le serveur npm n'utilise que les modules natifs Node.
- 🌟 **PWA de référence** — Cycle SW complet (precache + SWR + skipWaiting + notification), cache-busting SHA-256 automatisé, 100 % hors-ligne.
- 🌟 **Discipline CI** — Actions tierces toutes épinglées par SHA, filtrage par chemin, tests E2E élargis.
- 🌟 **Subset FontAwesome auto-généré** — Icônes FA7 Pro sans CDN ni police multi-Mo.

---

### Note méthodologique
Audit fondé sur l'analyse de l'état **courant** du code (commit `6bb5044`), validé par : `npm run test:unit` (49/49), greps systématiques (`onclick`, `console.log`, `innerHTML`, `@import`, `Content-Security-Policy`, `aria-live`, `role="search"`, `skipWaiting`), lecture intégrale de `bin/ednum.js`, `sw.js`, `theme.js`, `_headers`, `manifest.json`, `package.json`, des deux workflows CI, et croisement avec l'audit du 20 mai 2026.

*Réalisé le 30 mai 2026 par Claude Opus 4.8 via Antigravity.*
