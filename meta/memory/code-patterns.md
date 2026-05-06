# Code Patterns & UI/UX Consistency

## 1. Global App Structure (HTML)
Toutes les applications web doivent suivre cette structure sémantique stricte :
- **Head :** Balises Open Graph (`og:title`, etc.) et favicon centralisé (`favicon.svg`).
- **Body :** Immédiatement suivi d'un lien d'accessibilité `<a href="#main-content" class="skip-link">Aller au contenu principal</a>`.
- **Header (`<header class="app-header">`) :** Contient le titre, l'icône (cliquable vers `../index.html`), et les boutons d'action (Scores, Theme, Audio, Paramètres) souvent regroupés dans un menu dropdown large et accessible. Les boutons d'action utilisent des SVG *inline* extraits de `fa-subset.js`.
- **Main (`<main id="main-content">`) :** Encapsule le contenu principal de l'application (grilles, simulateur). Peut être enveloppé dans `.desktop-layout` (flex) pour optimiser l'affichage sur écrans larges (>900px).
- **Footer (`<footer class="no-print">`) :** Voir `project-context.md` pour le texte exact obligatoire.
- **Confetti :** Un `<canvas id="confetti-canvas"></canvas>` pour les animations.

## 2. CSS & Glassmorphism Design System
- **Centralisation :** Tous les styles globaux, variables (`--text-main`, `--card-bg`), et classes partagées (`.btn`, `.tab-btn`, `.chal-instruction`) doivent résider STRICTEMENT dans `assets/css/shared.css`. **Aucun style local dans les fichiers HTML** ni couleurs codées en dur (utiliser les variables).
- **Glassmorphism :** Les `.card` utilisent des fonds semi-transparents (`var(--glass-bg)`), un `backdrop-filter: blur(12px) saturate(180%)`, et des bordures `--glass-border`. Les composants globaux utilisent `--card-border` (non `--border-color`).
- **Border Radius :** Standardisés via `--radius-sm` (6px, `.btn-small`), `--radius-md` (8px, `.btn` principal), `--radius-lg` (12px, `.tab-btn`, dropdowns), `--radius-2xl` (20px, `.container`).
- **Responsive & Layout :** Éviter les dimensions fixes en pixels. Utiliser `flex-wrap`, `min-width: 0`, et `width: clamp(...)`. Pour les tableaux responsives, cacher les colonnes dynamiques avec `display: none !important` et utiliser `white-space: nowrap` sur les `<th>`. Pour éviter l'overflow horizontal sur mobile, limiter la largeur des cartes avec `minmax(min(100%, 320px), 1fr)`.
- **Thème Sombre (Dark Mode) :** Géré nativement via un attribut `data-theme` sur `<html>`. Les composants UI (boutons) doivent maintenir un fort contraste en mode sombre/clair au survol (utiliser `filter: brightness()` ou semi-transparence, éviter les textes blancs sur fonds clairs).

## 3. Navigation & Composants UI
- **Navigation Principale :** Utiliser EXCLUSIVEMENT des onglets supérieurs (`.tabs` > `.tab-btn`) pour la navigation entre les exercices. **Ne JAMAIS utiliser de barres inférieures ou `.nav-bar`** (pour éviter les conflits avec les gestes OS mobiles). Les onglets ne doivent pas servir à choisir la difficulté.
- **Accessibilité (A11y) & Interactions :**
  - Cibles tactiles d'au moins 44x44px.
  - Gestion du clavier (`tabindex="0"`, `onkeydown="Enter/Space"`). Rôles ARIA exacts pour les grilles complexes. Focus ring global via `:focus-visible`.
  - Micro-interactions "Juicy" avec animations de ressort (`var(--spring-easing)`).
- **Instructions :** Les consignes longues utilisent `<details class="instructions">`. Les directives courtes (une phrase) utilisent `.chal-instruction` (ex: `font-weight: 600; font-size: 1.1em`).
- **Modals & Drawers :** Stylés sous forme de panneaux latéraux (side-panels), pas de fenêtres flottantes ni de "bottom sheets". Doivent supporter la fermeture par geste (swipe) et la touche Escape.

## 4. JS & State Management
- **ScoreManager (`assets/js/scores.js`) :** Centralise la difficulté adaptative, les séries, les records, stockés dans `localStorage`. Les statistiques (%) doivent englober toutes les actions (succès + erreurs). Ne pas utiliser de fonctions obsolètes (ex: pas de `addCorrect()`).
- **Toasts (`assets/js/toast.js`) :** Utilisé via `showToast(msg, type)`. Conteneur généré automatiquement. Inutile de coder `<div id="toast"></div>` dans les apps. Positionnement global et `pointer-events: none`.
- **Audio (`assets/js/audio.js`) :** Toutes les applications avec audio doivent démarrer en mode muet (`let isMuted = true;`). Utiliser l'API Web Audio (`playSound()`), jamais de fichiers statiques ni de balises `<audio>`.
- **Drag & Drop (Mobile & Desktop) :** Suivre explicitement l'état global (ex: `isDragged = true`) pour éviter les conflits avec les boucles `requestAnimationFrame`. Pour le D&D mobile sans API HTML5, cloner l'élément, utiliser `position: fixed`, et bloquer le scroll via `e.preventDefault()` dans `touchmove`.
- **SVG & DOM Injection :** Ne pas utiliser `innerHTML` pour des données non vérifiées. Utiliser `ScoreManager._escapeHtml()`. Placer les `<defs>` SVG partagés dans un `<svg>` global caché dans le `<body>` pour éviter les collisions d'ID. Ne pas mettre de `overflow: hidden` sur les `.fa-icon` pour éviter de couper les icônes dépassant légèrement de leur viewBox.

## 5. Alpha Apps & App-Specific Quirks (Mots-clés)
- **Dessin / Pixels (Pixel Studio, Binaire) :** `isDrawing` tracking ; `e.preventDefault()` sur touchmove ; désactivation totale de `assets/js/swipe.js` pour éviter conflit Swipe vs Dessin.
- **Simulateur Blue-Bot :**
  - Vérifier routage via `activeTab` pour écouteurs globaux (clavier).
  - Validation "Dessin" : requiert shape `closed: true` et vérification position finale == initiale.
  - Grille carrée : Calculer dynamiquement l'`aspect-ratio` au lieu d'un `1/1` figé.
  - Skins/Mats : Mises à jour in-place DOM classes. Ne pas utiliser `buildGrid()`. Forcer `redrawTrail()`.
  - Mode 'Lecture' (Décodage) : Cacher la cible au rendu ! `.read-only-cmd` (`pointer-events: none`).
- **Jeu de la Grue :** Logique de queue 1D aveugle (pas de Preview) ; `.active-column`/`.active-slot` sur le DOM pour animer l'exécution ; Reset du `initialCupsState` sur échec.
- **Réseau de Tri :** Animations parallèles via `currentStageIndex`. Décalages `offsetX` uniquement en cas de chevauchement vertical garanti. Calculs `GRID_SPACING_X` dynamiques sur `window.resize`.
- **Machine à Trier :** Tri ascendant requis pour modes "Quantité" (dés) et "Taille".
- **Machine à Chiffrer :** Conteneur circulaire (`aspect-ratio: 1/1`), hauteurs internes en %, `transform-origin: bottom center`.
- **Routage Réseau :** Mode Extreme utilise `solarInterval` pour pannes temps réel (`brokenNodes`).