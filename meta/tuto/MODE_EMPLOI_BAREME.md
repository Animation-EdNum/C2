# 📊 Mode d'emploi : Générateur de Barèmes

Le **Générateur de Barèmes** produit instantanément la grille de conversion points → notes pour vos évaluations, avec un seuil de suffisance paramétrable, l'affichage optionnel des points perdus (-fautes), une copie tabulaire pour tableur et des exports en image PNG ou PDF A4.

100% hors-ligne · Aucune donnée transmise · Aucune inscription · Conforme à l'échelle de notation romande (1.0 à 6.0).

---

## Pourquoi cet outil ?

- **Gain de temps :** Plus besoin de recalculer chaque note à la calculatrice lors des corrections de copies.
- **Équité mathématique :** Chaque élève bénéficie strictement de la même courbe de notation, quel que soit l'ordre de correction.
- **Transparence totale :** Le barème peut être affiché au tableau, copié dans un tableur ou imprimé pour être agrafé à l'épreuve.
- **Régularité des arrondis :** Application uniforme et rigoureuse des règles d'arrondi sur l'ensemble de l'épreuve.

---

## 1. Configuration de base

Dans le panneau latéral gauche :

- **Points maximum :** Saisissez le total de points de l'évaluation (ex. `20`, `35.5`, `50`).
- La formule par défaut applique le barème linéaire romand :
  $$\text{Note} = 1 + 5 \times \frac{\text{Points}}{\text{Total}}$$
  *(Le seuil de suffisance 4.0 se situe naturellement à 60% des points).*

---

## 2. Options avancées

Dépliez la section **« Options avancées »** pour affiner vos réglages :

| Option | Rôle | Choix disponibles |
|---|---|---|
| **Titre de l'épreuve** | Personnalise l'en-tête du document et de l'impression. | Champ texte libre (ex. *« Mathématiques 6H — Géométrie »*). |
| **Seuil de suffisance (Note 4)** | Ajuste le nombre de points exigé pour obtenir la note 4.0. | Nombre de points libre (génère un double barème linéaire avec point d'inflexion au seuil). |
| **Pas du barème** | Échelonnement des points dans le tableau. | `1 pt`, `0.5 pt` (défaut), `0.25 pt`, `0.1 pt`. |
| **Arrondi des notes** | Règle d'arrondi automatique des notes calculées. | Au dixième (`0.1`), au quart (`0.25`), au demi (`0.5`), à l'entier (`1.0`). |
| **Afficher les points perdus (-fautes)** | Affiche une colonne supplémentaire indiquant les points manquants par rapport au total. | Case à cocher (très pratique pour corriger en comptant les erreurs à soustraire). |

---

## 3. Lecture du tableau de notation

Le tableau central présente chaque score possible avec sa note correspondante :
- 🟢 **Vert (fond doux) :** Notes suffisantes ($\ge 4.0$).
- 🔴 **Rouge (fond doux) :** Notes insuffisantes ($< 4.0$).
- La ligne exacte du **seuil 4.0** est mise en valeur par un liseré visuel.
- L'en-tête rappelle la formule mathématique active et le résumé des paramètres.

---

## 4. Exportation et partage

La barre d'outils supérieure propose 3 modes d'exportation complémentaires :

1. 🖼️ **Image (`#exportImageBtn`) :** Génère et télécharge une image PNG nette du barème, prête à être insérée dans un traitement de texte ou un diaporama.
2. 📋 **Copier (`#copyTableBtn`) :** Copie l'intégralité du tableau au format texte/tabulations dans votre presse-papiers, prêt à être collé directement dans Excel, Google Sheets ou LibreOffice Calc (`Ctrl+V`).
3. 🖨️ **Imprimer (`#printBtn`) :** Ouvre la boîte de dialogue d'impression avec une mise en page épurée (sans arrière-plan sombre, sans boutons), compactée sur une seule feuille A4 ou convertible en PDF.

---

## 5. Thèmes et accessibilité

- Bouton **Thème clair / sombre 🌙** dans la barre supérieure droite.
- Bouton **Réinitialiser 🔄** pour remettre les réglages par défaut en un clic.
