# 🤖 Mode d'emploi : Simulateur d'automate (Blue-Bot)

Bienvenue dans le guide d'utilisation du **Simulateur d'automate**, une application web interactive conçue pour accompagner l'enseignement de la robotique et de la pensée algorithmique à l'école primaire.

Ce simulateur permet aux élèves de s'entraîner à la programmation d'un automate (de type Blue-Bot) de manière ludique, à travers **5 modes** de difficulté progressive.

---

## 1. Mode Exploration (Déplacement direct)

Ce mode permet de comprendre le comportement de l'automate sans avoir à anticiper une séquence complète. Le robot se déplace immédiatement à chaque appui sur une touche.

**Comment l'utiliser :**
- Utilisez les boutons du panneau de contrôle (Avancer, Reculer, Pivoter à gauche, Pivoter à droite).
- À chaque clic, l'automate exécute immédiatement l'action sur la grille.
- Vous pouvez positionner le robot où vous le souhaitez en cliquant sur le bouton **« Position aléatoire »** (icône dé) ou en cliquant directement sur une case de la grille.
- Le bouton **« Trésors & Obstacles »** permet de placer des éléments à récolter et des obstacles à contourner sur la grille.
- C'est le mode idéal pour faire de la découverte ou pour les plus jeunes élèves.

---

## 2. Mode Simulateur (Programmation)

![Mode Simulateur](../screenshots/sim_simulateur.png)

Ce mode est idéal pour créer et tester des séquences de déplacement entières avant exécution.

**Comment l'utiliser :**
- Utilisez les boutons directionnels pour créer une séquence d'instructions.
- Les instructions s'affichent sous forme de cartes dans la barre du programme.
- Appuyez sur le bouton **« GO »** (vert) pour lancer l'exécution de votre programme. L'automate se déplacera en suivant vos instructions.
- Le bouton **« X »** (bleu) permet d'effacer la séquence d'instructions.
- Comme en mode Exploration, vous pouvez ajouter des trésors et des obstacles. Les éléments atteints par le robot s'affichent dans la zone « Éléments atteints ».
- Un bouton **œil barré** (à côté de la barre du programme) permet de **masquer les commandes** pour transformer l'exercice en défi mémoire.
- Un compteur **Victoires** et une **Série 🔥** apparaissent lorsque vous collectez des trésors.

---

## 3. Mode Pilotage (Défis à choix multiples)

![Mode Pilotage](../screenshots/sim_pilotage.png)

Ce mode propose des défis à résoudre : l'automate doit atteindre une cible précise. **Contrairement au mode Simulateur, vous ne programmez pas la séquence vous-même** : plusieurs propositions de séquences vous sont données, et vous devez choisir celle qui est correcte.

**Comment l'utiliser :**
- Observez la position de l'automate et celle de la cible sur la grille.
- Analysez chaque proposition de séquence affichée au-dessus de la grille.
- Cliquez sur la proposition que vous pensez correcte. Les bonnes réponses se colorent en vert, les mauvaises en rouge.
- **Niveaux de difficulté :**
  - **🟢 Facile :** Mouvements simples, pas d'obstacles.
  - **🟡 Moyen :** Introduction d'obstacles à contourner.
  - **🔴 Difficile :** Obstacles et chemins plus complexes à optimiser.
  - **🔥 Extrême :** Niveau **débloqué** uniquement après avoir progressé dans les niveaux précédents ; chemins maximaux avec contraintes renforcées.

---

## 4. Mode Décodage (Lecture de code)

![Mode Décodage](../screenshots/sim_decodage.png)

Ce mode inverse la logique : le programme est déjà écrit, et vous devez deviner où l'automate va s'arrêter !

**Comment l'utiliser :**
- Une séquence d'instructions est affichée à l'écran et l'automate est positionné sur la grille.
- Lisez la séquence de gauche à droite et imaginez mentalement le parcours du robot.
- **Cliquez sur la case de la grille** où vous pensez que l'automate terminera son parcours après l'exécution complète du programme.
- Une fois que vous avez cliqué, le programme s'exécute visuellement pour vérifier votre prédiction.
- C'est un excellent exercice pour travailler la **décentration cognitive** (distinguer gauche/droite relatives au robot) et la **mémoire de travail**.

---

## 5. Mode Dessin (Création géométrique)

![Mode Dessin](../screenshots/sim_dessin.png)

Dans ce mode, l'automate est équipé d'un stylo imaginaire et **laisse une trace** derrière lui au fil de ses déplacements. Le but est de reproduire des formes géométriques ou des motifs.

**Comment l'utiliser :**
- Le défi affiche les cases à parcourir (cases cibles en **pointillés bleus**) pour former la figure demandée.
- Programmez les mouvements de l'automate de manière à passer par toutes les cases cibles. Les cases parcourues se remplissent progressivement.
- **Attention :** pour les formes fermées (carré, rectangle…), l'automate doit passer par toutes les cases du contour. Veillez à bien compter les déplacements et les rotations.
- Ce mode permet d'introduire des concepts de **géométrie** : angles droits, longueurs, polygones.

---

## 🎨 Personnalisation

Le menu **Options** (icône engrenage ⚙ en haut à droite) donne accès à plusieurs réglages  :

- **Partager l'activité** 🔗 : ouvre une modale permettant de générer un lien spécifique pour les élèves (cf. [Tutoriel de partage](MODE_EMPLOI_PARTAGE.md)).
- **Changer de tapis** 🗺 : ouvre un tiroir latéral permettant de choisir un fond de grille (tapis pédagogique), d'ajuster son **opacité** et de régler la **taille de la grille** (de 4×4 à 10×10).
- **Changer de skin** 🎨 : permet de personnaliser l'apparence du robot et de la piste (Bee-Bot, Licorne 🌈, Cyber-Bot, Volcan 🌋, etc.). Certains skins se débloquent en progressant.
- **Voir mes statistiques** 📊 : accès au tableau de bord des scores.
- **Vitesse** ⏱ : bascule entre vitesse normale et vitesse rapide (2×).
- **Thème clair / sombre** 🌙 : bascule entre les deux modes d'affichage.
- **Son** 🔊 : active ou désactive les effets sonores.

---

### Astuces supplémentaires

- **Accessibilité :** l'application est utilisable **au clavier** (flèches directionnelles, Espace, Entrée) dans le mode Simulateur.
- **Hors-ligne :** une fois chargée une première fois, l'application fonctionne entièrement **sans connexion Internet**.
