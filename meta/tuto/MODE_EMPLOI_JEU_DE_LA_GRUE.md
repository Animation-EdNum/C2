# 🏗️ Mode d'emploi : Jeu de la grue

Bienvenue dans le guide d'utilisation du **Jeu de la grue**, une application web interactive conçue pour initier les élèves des Cycles 1 et 2 à la **pensée algorithmique**, à la **planification séquentielle** et à la **résolution de problèmes par contraintes**.

Le principe est simple et captivant : programmer une grue mobile sur rail pour déplacer des cubes colorés entre trois colonnes et reproduire fidèlement la disposition cible affichée dans la zone « Objectif ».

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Pensée computationnelle :** Structurer une démarche algorithmique déterministe (la machine exécute aveuglément les ordres donnés).
- **Planification & Stratégie :** Anticiper les états intermédiaires du système (déplacer un cube temporairement pour accéder à celui situé en-dessous).
- **Gestion des contraintes physiques :** Gérer l'état de la pince (ouverte / fermée, vide / chargée) et respecter les limites spatiales du plateau.
- **Analyse de bugs (Débogage) :** Comprendre précisément pourquoi une instruction échoue grâce aux explications visuelles contextuelles.

---

## 1. Découvrir l'interface

L'écran s'articule autour de zones visuelles épurées :

- **Zone « Objectif » (à gauche) :** La disposition cible des cubes à reproduire.
- **Zone de travail (au centre) :** La grue suspendue sur son rail horizontal et les 3 colonnes (« cups ») où se trouvent les cubes à manipuler.
- **Bande de programme :** La frise chronologique où s'alignent les cartes d'instructions.
- **Panneau de commandes :** Les 5 boutons d'ordres colorés et les boutons d'exécution/effacement.
- **Compteurs :** *Victoires* et *Série 🔥* pour stimuler la régularité sans pénaliser l'erreur.

> 💡 Le bandeau dépliable **« 📖 Comment ça marche ? »** en haut de page rappelle les règles essentielles aux élèves en autonomie.

---

## 2. Les 3 niveaux de difficulté

Sélectionnables en un clic au-dessus du plateau :

- **🟢 Facile :** 1 seul cube à déplacer — idéal pour la découverte en Cycle 1 (4-7 ans) ou les premières séances.
- **🟡 Moyen :** 2 cubes à manipuler — niveau standard demandant de premières coordinations.
- **🔴 Difficile :** 3 cubes à réorganiser — impose de planifier des **déplacements intermédiaires** (utiliser une colonne libre comme zone de stockage temporaire).

À chaque changement de niveau ou victoire, un nouveau défi est généré aléatoirement.

---

## 3. Les 5 instructions de commande

La grue ne comprend que **5 ordres fondamentaux**, chacun associé à un code couleur distinctif :

| Bouton | Couleur | Raccourci | Action |
|---|---|---|---|
| ⬆️ **Haut** | Bleu | Flèche Haut | Remonter la pince au niveau du rail |
| ⬇️ **Bas** | Violet | Flèche Bas | Descendre la pince vers la colonne |
| ⬅️ **Gauche** | Orange | Flèche Gauche | Déplacer le chariot d'une colonne vers la gauche |
| ➡️ **Droite** | Vert | Flèche Droite | Déplacer le chariot d'une colonne vers la droite |
| ✊ **Action** | Rouge | `Espace` | Basculer la pince : attraper **ou** relâcher un cube |

> 🔎 **Indicateur dynamique :** L'icône du bouton *Action* s'adapte à l'état de la pince (poing fermé quand la pince est vide, main ouverte quand elle transporte un cube).

---

## 4. Construire et exécuter un programme

- **Ajouter une instruction :** Cliquez sur un bouton de commande ou utilisez les touches du clavier.
- **Supprimer une étape précise :** Cliquez directement sur la carte de l'instruction dans la bande (une croix ✕ apparaît au survol).
- **Effacer la dernière action :** Cliquez sur **« Effacer »** (icône corbeille) ou appuyez sur `Retour arrière`.
- **Tout réinitialiser :** Cliquez sur **« Tout vider »** pour recommencer une séquence vierge.
- **Lancer la grue :** Cliquez sur **« ▶ Exécuter »** ou appuyez sur `Entrée`. La grue s'anime et met en valeur l'instruction active en temps réel.

---

## 5. Détection des erreurs & Pédagogie de l'échec

Le jeu propose une analyse d'erreur explicite très formatrice :

- **Instruction invalide en cours de route :** Si la grue tente un mouvement interdit (heurter un cube par le côté, sortir du plateau, relâcher un cube trop haut…), l'exécution s'arrête net.
- **Mise en évidence :** La carte responsable devient **noire et agrandie** dans la bande de programme.
- **Explication claire :** Un message explicatif indique la cause du blocage (ex. : *« La grue est déjà au maximum à gauche ! »*, *« La grue doit descendre juste au-dessus de la cible pour relâcher l'objet ! »*).
- **Temps de réflexion :** Un court délai d'attente invite l'élève à analyser la situation avant de corriger sa ligne de code.

---

## 6. Récompenses & Gamification

- **🎉 Pluie de confettis** à chaque défi validé.
- **🔥 Flamme et animation renforcée** toutes les 3 victoires consécutives.
- **📊 Tableau de bord statistique :** L'icône camembert donne accès au suivi détaillé des réussites et des taux de succès.

---

## 7. Accessibilité & Raccourcis Clavier

| Raccourci | Action |
|---|---|
| ⬆ ⬇ ⬅ ➡ | Ajouter Haut / Bas / Gauche / Droite |
| `Espace` | Ajouter l'action Pince (Attraper / Relâcher) |
| `Entrée` | Exécuter le programme |
| `Retour arrière` | Effacer la dernière instruction |

---

## 🏫 Pistes d'activités en classe (Scénario 45 min)

1. **Phase débranchée (10 min) :** Un élève joue le robot avec les yeux bandés ou le corps rigide, un autre élève lui donne des ordres à haute voix. Verbaliser : *« Une machine ne devine rien, chaque mouvement doit être ordonné »*.
2. **Démonstration collective au TBI (5 min) :** Résolution guidée d'un défi moyen en verbalisant la stratégie.
3. **Atelier binômes (25 min) :** Rôle tournant : un *Programmeur* (qui conçoit l'algorithme) et un *Vérificateur* (qui relit mentalement avant d'appuyer sur ▶).
4. **Bilan / Synthèse (5 min) :** Mise en commun des astuces pour le niveau Difficile (stockage temporaire d'un cube).

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*