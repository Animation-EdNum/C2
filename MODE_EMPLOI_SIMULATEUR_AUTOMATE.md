# 🤖 Mode d'emploi : Simulateur d'automate (Blue-Bot)

Bienvenue dans le guide d'utilisation du **Simulateur d'automate**, une application web interactive conçue pour accompagner l'enseignement de la robotique et de la pensée algorithmique à l'école primaire.

Ce simulateur permet aux élèves de s'entraîner à la programmation d'un automate (de type Blue-Bot) de manière ludique, à travers 4 modes de difficulté progressive.

---

## 1. Mode Simulateur (Exploration Libre)

![Mode Simulateur](meta/screenshots/sim_simulateur.png)

Ce mode est idéal pour une première prise en main de l'automate et des déplacements dans l'espace.

**Comment l'utiliser :**
- Utilisez les boutons du panneau de contrôle (Avancer, Reculer, Pivoter à gauche, Pivoter à droite) pour créer une séquence d'instructions.
- Les instructions s'affichent sous forme de cartes dans la barre d'exécution.
- Appuyez sur le bouton **"GO"** (vert) pour lancer l'exécution de votre programme. L'automate se déplacera sur la grille en suivant vos instructions.
- Le bouton **"Effacer"** (rouge avec une croix) permet de supprimer la dernière instruction ou de vider entièrement la séquence si on clique sur la corbeille.
- Vous pouvez choisir différents "Tapis" (fonds de grille) dans les réglages pour varier les contextes (ex: Ville, Espace, Nature).
- Vous pouvez positionner le robot où vous le souhaitez en cliquant sur le bouton **"Position aléatoire"** ou en cliquant directement sur une case de la grille avant d'ajouter des instructions.

---

## 2. Mode Pilotage (Défis)

![Mode Pilotage](meta/screenshots/sim_pilotage.png)

Ce mode propose des défis à résoudre : l'automate doit atteindre une cible précise (ex: une étoile, un drapeau) en suivant les règles imposées par la difficulté.

**Comment l'utiliser :**
- Observez la position de l'automate et celle de la cible.
- Programmez la séquence d'instructions permettant de relier les deux.
- **Niveaux de difficulté :**
  - **🟢 Facile :** Mouvements libres, aucune restriction sur les déplacements (pas de collisions avec des obstacles).
  - **🟡 Moyen :** Introduction d'obstacles. Vous devez contourner les cases grisées.
  - **🔴 Difficile :** Obstacles et limitation du nombre d'instructions. Vous devez trouver le chemin le plus court (optimisation).
  - **🔥 Extrême :** Le chemin doit être parfait du premier coup. Toute erreur annule la progression du défi.
- Si vous réussissez, une animation de victoire s'affiche, et vous gagnez des points. Si vous échouez (ex: vous sortez de la grille, ou vous touchez un obstacle), vous pouvez corriger votre programme et réessayer.

---

## 3. Mode Décodage (Lecture de code)

![Mode Décodage](meta/screenshots/sim_decodage.png)

Ce mode inverse la logique : le programme est déjà écrit, et vous devez deviner où l'automate va s'arrêter !

**Comment l'utiliser :**
- Une séquence d'instructions est affichée à l'écran. L'automate est positionné sur la grille.
- Vous devez lire la séquence de gauche à droite, et imaginer (de tête) le parcours de l'automate.
- **Cliquez sur la case de la grille** où vous pensez que l'automate terminera son parcours après l'exécution complète du programme.
- Une fois que vous avez cliqué, le programme s'exécute visuellement pour vérifier votre prédiction.
- C'est un excellent exercice pour travailler la décentration cognitive (gauche/droite relatives au robot) et la mémoire de travail.
- La difficulté augmente progressivement (plus d'instructions, chemins plus complexes).

---

## 4. Mode Dessin (Création géométrique)

![Mode Dessin](meta/screenshots/sim_dessin.png)

Dans ce mode, l'automate est équipé d'un stylo imaginaire et laisse une trace derrière lui. Le but est de reproduire des formes géométriques ou des motifs.

**Comment l'utiliser :**
- Le défi affiche une forme à reproduire (ex: un carré, un rectangle, une ligne droite).
- Programmez les mouvements de l'automate de manière à tracer la forme demandée.
- **Attention :** Pour les formes fermées (comme un carré ou un rectangle), l'automate doit impérativement revenir à son point de départ. Par exemple, pour un carré de 2 cases de côté, il ne suffit pas de faire les 4 côtés, il faut s'assurer que le dernier mouvement ramène le robot sur la case initiale.
- Ce mode permet d'introduire des concepts de géométrie (angles droits, longueurs, polygones).
- La complexité des figures augmente avec les niveaux de difficulté.

---

### Astuces supplémentaires

- **Accessibilité :** L'application est utilisable au clavier (flèches directionnelles, Espace, Entrée) dans le mode Simulateur.
- **Thème :** Vous pouvez basculer entre le mode clair et le mode sombre via l'icône dans l'en-tête (si disponible dans le portail).
- **Hors-ligne :** Une fois chargée une première fois, l'application fonctionne entièrement sans connexion Internet.
