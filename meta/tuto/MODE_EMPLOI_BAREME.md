# 📊 Mode d'emploi : Générateur de Barèmes

Bienvenue dans le guide d'utilisation complet du **Générateur de Barèmes**, un utilitaire professionnel conçu pour les enseignant·e·s afin de générer instantanément des grilles de notation précises, équitables et conformes aux exigences institutionnelles (système de notation suisse 1 à 6, seuil de suffisance à 4.0).

L'outil fonctionne **100% hors-ligne**, sans aucune publicité, sans inscription et sans stockage de données sur des serveurs externes.

---

## 🌟 Enjeux Pédagogiques & Docimologiques

- **Équité et transparence de l'évaluation :** Assurer une correspondance mathématique claire entre le nombre de points attribués aux critères d'une épreuve et la note finale délivrée à l'élève.
- **Différenciation et seuil de suffisance :** Définir avec précision le seuil où l'évaluation est considérée comme « suffisante » (note 4.0), souvent fixé institutionnellement à **60% des points** (ou ajustable selon la difficulté de l'épreuve).
- **Gain de temps précieux :** Éliminer les calculs répétitifs à la calculatrice lors des corrections d'évaluations sommatives ou formatives.
- **Régularité des arrondis :** Éviter les écarts d'arrondis manuels grâce au paramétrage automatique (au dixième, au quart de point ou au demi-point).

---

## 1. Structure de l'Interface

| Volet | Contenu | Rôle pour l'enseignant |
|---|---|---|
| ⚙️ **Panneau de Configuration** (Gauche) | Total de points, pas, seuil du 4.0, type de courbe, arrondis | Ajuster les paramètres docimologiques de l'épreuve. |
| 📋 **Tableau & Calculateur** (Droite) | Grille complète Points $\rightarrow$ Notes, calculateur instantané, impression | Corriger rapidement et exporter un barème propre sur papier/PDF. |

---

## 2. Configurer les Paramètres de l'Évaluation

Le panneau latéral gauche rassemble l'ensemble des réglages :

### 2.1. Points & Pas de Notation
- **Points maximum :** Saisissez le barème maximal de l'évaluation (ex: `20`, `35.5`, `50`).
- **Pas d'incrémentation :** Choisissez l'intervalle de décompte du tableau :
  - `1.0 pt` : Entiers uniquement.
  - `0.5 pt` : Demi-points (recommandé pour la majorité des épreuves).
  - `0.25 pt` : Quarts de points (pour les évaluations fines).

### 2.2. Seuil de Suffisance (La note 4.0)
- **Mode Pourcentage (%) :** Fixez le pourcentage de réussite nécessaire pour obtenir la note 4.0 (par défaut **60%**).
- **Mode Points absolus :** Définissez directement le nombre exact de points correspondant au 4.0 (ex. *24 points sur 40*).

### 2.3. Type de Courbe (Modèle mathématique)
- **Courbe Linéaire Standard :**
  $$\text{Note} = 1 + 5 \times \frac{\text{Points}}{\text{Total}}$$
  *(Dans ce modèle, le 4.0 se situe naturellement à 60% des points).*
- **Courbe avec Seuil Ajusté (Bi-linéaire) :**
  Si vous modifiez le seuil du 4.0 (ex. à 50% ou 70%), la formule calcule deux pentes distinctes pour garantir que 0 pt = 1.0, Seuil = 4.0, et Max = 6.0 sans rupture d'échelle.

### 2.4. Règle d'Arrondi des Notes
- **Au dixième (`0.1`) :** Notation fine (ex: 4.3, 5.7).
- **Au quart de note (`0.25`) :** Notation standard romande (ex: 4.25, 4.5, 4.75).
- **Au demi-point (`0.5`) :** Arrondi classique (ex: 4.0, 4.5, 5.0).
- **À l'unité (`1.0`) :** Notes entières.

---

## 3. Utiliser le Tableau de Notation & Calculateur

### A. La Grille de Correspondance
- Le tableau central affiche la liste complète des scores possibles avec la note associée.
- **Code couleur automatique :**
  - 🟢 **Vert :** Notes suffisantes ($\ge 4.0$).
  - 🔴 **Rouge :** Notes insuffisantes ($< 4.0$).
- La ligne du **seuil 4.0** est mise en évidence par une bordure distinctive.

### B. Le Calculateur Instantané
- Au-dessus du tableau, un champ de saisie rapide permet de taper le score d'un élève (ex: `17.5`) : la note calculée s'affiche instantanément en grand sans avoir à chercher dans la liste.

---

## 4. Impression & Exportation PDF Propre

Cliquez sur le bouton **« 🖨️ Imprimer le barème »** :
- Une feuille de style d'impression dédiée (`@media print`) s'applique automatiquement.
- Tous les éléments d'interface inutiles (menus, boutons, arrière-plans sombres) sont masqués.
- Le barème est compacté sous forme de colonnes élégantes et aérées, prêtes à être imprimées sur une seule page A4 ou enregistrées en PDF pour votre dossier de classe.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
