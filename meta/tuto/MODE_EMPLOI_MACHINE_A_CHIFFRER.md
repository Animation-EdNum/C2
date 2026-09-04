# 🔐 Mode d'emploi : Machine à chiffrer

La **Machine à chiffrer** initie les élèves aux principes fondamentaux de la **cryptographie historique**, en particulier le **chiffre de César** (décalage de lettres) à l'aide d'une double roue rotative interactive.

Alignement : Cycle 2 et Cycle 3 (sécurité, cryptographie et histoire de l'information).

---

## Pourquoi cet outil ?

- **Notion de clé de chiffrement :** Comprendre qu'un message secret nécessite un algorithme (le décalage) et un paramètre secret appelé la **clé** (le nombre de crans de décalage).
- **Symétrie chiffrement / déchiffrement :** Découvrir que déchiffrer consiste à appliquer l'opération inverse (décaler de $-k$ ou tourner la roue en sens inverse).
- **Histoire des sciences :** Découvrir comment Jules César protégeait ses correspondances militaires il y a plus de 2000 ans.

---

## 1. La Roue de César interactive

L'écran présente une double roue alphabétique :
- **Roue extérieure (A–Z) :** L'alphabet d'origine (lettres en clair).
- **Roue intérieure (A–Z) :** L'alphabet décalé (lettres chiffrées).
- **Curseur de décalage (Clé $k$) :** De $0$ à $25$. Tourner la molette fait pivoter la roue intérieure avec une animation fluide.

> **Exemple avec une clé $k = 3$ :**
> - La lettre `A` devient `D`
> - La lettre `B` devient `E`
> - La lettre `Z` devient `C` (rebouclage circulaire).

---

## 2. Les fonctionnalités

| Outil | Description |
|---|---|
| 🔒 **Chiffrer un message** | Tapez un texte en clair → la machine applique le décalage sélectionné et affiche le message secret. |
| 🔓 **Déchiffrer un message** | Entrez un texte chiffré et la clé → la machine restaure le texte original. |
| 🎲 **Clé aléatoire** | Tire un décalage au sort pour créer un nouveau défi instantané. |
| 📋 **Copier le résultat** | Copie le texte chiffré dans le presse-papiers pour l'envoyer à un camarade. |

---

## 3. Cryptanalyse : Casser le code !

L'application permet d'introduire des méthodes simples d'attaque cryptographique :

1. **Attaque par force brute :** Puisqu'il n'y a que 25 clés possibles, un élève peut tester chaque position de la roue jusqu'à ce qu'un texte lisible apparaisse.
2. **Analyse fréquentielle :** En français, la lettre la plus fréquente est le **E**. En repérant la lettre la plus récurrente dans un message chiffré, on peut deviner le décalage appliqué.

---

## 🏫 Activité collaborative : Le courrier de l'Empire

1. **Étape 1 :** L'enseignant choisit une clé du jour (ex. $k = 7$).
2. **Étape 2 :** Chaque élève rédige une courte consigne ou devinette, la chiffre avec la roue et la transmet à son voisin.
3. **Étape 3 :** Le destinataire applique le déchiffrement pour lire le message et y répondre.
4. **Variante experte :** Transmettre un message chiffré **sans donner la clé** : le camarade doit trouver la clé par déduction !
