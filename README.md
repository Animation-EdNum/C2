# Suite EdNum - Éducation Numérique (Webapps & Ressources)

![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🎯 Présentation du projet

Bienvenue dans la **Suite EdNum**, un projet développé avec passion par l'Animation Pédagogique Éducation Numérique (HEP-VS).

Ce dépôt regroupe des **applications web interactives** (webapps) et des **outils pédagogiques**, entièrement gratuits, sans publicité, et créés spécifiquement pour accompagner l'enseignement de la science informatique à l'école primaire (en complément des manuels valaisans et vaudois [Décodage](https://decodage.edu-vd.ch/)).

Notre mission est de fournir des outils numériques de qualité, autonomes et accessibles. La philosophie pédagogique repose sur des interfaces épurées, une progression adaptative, de la gamification et une utilisation garantie **100% hors-ligne** pour permettre aux élèves et aux enseignant·e·s de se concentrer sur l'apprentissage.

---

## 🍎 Pour les enseignant·e·s (Utilisation simple)

Vous n'êtes pas un pro de l'informatique ? Aucun problème ! Ces outils sont conçus pour fonctionner de la manière la plus simple possible, directement dans le navigateur (Chrome, Firefox, Safari, Edge) de votre ordinateur de classe ou de votre tablette.

### ✨ Les avantages pour votre classe
*   **Zéro installation :** Pas de serveur, pas de logiciel lourd. Téléchargez le dossier, double-cliquez sur `index.html` et c'est parti !
*   **100% Hors-ligne :** Une fois la page ouverte (ou installée comme application sur tablette), vous n'avez plus besoin d'internet. Parfait pour les écoles avec une connexion instable.
*   **Essayez tout de suite :** Toutes nos applications sont directement jouables en ligne sur le portail [www.zooom.top](https://www.zooom.top).

### 📱 Compatibilité Multi-Supports (Responsive Design)
Nos applications sont pensées pour s'adapter à toutes les tailles d'écran (Mobile, Tablette, Desktop, et Ecrans larges). L'interface reste claire et utilisable sur tous les supports.

Voici un exemple avec le simulateur d'automate, prouvant la compatibilité sur de multiples supports :

| Mobile | Écran large (Wide) |
|:---:|:---:|
| <img src="meta/screenshots/simulateur_bluebot_mobile.png" height="350"> | <img src="meta/screenshots/simulateur_bluebot_widescreen.png" height="350"> |
| *Affichage vertical compact avec swipe* | *Exploitation complète de la largeur d'écran* |

### 🎮 Nos Webapps pour les élèves (Jeux pédagogiques)

Toutes nos applications intègrent une interface unifiée (design "Glassmorphism" moderne), un mode clair/sombre, une difficulté adaptative intelligente, et des graphiques circulaires pour visualiser les progrès. L'application portail d'accueil (`index.html`) permet un accès facile et rapide à chaque outil.

![Portail d'accueil](meta/screenshots/index.png)

#### 1. Simulateur Blue-Bot (`webapps/simulateur_bluebot.html`)
![Simulateur Blue-Bot](meta/screenshots/simulateur_bluebot.png)
- **À quoi sert l'outil :** Un simulateur de robot programmable permettant aux élèves de découvrir les bases de la robotique et de la pensée algorithmique à travers des parcours libres et des puzzles de cheminement dynamiques.
- **Lien DÉ>CODAGE :** [3-4e](https://decodage.edu-vd.ch/3-4/) · **Scénario 2 — Automates · Blue-Bot** (Demi-cycle 3-4H)
- **Fonctionnalités :** Explorez librement le robot, résolvez des puzzles avec règles strictes (Facile, Moyen, Difficile), prédisez les parcours et trouvez des bugs dans les programmes. Créez aussi vos propres défis sur des tapis modulables.
- **Valeur pédagogique :** Travaille la pensée algorithmique, la décomposition de problèmes, la décentration cognitive (droite/gauche relatives au robot) et favorise l'anticipation par la programmation à l'aveugle.

#### 2. Pixel Studio (`webapps/binaire_studio.html`)
![Pixel Studio](meta/screenshots/binaire_studio.png)
- **À quoi sert l'outil :** Un studio de codage interactif faisant le lien entre des images matricielles en noir et blanc et leur représentation binaire (0 pour noir, 1 pour blanc).
- **Lien DÉ>CODAGE :** [5-6e](https://decodage.edu-vd.ch/5-6/) · **Scénario 4 — Codage de données, codage binaire** (Demi-cycle 5-6H)
- **Fonctionnalités :** 3 modes : *Décoder* (dessiner d'après le code), *Encoder* (trouver le code d'une image) et *Éditeur Libre*. Avec sauvegarde locale de créations !
- **Valeur pédagogique :** Matérialise le concept abstrait de "numérisation". Comprendre que l'information visuelle se traduit en 0 et en 1.

#### 3. Mots secrets (`webapps/binaire_message.html`)
![Mots secrets](meta/screenshots/binaire_message.png)
- **À quoi sert l'outil :** Un jeu interactif pour chiffrer et déchiffrer des mots en utilisant l'alphabet binaire.
- **Lien DÉ>CODAGE :** [7-8e](https://decodage.edu-vd.ch/7-8/) · **Activité 2 — Codages en folie (séance 2)** (Demi-cycle 7-8H)
- **Valeur pédagogique :** Les élèves découvrent que les lettres sont représentées par des nombres, eux-mêmes encodés en binaire. Stimule le calcul mental (puissances de 2) et renforce la collaboration avec le mode (dé)codeur de messages.

#### 4. Routage Réseau (`webapps/routage_reseau.html`)
![Routage Réseau](meta/screenshots/routage_reseau.png)
- **À quoi sert l'outil :** Simulation visuelle pour trouver le chemin le plus rapide pour acheminer un "paquet" dans un réseau.
- **Lien DÉ>CODAGE :** [7-8e](https://decodage.edu-vd.ch/7-8/) · **Activité 8 — Les réseaux, Niveau 2** (Demi-cycle 7-8H)
- **Valeur pédagogique :** Montre qu'un chemin court "visuellement" n'est pas le plus rapide (coût des routes). Sensibilise à l'infrastructure d'Internet et développe des stratégies d'optimisation face à des graphes complexes.

#### 5. Codage binaire (`webapps/binaire_codage.html`)
![Codage binaire](meta/screenshots/binaire_codage.png)
- **À quoi sert l'outil :** Entraînement intensif au passage des nombres entiers (décimal) vers le binaire, et inversement.
- **Lien DÉ>CODAGE :** [7-8e](https://decodage.edu-vd.ch/7-8/) · **Activité 2 — Codages en folie (séance 1)** (Demi-cycle 7-8H)
- **Valeur pédagogique :** Consolide la numération de position sur 8 bits (jusqu'à 255) et guide l'élève de manière proactive et étayée (feedback "trop grand / trop petit").

#### 6. Bit de Parité (`webapps/bit_de_parite.html`)
![Bit de Parité](meta/screenshots/bit_de_parite.png)
- **À quoi sert l'outil :** Jeu sur la parité (paire) permettant de comprendre comment l'ordinateur détecte qu'un message a été altéré.
- **Lien DÉ>CODAGE :** [7-8e](https://decodage.edu-vd.ch/7-8/) · **Enquête 5 — Peut-on détecter des erreurs... ?** (Demi-cycle 7-8H)
- **Valeur pédagogique :** Initie à l'intégrité de la donnée via des métadonnées (le bit de parité) et développe le repérage spatial via des coordonnées sur une grille.


### 🛠️ Ressources pratiques pour les enseignant·e·s
Trouvez ces outils dans le portail central `index.html` ou directement dans le dossier `webapps/teacher/`.

#### Générateur de Barème (`webapps/teacher/bareme.html`)
![Générateur de Barème](meta/screenshots/bareme.png)
Un petit utilitaire sans publicité permettant de générer instantanément un barème de points pour la correction d'évaluations (avec option d'impression PDF au format propre).

#### Tirage au Sort (`webapps/teacher/tirage.html`)
![Tirage au Sort](meta/screenshots/tirage.png)
Outil visuel pour désigner un·e élève au hasard. Gère la sauvegarde automatique (`localStorage`), l'exclusion d'élèves (absents) et conserve l'historique des tirages.

---

## 💻 Pour les Geeks et les Contributeurs (Développeurs)

Vous aimez le code propre, sans fioritures et extrêmement performant ? Ce projet est fait pour vous.
Nous avons fait le choix radical du **Vanilla 100%**. Pas de React, pas de Tailwind, pas de npm install pour compiler la production. Le code source *est* le code de production.

### 🏗️ Architecture technique
*   **Stack :** HTML / CSS (Variables natives) / JS (ES6).
*   **Offline-First & PWA :** Un Service Worker robuste (`sw.js`) met en cache le dossier `assets/` (fichiers CSS, JS partagés, et polices locales) et tous les HTML.
*   **Design System partagé :** Tout le Glassmorphism, le Dark Mode, et les composants UI (`.btn`, `.tabs`, `.card`) se trouvent dans `assets/css/shared.css`.
*   **Gestionnaires globaux :**
    *   Scores et Gamification : `assets/js/scores.js` (ScoreManager).
    *   Sons (Web Audio API) : `assets/js/audio.js` (aucun fichier .mp3 externe).
    *   Swipe Mobile : `assets/js/swipe.js`.
    *   Toasts & Particules : `assets/js/toast.js` et `assets/js/confetti.js`.
*   **Icônes Vectorielles (FontAwesome) :** Nous utilisons **FontAwesome 7 Pro (Solid & Duotone)**. Au lieu de charger un énorme fichier de police, un script Node.js (`meta/scripts/generate_fa_subset.js`) parse le HTML et génère dynamiquement `assets/js/fa-subset.js` (moins de 20ko !).

### 🤝 Comment contribuer ?
Les contributions (nouvelles apps, corrections de bugs, ou optimisations UI) sont très appréciées !
Consultez le **[Guide de contribution](CONTRIBUTING.md)** pour tout savoir.

1.  **Forkez** le projet et clonez votre repo.
2.  Créez une branche (`feature/nouvelle-app`).
3.  Faites vos modifications en respectant les **Patterns du projet** (voir `meta/memory/code-patterns.md`).
4.  Lancez les **tests E2E** Playwright avant de soumettre.
5.  Ouvrez une **Pull Request** vers `main`.

### 🧪 Tests End-to-End (E2E)
Notre pipeline CI (`.github/workflows/e2e-tests.yml`) vérifie chaque PR avec Playwright.
Pour lancer les tests localement :
```bash
# 1. Installer les dépendances Python
pip install -r meta/e2e_tests/requirements.txt && playwright install

# 2. Démarrer un serveur local (en tâche de fond)
python -m http.server 8000 &

# 3. Lancer les tests E2E
pytest meta/e2e_tests/

# 4. Tuer le serveur une fois terminé
kill $(lsof -t -i :8000) 2>/dev/null || true
```

## 📜 Changelog et Documentation Interne
Tout notre processus de développement (décisions d'architecture, logs) est archivé dans le dossier `meta/memory/`. Si vous modifiez l'architecture globale, pensez à mettre à jour `project-context.md` ou `event-log.md`.

## 📬 Contact / Support
Pour toute question pédagogique ou technique, vous pouvez me contacter :
📧 **vivian.epiney [at] hepvs.ch**

## ⚖️ Licence
Ce projet est libre et open-source. Code 100% distribué sous la licence **[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)**. Partagez, modifiez, mais gardez-le libre !
