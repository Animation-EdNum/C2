# 🔐 Mode d'emploi : Mots secrets

**Mots secrets** est une application d'espionnage numérique qui enseigne le codage binaire des caractères : chaque lettre a un numéro (A=1, B=2, …, Z=26) que l'on représente en binaire sur 8 bits grâce aux puissances de 2.

Alignement programme : Cycle 2, Décodages 7-8H · Activité 2 — *Codages en folie, séance 2*.

---

## Pourquoi cet outil ?

- **Représentation des caractères :** Comprendre qu'un texte est découpé en caractères et que chaque lettre se réduit à une suite de 0 et de 1.
- **Puissances de 2 :** Pratiquer la décomposition additive ($128, 64, 32, 16, 8, 4, 2, 1$) comme calcul mental.
- **Collaboration & défi :** Créer des messages chiffrés à échanger entre camarades.

---

## 1. Les deux modes de jeu

| Mode | Démarche |
|---|---|
| ✏️ **Encode !** | L'application propose un mot ; l'élève convertit chaque lettre en binaire. Entraînement progressif (Facile → Moyen → Difficile). |
| 🎮 **(Dé)code un mot** | L'élève chiffre son propre message ou déchiffre un code reçu — mode libre et collaboratif. |

---

## 2. Mode « Encode ! » — Entraînement guidé

Un mot secret est proposé, l'élève le code **lettre par lettre** :

1. Repérez la lettre demandée (affichée en haut du tableau).
2. Trouvez son rang dans l'alphabet (ex. **C = 3**).
3. Activez les interrupteurs binaires pour obtenir la somme exacte :
   Pour **3** → activez `2` et `1` ($2 + 1 = 3$) → binaire `00000011`.
4. Cliquez **Vérifier** (ou `Entrée`) pour passer à la lettre suivante.

### Niveaux de difficulté

- **🟢 Facile :** Mots de 3 lettres (ex. *BUS*, *SKI*).
- **🟡 Moyen :** Mots de 4 lettres (ex. *LION*, *LUNE*).
- **🔴 Difficile :** Mots de 5-6 lettres (ex. *ROBOT*, *ÉTOILE*).

---

## 3. L'alphabet binaire secret (aide intégrée)

Un panneau dépliable **« 📋 Alphabet binaire secret »** montre la correspondance complète lettre → numéro → binaire.

- **Aide adaptative :** En cas d'erreurs consécutives, le dictionnaire se déverrouille automatiquement.
- **Pour les évaluations :** Le dictionnaire peut être masqué via l'option de partage `&hideDict=1`.

---

## 4. Mode « (Dé)code un mot » — Mode libre

### Chiffrer
Saisissez un mot → l'application génère la suite d'octets binaires correspondante. L'élève peut la recopier sur papier pour défier un camarade.

### Déchiffrer
Entrez une suite de 0 et de 1 reçue → l'application traduit les octets en lettres lisibles.

---

## 5. Scores & récompenses

- **Barre de progression :** Nombre de mots codés avec succès.
- **Série de victoires 🔥 :** Récompense visuelle pour les enchaînements sans erreur.
- **Statistiques :** Consultables via le bouton camembert.

---

## 🏫 Activité suggérée : « Les Espions de la classe »

1. La classe se divise en binômes : **Agent A** et **Agent B**.
2. **Agent A** choisit un mot dans le mode *(Dé)code un mot*, note le code binaire sur une feuille et transmet le message.
3. **Agent B** décompose chaque octet en puissances de 2 de tête ($16+4+1 = 21 \rightarrow$ U), reconstitue le mot et vérifie dans l'application.
4. Les rôles sont inversés.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
