# 🏗️ Mode d'emploi : Jeu de la grue

Bienvenue dans le guide d'utilisation du **Jeu de la grue**, une application web interactive conçue pour initier les jeunes élèves à la **pensée algorithmique** et à la **programmation**.

Le principe est simple : programmer une grue pour déplacer des cubes entre trois colonnes et reproduire exactement la disposition affichée dans la zone « Objectif » .

---

## 1. Découvrir l'interface

L'écran se décompose en plusieurs zones clairement identifiables :

- **Zone « Objectif »** (à gauche) : la disposition des cubes à reproduire .
- **Zone de travail** (à droite) : la grue mobile, le rail et les trois colonnes (« cups ») où se trouvent les cubes à manipuler .
- **Bande de programme** (en bas / à droite sur ordinateur) : la suite des instructions que l'élève va construire.
- **Panneau de commandes** : les 5 boutons d'instructions et les boutons d'exécution.
- **Compteurs** : *Victoires* et *Série 🔥* pour suivre la progression .

> 💡 Un bandeau dépliable **« 📖 Comment ça marche ? »** est disponible en haut de la page pour rappeler les règles aux élèves .

---

## 2. Les trois niveaux de difficulté

L'application propose trois niveaux sélectionnables à tout moment via la barre située au-dessus des plateaux  :

- **🟢 Facile** : 1 cube à déplacer — idéal pour la découverte et les plus jeunes.
- **🟡 Moyen** : 2 cubes à manipuler — niveau par défaut au lancement.
- **🔴 Difficile** : 3 cubes — nécessite de planifier des déplacements intermédiaires (déplacer un cube « en attente » pour libérer une colonne).

À chaque changement de niveau, un nouveau défi est généré automatiquement .

---

## 3. Les 5 instructions disponibles

La grue ne comprend que **5 ordres**. Chaque bouton a sa propre couleur pour aider les élèves à repérer visuellement leur programme  :

| Bouton | Couleur | Action |
|---|---|---|
| ⬆️ **Haut** | Bleu | Remonter la pince |
| ⬇️ **Bas** | Violet | Descendre la pince |
| ⬅️ **Gauche** | Orange | Déplacer la grue d'une colonne à gauche |
| ➡️ **Droite** | Vert | Déplacer la grue d'une colonne à droite |
| ✊ **Action** | Rouge | Attraper **ou** relâcher un cube (bascule automatique) |

> 🔎 L'icône du bouton *Action* change selon l'état : poing fermé quand la grue est vide, main ouverte quand elle tient un cube .

---

## 4. Construire et exécuter un programme

**Comment l'utiliser :**

- Cliquez sur une instruction : elle **s'ajoute à la fin du programme** sous forme de carte colorée dans la bande.
- Pour **supprimer une instruction précise**, cliquez directement sur sa carte dans la bande (un ✕ apparaît au survol) .
- Le bouton **« Effacer »** (corbeille) retire la **dernière** instruction .
- Le bouton **« Tout vider »** (rouge) supprime la totalité du programme .
- Le bouton **« ▶ Exécuter »** (vert) lance la grue : elle réalise la séquence étape par étape, l'instruction en cours est mise en évidence .

> ⚠️ Pendant l'exécution, les boutons sont désactivés : impossible de modifier le programme en cours de route .

---

## 5. Gestion des erreurs

Le jeu propose un retour visuel très parlant en cas d'échec, précieux pour l'analyse d'erreurs en classe  :

- Si une instruction est **impossible** (grue qui sort du plateau, descend sur un cube, essaie d'attraper dans le vide…), l'exécution s'arrête et la carte fautive apparaît en **noir agrandi** dans la bande .
- Un **message d'explication** s'affiche (ex. : *« La grue est déjà au maximum à gauche ! »*, *« La grue doit descendre juste au-dessus de la cible pour relâcher l'objet ! »*) .
- Si la séquence s'exécute jusqu'au bout mais que la disposition **ne correspond pas** à l'objectif, un message indique soit *« La grue tient encore un objet »*, soit *« La disposition ne correspond pas »* .
- Après une erreur, un **temps d'attente de 5 secondes** permet à l'élève d'analyser avant de relancer .

---

## 6. Récompenses et motivation

- **🎉 Confettis** à chaque réussite, avec message *« Bien joué ! Exercice réussi »* .
- **🔥 Animation renforcée** toutes les 3 victoires consécutives (série entretenue) .
- **Compteur Victoires** : total de défis réussis depuis l'ouverture.
- **Compteur Série 🔥** : victoires d'affilée sans erreur .
- Un nouveau défi est automatiquement généré **4 secondes après** une réussite .

> 👉 Le bouton **📊 statistiques** (icône camembert) ouvre un tableau de bord détaillé des scores .

---

## 7. Raccourcis clavier

Pour les élèves à l'aise au clavier (ou sur TBI tactile avec clavier connecté)  :

| Touche | Action |
|---|---|
| ⬆ ⬇ ⬅ ➡ | Ajouter l'instruction correspondante |
| `Espace` | Ajouter l'instruction *Action* (pince) |
| `Entrée` | Exécuter le programme |
| `Retour arrière` | Effacer la dernière instruction |

---

## 🎨 Personnalisation

Le menu **Options** (icône engrenage ⚙ en haut à droite) donne accès à  :

- **Thème clair / sombre** 🌙 : bascule entre les deux modes d'affichage.
- **Son** 🔊 : active ou désactive les effets sonores (clic, victoire, erreur).

---

## 🏫 Conseils d'utilisation en classe

### Public cible
- **Cycle 1 (4–8 ans)** : en collectif au TBI ou en binômes, niveau **Facile**.
- **Cycle 2 (8–12 ans)** : en autonomie, progression Facile → Moyen → Difficile.

### Déroulé suggéré (45 min)
1. **Phase débranchée** (10 min) : au sol, un élève joue la grue, un autre donne les ordres avec des cartes-flèches. Faire verbaliser : *« Une machine ne devine rien, il faut tout lui dire à l'avance »* .
2. **Démonstration au TBI** (5 min) : l'enseignant résout un défi en niveau Facile en pensant à voix haute.
3. **Entraînement individuel ou en binôme** (25 min) : viser 3 réussites d'affilée (🔥) avant de changer de niveau.
4. **Mise en commun** (5 min) : partage de stratégies, notamment pour le niveau Difficile qui impose parfois de **déplacer un cube temporairement ailleurs**.

### Binômes efficaces
- **« Programmeur / vérificateur »** : l'un construit la séquence, l'autre la lit à voix haute avant d'appuyer sur ▶.
- **« Objectif caché »** : à deux, l'un décrit oralement la cible, l'autre programme sans la regarder.

### Points d'attention pédagogiques
- Insister sur la **lecture de l'objectif AVANT de programmer**.
- Valoriser l'**essai-erreur** : la case noire qui s'affiche indique précisément où le programme coince .
- Ne pas corriger trop vite : laisser l'élève comprendre par lui-même grâce au message d'erreur.
- Verbaliser : *« Pourquoi la grue ne peut-elle pas descendre ici ? »*, *« Que tient-elle actuellement ? »*

---

### Astuces supplémentaires

- **Accessibilité** : l'application est entièrement **utilisable au clavier** (flèches, Espace, Entrée, Retour arrière) .
- **Hors-ligne** : une fois chargée, l'application fonctionne sans connexion Internet.
- **Gratuit et libre** : code open source sous licence AGPL-3.0, conçu par l'AP EdNum (HEP-VS) .

---

*Bon jeu en classe, et surtout : laissez vos élèves se tromper, recommencer… et savourer leur première victoire de « programmeur de grue » ! 🏗️🎉*