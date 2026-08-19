# 🔐 Mode d'emploi : Mots secrets

Bienvenue dans le guide d'utilisation de **Mots secrets**, une application web interactive d'espionnage numérique permettant aux élèves d'apprendre à chiffrer et déchiffrer des messages à l'aide de l'alphabet binaire et du calcul des puissances de 2.

Cette activité s'aligne directement avec le programme d'éducation numérique du Cycle 2 (Décodages 7-8H · Activité 2 — *Codages en folie, séance 2*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Représentation des caractères (ASCII) :** Comprendre qu'un texte est découpé en caractères, que chaque lettre correspond à un nombre (A=1, B=2, ..., Z=26), et que chaque nombre est stocké sous forme binaire sur un octet (8 bits).
- **Calcul mental & Décomposition en puissances de 2 :** Pratiquer la décomposition additive de nombres entiers en puissances de deux (128, 64, 32, 16, 8, 4, 2, 1).
- **Esprit d'enquête et de collaboration :** Créer des défis mutuels où les élèves s'échangent des mots chiffrés à décoder.

---

## 1. Structure de l'application & Modes de Jeu

| Mode | Type d'activité | Démarche pour l'élève |
|---|---|---|
| ✏️ **Encode !** | Entraînement individuel progressif | Convertir des lettres en binaire grâce aux puissances de 2 (Facile, Moyen, Difficile). |
| 🎮 **(Dé)code un mot** | Défi libre & collaboratif | Chiffrer ses propres messages secrets pour un camarade ou décoder un code reçu. |

---

## 2. Mode « Encode ! » (Entraînement guidé)

Dans ce mode, l'application propose un mot secret à coder lettre par lettre.

### Les 3 niveaux de difficulté :
- **🟢 Facile :** Mots courts de 3 lettres (ex: *BUS*, *SKI*, *LAC*).
- **🟡 Moyen :** Mots de 4 lettres (ex: *LION*, *CHEF*, *LUNE*).
- **🔴 Difficile :** Mots de 5 à 6 lettres (ex: *ROBOT*, *ÉTOILE*, *PAYSAN*).

### Comment coder une lettre :
1. Repérez la lettre demandée (affichée en haut du tableau).
2. Trouvez son rang dans l'alphabet (ex : **C = 3**).
3. Activez les interrupteurs binaires sous les puissances de 2 pour obtenir la somme exacte :
   - Pour **3** : activez la colonne **2** et la colonne **1** ($2 + 1 = 3$), ce qui donne le binaire `00000011`.
4. Cliquez sur **Vérifier** ou appuyez sur `Entrée`.
5. Passez à la lettre suivante pour compléter le mot entier.

---

## 3. L'Alphabet Binaire Secret (Aide intégrée)

Un panneau dépliable **« 📋 Alphabet binaire secret »** est accessible au centre de l'écran :
- Il présente la correspondance entre chaque lettre de l'alphabet, son numéro d'ordre (1 à 26) et son écriture binaire complète sur 8 bits.
- **Aide adaptative :** En cas d'erreur consécutive, ce dictionnaire se déverrouille automatiquement pour débloquer l'élève sans le pénaliser.
- *(Note pour l'enseignant : ce tableau peut être entièrement masqué lors des évaluations via l'option de partage `&hideDict=1`).*

---

## 4. Mode « (Dé)code un mot » (Mode Libre & Collaboratif)

Ce mode créatif permet deux usages puissants :

### A. Chiffrer son propre mot secret
- Saisissez n'importe quel mot dans le champ de texte.
- L'application calcule et génère instantanément la suite d'octets binaires correspondante.
- L'élève peut recopier cette suite d'octets sur une feuille pour défier un camarade.

### B. Déchiffrer un code reçu
- Entrez la suite de 0 et de 1 reçue.
- L'application traduit les octets en lettres claires, validant ou invalidant la résolution de l'enquête.

---

## 5. Suivi des scores & Récompenses

- **Barre de progression :** Affiche le nombre de mots décodés avec succès.
- **Série de victoires 🔥 :** Multiplie les récompenses visuelles en cas d'enchaînement sans faute.
- **Tableau de bord statistique :** Consultation des réussites par palier de difficulté via le bouton camembert.

---

## 🏫 Activité suggérée : « Les Espions de la classe »

1. La classe est divisée en binômes d'espions : **Agent A** et **Agent B**.
2. **Agent A** choisit un mot mystère dans l'onglet *(Dé)code un mot*, note le code binaire sur une feuille et transmet le message à **Agent B**.
3. **Agent B** calcule de tête le rang de chaque lettre grâce aux puissances de 2 ($16+4+1=21 \rightarrow U$), reconstitue le mot et vérifie sa réponse dans l'application.
4. Les rôles sont ensuite inversés.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
