# 💻 Mode d'emploi : Codage binaire

**Codage binaire** est une application d'entraînement intensif à la conversion décimal ↔ binaire. L'élève manipule des cartes à points (méthode CS Unplugged) ou un tapis roulant industriel pour maîtriser la numération en base 2.

Alignement programme : Cycle 2, Décodages 7-8H · Activité 2 — *Codages en folie, séance 1*.

---

## Pourquoi cet outil ?

- **Numération de position :** Comprendre que chaque colonne binaire a un poids qui double vers la gauche ($1, 2, 4, 8, 16, 32, 64, 128$).
- **Décomposition gloutonne :** Automatiser le réflexe de retirer la plus grande puissance de 2 possible à chaque étape.
- **Notion de capacité :** Découvrir qu'un quartet (4 bits) peut stocker 0 à 15, et qu'un octet (8 bits) peut stocker 0 à 255.

---

## 1. Deux sens de conversion

| Mode | L'élève reçoit… | L'élève doit… |
|---|---|---|
| 🧮 **Décimal → Binaire** | Un nombre entier (ex. `45`) | Activer/désactiver les cartes de bits pour obtenir la somme exacte ($32+8+4+1 = 45$). |
| 🖥️ **Binaire → Décimal** | Une suite de 0 et 1 (ex. `00101100`) | Additionner les bits actifs ($32+8+4 = 44$) et saisir le résultat. |

---

## 2. Deux styles visuels

- **📦 Classique (Cartes à points) :** Chaque bit est représenté par une carte montrant le nombre de points correspondant ($1, 2, 4, 8…$). Carte visible = 1, carte retournée = 0.
- **🏭 Usine (Tapis roulant) :** Même mécanique, mais habillée d'un tapis roulant industriel avec boîtes et ambiance mécanique.

---

## 3. Trois niveaux de difficulté

| Niveau | Bits | Valeurs possibles |
|---|---|---|
| 🟢 Facile | 4 bits | 0 à 15 (colonnes $8, 4, 2, 1$) |
| 🟡 Moyen | 6 bits | 0 à 63 (colonnes $32, 16, 8, 4, 2, 1$) |
| 🔴 Difficile | 8 bits (1 octet) | 0 à 255 (colonnes $128, 64, 32, 16, 8, 4, 2, 1$) |

---

## 4. Aide bienveillante

- **Feedback immédiat :** Si la somme est incorrecte, un message indique « Trop grand ! » ou « Trop petit ! » pour guider le réajustement.
- **Célébration des séries :** Après 3 victoires consécutives, une animation de feu 🔥 récompense la maîtrise.

---

## 5. Raccourcis clavier

| Touche | Action |
|---|---|
| `1` à `8` | Basculer l'état du bit correspondant |
| `Entrée` | Valider la réponse |
| `Espace` | Passer au défi suivant |
