# Guide de contribution

Merci de votre intérêt pour la **Suite EdNum** ! Ce guide vous aidera à contribuer efficacement au projet.

## Table des matières

- [Prérequis](#prérequis)
- [Architecture technique](#architecture-technique)
- [Règles de contribution](#règles-de-contribution)
- [Conventions de code](#conventions-de-code)
- [Tests](#tests)
- [Soumettre une contribution](#soumettre-une-contribution)

---

## Prérequis

Aucun outil de build n'est nécessaire ! Le projet est en **Vanilla HTML/CSS/JS pur**.

Pour le développement local, vous aurez besoin de :
- Un navigateur web moderne (Chrome, Firefox, Edge)
- Un éditeur de code (VS Code recommandé)
- Python 3.x (uniquement pour les tests E2E et le serveur HTTP local)
- Node.js (scripts utilitaires et tests unitaires)

## Architecture technique

### Philosophie

Le projet repose sur trois principes fondamentaux :

1. **Offline-First / PWA** — Aucune dépendance réseau. Toutes les ressources (polices, icônes, logique) sont locales. Un Service Worker (`sw.js`) pré-cache les assets pour garantir un fonctionnement 100% hors-ligne.
2. **Zéro dépendance** — HTML, CSS et JavaScript purs. Pas de framework (React, Vue, Tailwind), pas de bundler (Webpack, Vite), pas de `npm install`. Cela garantit la longévité et la simplicité de distribution.
3. **Esthétique premium** — Design Glassmorphism moderne, typographie Outfit, micro-animations fluides.

### Structure du projet

```
C2/
├── index.html              # Portail d'accueil (point d'entrée)
├── sw.js                   # Service Worker (cache PWA)
├── manifest.json           # Manifeste PWA
│
├── webapps/                # Applications élèves (6 apps)
│   ├── simulateur_automate.html
│   ├── binaire_studio.html
│   ├── binaire_message.html
│   ├── binaire_codage.html
│   ├── bit_de_parite.html
│   └── routage_reseau.html
│
├── alpha/webapps/          # Applications expérimentales (non documentées)
│   ├── jeu_de_la_grue.html
│   ├── machine_a_trier.html
│   ├── machine_a_chiffrer.html
│   ├── reseau_de_tri.html
│   └── pixels_binaires.html
│
├── webapps/teacher/             # Outils enseignant·e·s
│   ├── bareme.html
│   └── tirage.html
│
├── assets/css/
│   └── shared.css          # Styles partagés (design system)
│
├── assets/js/
│   ├── theme.js            # Thème global + registration SW
│   ├── scores.js           # ScoreManager (gamification)
│   ├── confetti.js         # Effets visuels de récompense
│   ├── audio.js            # Audio synthétique (Web Audio API)
│   ├── swipe.js            # Navigation tactile par swipe
│   └── fa-subset.js    # Icônes FontAwesome
│
├── assets/fonts/                  # Polices auto-hébergées
├── meta/                   # Audits, tests, scripts et ressources non-déployées
│   ├── audits/
│   ├── tests/
│   │   ├── unit/           # Tests unitaires Node.js
│   │   └── e2e/            # Tests End-to-End Playwright (Python)
│   ├── memory/             # Contexte agents IA
│   ├── ressources/
│   │   ├── solid_icons.js   # Source pour la génération du subset FA
│   │   ├── regular_icons.js
│   │   └── duotone.js
│   ├── screenshots/        # Captures pour le README
│   └── scripts/            # Scripts utilitaires (Node.js)
└── .github/workflows/      # CI/CD GitHub Actions
```

### Fichiers partagés clés

| Fichier | Rôle |
|---|---|
| `assets/css/shared.css` | Design system complet : variables CSS, glassmorphism, dark mode, composants réutilisables |
| `assets/js/theme.js` | Gestion du thème clair/sombre, enregistrement du Service Worker, callback `__onThemeChange` |
| `assets/js/scores.js` | `ScoreManager` — suivi des scores, séries, records, difficulté adaptative, modale de stats |
| `assets/js/confetti.js` | Effets de confettis et récompenses visuelles (`launchConfetti()`, `launchFire()`) |
| `assets/js/audio.js` | Sons synthétiques via Web Audio API (`playSound('success')`, etc.) |
| `assets/js/swipe.js` | Navigation par swipe tactile entre onglets |
| `assets/js/fa-subset.js` | Icônes FontAwesome (auto-généré) |

### Service Worker

Le fichier `sw.js` maintient un tableau `ASSETS` listant tous les fichiers à mettre en cache. **Exécutez `node meta/scripts/generate-sw-manifest.js` pour mettre à jour la liste automatiquement.**

### Icônes FontAwesome

Le projet utilise un **subset personnalisé** de FontAwesome 7 Pro. Pour ajouter une nouvelle icône :
1. Ajoutez `data-fa="nom-icone"` dans votre HTML
2. Exécutez `node meta/scripts/generate_fa_subset.js` pour régénérer le subset
3. Vérifiez que l'icône s'affiche correctement

---

## Règles de contribution

### À faire ✅
- Respecter la stack Vanilla (HTML/CSS/JS pur)
- Utiliser les variables CSS de `shared.css` au lieu de valeurs hardcodées
- Ajouter des `aria-label` sur tous les boutons et éléments interactifs
- Tester en mode sombre et en mode clair
- Inclure les balises meta Open Graph (`og:title`, `og:description`, `og:type`)
- Ajouter le footer standard d'attribution
- Mettre à jour `sw.js` si de nouveaux fichiers sont ajoutés

### À ne pas faire ❌
- Ajouter des dépendances npm ou des CDN externes
- Utiliser `innerHTML` avec des données non échappées (risque XSS)
- Hardcoder des couleurs au lieu d'utiliser les CSS variables
- Ajouter des `console.log` en production
- Créer des doublons de styles déjà définis dans `shared.css`

---

## Conventions de code

### HTML
- Structure standard : `header.app-header` → `main.container` → `footer.no-print`
- Chaque page inclut `assets/css/shared.css`, puis ses styles locaux dans un `<style>`
- Les scripts partagés sont chargés via `<script src="../assets/js/...">`

### CSS
- Utiliser les variables CSS (`var(--accent)`, `var(--text-main)`, `var(--glass-bg)`, etc.)
- Préfixer les animations avec `var(--spring-easing)` pour la cohérence
- Mobile-first : `min-width` dans les media queries
- Touch targets minimum 44×44px (`clamp()` recommandé)

### JavaScript
- Accolades `{}` obligatoires pour tous les blocs `if/else`, même sur une ligne
- Ellipse typographique `…` (U+2026) dans le texte affiché, jamais `...`
- Bloquer les répétitions clavier avec `if (e.repeat) return;`
- Audio muet par défaut : `let isMuted = true;`
- Utiliser `ScoreManager.init('app_name')` pour la gamification

---

## Tests

### Tests unitaires (Node.js)

Ces tests vérifient la logique métier isolée (calculs, mélanges, etc.).

```bash
# Lancer les tests unitaires
npm run test:unit
```

### Tests E2E (Playwright)

Le projet dispose d'une suite de tests End-to-End qui vérifie le bon fonctionnement des applications dans un navigateur.

#### Installation
```bash
pip install pytest-playwright playwright
playwright install
```

#### Exécution locale
```bash
# Terminal 1 : serveur HTTP
python -m http.server 8000

# Terminal 2 : lancer les tests
python -m pytest meta/tests/e2e/ -v
```

#### CI/CD
Les tests sont automatiquement exécutés via GitHub Actions sur chaque Pull Request vers `main`. Le workflow est défini dans `.github/workflows/e2e-tests.yml`.

#### Ajouter un test
Les tests sont organisés par application dans `meta/tests/e2e/`. Conventions :
- Nommer les fichiers `test_<nom_app>.py`
- Utiliser `page.goto("http://localhost:8000/...")` comme base URL
- Privilégier les sélecteurs par ID (`#mon-element`) pour la stabilité

---

## Soumettre une contribution
1. **Forkez** le dépôt
2. **Créez une branche** descriptive : `fix/automate-collision` ou `feat/new-webapp`
3. **Commitez** avec des messages clairs en français ou anglais
4. **Testez** localement (vérification visuelle + tests unitaires + tests E2E)
5. **Ouvrez une Pull Request** vers `main` avec une description détaillée

> 💡 Pour les changements visuels, incluez des captures d'écran avant/après dans votre PR.
