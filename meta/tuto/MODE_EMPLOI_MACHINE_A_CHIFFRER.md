# 🔐 Mode d'emploi : Machine à chiffrer

La **Machine à chiffrer** initie les élèves aux principes fondamentaux de la **cryptographie et de la sécurité des communications** à travers cinq chiffres et outils historiques interactifs : César, Vigenère, Atbash, Morse et un laboratoire d'interception Hacker.

Alignement : Cycle 2 et Cycle 3 (sécurité, cryptographie, algorithmes et histoire de l'information).

---

## Pourquoi cet outil ?

- **Notion de clé de chiffrement :** Comprendre qu'un message secret repose sur un algorithme (la méthode de transformation) et une **clé** (paramètre secret permettant de chiffrer et déchiffrer).
- **Symétrie chiffrement / déchiffrement :** Expérimenter que lire un message secret nécessite d'appliquer l'opération mathématique inverse.
- **Évolution de la cryptographie :** Passer du simple décalage monoalphabétique antique (César, Atbash) au chiffrement polyalphabétique robuste de la Renaissance (Vigenère), jusqu'au code télégraphique (Morse).
- **Cryptanalyse :** Comprendre comment les pirates et espions cassent les codes grâce à l'analyse de fréquence des lettres et à la force brute.

---

## 1. Les 5 modes de la machine (onglets)

La barre supérieure donne accès à 5 univers cryptographiques :

| Onglet | Méthode | Principe & Clé |
|---|---|---|
| 🔄 **Code César** | Chiffrement par décalage | Une roue rotative interactive décale l'alphabet de $0$ à $25$ crans. |
| 🗝️ **Code Vigenère** | Chiffrement polyalphabétique | Utilise un **mot-clé secret** (ex. `SECRET`) pour varier le décalage de chaque lettre. |
| 🔁 **Atbash** | Chiffrement par miroir | Inversement alphabétique hébreu : A devient Z, B devient Y, C devient X… |
| 📻 **Morse** | Code télégraphique binaire | Traduit le texte en impulsions courtes (ti / `.`) et longues (tah / `-`). |
| 🔍 **Hacker** | Laboratoire de cryptanalyse | Interception, graphique de fréquence des lettres et bouton de force brute. |

---

## 2. Le Chiffre de César (Roue interactive)

L'écran présente une double roue alphabétique rotative :
- **Roue extérieure :** Lettres du texte en clair (A–Z).
- **Roue intérieure :** Lettres chiffrées correspondantes.
- **Curseur de décalage (Clé $k$) :** De $0$ à $25$. Tourner la molette ou cliquer sur **« Aléatoire »** fait pivoter la roue intérieure.
- Tapez dans le panneau gauche pour chiffrer en direct, ou dans le panneau droit pour déchiffrer.

---

## 3. Le Chiffre de Vigenère (Mot-clé secret)

Le chiffre de César ayant la faiblesse d'utiliser un décalage fixe, Vigenère introduit une clé composée d'un mot :
1. Saisissez votre texte en clair.
2. Choisissez une **Clé secrète** (ex. `LION`).
3. La première lettre du texte est décalée selon `L`, la deuxième selon `I`, la troisième selon `O`, etc.
4. Pour déchiffrer, le destinataire doit impérativement connaître ce mot-clé.

---

## 4. Atbash & Morse

- **Atbash :** Chiffrement par substitution miroir antique. Particularité remarquable : chiffrer ou déchiffrer correspond exactement à la même opération ($A \leftrightarrow Z$) !
- **Code Morse :** L'alphabet est converti en signaux sonores et visuels. Idéal pour faire le lien avec la transmission d'informations par télégraphe et les codes binaires.

---

## 5. Le Laboratoire « Hacker » (Cryptanalyse)

Cet onglet transforme l'élève en détective cryptographique :
1. Cliquez sur **« Intercepter un message »** pour charger un texte chiffré mystère sans connaître la clé.
2. **Analyse fréquentielle :** L'outil trace un histogramme des lettres les plus fréquentes du message intercepté et le compare à la distribution naturelle de la langue française (où la lettre **E** est largement prédominante avec ~15% des occurrences).
3. **Craquer le code (Brute Force) :** Cliquez sur le bouton **« Craquer le code »** pour voir l'ordinateur tester instantanément toutes les 25 clés possibles jusqu'à trouver un français cohérent.

---

## 6. Actions rapides & Copie

- **Copier le texte :** Boutons dédiés pour copier instantanément le message chiffré dans le presse-papiers (`#btn-copy-cipher`) afin de le transmettre à un camarade.
- **Effacer :** Boutons corbeille pour vider les zones de texte.
