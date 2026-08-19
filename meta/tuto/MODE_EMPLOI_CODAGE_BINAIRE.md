# 💻 Mode d'emploi : Codage binaire

Bienvenue dans le guide d'utilisation de **Codage binaire**, une application web interactive dédiée à l'apprentissage et à l'entraînement intensif au passage des nombres entiers décimaux vers leur écriture binaire (et réciproquement).

Cette application s'aligne sur le plan d'études romand (Cycle 2, Décodages 7-8H · Activité 2 — *Codages en folie, séance 1*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Numération de position en base 2 :** Comprendre que chaque colonne binaire a un poids qui double à chaque rangée vers la gauche ($1, 2, 4, 8, 16, 32, 64, 128$).
- **Algorithme de conversion :** Développer des automatismes de décomposition gloutonne (retirer la plus grande puissance de 2 possible) ou d'addition binaire.
- **Différenciation de la taille des données :** Découvrir la capacité maximale d'un quartet (4 bits $\rightarrow 0$ à $15$), de 6 bits ($0$ à $63$) et d'un octet complet (8 bits $\rightarrow 0$ à $255$).

---

## 1. Les 2 Modes de Conversion

L'application propose une double navigation dans les deux sens de conversion :

| Mode | Principe | Démarche pour l'élève |
|---|---|---|
| 🧮 **Décimal → Binaire** | Un nombre entier est donné (ex: `45`). | L'élève active/désactive les cartes de bits pour former la somme exacte ($32 + 8 + 4 + 1 = 45$). |
| 🖥️ **Binaire → Décimal** | Une suite de 0 et 1 est affichée (ex: `00101100`). | L'élève calcule la somme des bits actifs ($32 + 8 + 4 = 44$) et saisit la valeur numérique. |

---

## 2. Les Styles de Jeu : « Classique » vs « Usine (Tapis) »

Au-dessus du sélecteur de difficulté, deux modes de visualisation sont disponibles :

- **📦 Mode Classique (Cartes à points) :** Représente les bits sous forme de cartes d'inspiration méthode CS Unplugged. Chaque carte montre le nombre exact de points correspondant à sa valeur ($1, 2, 4, 8, \dots$). Les cartes retournées faces cachées valent 0, les cartes visibles valent 1.
- **🏭 Mode Usine (Tapis roulant) :** Présentation gamifiée sous forme de tapis roulant industriel avec boîtes de composants électroniques et ambiance mécanique.

---

## 3. Les 3 Niveaux de Difficulté

- **🟢 Facile (4 bits) :** Nombres de **0 à 15** (colonnes : $8, 4, 2, 1$). Idéal pour appréhender le mécanisme sans surcharge cognitive.
- **🟡 Moyen (6 bits) :** Nombres de **0 à 63** (colonnes : $32, 16, 8, 4, 2, 1$). Permet de manipuler des valeurs intermédiaires.
- **🔴 Difficile (8 bits / 1 Octet) :** Nombres de **0 à 255** (colonnes : $128, 64, 32, 16, 8, 4, 2, 1$). Représente l'unité standard de la mémoire informatique.

---

## 4. Feedback Interactif & Aide bienveillante

- **Validation dynamique :** L'élève peut appuyer sur la touche **Entrée** du clavier ou cliquer sur **Valider**.
- **Indices en cas d'erreur :** Si la somme proposée est incorrecte, un message d'aide adaptatif indique immédiatement si le résultat est *« Trop grand ! »* ou *« Trop petit ! »*, guidant l'élève dans son réajustement par essais-erreurs.
- **Célébration des séries :** Après 3 victoires consécutives, une animation spéciale de feu 🔥 récompense la maîtrise du calcul.

---

## 5. Raccourcis Clavier & Confort

| Touche | Action |
|---|---|
| `1` à `8` | Basculer directement l'état du bit correspondant |
| `Entrée` | Valider la réponse |
| `Espace` | Passer au défi suivant après une victoire |

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
