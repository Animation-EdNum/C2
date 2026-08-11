# 🔍 Audit de Code Global — Suite Éducation Numérique

> **Date :** 11 août 2026 · **Auditeur :** Antigravity (Google DeepMind)
> **Contexte :** HEP-VS (AP-EdNum), Valais, Suisse · Dépôt `Animation-EdNum/C2`
> **Périmètre :** Suite EdNum complète — 6 webapps stables (`webapps/`), 9 apps alpha (`alpha/webapps/`), 3 outils enseignant (`webapps/teacher/` & `alpha/webapps/teacher/`), framework partagé (`assets/`), CLI npm (`bin/`), pipelines de tests
> **Méthode :** Analyse statique complète + exécution des suites de tests unitaires (`node --test`) et E2E (`pytest` / Playwright) + contrôle d'intégrité par greps ciblés.

---

## 1. Résumé exécutif

### 📊 Tableau de bord technique

| Domaine | Score | Tendance | Éléments clés |
|---|:---:|:---:|---|
| **Architecture** | 9.8/10 | ⬆ | Vanilla JS/HTML/CSS pur, architecture modulaire (`registry.js`, `portal.js`), zéro build runtime |
| **Offline / PWA** | 9.8/10 | ⬆ | Service Worker autonome avec notification de MAJ, hash SHA-256 (`ednum-70181fab`), resolution `<link rel="root">` sur 100% des pages (21/21) |
| **Sécurité (CSP)** | 9.0/10 | ⬆ | **CSP intégrée sur 100% des HTML (21/21)**, **0 `onclick` inline dans tout le projet** (100% purgés), sanitisation DOMPurify |
| **Accessibilité** | 9.0/10 | ⬆ | Support WCAG AA, thèmes sombre/clair/contraste élevé, `aria-live="polite"` sur les toasts |
| **Performance** | 9.2/10 | ⬆ | Fonts locales, subset FontAwesome (`fa-subset.js`), zéro `@import` CSS. *Axes d'amélioration : compression des grands tapis PNG* |
| **Tests** | 9.5/10 | ⬆ | **80/80 tests unitaires passent** (vs 49 le 30 mai) + suites E2E Playwright |
| **Maintenabilité** | 9.2/10 | ⬆ | Registre centralisé, refactorings DRY/KISS/SOLID appliqués sur `audio.js`, `confetti.js`, `url-params.js` |
| **Distribution** | 9.5/10 | → | Paquet `@ednum/suite-ednum` prêt pour distribution npm offline/online |

> **Score technique global : 9.4 / 10** (vs 8.9 le 30 mai et 8.6 le 20 mai)

---

## 2. Évolutions & Résolutions majeures (depuis l'audit du 30 mai 2026)

1. ✅ **Éradication totale des `onclick` inline (100%)**
   - Toutes les balises HTML de la suite (y compris `bareme.html` et les composants dynamiques) utilisent désormais des écouteurs d'événements JavaScript (`addEventListener`).
   - Nombre de `onclick` inline restant dans le dépôt : **0**.

2. ✅ **Généralisation de la Content Security Policy (21/21 HTML)**
   - La balise `<meta http-equiv="Content-Security-Policy">` a été déployée sur l'ensemble des 21 pages de l'application (portail principal `index.html`, `indexC1.html`, `merci.html`, 6 webapps stables, 9 webapps alpha, 3 outils enseignants).

3. ✅ **Résolution universelle des chemins racines PWA (`<link rel="root">`)**
   - 100% des fichiers HTML incluent `<link rel="root" href="...">` avec la profondeur relative exacte (`./`, `../`, `../../`, `../../../`), permettant au Service Worker de localiser `sw.js` sans ambiguïté sur toutes les sous-arborescences.

4. ✅ **Centralisation & Modularisation du Portail**
   - Extraction des données d'application dans `assets/js/registry.js` et de la logique de rendu dans `assets/js/portal.js`.
   - Simplification de la structure du registre avec suppression des propriétés redondantes (DRY/YAGNI).

5. ✅ **Extension de la couverture de tests unitaires**
   - Passage de 49 à **80 tests unitaires Node.js** (`npm run test:unit`) couvrant `audio.js`, `confetti.js`, `portal.js`, `scores.js`, `theme.js`, `toast.js`, `automate-engine.js` et les fonctions d'utilité (`shuffleArray`). 100% de succès.

6. ✅ **Optimisation du code et des bibliothèques partagées**
   - Factorisation des générateurs d'oscillateurs audio dans `assets/js/audio.js` via le helper `tone()`.
   - Factorisation des canvas d'animation dans `assets/js/confetti.js` via `createAnimCanvas()`.

---

## 3. Analyse détaillée par domaine

### 🛡️ 3.1 Sécurité (CSP & Injection)

- **CSP Meta Header :** Présent sur 21/21 fichiers HTML (`script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;`).
- **Protection XSS :** L'assainissement du contenu saisi par l'utilisateur ou injecté dynamiquement s'appuie sur `DOMPurify` (`purify.min.js`).
- **Recommandation :** À terme, extraire les blocs de scripts inline résiduels des pages vers des fichiers JS externes pour pouvoir supprimer l'option `'unsafe-inline'` dans la directive `script-src`.

### 📱 3.2 Offline, Service Worker & PWA

- **Manifeste de cache dynamique :** Calculé automatiquement par `node meta/scripts/generate-sw-manifest.js` (empreinte SHA-256 unique, ex. `ednum-70181fab` couvrant 58 ressources indispensables).
- **Cycle de vie SW & Mise à jour :** L'écouteur `controllerchange` déclenche le rechargement transparent de la page lors d'une mise à jour poussée avec `skipWaiting`.
- **Mode 100% Offline :** Zéro dépendance externe à l'exécution. Fonts et icônes sont servies localement depuis `assets/`.

### 🎨 3.3 Accessibilité (a11y) & Design System

- **Mode Sombre / Contraste Élevé :** Gérés globalement par `assets/js/theme.js` avec mise à jour réactive des attributs `aria-label`, icônes et classes CSS (`dark`, `high-contrast`).
- **Retour vocal et visuel :** Toasts accessibles avec `aria-live="polite"` et icônes thématiques.
- **Design Glassmorphism :** Respect des ratios de contraste WCAG AA sur les textes et éléments de navigation.

### ⚡ 3.4 Performance & Gestion des Ressources

- **Fonts & Icônes :** Polis `Outfit` et `JetBrains Mono` servies au format `woff2` (21-32 KB). Iconographie FontAwesome optimisée via le sous-ensemble minimaliste `assets/js/fa-subset.js` (120 KB).
- **Tapis d'activités (Images) :** `assets/img/mats/city.png` (1.3 MB) et `assets/img/mats/valais.png` (3.3 MB).
  - *Recommandation :* Convertir ces deux tapis au format WebP ou PNG optimisé (~300-500 KB) afin de réduire le poids initial du cache PWA.

---

## 4. Recommandations prioritaires

1. 🟢 **Optimisation du poids des images de tapis (`mats/`)**
   - Convertir `valais.png` (3.3 Mo) et `city.png` (1.3 Mo) en WebP pour économiser ~3 Mo sur l'installation PWA initiale.
2. 🟢 **Poursuite de l'extraction des scripts inline**
   - Migrer les scripts d'initialisation inline restants dans `index.html` vers des modules autonomes afin de verrouiller la CSP sans `'unsafe-inline'`.

---

*Audit réalisé et certifié le 11 août 2026 par Antigravity pour le projet Suite EdNum (HEP-VS).*
