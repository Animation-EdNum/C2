# 🎨 Mode d'emploi : Pixel Studio

Bienvenue dans le guide d'utilisation de **Pixel Studio** (Pixel Art Binaire), une application web interactive conçue pour faire le pont entre l'art visuel, les images matricielles et leur représentation numérique sous forme de code binaire (1 ou 2 bits par pixel).

Cette application s'inscrit au cœur du programme d'éducation numérique de l'école primaire (Cycle 2, Décodages 5-6H · Scénario 4 — *Codage de données, codage binaire*).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Numérisation de l'image :** Comprendre qu'une image numérique est une grille finie de carrés élémentaires appelés **pixels**.
- **Du visuel au binaire :** Découvrir que chaque pixel est codé par une information numérique (0 pour noir, 1 pour blanc en 1 bit ; 00, 01, 10, 11 en 2 bits / 4 couleurs).
- **Notion de profondeur de couleur :** Expérimenter le passage de 1 bit/pixel (2 états : noir et blanc) à 2 bits/pixel (4 couleurs : noir, vert, bleu, jaune).
- **Rigueur de codage :** Comprendre l'importance de l'ordre de lecture des lignes (de gauche à droite, de haut en bas).

---

## 1. Les 3 Modes de Jeu

| Onglet / Mode | Mission principale | Rôle de l'élève |
|---|---|---|
| 🎯 **Décoder** | Du code binaire vers l'image | Lire la suite de `0` et de `1` et colorier la grille pour révéler le dessin. |
| ✏️ **Encoder** | De l'image vers le code binaire | Observer l'image matricielle et saisir les 0 et 1 correspondants. |
| 🎨 **Éditeur Libre** | Création artistique et exportation | Dessiner librement, générer le code en direct, exporter en PNG et partager. |

### 1.1. Mode « Décoder » (Du code vers le dessin)
- **Objectif :** Une suite de 0 et de 1 est affichée ligne par ligne sur le côté gauche. L'élève doit colorier les pixels de la grille pour faire apparaître le dessin caché.
- **Comment colorier :**
  - **En mode Noir & Blanc (1 bit) :** Cliquez sur une case pour basculer entre Noir (0) et Blanc (1).
  - **En mode Couleurs (2 bits) :** Sélectionnez une couleur dans la palette de convention en haut (`⬛ 00`, `🟢 01`, `🔵 10`, `🟡 11`), puis cliquez sur les cases de la grille.
- **Validation :** Cliquez sur le bouton vert **« Vérifier »**. Si le dessin correspond exactement au code, une célébration se déclenche et les scores s'incrémentent !

### 1.2. Mode « Encoder » (Du dessin vers le code)
- **Objectif :** Un dessin pixélisé est affiché sur la gauche. L'élève doit saisir la séquence binaire correspondante dans les champs de texte à droite.
- **Aide à la saisie :** Les touches `0` et `1` du clavier permettent de remplir rapidement les champs. Le curseur avance automatiquement au fil de la frappe.
- **Vérification instantanée :** Dès que la ligne est correcte, elle se valide avec un retour visuel vert rassurant.

### 1.3. Mode « Éditeur Libre » (Création & Partage)
- **Déverrouillage :** Pour valoriser l'effort et garantir la maîtrise des concepts de base, l'éditeur libre se débloque après avoir réussi **3 décodages** et **3 encodages**.
- **Fonctionnalités de l'éditeur :**
  - **Choix des dimensions :** Grilles de `10×10`, `15×15` ou `20×20` pixels.
  - **Génération binaire en temps réel :** Chaque clic sur la grille met à jour instantanément la chaîne binaire dans la zone de texte.
  - **Importation par copier-coller :** Vous pouvez coller n'importe quelle séquence de 0 et de 1 dans la zone de texte pour voir le dessin se matérialiser immédiatement.
  - **💾 Exporter :** Télécharge l'image dessinée au format PNG sur votre appareil.
  - **🔗 Partager :** Génère un lien URL encodant votre dessin (`&importGrid=...`) pour l'envoyer à un camarade ou à l'enseignant.

---

## 2. Basculement Noir & Blanc ↔ Couleurs (Profondeur de bit)

Un interrupteur situé sous les onglets permet de basculer à tout moment entre :

| Mode | Profondeur | Convention de codage |
|---|---|---|
| **⬛ N/B** | 1 bit par pixel | `0` = ⬛ Noir · `1` = ⬜ Blanc |
| **🌈 Couleurs** | 2 bits par pixel | `00` = ⬛ Noir · `01` = 🟢 Vert · `10` = 🔵 Bleu · `11` = 🟡 Jaune |

---

## 3. Suivi des scores & Gamification

- **Compteurs Victoires & Série 🔥 :** Intégrés en bas de chaque carte de défi pour encourager la persévérance.
- **Statistiques globales :** Le bouton avec l'icône camembert (`dt-chart-pie`) ouvre la modale récapitulative des défis réussis par mode et par niveau de difficulté.

---

## 4. Conseils d'utilisation en classe

### Défi en binômes « Transmettre une image » (30 min) :
1. **Élève A** ouvre l'**Éditeur Libre** et dessine un pictogramme simple en 10×10 (ex. cœur, smiley, sapin).
2. **Élève A** copie uniquement la séquence de 0 et de 1 générée et l'écrit sur une feuille de papier (ou la transmet par messagerie).
3. **Élève B** reçoit la feuille de code, ouvre le mode **Décoder** (ou colle le code dans l'éditeur) et reconstruit l'image sans avoir vu l'original.
4. Les élèves comparent leurs écrans : l'image reconstruite est-elle identique ? Cette activité illustre concrètement le principe des transmissions réseau et de la compression d'image !

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
