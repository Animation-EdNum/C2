# 🔐 Mode d'emploi : Mots secrets

**Mots secrets** est une application d'espionnage numérique qui enseigne le codage binaire des caractères : chaque lettre de l'alphabet est associée à son rang (A=1, B=2, …, Z=26), que l'élève convertit en code binaire sur **5 bits** grâce aux puissances de 2 ($16, 8, 4, 2, 1$).

Alignement programme : Cycle 2, Décodages 7-8H · Activité 2 — *Codages en folie, séance 2*.

---

## Pourquoi cet outil ?

- **Représentation des caractères :** Comprendre qu'un texte est découpé en caractères élémentaires et que chaque lettre est encodée sous forme de nombres binaires.
- **Pourquoi 5 bits ? :** L'alphabet comptant 26 lettres, 4 bits sont insuffisants ($2^4 = 16$), tandis que 5 bits offrent 32 combinaisons ($2^5 = 32$), ce qui couvre largement A à Z.
- **Calcul mental & puissances de 2 :** Pratiquer la décomposition additive rapide avec les valeurs $16, 8, 4, 2, 1$.
- **Collaboration & cryptographie :** Créer des messages chiffrés à échanger entre camarades de classe.

---

## 1. Deux modes de jeu

| Mode | Démarche |
|---|---|
| ✏️ **Encode !** | L'application propose un mot mystère ; l'élève convertit chaque lettre en binaire une par une. Progression guidée par niveaux. |
| 🎮 **(Dé)code un mot** | Mode libre et collaboratif : l'élève tape son propre texte pour voir son code binaire, ou déchiffre une suite binaire reçue d'un camarade. |

---

## 2. Mode « Encode ! » — Entraînement guidé

Un mot secret est proposé, l'élève le code **lettre par lettre** :

1. Repérez la lettre active surlignée dans le mot.
2. Trouvez son rang dans l'alphabet (ex. **C = 3** ou **M = 13**).
3. Activez les **5 commutateurs binaires** ($16, 8, 4, 2, 1$) pour obtenir la somme exacte :
   - Pour **3** (C) : activez `2` et `1` ($2 + 1 = 3$) ➔ binaire `00011`.
   - Pour **13** (M) : activez `8`, `4` et `1` ($8 + 4 + 1 = 13$) ➔ binaire `01101`.
4. La somme en direct s'affiche sous les interrupteurs pour assister le calcul.
5. Cliquez sur **« Vérifier (Entrée) »** pour valider et passer à la lettre suivante.

### Niveaux de difficulté
- **🟢 Facile :** Mots courts de 3 lettres (ex. *BUS*, *SKI*, *LAC*).
- **🟡 Moyen :** Mots de 4 lettres (ex. *LION*, *LUNE*, *ROSE*).
- **🔴 Difficile :** Mots de 5 à 6 lettres (ex. *ROBOT*, *ÉTOILE*, *SOLEIL*).

---

## 3. L'alphabet binaire secret (aide intégrée)

Un panneau déroulant **« 📋 Alphabet binaire secret »** liste la correspondance complète lettre ↔ rang ↔ code binaire sur 5 bits.

- **Aide adaptative :** En cas d'erreur de l'élève, le bandeau d'aide se déverrouille automatiquement avec un message d'encouragement.
- **Évaluation :** Le panneau peut être replié à tout moment pour encourager la recherche mentale autonome.

---

## 4. Mode « (Dé)code un mot » — Mode libre

- **Encoder un message secret :** Saisissez un mot de votre choix ➔ l'application affiche la séquence de blocs binaires correspondante. L'élève peut la recopier sur papier pour lancer un défi à la classe.
- **Déchiffrer un code :** Saisissez une séquence de 0 et de 1 ➔ l'application traduit instantanément le code en texte clair.

---

## 5. Scores & statistiques

- **Suivi de session :** Compteurs de victoires et de série 🔥 sans faute.
- **Statistiques :** Bouton camembert en bas de carte affichant les détails de précision.
- **Raccourcis :** Touche `Entrée` pour vérifier la lettre en cours.
