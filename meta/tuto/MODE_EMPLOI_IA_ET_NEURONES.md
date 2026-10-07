# 🧠 Mode d'emploi : Intelligence Artificielle & Neurones

Les applications **Dresseur de neurones** et **Détective IA** initient les élèves du Cycle 2 et du Cycle 3 au fonctionnement fondamental de l'intelligence artificielle et de l'apprentissage automatique (*Machine Learning*). Elles démontrent visuellement qu'une IA ne pense pas, mais qu'elle apprend à partir d'exemples et peut hériter de **biais algorithmiques** si son entraînement est incomplet ou trompeur.

Alignement : Cycle 2 et Cycle 3 (Éducation numérique, algorithmes d'apprentissage, pensée critique face aux IA).

---

## Pourquoi ces outils ?

- **Démystifier le fonctionnement d'une IA :** Comprendre qu'un modèle informatique n'a pas de conscience ; il extrait des régularités statistiques (critères discriminants) à partir d'une base de données d'apprentissage.
- **Le cycle de l'apprentissage supervisé :** Expérimenter concrètement les trois étapes fondamentales :
  1. *Collecte et étiquetage des données* (donner des exemples étiquetés à l'IA).
  2. *Entraînement du modèle* (remplir les bacs de mémoire et ajuster les critères).
  3. *Inférence et test en production* (mettre l'IA à l'épreuve face à des données nouvelles).
- **Comprendre et observer le biais algorithmique :** Découvrir pourquoi une IA se trompe lourdement lorsqu'on lui présente un cas non représenté dans ses données d'entraînement.

---

## 1. Dresseur de neurones (`dresseur_neurones.html`)

Cette application place l'élève dans le rôle d'un ingénieur entraînant un robot trieur pour une usine agroalimentaire.

### Phase 1 : Le Laboratoire d'entraînement (Onglet 🧺 1. Entraînement)
1. **La Réserve de fruits :** L'élève dispose de 4 types de fruits :
   - 🍎 **Pomme Rouge :** Rouge, Ronde.
   - 🍐 **Poire Verte :** Verte, Allongée.
   - 🍏 **Pomme Verte (⚠️ Piège) :** Verte, Ronde.
   - 🍐 **Poire Rouge (⚠️ Piège) :** Rouge, Allongée.
2. **Créateur sur-mesure :** L'élève peut aussi concevoir son propre fruit en choisissant la couleur (Rouge / Vert) et la forme (Ronde / Allongée).
3. **Nourrir le robot :** Cliquez sur un fruit pour le placer dans le chargeur, puis cliquez sur **« 🍎 Nourrir Pomme »** ou **« 🍐 Nourrir Poire »** pour alimenter les bacs de mémoire du robot.
4. **Condition d'activation :** Le robot a besoin d'au moins **2 exemples par bac** pour mémoriser les critères et débloquer l'accès à l'usine.

### Phase 2 : Le Tapis de tri en usine (Onglet 🏭 2. Tapis de tri)
1. Cliquez sur **« 🚀 Lancer le tri en usine ! »** : l'interface bascule sur la chaîne de production automatisée.
2. Les fruits défilent sur le tapis roulant sous le **scanner laser** de l'IA.
3. Le robot classe automatiquement chaque fruit dans le bac des pommes ou des poires.
4. **La révélation du biais algorithmique :**
   - Si l'élève n'a nourri le robot qu'avec des pommes rouges et des poires vertes, sur quel critère l'IA s'est-elle basée ? La couleur ou la forme ?
   - Lorsque des **pommes vertes** ou des **poires rouges** défilent, l'élève assiste aux erreurs de prédiction du robot !
   - Cette expérience déclenche un débat riche en classe : une IA entraînée sur des données incomplètes prend des décisions erronées sans s'en rendre compte.

---

## 2. Détective IA (`detective_ia.html`)

Cette application explore les **arbres de décision**, l'une des structures algorithmiques les plus transparentes et interprétables du machine learning.

### Configuration du jeu de données :
1. **Choix du thème :** 🐾 **Animaux**, 🍎 **Fruits** ou 🚗 **Véhicules**.
2. **Choix de la difficulté :**
   - 🟢 **Facile :** 4 éléments avec des attributs très distincts.
   - 🟡 **Moyen :** 6 éléments avec des questions plus fines.
   - 🔴 **Difficile :** 8 éléments avec critères croisés.

### Les 3 modes d'enquête (onglets) :
| Mode | Ce que fait l'élève | Objectif pédagogique |
|---|---|---|
| 🧭 **Mode Guidé** | Répond à des questions successives (ex. *« A-t-il des poils ? »*, *« Vole-t-il ? »*) pour progresser dans l'arbre. | Comprendre comment un arbre divise récursivement un groupe d'éléments en sous-groupes homogènes. |
| 🛠️ **Mode Libre** | Choisit lui-même les meilleures questions pour construire l'arbre de classification le plus court possible. | Découvrir la notion de *gain d'information* : poser la question qui sépare le groupe équitablement. |
| 🎯 **Mode Défi** | Analyse un arbre déjà construit pour identifier des erreurs de classification ou deviner l'objet secret. | Développer l'esprit critique et l'audit de modèles automatisés. |

---

## 3. Raccourcis & Gamification

- **Statistiques :** Bouton camembert en bas de carte pour suivre le taux de précision et le nombre de défis résolus.
- **Série 🔥 & Confettis :** Valorisation des déductions correctes et de la justesse des modèles.
- **Menu Options ⚙ :** Thème sombre, réglage audio et réinitialisation de session.
