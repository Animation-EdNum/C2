# 💻 Mode d'emploi : Codage binaire

**Codage binaire** est une application d'entraînement interactif à la conversion entre nombres entiers (base 10) et écriture binaire (base 2). L'élève résout des défis sous forme de coffre-fort numérique à déverrouiller et de console de décodage avec l'appui d'une mini-calculatrice binaire intégrée.

Alignement programme : Cycle 2, Décodages 7-8H · Activité 2 — *Codages en folie, séance 1*.

---

## Pourquoi cet outil ?

- **Numération de position :** Comprendre que chaque colonne binaire a un poids qui double vers la gauche ($1, 2, 4, 8, 16, 32, 64, 128$).
- **Décomposition additive :** Automatiser la recherche des puissances de 2 qui composent un nombre donné.
- **Notion d'octet et de capacité :** Expérimenter le passage de 4 bits (0 à 15), 6 bits (0 à 63) à 8 bits (1 octet, 0 à 255).
- **Auto-évaluation immédiate :** Feedback instantané guidant l'élève en cas de somme trop grande ou trop petite.

---

## 1. Deux modes d'entraînement

L'application propose deux onglets complémentaires :

| Mode | Défi proposé | Interface & Ce que fait l'élève |
|---|---|---|
| 🧮 **Décimal → Binaire** | Un nombre entier cible est affiché sur l'écran du coffre-fort (ex. `42`). | L'élève bascule les **commutateurs binaires** correspondants pour composer la valeur exacte, puis clique sur **« DÉVERROUILLER »**. |
| 🖥️ **Binaire → Décimal** | Une chaîne binaire est affichée (ex. `00101010`). | L'élève additionne mentalement la valeur des bits actifs ($32 + 8 + 2 = 42$) et tape sa réponse en base 10 dans le champ de saisie avant de cliquer sur **« Vérifier »**. |

---

## 2. Niveaux de difficulté

Trois paliers sont sélectionnables dans la barre de difficulté :

| Niveau | Nombre de bits | Puissances actives | Plage de valeurs |
|---|---|---|---|
| 🟢 **Facile** | 4 bits | $8, 4, 2, 1$ | 0 à 15 |
| 🟡 **Moyen** | 6 bits | $32, 16, 8, 4, 2, 1$ | 0 à 63 |
| 🔴 **Difficile** | 8 bits (1 octet) | $128, 64, 32, 16, 8, 4, 2, 1$ | 0 à 255 |

---

## 3. Mini-calculatrice binaire intégrée

Un bouton central **« 🧮 Ouvrir la mini-calculatrice »** ouvre une fenêtre modale d'aide pédagogique :
- Présente le tableau complet des puissances de 2 de 128 à 1.
- Permet à l'élève de cliquer sur n'importe quelle case pour activer un bit (1) ou le désactiver (0).
- Calcule la somme détaillée en direct (ex. $32 + 8 + 2 = 42$).
- Bouton **« Remise à zéro »** pour tester rapidement de nouvelles combinaisons sans affecter l'exercice en cours.

---

## 4. Feedback bienveillant & Gamification

- **Indices de correction :** En cas d'erreur dans le coffre-fort, un message explicatif indique si la somme courante est *« Trop grande ! »* ou *« Trop petite ! »*, encourageant l'élève à ajuster sa décomposition.
- **Série 🔥 :** Célébration visuelle lors des séries de victoires consécutives sans erreur.
- **Statistiques :** Le bouton camembert en pied de carte ouvre le bilan de la session (nombre de réussites, tentatives, taux de précision).

---

## 5. Raccourcis et options

- **Clavier :** Touche `Entrée` pour déverrouiller / vérifier le résultat.
- **Menu Options ⚙ :** Thème clair / sombre 🌙, Son on / off 🔊, Mode projection TNI/TBI 📺 et Réinitialisation.
