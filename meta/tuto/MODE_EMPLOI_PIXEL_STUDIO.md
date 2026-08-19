# 🎨 Mode d'emploi : Pixel Studio

**Pixel Studio** fait le pont entre l'art visuel et le code binaire. L'élève découvre qu'une image numérique est une grille de pixels, et que chaque pixel est représenté par des 0 et des 1.

Alignement programme : Cycle 2, Décodages 5-6H · Scénario 4 — *Codage de données, codage binaire*.

---

## Pourquoi cet outil ?

- **Image = grille de pixels :** Comprendre qu'une image numérique est une matrice finie de carrés élémentaires.
- **Du visuel au binaire :** Chaque pixel est codé par une valeur numérique (0/1 en noir & blanc, 00/01/10/11 en couleurs).
- **Profondeur de couleur :** Expérimenter le passage de 1 bit (2 états) à 2 bits (4 couleurs) par pixel.
- **Rigueur de codage :** L'ordre de lecture des lignes (gauche → droite, haut → bas) est essentiel.

---

## 1. Les trois modes de jeu

| Mode | Mission | Ce que fait l'élève |
|---|---|---|
| 🎯 **Décoder** | Code binaire → image | Lire les 0 et 1 affichés à gauche et colorier la grille pour révéler le dessin. |
| ✏️ **Encoder** | Image → code binaire | Observer le dessin et saisir la séquence de 0 et 1 correspondante. |
| 🎨 **Éditeur Libre** | Création & partage | Dessiner librement, voir le code en direct, exporter en PNG et partager via URL. |

---

## 2. Mode « Décoder »

- **N/B (1 bit) :** Cliquez sur une case pour basculer entre Noir (0) et Blanc (1).
- **Couleurs (2 bits) :** Sélectionnez une couleur dans la palette (`⬛ 00`, `🟢 01`, `🔵 10`, `🟡 11`), puis cliquez sur les cases.
- Cliquez sur **Vérifier** : si le dessin correspond au code, célébration 🎉 !

## 3. Mode « Encoder »

- Un dessin pixélisé est affiché. L'élève saisit les bits correspondants dans les champs de texte.
- Les touches `0` et `1` du clavier remplissent rapidement les champs. Le curseur avance automatiquement.
- Chaque ligne validée passe au vert.

## 4. Mode « Éditeur Libre »

> **Déverrouillage :** L'éditeur se débloque après 3 décodages et 3 encodages réussis.

- **Dimensions :** Grilles de 10×10, 15×15 ou 20×20 pixels.
- **Code en temps réel :** Chaque clic met à jour la chaîne binaire instantanément.
- **Importation :** Collez une séquence de 0/1 → le dessin apparaît.
- **💾 Exporter :** Téléchargez l'image en PNG.
- **🔗 Partager :** Générez un lien URL encodant le dessin (`&importGrid=…`).

---

## 5. Basculement N/B ↔ Couleurs

| Mode | Profondeur | Convention |
|---|---|---|
| ⬛ **N/B** | 1 bit/pixel | `0` = ⬛ Noir · `1` = ⬜ Blanc |
| 🌈 **Couleurs** | 2 bits/pixel | `00` = ⬛ · `01` = 🟢 · `10` = 🔵 · `11` = 🟡 |

---

## 6. Scores

- **Compteurs Victoires & Série 🔥** en bas de chaque carte de défi.
- **Statistiques globales** via le bouton camembert.

---

## 🏫 Activité en binômes : « Transmettre une image » (30 min)

1. **Élève A** dessine un pictogramme simple en 10×10 dans l'Éditeur Libre (cœur, smiley, sapin…).
2. **Élève A** copie uniquement la chaîne de 0/1 sur une feuille.
3. **Élève B** reçoit la feuille, ouvre le mode Décoder (ou colle le code dans l'éditeur) et reconstruit l'image sans avoir vu l'original.
4. Comparaison : l'image est-elle identique ? → Illustration concrète des transmissions réseau.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
