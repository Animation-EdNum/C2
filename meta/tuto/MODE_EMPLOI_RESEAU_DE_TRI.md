# 🔀 Mode d'emploi : Réseau de tri

**Réseau de tri** (*Sorting Network*) est une simulation interactive inspirée des activités pionnières de *CS Unplugged*. Elle fait découvrir aux élèves comment un matériel informatique massivement parallèle peut trier des données beaucoup plus vite qu'un processeur classique en comparant plusieurs éléments simultanément, illustré par un duel en direct contre un algorithme séquentiel (tri à bulles).

Alignement : Cycle 2 et Cycle 3 (algorithmes, parallélisme, matériel et vitesse de calcul).

---

## Pourquoi cet outil ?

- **Calcul parallèle vs séquentiel :** Comprendre qu'au lieu de trier les éléments un par un dans une boucle lente, des comparateurs câblés en parallèle peuvent agir en même temps sur différents fils.
- **Principe du comparateur élémentaire :** Chaque pont vertical compare deux valeurs : la plus petite monte sur le fil supérieur, la plus grande descend sur le fil inférieur.
- **Déterminisme architectural :** Un réseau de comparateurs correctement structuré garantit un résultat parfaitement ordonné à la sortie, **quel que soit** l'ordre de départ des éléments.

---

## 1. Deux types de données (onglets)

| Onglet | Données triées | Axe de tri |
|---|---|---|
| 🔢 **Nombres** | Chiffres de 1 à 9 | $1$ (le plus petit, vers le haut) $\longrightarrow$ $9$ (le plus grand, vers le bas) |
| 🔤 **Lettres** | Lettres de l'alphabet (A à Z) | $A$ (haut) $\longrightarrow$ $Z$ (bas) |

---

## 2. Niveaux de difficulté

Trois configurations de circuits sont sélectionnables :

- 🟢 **3 fils :** Réseau d'initiation avec 3 entrées et 3 comparateurs successifs.
- 🟡 **4 fils :** Réseau intermédiaire à 5 comparateurs (découverte du parallélisme sur deux comparateurs verticaux synchrones).
- 🔴 **5 fils :** Réseau complet à 9 comparateurs illustrant toute la puissance du tri câblé.

---

## 3. Déroulement d'un défi : Pas-à-pas & Course

### Étape 1 : Le parcours pas-à-pas
1. Les jetons de départ sont disposés aléatoirement à gauche sur les fils parallèles.
2. Cliquez sur **« Valider l'étape ➔ »** (`#btn-next-step`) :
   - Les jetons avancent sur les fils jusqu'au prochain étage de comparateurs.
   - Les valeurs sont comparées à chaque pont vertical : la plus petite monte, la plus grande descend.
   - L'étape s'anime avec un surlignage vert des fils actifs.
3. Répétez l'opération jusqu'à ce que tous les jetons atteignent la ligne d'arrivée parfaitement rangés.

### Étape 2 : 🏁 Lancer la course contre le Tri à bulles !
Dès que le réseau a fini son parcours, un bouton spectaculaire apparaît : **« 🏁 Lancer la course ! »** (`#btn-start-race`).
- L'écran active la piste de duel inférieure : **VS Algorithme séquentiel (Tri à bulles)**.
- Le réseau de tri et l'algorithme séquentiel reçoivent la même permutation désordonnée.
- Les élèves observent la différence éclatante :
  - Le réseau de tri termine en quelques étapes synchrones parallèles.
  - Le tri à bulles doit faire des dizaines de comparaisons successives, illustrant concrètement le gain phénoménal du parallélisme matériel.

---

## 4. Raccourcis et statistiques

- **Statistiques :** Bouton camembert pour afficher les victoires et la précision.
- **Série 🔥 :** Célébration après chaque réseau résolu avec succès.
- **Menu Options ⚙ :** Thème clair/sombre, son on/off et réinitialisation de l'application.

---

## 🏫 Activité débranchée géante (cour d'école ou préau)

1. Tracez à la craie au sol 4 à 6 couloirs parallèles reliés par des ponts comparateurs.
2. Les élèves reçoivent chacun un dossard ou carton portant un numéro secret.
3. Tout le monde avance d'un pas au signal.
4. À chaque croisement, les deux élèves comparent leurs numéros : le plus petit prend la ligne du haut, le plus grand celle du bas.
5. À la sortie du réseau, toute la classe est instantanément rangée dans l'ordre croissant sans qu'aucun élève n'ait eu besoin de connaître l'ensemble des numéros !
