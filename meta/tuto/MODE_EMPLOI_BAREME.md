# 📊 Mode d'emploi : Générateur de Barèmes

Le **Générateur de Barèmes** produit instantanément la grille de conversion points → notes pour vos évaluations, avec un seuil de suffisance paramétrable et un export PDF imprimable sur une seule page A4.

100% hors-ligne · Aucune donnée transmise · Aucune inscription.

---

## Pourquoi cet outil ?

- **Gain de temps :** Plus besoin de calculer manuellement chaque note à la calculatrice lors des corrections.
- **Équité :** Chaque élève est évalué avec la même courbe mathématique, quel que soit l'ordre de correction.
- **Transparence :** Le barème imprimé peut être joint au dossier d'évaluation ou affiché au tableau pour les élèves.
- **Régularité des arrondis :** L'outil applique systématiquement la même règle d'arrondi à chaque score.

---

## 1. Configurer le barème

### Points maximum & pas

- Saisissez le **total de points** de votre épreuve (ex. `20`, `35.5`, `50`).
- Choisissez le **pas d'incrémentation** du tableau :
  - `1.0` — Points entiers uniquement.
  - `0.5` — Demi-points (le plus courant).
  - `0.25` — Quarts de points (évaluations fines).

### Seuil de suffisance (note 4.0)

Deux modes au choix :
- **Pourcentage :** Le 4.0 est attribué lorsque l'élève atteint X% du total (par défaut **60%**).
- **Points absolus :** Fixez directement le nombre de points correspondant au 4.0 (ex. 24 pts sur 40).

### Type de courbe

- **Linéaire standard :** $\text{Note} = 1 + 5 \times \frac{\text{Points}}{\text{Total}}$
  La note 4.0 tombe naturellement à 60% des points.
- **Bi-linéaire (seuil ajusté) :** Deux pentes distinctes de part et d'autre du seuil pour garantir 0 pt = 1.0, Seuil = 4.0 et Max = 6.0. Utile si vous placez le 4.0 à 50% ou 70%.

### Arrondi

| Arrondi | Exemples de notes possibles |
|---|---|
| Au dixième `0.1` | 4.1, 4.2, 4.3 … |
| Au quart `0.25` | 4.0, 4.25, 4.5, 4.75 … |
| Au demi-point `0.5` | 4.0, 4.5, 5.0 … |
| À l'unité `1.0` | 4, 5, 6 |

---

## 2. Lire le tableau de notation

Le tableau central affiche chaque score possible avec la note calculée :
- 🟢 **Vert** = notes suffisantes ($\ge$ 4.0).
- 🔴 **Rouge** = notes insuffisantes ($\lt$ 4.0).
- La ligne du **seuil 4.0** est visuellement mise en évidence.

### Calculateur rapide

Au-dessus du tableau, un champ de saisie permet de taper directement un score (ex. `17.5`) : la note apparaît instantanément en grand, sans avoir à chercher dans la liste.

---

## 3. Imprimer / Exporter en PDF

Cliquez sur **« 🖨️ Imprimer le barème »** :
- La feuille de style d'impression masque automatiquement les éléments d'interface (menus, boutons, fond sombre).
- Le barème est compacté en colonnes claires et aérées, prêtes pour l'impression A4 ou l'enregistrement en PDF.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
