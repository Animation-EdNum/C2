# 🏗️ Mode d'emploi : Jeu de la grue

Bienvenue dans le guide d'utilisation du **Jeu de la grue**, une application web interactive conçue pour initier les élèves à la **pensée algorithmique** et à la **programmation séquentielle**.

Ce simulateur permet de s'entraîner à programmer les déplacements et les actions d'une grue pour déplacer des cubes entre trois colonnes, selon **3 niveaux de difficulté progressifs**.

---

## 📖 But du jeu

Observez attentivement la zone **Objectif** (à gauche). Vous devez utiliser la grue pour déplacer les cubes dans la **Zone de travail** (à droite) afin de reproduire **exactement** la même disposition.

> ⚠️ **Attention :** une machine ne devine rien ! Vous devez lui fournir une **suite complète d'instructions à l'avance**. Ce n'est pas du pilotage direct : la grue n'agira qu'une fois le programme lancé.

Un bandeau dépliable **« 📖 Comment ça marche ? »** est disponible en haut de la page pour rappeler les règles aux élèves à tout moment.

---

## 🕹️ Comment l'utiliser ?

### 1. Analyser l'objectif
Comparez la disposition des cubes dans la *Zone de travail* avec celle demandée dans la zone *Objectif*. Identifiez quels cubes doivent bouger, et dans quel ordre.

### 2. Programmer la grue
Utilisez le panneau de contrôle pour ajouter les instructions, qui s'affichent sous forme de **cartes colorées** dans la barre du programme. Chaque instruction a sa propre couleur pour faciliter le repérage visuel :

| Bouton | Couleur | Action |
|---|---|---|
| ⬆️ **Haut** | Bleu | Remonter la pince |
| ⬇️ **Bas** | Violet | Descendre la pince |
| ⬅️ **Gauche** | Orange | Déplacer la grue d'une colonne vers la gauche |
| ➡️ **Droite** | Vert | Déplacer la grue d'une colonne vers la droite |
| ✊ / ✋ **Action** | Rouge | Fermer la pince pour attraper, ou l'ouvrir pour relâcher |

> 🔎 L'icône du bouton *Action* change selon l'état : **poing fermé** quand la grue est vide, **main ouverte** quand elle tient un cube.

### 3. Gérer le programme
- **Cliquer sur une carte** dans la barre du programme la **supprime** directement (un ✕ apparaît au survol).
- Le bouton **« Effacer »** (corbeille) retire la **dernière** instruction ajoutée.
- Le bouton **« Tout vider »** (rouge) réinitialise complètement le programme.

### 4. Exécuter
Appuyez sur le bouton **« ▶ Exécuter »** (vert) pour lancer l'animation. La grue réalise la séquence **étape par étape**, et l'instruction en cours est mise en évidence dans la bande.

> 🔒 Pendant l'exécution, les boutons sont désactivés : impossible de modifier le programme en cours de route.

- ✅ Si la disposition finale correspond à l'objectif : **🎉 confettis** et message de réussite !
- ❌ Sinon, le jeu indique précisément où se situe le problème (voir ci-dessous).

---

## 🧯 Gestion des erreurs

Le retour visuel est conçu pour favoriser l'**analyse d'erreurs** en autonomie :

- La **carte fautive** apparaît en **noir agrandi** dans la bande du programme.
- Un **message explicite** s'affiche, par exemple :
  - *« La grue est déjà au maximum à gauche ! »*
  - *« La grue doit descendre juste au-dessus de la cible pour relâcher l'objet ! »*
  - *« La grue tient encore un objet »* (exécution terminée mais pince non vidée)
  - *« La disposition ne correspond pas »* (programme terminé sans correspondance)
- Un **délai de 5 secondes** s'écoule avant le redémarrage possible, pour laisser le temps d'analyser l'erreur.

---

## 🚦 Niveaux de difficulté

La difficulté se choisit via la barre située au-dessus du jeu. Changer de niveau génère automatiquement un nouveau défi :

- 🟢 **Facile :** 1 seul cube à déplacer — idéal pour comprendre les commandes de base (déplacement et action de la pince).
- 🟡 **Moyen :** 2 cubes — nécessite d'anticiper les déplacements multiples et la gestion de la superposition.
- 🔴 **Difficile :** 3 cubes — les piles rendent les mouvements plus complexes : il faut souvent **déplacer temporairement un cube** dans une colonne d'attente pour accéder à celui situé en dessous.

---

## 📊 Statistiques et suivi

L'application enregistre les réussites de l'élève. Une barre de score affiche en permanence :

- **Victoires :** nombre total de défis réussis.
- **Série 🔥 :** nombre de victoires consécutives sans erreur. Une **animation renforcée** se déclenche toutes les 3 victoires d'affilée.

L'icône **Statistiques** (Camembert 📊) ouvre un **tableau de bord détaillé** des scores.

> ⏱ Après une réussite, un nouveau défi est automatiquement généré au bout de **4 secondes**.

---

## 🎨 Personnalisation et options

Le menu **Options** (icône engrenage ⚙ en haut à droite) donne accès aux réglages :

- **Partager l'activité** 🔗 : ouvre une modale permettant de générer un lien spécifique pour les élèves, en bloquant par exemple le niveau de difficulté (cf. [Tutoriel de partage](MODE_EMPLOI_PARTAGE.md)).
- **Thème clair / sombre** 🌙 : bascule entre les deux modes d'affichage pour le confort visuel.
- **Son** 🔊 : active ou désactive les effets sonores (clic, victoire, erreur).

---

## 🏫 Conseils d'utilisation en classe

### Publics cibles
- **Cycle 1 (4–8 ans)** : en collectif au TBI ou en binômes, niveau **Facile** privilégié.
- **Cycle 2 (8–12 ans)** : en autonomie, progression Facile → Moyen → Difficile.

### Modalités de travail efficaces
- **Binôme « programmeur / vérificateur »** : l'un construit la séquence, l'autre la lit à voix haute avant d'appuyer sur ▶.
- **Phase débranchée préalable** : au sol, un élève joue la grue, les autres donnent les ordres avec des cartes-flèches. Cela ancre le principe : *« Une machine ne devine rien. »*
- **Verbaliser l'objectif** avant de programmer : *« Quel cube doit bouger ? D'où vers où ? »*

### Points d'attention pédagogiques
- Valoriser l'**essai-erreur** : la carte noire qui s'affiche est une **information précieuse**, pas un échec.
- Ne pas corriger trop vite : laisser l'élève lire le message et comprendre par lui-même.
- Pour le niveau Difficile, accompagner la découverte de la **colonne d'attente** (déplacer un cube « en intermédiaire »).

---

## 💡 Astuces supplémentaires

- **Accessibilité clavier :** le jeu est entièrement jouable au clavier.
  - **Flèches directionnelles** : ajouter une instruction de déplacement.
  - **Barre d'Espace** : ajouter l'instruction Action (attraper/lâcher).
  - **Entrée** : exécuter le programme.
  - **Retour arrière (Backspace)** : effacer la dernière instruction.
- **Utilisation hors-ligne :** une fois chargée, l'application fonctionne **sans connexion Internet**.
- **Limites mécaniques à connaître :**
  - La grue ne peut pas descendre s'il y a déjà un cube juste en dessous.
  - Une colonne ne peut contenir qu'un **maximum de 3 cubes**.
  - La pince doit être descendue **exactement** au bon niveau (juste au-dessus du cube à saisir, ou juste au-dessus de la position de dépôt) pour attraper ou relâcher.
  - Tenter d'attraper dans le vide ou de relâcher à une mauvaise hauteur déclenche une erreur.

---

*Bon jeu, et surtout : laissez vos élèves se tromper, recommencer… et savourer leur première victoire de « programmeur de grue » ! 🏗️🎉*
