# 🔍 Audit Complet — Dépôt `Animation-EdNum/C2`

> **Date :** 30 avril 2026 · **Auditeur :** Antigravity (Claude Sonnet 4.6)  
> **Périmètre :** Code source, architecture, sécurité, performance, accessibilité, tests, documentation, gouvernance

---

## 1. Vue d'ensemble du projet

| Métrique | Valeur |
|---|---|
| **Commits totaux** | ~712 |
| **Commits en avril 2026** | ~710 (projet très actif) |
| **Fichiers source (.html/.css/.js)** | 23 fichiers · ~1,2 Mo total |
| **Webapps principales** | 6 (dans `webapps/`) |
| **Webapps alpha** | 6 (dans `alpha/webapps/`) |
| **Ressources enseignants** | 2 (dans `webapps/teacher/`) |
| **Tests E2E** | 5 fichiers Playwright/pytest |
| **Licence** | AGPL-3.0 |
| **Stack** | HTML5 · Vanilla JS ES6+ · Vanilla CSS · PWA |
| **Design system** | Glassmorphism + police Outfit + dark mode |

---

## 2. Architecture générale

```
C2/
├── index.html              ← Portail central (57 Ko)
├── sw.js                   ← Service Worker PWA
├── manifest.json           ← Manifeste PWA
├── css/shared.css          ← Design system partagé (592 lignes)
├── js/
│   ├── theme.js            ← Thème + registration SW
│   ├── scores.js           ← ScoreManager global
│   ├── audio.js            ← Web Audio API
│   ├── confetti.js         ← Effets visuels
│   ├── swipe.js            ← Gestes tactiles
│   └── lucide.min.js       ← Icônes (397 Ko !)
├── fonts/                  ← Outfit + JetBrains Mono (auto-hébergés)
├── webapps/                ← 6 apps élèves
├── alpha/webapps/          ← 6 apps expérimentales
├── webapps/teacher/             ← 2 outils enseignants
├── e2e_tests/              ← Suite Playwright
├── memory/                 ← Mémoire agentique (5 fichiers)
└── screenshots/            ← Documentation visuelle
```

### ✅ Points forts architecturaux

- **PWA offline-first** : Service Worker robuste, pas de CDN, tout auto-hébergé
- **Stack zéro-dépendance** : Aucun `npm install`, ouvrable en double-clic
- **Séparation claire** : `webapps/` / `alpha/` / `webapps/teacher/` / `js/` / `css/`
- **Shared design system** : `css/shared.css` + tokens CSS variables bien centralisés
- **Module ScoreManager** : Architecture singleton propre, persistance localStorage
- **Mémoire agentique** : Système de 5 fichiers memory/ pour la continuité entre sessions IA

### ⚠️ Points d'amélioration architecturaux

- **`simulateur_bluebot.html` monolithique** : 237 Ko en un seul fichier — difficile à maintenir, impossible à tester unitairement
- **Duplication de logique** : Les 6 webapps contiennent chacune leur propre CSS local (plusieurs centaines de lignes), dupliquant parfois des patterns de `shared.css`
- **`theme.js` — double registration SW** : Le fichier contient **deux blocs** de registration du Service Worker (lignes 49-59 ET 88-110), causant potentiellement deux appels `register()` par page
- **`alpha/` sans index** : Pas de portail alpha dédié, les apps alpha ne sont accessibles que via la recherche `alpha` dans `index.html`

---

## 3. Qualité du code

### 3.1 JavaScript

| Critère | État | Détail |
|---|---|---|
| ES6+ moderne | ✅ | Arrow functions, template literals, destructuring |
| Inline handlers | ⚠️ | Quelques `onclick="ScoreManager.resetScores()"` dans `scores.js` injectés via `insertAdjacentHTML` — contourne la politique séparation HTML/JS |
| Gestion d'erreurs | ⚠️ | `localStorage.getItem` wrappé dans try/catch ✓, mais certains `JSON.parse` sans fallback dans les webapps individuelles |
| XSS — `innerHTML` | ⚠️ | `scores.js` utilise `body.innerHTML = html` avec des données venant de `localStorage` (contrôlées par l'utilisateur). Risque XSS limité (même origine) mais non nul |
| `const`/`let` | ✅ | Pas de `var` visible dans les modules partagés |
| Commentaires | ✅ | Code bien documenté dans les modules partagés |
| String building | ✅ | Template literals, pas de `+=` massif dans les boucles critiques |
| Pas de `console.log` en prod | ❌ | `theme.js` contient `console.log('ServiceWorker registration successful...')` et `console.log('Cache ouvert')` dans `sw.js` |

### 3.2 CSS

| Critère | État | Détail |
|---|---|---|
| Variables CSS | ✅ | Système de tokens bien défini dans `shared.css` |
| Hardcoded colors | ⚠️ | `btn-reset-scores` utilise `background: #e53e3e` directement au lieu d'une variable |
| Dark mode | ✅ | Gestion via `body.dark` + overrides systématiques |
| Responsive | ✅ | Mobile (`max-width: 600px`) + TBI (`min-width: 1200px`) |
| `!important` abusif | ⚠️ | `shared.css` en contient ~15 dans les règles des bottom tabs — justifié mais fragile |
| Doublons | ✅ | `stat-donut-container` défini deux fois dans `shared.css` (lignes 420 et 493) — **duplication réelle** |

### 3.3 HTML

| Critère | État | Détail |
|---|---|---|
| Sémantique | ✅ | Usage de `<header>`, `<main>`, `<nav>`, `<footer>` |
| `<title>` uniques | ✅ | Chaque page a son propre titre |
| Open Graph | ✅ | `og:title`, `og:description`, `og:type` présents (selon decisions.md) |
| Lang attribute | ❓ | Non vérifié dans les webapps individuelles — critique pour l'accessibilité |
| Footer attribution | ✅ | Formulé exactement comme spécifié dans `project-context.md` |

---

## 4. Sécurité

### 4.1 Vecteurs d'attaque identifiés

| Risque | Sévérité | Localisation | Description |
|---|---|---|---|
| **XSS via localStorage → innerHTML** | 🟡 Moyen | `scores.js:366` | `body.innerHTML = html` construit avec des clés de `localStorage`. Si une extension ou un autre script peut écrire dans `localStorage`, injection possible. |
| **XSS via `insertAdjacentHTML`** | 🟡 Moyen | `scores.js:174, 226` | HTML injecté depuis des constantes statiques — OK aujourd'hui, mais pattern risqué si données dynamiques ajoutées. |
| **Inline handlers dans HTML injecté** | 🟡 Moyen | `scores.js:220, 222` | `onclick="ScoreManager.resetScores()"` injecté via innerHTML — viole la séparation et bloque CSP strict. |
| **Pas de CSP header** | 🟡 Moyen | Global | Aucune Content-Security-Policy déclarée. Mitigé par l'architecture offline-first. |
| **`console.log` en production** | 🟢 Faible | `theme.js`, `sw.js` | Fuite d'informations techniques mineure. |
| **Pas de `rel="noopener noreferrer"` systématique** | 🟢 Faible | À vérifier dans les webapps | Déclaré dans les règles mais non audité en profondeur. |

> [!NOTE]
> Le risque XSS est **fortement atténué** par le contexte (application locale, même origine, pas d'entrée utilisateur arbitraire dans les clés de stats). Néanmoins, les patterns doivent être nettoyés pour respecter les meilleures pratiques.

### 4.2 Recommandations sécurité

1. **`scores.js`** : Remplacer `body.innerHTML = html` par une construction DOM (`createElement` + `textContent`) pour les données utilisateur
2. Remplacer les `onclick` inline dans le HTML injecté par `addEventListener` post-injection
3. Ajouter une CSP meta-tag dans les pages : `<meta http-equiv="Content-Security-Policy" content="default-src 'self';">`
4. Supprimer les `console.log` de production

---

## 5. Performance

### 5.1 Analyse des tailles de fichiers

| Fichier | Taille | Commentaire |
|---|---|---|
| `js/lucide.min.js` | **397 Ko** | 🔴 Principal goulot — toute la librairie Lucide bundlée |
| `webapps/simulateur_bluebot.html` | **237 Ko** | 🔴 Application monolithique très lourde |
| `webapps/binaire_message.html` | 54 Ko | 🟡 Acceptable mais conséquent |
| `webapps/binaire_studio.html` | 46 Ko | 🟡 |
| `webapps/bit_de_parite.html` | 45 Ko | 🟡 |
| `webapps/binaire_codage.html` | 45 Ko | 🟡 |
| `js/scores.js` | 17 Ko | ✅ |
| `css/shared.css` | 15 Ko | ✅ |
| `index.html` | 57 Ko | 🟡 |
| **Total 23 fichiers** | **~1,2 Mo** | Sans les assets binaires (fonts, images) |

### 5.2 Recommandations performance

1. **Lucide.min.js (397 Ko)** : Utiliser uniquement les icônes nécessaires (tree-shaking) ou passer à des SVG inline pour les 5-10 icônes utilisées par page. **Économie estimée : 380+ Ko par page.**
2. **`simulateur_bluebot.html`** : Candidat prioritaire à la refactorisation — extraire la logique JS dans un fichier externe `js/bluebot.js`
3. **Service Worker** : Le cache `ednum-v1` ne versionne pas — un changement de code nécessite de renommer manuellement le cache. Considérer une stratégie de cache busting automatique.
4. **Fonts** : Les deux fonts (Outfit + JetBrains Mono) sont auto-hébergées en `.woff2` — ✅ optimal pour l'offline
5. **Images** : Pas d'images raster dans le code applicatif — ✅ tout en SVG/emoji

### 5.3 Stratégie PWA

| Aspect | État |
|---|---|
| `manifest.json` | ✅ Complet (name, icons 192/512, display: standalone) |
| Service Worker | ✅ Cache-first robuste |
| CNAME | ✅ Domaine personnalisé (`www.zooom.top`) |
| Icônes | ✅ SVG + PNG 192/512 |
| Offline | ✅ Tous les assets pré-cachés |
| **Double registration SW** | ❌ `theme.js` enregistre le SW deux fois (lignes 49-59 et 88-110) |

---

## 6. Accessibilité (WCAG AA)

### 6.1 Points positifs

- **Focus rings** : `:focus-visible` global dans `shared.css` ✅
- **Touch targets** : `min-width: 44px; min-height: 44px` sur tous les boutons ✅
- **`aria-label`** : Présents sur les boutons icon-only (documenté dans code-patterns.md) ✅
- **Swipe to close** : Modaux et drawers avec geste et touche Escape ✅
- **Navigation clavier** : Documentée dans code-patterns.md ✅
- **`touch-action: manipulation`** : Élimine le délai 300ms ✅

### 6.2 Points à vérifier

| Critère | État | Action recommandée |
|---|---|---|
| Attribut `lang` sur `<html>` | ❓ | Vérifier que toutes les pages ont `lang="fr"` |
| Contraste couleur dark mode | ❓ | Audit couleur systématique — les couleurs d'accentuation per-app non vérifiées |
| `role="grid"` sur les grilles interactives | ✅ (documenté) | |
| Skip links | ❓ | Lien "Aller au contenu" absent (critique pour lecteurs d'écran) |
| Annonces ARIA live | ❓ | Les toasts et feedbacks utilisent-ils `aria-live="polite"` ? |
| Texte alternatif emojis | ⚠️ | Les emojis dans les mats Blue-Bot doivent avoir `role="img" aria-label="..."` |

---

## 7. Tests

### 7.1 État de la suite E2E

| Fichier | Couverture |
|---|---|
| `test_basic.py` | Smoke test (structure HTML de base) |
| `test_webapps.py` | Tests de chargement des 6 webapps |
| `test_alpha_webapps.py` | Tests de chargement des 6 apps alpha |
| `test_teacher.py` | Tests de chargement des 2 ressources |
| `test_scores.py` | Tests fonctionnels ScoreManager (init, success, mistake, reset, adaptive) |

### 7.2 Forces

- Coverage du ScoreManager bien pensé (5 cas testés) ✅
- Tests de chargement pour toutes les apps ✅
- Instructions d'exécution dans README ✅

### 7.3 Lacunes majeures

| Lacune | Priorité |
|---|---|
| **Aucun test fonctionnel** pour `simulateur_bluebot` (la plus complexe) | 🔴 Haute |
| Pas de test pour le mode plein écran | 🟡 Moyenne |
| Pas de test pour les skins et les tapis | 🟡 Moyenne |
| Pas de test PWA / Service Worker | 🟡 Moyenne |
| Pas de tests de régression CSS / layout | 🟢 Faible |
| `conftest.py` non trouvé — configuration pytest unclear | ❓ |
| Tests non intégrés en CI/CD (pas de `.github/workflows` actif) | 🟡 Moyenne |

---

## 8. Documentation

### 8.1 README

| Section | État |
|---|---|
| Description projet | ✅ Excellente |
| Screenshot par webapp | ✅ 8/8 apps documentées |
| Instructions utilisation | ✅ Claires |
| Guide tests E2E | ✅ Présent |
| Guide contribution | ✅ Court mais suffisant |
| Architecture technique | ❌ Absente (pour les nouveaux contributeurs) |
| Changelog | ❌ Absent (remplacé par event-log.md agentique) |

### 8.2 Mémoire agentique

Le système de 5 fichiers memory/ est remarquablement bien conçu :
- `project-context.md` : 93 lignes de règles métier précises ✅
- `code-patterns.md` : 81 lignes de patterns réutilisables ✅
- `decisions.md` : 25 entrées datées avec justifications ✅
- `event-log.md` : 36 entrées append-only datées ✅
- `user-preferences.md` : Non lu dans cet audit

> [!NOTE]
> La mémoire agentique sert de **documentation vivante** pour les IA collaborant sur ce projet. C'est une pratique pionnière et très efficace.

### 8.3 Code

- Modules partagés (`scores.js`, `theme.js`) : bien commentés ✅
- Webapps individuelles : commentaires variables, souvent absents dans les sections CSS ⚠️
- `sw.js` : commentaires en français ✅

---

## 9. Gouvernance & processus

### 9.1 Workflow Git

- **712 commits** sur ~1 mois d'activité intensive
- **Branches feature** : Convention `jules-{id}`, `feature/{nom}`, `update-{nom}` — cohérente
- **Pull Requests** : Utilisées systématiquement (PR #282 vu dans le log) ✅
- **Reverts** : PR #281 et #282 sont des reverts — indique quelques régressions gérées proprement

### 9.2 Constats Git

| Constat | Détail |
|---|---|
| **Pas de `.github/workflows`** (actif) | CI/CD inexistante — tests non automatisés à chaque PR |
| **Commits très fréquents** | ~710 commits en avril 2026 seul — rythme insoutenable sur le long terme, suggère des itérations très courtes avec l'IA |
| **Messages de commit** | Variables — certains très détaillés, d'autres génériques |
| **License** | AGPL-3.0 correctement incluse ✅ |
| **CNAME** | `www.zooom.top` configuré ✅ |

### 9.3 Règles projet (JULES.md)

- Directive "pas de `replace_file_content`" documentée (ajoutée 2026-04-29) ✅
- Stack Vanilla imposé explicitement ✅
- Pas de modification `.github/workflows` sans permission ✅

---

## 10. Matrice de risques

| # | Risque | Probabilité | Impact | Priorité |
|---|---|---|---|---|
| R1 | Double registration SW dans `theme.js` | Haute | Moyen | 🔴 **P1** |
| R2 | Monolithe `simulateur_bluebot.html` (237 Ko) difficile à maintenir | Haute | Haut | 🔴 **P1** |
| R3 | `lucide.min.js` (397 Ko) chargé intégralement sur chaque page | Haute | Haut | 🔴 **P1** |
| R4 | XSS via `innerHTML` dans `scores.js` | Faible | Moyen | 🟡 **P2** |
| R5 | Duplication `.stat-donut-container` dans `shared.css` | Haute | Faible | 🟡 **P2** |
| R6 | Absence de CI/CD — régressions non détectées automatiquement | Haute | Haut | 🟡 **P2** |
| R7 | `console.log` en production | Haute | Faible | 🟢 **P3** |
| R8 | Attribut `lang="fr"` potentiellement absent | Faible | Moyen | 🟡 **P2** |
| R9 | Skip links absents (accessibilité) | Haute | Moyen | 🟡 **P2** |
| R10 | Cache SW non versionné (pas de cache busting) | Moyenne | Moyen | 🟡 **P2** |

---

## 11. Recommandations priorisées

### 🔴 Priorité 1 — À corriger immédiatement

1. **Supprimer la double registration du Service Worker dans `theme.js`** (lignes 49-59 ou 88-110 — en garder une seule, préférer le bloc le plus complet lignes 88-110)
2. **`lucide.min.js`** : Remplacer par des SVG inline ou un bundle tree-shaked — économie de 380 Ko par page
3. **`shared.css`** : Supprimer la définition dupliquée de `.stat-donut-container` (ligne 493)

### 🟡 Priorité 2 — Court terme (prochain sprint)

4. **CI/CD** : Activer GitHub Actions pour exécuter `e2e_tests/` automatiquement à chaque PR
5. **`scores.js`** : Remplacer `body.innerHTML = html` par une construction DOM sécurisée ; remplacer les `onclick` inline par `addEventListener`
6. **Tests Blue-Bot** : Ajouter un fichier `test_bluebot.py` couvrant les modes simulateur, pilotage et décodage
7. **Vérifier `lang="fr"`** sur tous les fichiers HTML
8. **Skip links** : Ajouter `<a href="#main-content" class="skip-link">Aller au contenu</a>` dans tous les headers

### 🟢 Priorité 3 — Long terme

9. **Supprimer les `console.log`** de `theme.js` et `sw.js` (ou les conditionner à `process.env`)
10. **Stratégie de versioning du cache SW** : Utiliser un hash de build ou un timestamp dans `CACHE_NAME`
11. **Refactoriser `simulateur_bluebot.html`** : Extraire le JS applicatif dans `js/bluebot.js`
12. **Ajouter un `CHANGELOG.md`** pour les utilisateurs (distinct du journal agentique)
13. **Documenter l'architecture** dans le README pour les nouveaux contributeurs humains

---

## 12. Synthèse globale

> **Score global estimé : 7,5 / 10**

Ce dépôt représente un **travail pédagogique de haute qualité**, avec une architecture bien pensée, un design system cohérent et une philosophie offline-first exemplaire. La gamme applicative est complète et bien documentée.

Les **principales faiblesses** sont d'ordre technique (performance de `lucide.min.js`, monolithe Blue-Bot, bug SW) plutôt que conceptuel. L'absence de CI/CD est le risque le plus systémique à long terme.

La pratique de **mémoire agentique** (fichiers `memory/`) est une innovation remarquable pour la maintenabilité assistée par IA, et constitue un modèle à documenter et partager.

---

*Audit réalisé par analyse statique du code source local. Aucun test dynamique exécuté dans le cadre de cet audit.*
