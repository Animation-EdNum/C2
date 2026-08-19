# 🛡️ Mode d'emploi : Bit de parité

Bienvenue dans le guide d'utilisation de **Bit de parité – Entraînement & Détection**, une application web interactive permettant aux élèves de comprendre les principes fondamentaux de l'**intégrité des données** et de la **détection automatique d'erreurs** lors d'une transmission réseau.

Cette ressource s'intègre dans le programme du Cycle 2 (Décodages 7-8H · Enquête 5 — *Peut-on détecter des erreurs dans un message transmis ?*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Notion de métadonnée :** Comprendre qu'un ordinateur n'envoie pas seulement des données brutes, mais ajoute des bits de contrôle (bits de parité) pour vérifier la fiabilité du transport.
- **Principe de parité paire :** Savoir compter les bits à 1 sur une ligne ou une colonne et choisir la valeur du bit de contrôle pour que le total de "1" soit toujours **pair** ($0, 2, 4, 6\dots$).
- **Localisation par coordonnées (Croisement 2D) :** Détecter une case erronée au croisement précis de la ligne impaire et de la colonne impaire.
- **Pensée logique et rigueur :** Développer un raisonnement structuré de vérification ligne par ligne et colonne par colonne.

---

| Mode | Défi | Mécanisme de résolution |
|---|---|---|
| 🖊️ **Entraînement** | Calculer et placer les bits de parité en bordure | Compléter les cases vides pour que chaque ligne et colonne ait un nombre pair de "1". |
| 🔍 **Trouve l'erreur** | Identifier le bit corrompu lors d'une transmission | Repérer la ligne impaire et la colonne impaire, puis cliquer à leur intersection. |

### 1.1. Mode « Entraînement » (Générer la parité)
- **Principe :** Une matrice de données est remplie aléatoirement de 0 et de 1.
- **Action de l'élève :** Remplir les cases de bordure vides (la dernière case de chaque ligne, la dernière case de chaque colonne, et la case du coin inférieur droit) avec un `0` ou un `1` de telle sorte que chaque ligne et chaque colonne contienne un **nombre pair de 1**.
- **Méthode :**
  - Si une ligne contient trois "1" (nombre impair), l'élève ajoute un `1` pour obtenir quatre "1" (nombre pair).
  - Si une ligne contient déjà deux "1" (nombre pair), l'élève ajoute un `0` pour conserver la parité.

### 1.2. Mode « Trouve l'erreur » (Détecter la corruption)
- **Scénario :** Un parasite réseau a altéré un bit pendant la transmission. Une grille complète vous est soumise, mais un des bits s'est inversé (un 0 est devenu un 1, ou inversement).
- **Action de l'élève :**
  1. Inspectez chaque ligne et chaque colonne.
  2. Repérez la seule **ligne** qui contient un nombre **impair** de 1.
  3. Repérez la seule **colonne** qui contient un nombre **impair** de 1.
  4. Cliquez sur la case située à l'**intersection** de cette ligne et de cette colonne pour corriger l'erreur !

---

## 2. Les 3 Tailles de Grille (Niveaux de difficulté)

- **🟢 Facile :** Grille $4 \times 4$ ($3 \times 3$ données + bordure de parité).
- **🟡 Moyen :** Grille $5 \times 5$ ($4 \times 4$ données + bordure de parité).
- **🔴 Difficile :** Grille $6 \times 6$ ($5 \times 5$ données + bordure de parité).

---

## 3. Mode Normal vs Mode Strict

- **Mode Normal :** Les compteurs de parité fournissent un guidage immédiat.
- **Mode Strict (via partage `&strictMode=1`) :** Aucun indice visuel en temps réel. L'élève doit compter mentalement et valider sa grille d'un seul bloc, simulant un véritable protocole de communication informatique sans assistance.

---

## 🏫 Activité magique en classe débranchée (Le Tour de Magie)

Avant d'utiliser l'application sur écran, réalisez le célèbre **tour de magie de la parité** avec des cartes bicolores (ex. faces noires et blanches) :
1. L'enseignant dispose une grille de 5x5 cartes au hasard.
2. L'enseignant ajoute une 6e ligne et une 6e colonne en expliquant qu'il "complique le jeu" (en réalité, il pose la parité paire).
3. L'enseignant se retourne. Un élève retourne **une seule carte** dans la grille.
4. L'enseignant se retourne, balaie la grille du regard et désigne instantanément la carte retournée en cherchant l'intersection des lignes et colonnes impaires !
5. Les élèves découvrent ensuite le secret mathématique en s'exerçant sur l'application Web.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
