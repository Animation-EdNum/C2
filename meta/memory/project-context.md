# Project Context

## Overview & Mission
La **Suite EdNum** (par Animation-EdNum, HEP-VS) est une collection d'applications web éducatives interactives de haute qualité, destinées aux élèves de l'école primaire en Suisse (Hautes Écoles Pédagogiques - HEP-VS). Ces outils complètent les manuels **Décodages** et sont alignés sur le Plan d'Études Romand (PER) pour les cycles 1-2H, 3-4H, 5-6H et 7-8H. L'objectif est d'enseigner des concepts informatiques tels que les algorithmes, le codage binaire, les réseaux et la logique.

## Application Categories
Les applications sont structurées en deux catégories principales :
- **Student Tools (`webapps/`) :** Simulateur Blue-Bot, Pixel Studio, Mots secrets, Routage Réseau, Codage binaire, Bit de Parité, etc.
- **Teacher Tools (`webapps/teacher/`) :** Générateur de Barème, Tirage au Sort. *(Anciennement dans `ressources/`)*

## Technical Philosophy & Architecture
- **Offline-First / PWA (Critical) :** Le projet fonctionne comme une Progressive Web App (PWA) installable. Il n'y a aucune dépendance à Internet ; tous les éléments (polices, icônes FontAwesome, logique) sont locaux. Le Service Worker (`sw.js`) met en cache les dossiers `webapps/`, `webapps/teacher/`, `assets/css/`, `assets/js/`, et `assets/fonts/` pour garantir une fonctionnalité hors ligne totale.
- **Vanilla Stack :** Pur HTML, CSS, et JS (Vanilla). Aucun framework (React, Vue, Tailwind) pour assurer la longévité, la maintenabilité et l'absence d'étape de build.
- **Premium Aesthetics & A11y :** Design moderne "Glassmorphism", typographie soignée ("Outfit"), micro-animations fluides, conformité WCAG AA (support complet du clavier, ARIA).
- **Structure de Dépôt :**
  - **Dossier `standalone/` :** Intentionnellement supprimé. Ne pas essayer de créer de versions standalone.
  - **Dossier `alpha/webapps/` :** Contient les applications expérimentales. Doivent y rester, rester cachées par défaut (recherche du mot-clé 'alpha' requise dans `index.html`) et ne pas être documentées dans le README.

## Documentation & Assets
- **Screenshots & README :** Le fichier `README.md` doit impérativement conserver les explications des différentes webapps (très utile pour les enseignants) et inclure une capture d'écran pour chaque application, ressource, et le portail `index.html` (Desktop et Mobile). Les captures sont stockées dans `meta/screenshots/`.
- **Cartes d'Application (`index.html`) :**
  - Les descriptions (`.card-desc`) doivent comporter une seule phrase (max 12 mots), expliquant objectivement l'outil (ex: "Un outil pour...").
  - Tags (`.card-tags`) : Maximum 4 tags, réutilisés pour la cohérence, avec le domaine éducatif en dernier (ex: `#Maths`, `#Transversal`). Ne pas utiliser le tag `#Jeu`.
  - Ressources externes : Placées après les ressources internes, stylées de manière neutre (`.card.external`, gris), avec une icône FontAwesome unique.
  - Badges : Les badges secondaires/anciens cycles utilisent `.badge.grey`. Les ressources enseignants utilisent `.badge.prof`.

## License, Attribution & Support
- **Attribution (Critical) :** TOUS les fichiers HTML doivent utiliser un pied de page uniforme (`<footer class="no-print">`) contenant exactement : "Webapp conçue par Vivian de l'[AP EdNum](https://www.hepvs.ch/fr/prestations-de-services/animation-pedagogique-12811/) avec ❤️ et quelques neurones artificiels" (le lien doit être uniquement sur "AP EdNum") et un lien vers le code source : "Code 100% libre (AGPL-3.0)".
- **License :** Code source sous licence AGPL-3.0.
- **Support :** Contact principal : vivian.epiney@hepvs.ch.

## Current Sprint Focus
- **Simulateur Blue-Bot :** Stable, fonctionnalités complètes.
- **Ongoing :** Standardisation de la navigation mobile (abandon des barres inférieures au profit des onglets supérieurs `.tabs`), notifications toast unifiées, et audit visuel (border-radius, interactions).