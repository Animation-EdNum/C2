# Éducation Numérique Webapps & Ressources

Ce dépôt contient deux sections principales : `webapps/` et `ressources/`.

## Webapps (Applications pour les élèves)
Ce sont des jeux interactifs conçus pour les élèves de l'école primaire qui travaillent avec les manuels scolaires *Décodage*. Vous pouvez trouver plus d'informations sur les manuels sur [https://decodage.edu-vd.ch/](https://decodage.edu-vd.ch/).

Les webapps partagent une interface unifiée, une esthétique moderne et incluent de manière native un **Mode Sombre global** (Dark Mode) dont le choix est conservé en mémoire pour une expérience continue d'une application à l'autre.

Les webapps disponibles sont :

### 1. Pixel Studio (`webapps/binaire_studio.html`)
- **À quoi sert l'outil :** Un studio de codage interactif permettant de faire le lien entre des images matricielles (pixels) en noir et blanc et leur représentation binaire (0 pour le noir, 1 pour le blanc).
- **Lien avec les activités Décodage :** Représentation de l'information (images, pixels).
- **Demi-cycle concerné :** 5-6H
- **Fonctionnalités :**
  - 3 modes de jeu : *Décoder* (dessiner à partir du code binaire), *Encoder* (trouver le code à partir d'une image) et *Éditeur Libre* (création pure).
  - Tailles de grille modulables selon la difficulté (5x5, 8x8, 10x10).
  - Sauvegarde locale d'une "Galerie" / "Collection" de ses créations.
  - Exportation technique de l'œuvre finale en format image PNG.

### 2. Mots secrets (`webapps/binaire_message.html`)
- **À quoi sert l'outil :** Un jeu interactif en deux parties pour apprendre à chiffrer et déchiffrer des mots à l'aide de l'alphabet binaire avec un camarade.
- **Lien avec les activités Décodage :** Représentation de l'information (texte).
- **Demi-cycle concerné :** 7-8H
- **Fonctionnalités :**
  - **Partie en deux étapes :** création d'un mot secret codé en binaire (max 4 lettres) que l'on transmet à un camarade, puis décodage d'un message reçu caractère par caractère.
  - **Progression adaptative :** mots de difficulté croissante (lettres A-G, puis A-O, puis A-Z) avec une assistance progressive au décodage (pas d'aide, puis la somme des bits, puis l'alphabet binaire complet).
  - Touche de validation rapide au clavier ("Entrée") et design épuré pour faciliter la concentration.

### 3. Routage Réseau (`webapps/routage_reseau.html`)
- **À quoi sert l'outil :** Une simulation visuelle qui demande aux élèves de trouver le chemin le plus rapide pour acheminer un "paquet" d'un point A (ordinateur) à un point B (serveur) au travers d'un graphe.
- **Lien avec les activités Décodage :** Réseaux et communication (cheminement, algorithme de routage, Internet).
- **Demi-cycle concerné :** 7-8H
- **Fonctionnalités :**
  - 3 niveaux de difficulté modifiant la taille et la complexité du réseau (génération dynamique).
  - Interface basée sur un canvas vectoriel (SVG) pour interagir directement sur les nœuds en cliquant.
  - Suivi en temps réel du coût du chemin (Unité de Temps/UTI).
  - Validateur d'optimalité qui compare le chemin de l'élève avec le chemin mathématiquement le plus court.

### 4. Codage binaire (`webapps/binaire_codage.html`)
- **À quoi sert l'outil :** Une plateforme d'entraînement intensif au passage des nombres entiers (décimal) vers leur écriture en binaire, et inversément.
- **Lien avec les activités Décodage :** Représentation de l'information (nombres).
- **Demi-cycle concerné :** 7-8H
- **Fonctionnalités :**
  - Exercices générés aléatoirement (conversion dans les deux sens).
  - Intégration d'une aide sous forme de "Mini-calculatrice binaire" dépliable pour aider à visualiser les puissances de 2.
  - Validation ultra-rapide au clavier (touche "Entrée") pour favoriser l'automatisme.

### 5. Bit de Parité (`webapps/bit_de_parite.html`)
- **À quoi sert l'outil :** Un exercice ludique abordant la notion de parité afin de comprendre comment un ordinateur peut s'assurer qu'un message n'a pas été altéré lors d'une transmission.
- **Lien avec les activités Décodage :** Représentation de l'information et détection d'erreurs (intégrité des données).
- **Demi-cycle concerné :** 7-8H
- **Fonctionnalités :**
  - Mode entraînement dynamique demandant de garantir la "parité paire" sur des grilles de bits.
  - 3 tailles de grilles pour adapter la complexité cognitive : 4x4, 5x5, ou 6x6.
  - Système de suivi des scores (victoires globales, etc.).

## Ressources (Outils pour les enseignant·e·s)
Ce sont des outils gratuits, sans publicité, simples et faciles à utiliser, conçus spécifiquement pour les enseignant·e·s.

Les ressources disponibles sont :

### 6. Générateur de Barème (`ressources/bareme.html`)
- **À quoi sert l'outil :** Un petit utilitaire sans publicité permettant aux enseignants de générer instantanément un barème de points pour la correction de leurs évaluations.
- **Fonctionnalités :**
  - Génération automatique des échelles de notes selon le total saisi.
  - Thème adaptable (Clair / Sombre) avec sauvegarde des préférences en `localStorage`.
  - Formatage spécifique pour l'impression ou l'exportation en PDF (affichage propre, masquage des menus de configuration).

### 7. Tirage au Sort (`ressources/tirage.html`)
- **À quoi sert l'outil :** Un outil efficace et visuel pour désigner un·e élève au hasard lors d'activités en classe ou pour créer des dynamiques aléatoires.
- **Fonctionnalités :**
  - Sauvegarde locale automatique (`localStorage`) : la liste d'élèves et l'état du tirage restent en mémoire même si l'onglet est fermé.
  - Animation de suspense avec effets sonores désactivables.
  - Gestion fine de la liste : exclusion temporaire (élèves absents) et remise en jeu des élèves déjà tirés par simple clic.
  - Génération et copie dans le presse-papiers d'un historique complet du tirage.

## Développement & Tests

Les tests automatiques utilisent [Playwright](https://playwright.dev/python/) et [pytest](https://pytest.org/).

### Lancer les tests (Windows)

Double-cliquez sur `run_tests.bat` ou, depuis un terminal :

```bat
run_tests.bat
```

Le script installe automatiquement les dépendances et lance les tests.

### Lancer manuellement

```bash
# Depuis la racine du repo
pip install playwright pytest
python -m playwright install chromium
python -m pytest tests/ -v
```

### Dépendances (`requirements.txt`)

```
playwright
pytest
```

## Licence
Toutes les webapps et ressources sont sous licence [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html).