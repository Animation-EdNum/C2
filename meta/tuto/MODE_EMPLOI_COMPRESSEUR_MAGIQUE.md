# ⚡ Mode d'emploi : Compresseur magique

Le **Compresseur magique** fait découvrir aux élèves le principe de la **compression d'images sans perte** grâce au codage par plages (*Run-Length Encoding* ou RLE). L'élève apprend à encoder et décoder des grilles de pixels en comptant les répétitions consécutives de couleurs.

Alignement : Cycle 2, Décodages (représentation et compression des données).

---

## Pourquoi cet outil ?

- **Comprendre la compression sans perte :** Réduire la quantité de données nécessaires pour décrire une image sans altérer aucun pixel.
- **Principe du codage RLE :** Remplacer une longue suite de pixels identiques par un couple *(nombre de répétitions, couleur)*.
- **Efficacité selon le contenu :** Découvrir qu'une image avec de grands aplats de couleur se compresse énormément, alors qu'une image avec beaucoup de détails hachés se compresse peu.

---

## 1. Convention d'écriture RLE

Dans l'application, chaque plage de pixels est notée : **`[Nombre][Lettre de couleur]`**

| Code | Couleur | Exemple |
|---|---|---|
| `X` | ⬜ Blanc (*Blank / Cross*) | `4X` = 4 pixels blancs consécutifs |
| `N` | ⬛ Noir | `2N` = 2 pixels noirs consécutifs |
| `B` | 🔵 Bleu | `3B` = 3 pixels bleus consécutifs |
| `R` | 🔴 Rouge | `1R` = 1 pixel rouge |
| `V` | 🟢 Vert | `5V` = 5 pixels verts |
| `J` | 🟡 Jaune | `2J` = 2 pixels jaunes |

> **Exemple de ligne :** `3X 2N 3X` sur une grille de 8 colonnes signifie : 3 blancs, puis 2 noirs, puis 3 blancs.
> Chaque ligne de la grille correspond à une nouvelle ligne dans le code RLE.

---

## 2. Les 3 modes de l'application

| Onglet | Mission | Ce que fait l'élève |
|---|---|---|
| 👁️ **Décompresser** | Du code RLE vers l'image | Lire le code RLE affiché et colorier la grille pour révéler le dessin caché. |
| 🖍️ **Compresser** | De l'image vers le code RLE | Observer le dessin matriciel et saisir le code RLE le plus court possible. |
| 📐 **Dessin libre** | Expérimentation & calcul de ratio | Dessiner librement et observer en direct le taux de compression calculé. |

---

## 3. Niveaux de difficulté

- **🟢 Facile :** Grille 5×5 en Noir & Blanc (`N` et `X`).
- **🟡 Moyen :** Grille 8×8 en Noir & Blanc.
- **🔴 Difficile :** Grille 8×8 en Couleurs (6 couleurs disponibles : `X, N, B, R, V, J`).

---

## 4. Taux de compression & Analyse

En mode Dessin libre, l'application compare en temps réel :
- **Taille brute (non compressée) :** 1 octet par pixel.
- **Taille compressée (RLE) :** Nombre de caractères du code.
- **Gain de stockage :** Pourcentage d'espace économisé.

---

## 🏫 Activité en classe : Le défi de l'espace disque

1. **Phase 1 :** Demandez aux élèves de dessiner un damier (1 pixel noir, 1 pixel blanc alterné). Observez le code RLE : `1N 1X 1N 1X...` (la taille augmente au lieu de diminuer !).
2. **Phase 2 :** Demandez-leur de dessiner un drapeau à bandes ou un cœur simple. Observez le gain : le fichier est réduit de 60 à 80%.
3. **Bilan :** Discuter de l'utilité du format GIF/PNG pour les schémas et logos, comparé au format JPEG pour les photographies.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
