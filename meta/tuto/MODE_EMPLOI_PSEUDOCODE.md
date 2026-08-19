# 💻 Mode d'emploi : Pseudo-code

Bienvenue dans le guide d'utilisation de **Pseudo-code**, un environnement d'apprentissage interactif conçu pour faire le pont entre la programmation par blocs (visuelle) et la programmation textuelle, en s'initiant à l'écriture et à la lecture d'algorithmes structurés en pseudo-code.

Cette ressource s'adresse particulièrement au Cycle 3 / Secondaire I (9CO, Connected 3 · 2C — *Un programme adéquat*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Comprendre la structure d'un algorithme :** Identifier les variables, les structures de contrôle conditionnelles (*si ... alors ... sinon*), et les structures itératives (*répéter n fois*, *tant que ... faire*).
- **Affranchissement de la syntaxe stricte :** Découvrir la rigueur logique de la programmation sans être bloqué par les erreurs de ponctuation d'un langage formel (Python, JavaScript).
- **Débogage pas-à-pas et simulation matérielle :** Observer l'état des variables mémoire en temps réel lors de l'exécution, et interagir avec du matériel simulé (drone, enceinte connectée, distributeur de billets).

---

## 1. Les 5 Chapitres d'Apprentissage

| Chapitre | Thématique algorithmique | Matériel ou mise en situation |
|---|---|---|
| **1. Variables** | Affectation (`←`) & calcul en mémoire | Machine à calculer magique et registres |
| **2. Conditions** | Décision (`si ... alors ... sinon`) | Enceinte connectée & Drone |
| **3. Boucle Répéter** | Itération déterminée (`répéter n fois`) | Drone autonome & motifs géométriques |
| **4. Boucle Tant que** | Itération conditionnelle (`tant que ...`) | Drone & boucle d'attente / obstacles |
| **5. Débogage** | Analyse d'erreurs logiques et correction | Distributeur automatique de billets (SwissPass) |

### 1.1. Chapitre 1 : Les Variables (La Machine Magique)
- **Concept :** Une variable est une « boîte étiquetée » en mémoire qui stocke une valeur (nombre ou texte) pouvant évoluer au cours de l'algorithme.
- **Activité :** L'élève observe les cases mémoires s'illuminer et changer de valeur à chaque assignation (`←`) ou calcul arithmétique.

### 1.2. Chapitre 2 : Les Conditions (L'Enceinte Connectée & Le Drone)
- **Concept :** L'instruction `si [condition] alors [actions] sinon [autres actions]` permet d'orienter le comportement du programme selon l'état des capteurs ou de l'utilisateur.
- **Activité :** Piloter l'enceinte audio intelligente (lecture, pause, connexion Bluetooth) ou guider un drone en évitant les zones interdites.

### 1.3. Chapitre 3 : La Boucle « Répéter » (Pour / For)
- **Concept :** Répéter un bloc d'instructions un nombre précis et fixé de fois afin d'éviter la répétition fastidieuse de lignes de code.
- **Activité :** Faire tracer au drone des formes géométriques ou collecter une rangée régulière d'étoiles avec un minimum d'instructions.

### 1.4. Chapitre 4 : La Boucle « Tant que » (While)
- **Concept :** Répéter une action *aussi longtemps qu'une condition reste vraie* (ex. avancer tant que la voie est libre, ou tant que la cible n'est pas atteinte).
- **Activité :** Gérer des parcours à distance inconnue ou des obstacles dynamiques.

### 1.5. Chapitre 5 : Le Débogage (Le Distributeur de Billets)
- **Scénario réaliste :** Un distributeur automatique de billets de train présente un dysfonctionnement (ex. oubli de rendu de monnaie, mauvais calcul du tarif adulte/enfant/SwissPass demi-tarif).
- **Activité :** L'élève teste la machine physique (insertion de pièces, sélection tactile du billet, validation), identifie la faille dans le pseudo-code et insère l'instruction manquante via l'interligne tactile intelligent.

---

## 2. L'Interface de Travail

L'écran est structuré en deux panneaux synchronisés :
- **Panneau Gauche (Éditeur de code) :** Affichage coloré et indenté du pseudo-code avec numéros de lignes, mise en valeur de l'instruction en cours d'exécution, et menus déroulants interactifs pour corriger le code.
- **Panneau Droit (Simulation Matérielle & Mémoire) :**
  - Grille 5×5 du drone spatial avec coordonnées et étoiles cibles.
  - Machine matérielle (enceinte, distributeur de billets avec fentes de pièces et empilement 3D des tickets imprimés).
  - Slots de variables mémoire et console d'affichage LED en temps réel.

---

## 3. Progression & Niveaux de Difficulté

Chaque chapitre propose 3 niveaux linéaires (**Facile 🟢**, **Moyen 🟡**, **Difficile 🔴**) garantissant une assimilation solide avant de passer aux concepts plus avancés.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
