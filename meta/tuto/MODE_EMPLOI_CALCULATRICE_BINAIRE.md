# 🧮 Mode d'emploi : Calculatrice binaire

**Calculatrice binaire** est une application web interactive d'exploration, de conversion et de décomposition d'un octet (8 bits) entre le système binaire (base 2) et le système décimal (base 10), avec des valeurs allant de 0 à 255.

- **Public cible :** Cycle 2 (7-8H) et Cycle 3 (9-11CO).
- **Alignement PER & Lehrplan 21 :** EN 22+32 · Science informatique — Codage en système binaire (*Connected 1 · 1.2 | Zahlen in Binär* et *Décodages 7-8 · Activité 2*).
- **Accès direct :** `webapps/calculatrice_binaire.html`.

---

## 🎯 Pourquoi cet outil ?

- **Comprendre la numération de position :** Visualiser que chaque bit possède un poids qui correspond à une puissance de 2 ($2^7 = 128$, $2^6 = 64$, $2^5 = 32$, $2^4 = 16$, $2^3 = 8$, $2^2 = 4$, $2^1 = 2$, $2^0 = 1$).
- **Saisie bidirectionnelle instantanée :**
  - Cliquer sur un bit pour l'activer ou le désactiver calcule immédiatement la valeur décimale et affiche la formule décomposée.
  - Saisir un nombre entier de 0 à 255 dans le champ décimal active automatiquement la bonne combinaison de bits par décomposition gloutonne.
- **Autonomie et étayage :** Idéal comme outil d'appui lors des séances sur le binaire pour vérifier ses calculs sans calculatrice complexe superflue.
- **Accessibilité et projection :** Compatible smartphone, tablette, ordinateur et mode grand écran TNI/TBI avec mode sombre et contraste élevé.

---

## 🧭 Fonctionnalités principales

### 1. Le tableau interactif sur 8 bits

Le tableau présente clairement les trois rangées fondamentales pour les élèves :
1. **BITS :** Les 8 chiffres binaires (`0` ou `1`). Un clic sur une case bascule son état.
2. **PUISSANCES :** La puissance de base 2 correspondante ($2^7$ jusqu'à $2^0$).
3. **VALEURS :** La valeur décimale de chaque position ($128, 64, 32, 16, 8, 4, 2, 1$). Un clic sur la valeur active également le bit correspondant.

### 2. Le calcul décomposé en direct

Sous le tableau, une zone d'explication affiche en temps réel le détail du calcul :
- Exemple pour le nombre `42` :  
  `32 + 8 + 2 = 42`
- Si aucun bit n'est actif, un message pédagogique invite à cliquer sur les cases pour commencer à explorer.

### 3. Saisie décimale (0 à 255)

Le champ **« Valeur décimale (0 à 255) : »** permet de taper directement n'importe quel nombre entre 0 et 255 :
- Les bits du tableau se mettent à jour instantanément pour afficher la décomposition binaire correspondante.
- La saisie est strictement limitée à 255 : si un élève essaie de saisir une valeur supérieure (par exemple 256 ou plus), elle est immédiatement plafonnée à 255 avec une notification d'avertissement.
- Un bouton de copie rapide permet de transférer la valeur décimale dans le presse-papier.

### 4. Saisie et édition binaire à la main

Le champ **« Binaire (base 2) : »** permet également d'éditer la valeur binaire directement à la main :
- L'élève peut saisir librement des chiffres binaires (`0` et `1`) pour expérimenter (les caractères invalides sont automatiquement filtrés).
- Le tableau interactif et la valeur décimale se synchronisent en temps réel à chaque chiffre saisi.
- Au terme de la saisie (ou à la perte du focus), la valeur est joliment formatée sur 8 bits avec un espace séparateur entre les deux demi-octets (quartets / nibbles, ex. `0010 1010`).
- Un bouton de copie permet de copier directement la chaîne binaire (8 chiffres) dans le presse-papier.

### 5. Actions rapides

- **Remise à zéro :** Désactive tous les bits et réinitialise la valeur à 0 d'un seul clic.

---

## 🏫 Pistes pédagogiques pour la classe

1. **Découverte inductive :** Laisser les élèves manipuler librement les cases pour observer ce qui se passe quand on active le bit de droite ($2^0 = 1$), puis les suivants.
2. **Le plus grand nombre :** Demander aux élèves quelle est la valeur maximale que l'on peut obtenir avec 8 bits ($255$), et pourquoi ($256 - 1$).
3. **Nombres pairs et impairs :** Faire remarquer aux élèves que seul le dernier bit ($2^0 = 1$) détermine si un nombre est impair.
4. **Le saut des puissances :** Observer que chaque case vaut la somme de toutes les cases précédentes plus 1 (ex. $64 = 32 + 16 + 8 + 4 + 2 + 1 + 1$).
