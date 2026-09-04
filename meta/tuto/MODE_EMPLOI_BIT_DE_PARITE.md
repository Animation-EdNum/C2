# 🛡️ Mode d'emploi : Bit de parité

**Bit de parité** enseigne comment un ordinateur détecte qu'un message a été altéré pendant sa transmission. L'élève apprend à calculer des bits de contrôle et à localiser un bit corrompu par croisement de coordonnées.

Alignement programme : Cycle 2, Décodages 7-8H · Enquête 5 — *Peut-on détecter des erreurs… ?*

---

## Pourquoi cet outil ?

- **Métadonnées :** Comprendre qu'un ordinateur ajoute des bits de contrôle aux données brutes pour vérifier leur intégrité.
- **Parité paire :** Savoir compter les bits à 1 sur une ligne ou colonne et choisir le bit de contrôle pour que le total soit toujours **pair**.
- **Localisation 2D :** Détecter une case erronée au croisement exact de la ligne impaire et de la colonne impaire.

---

## 1. Deux modes de jeu

| Mode | Mission | Ce que fait l'élève |
|---|---|---|
| 🖊️ **Entraînement** | Calculer et placer les bits de parité | Compléter les cases vides en bordure pour que chaque ligne et colonne contienne un nombre pair de 1. |
| 🔍 **Trouve l'erreur** | Identifier un bit corrompu | Repérer la ligne impaire et la colonne impaire, cliquer à leur intersection. |

---

## 2. Mode « Entraînement »

Une matrice de 0 et de 1 est générée aléatoirement. Les **cases de bordure** (dernière colonne, dernière ligne) sont vides.

**Méthode :**
- Comptez les 1 dans chaque ligne.
  - Si le nombre est **impair** → placez `1` pour rétablir la parité.
  - Si le nombre est **pair** → placez `0` pour la conserver.
- Procédez de même pour chaque colonne, puis pour la case du coin.

---

## 3. Mode « Trouve l'erreur »

Un parasite réseau a inversé **un seul bit** dans une grille complète (un 0 est devenu un 1, ou inversement).

1. Inspectez chaque **ligne** : laquelle a un nombre impair de 1 ?
2. Inspectez chaque **colonne** : laquelle a un nombre impair de 1 ?
3. Cliquez sur la case à l'**intersection** de cette ligne et de cette colonne.

---

## 4. Niveaux de difficulté

| Niveau | Taille de la grille | Zone de données |
|---|---|---|
| 🟢 Facile | $4 \times 4$ | $3 \times 3$ données + bordure de parité |
| 🟡 Moyen | $5 \times 5$ | $4 \times 4$ données + bordure de parité |
| 🔴 Difficile | $6 \times 6$ | $5 \times 5$ données + bordure de parité |

---

## 5. Mode strict

En mode normal, des compteurs de parité guident l'élève en temps réel.

Avec l'option de partage `&strictMode=1`, aucun indice visuel n'est affiché : l'élève doit compter mentalement et valider d'un bloc, comme un véritable protocole réseau.

---

## 🏫 Activité débranchée : Le Tour de Magie

Avant l'écran, réalisez ce tour classique avec des cartes bicolores (noir / blanc) :

1. Disposez une grille de 5×5 cartes au hasard devant la classe.
2. Ajoutez « innocemment » une 6ᵉ ligne et une 6ᵉ colonne (en réalité : la parité paire).
3. Retournez-vous. Un élève retourne **une seule carte**.
4. Retournez-vous, balayez la grille du regard et désignez instantanément la carte modifiée.
5. Les élèves découvrent ensuite le secret mathématique en s'exerçant sur l'application.
