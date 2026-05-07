# 🏗️ Mode d'emploi : Jeu de la grue

Bienvenue dans le guide d'utilisation du **Jeu de la grue**, une application web interactive conçue pour initier les élèves à la pensée algorithmique et à la programmation séquentielle.

Ce simulateur permet de s'entraîner à programmer les déplacements et les actions d'une grue pour déplacer des objets, selon 3 niveaux de difficulté.

---

## 📖 But du jeu

Observez bien la zone **Objectif**. Vous devez utiliser la grue pour déplacer les cubes dans la **Zone de travail** afin de reproduire exactement la même disposition.

**Attention :** Une machine ne devine rien ! Vous devez lui donner une suite d'instructions précises à l'avance. Ce n'est pas du pilotage direct.

---

## 🕹️ Comment l'utiliser ?

1. **Analyser l'objectif :** Comparez la disposition des cubes dans la *Zone de travail* avec celle demandée dans la zone *Objectif*.
2. **Programmer la grue :** Utilisez le panneau de contrôle pour ajouter les instructions dans la barre du programme.
   - ⬆️ **Haut** : remonter la grue.
   - ⬇️ **Bas** : descendre la grue.
   - ⬅️ **Gauche** : déplacer la grue vers la gauche.
   - ➡️ **Droite** : déplacer la grue vers la droite.
   - ✊ / ✋ **Action** : fermer la pince pour attraper un objet, ou ouvrir la pince pour le relâcher.
3. **Gérer le programme :**
   - Le bouton **« Effacer »** permet de retirer la dernière instruction ajoutée. Vous pouvez aussi cliquer directement sur une instruction dans la barre pour la supprimer.
   - Le bouton **« Tout vider »** permet de réinitialiser complètement le programme.
4. **Exécuter :** Une fois le programme terminé, appuyez sur le bouton **« Exécuter »** (vert) pour lancer l'animation et vérifier votre séquence.
   - Si la disposition finale correspond à l'objectif, c'est gagné !
   - Sinon, le jeu vous indiquera votre erreur (ex: la grue a heurté un cube, a essayé d'attraper dans le vide, ou la disposition ne correspond pas).

---

## 🚦 Niveaux de difficulté

Vous pouvez choisir la difficulté via la barre située au-dessus du jeu :
- 🟢 **Facile :** 1 seul cube à déplacer. Idéal pour comprendre les commandes de base (déplacement et action de la pince).
- 🟡 **Moyen :** 2 cubes. Nécessite d'anticiper les déplacements multiples et la gestion de la superposition.
- 🔴 **Difficile :** 3 cubes. Les piles de cubes rendent les mouvements plus complexes, car il faut souvent déplacer un cube pour accéder à celui situé en dessous.

---

## 📊 Statistiques et Suivi

L'application enregistre les réussites de l'élève. En bas de l'écran (ou sur le côté), une barre de score affiche :
- **Victoires :** Le nombre total de défis réussis.
- **Série 🔥 :** Le nombre de victoires consécutives sans erreur.
- En cliquant sur l'icône **Statistiques** (Camembert 📊), un tableau de bord détaillé des scores s'ouvre.

---

## 🎨 Personnalisation et Options

Le menu **Options** (icône engrenage ⚙ en haut à droite) donne accès à plusieurs réglages :

- **Partager l'activité** 🔗 : ouvre une modale permettant de générer un lien spécifique pour les élèves, en bloquant par exemple le niveau de difficulté (cf. [Tutoriel de partage](MODE_EMPLOI_PARTAGE.md)).
- **Thème clair / sombre** 🌙 : bascule entre les deux modes d'affichage pour le confort visuel.
- **Son** 🔊 : active ou désactive les effets sonores de l'application.

---

### 💡 Astuces supplémentaires

- **Accessibilité clavier :** Le jeu est entièrement jouable au clavier. Utilisez les **flèches directionnelles** pour les déplacements, la barre d'**Espace** pour l'action (attraper/lâcher), **Entrée** pour exécuter, et **Retour arrière (Backspace)** pour effacer la dernière instruction.
- **Limites mécaniques :**
  - La grue ne peut pas descendre s'il y a déjà un cube juste en dessous.
  - La colonne ne peut contenir qu'un maximum de 3 cubes.
  - La pince doit être descendue **exactement** au niveau du cube (ou de la position vide) pour pouvoir attraper ou relâcher.
