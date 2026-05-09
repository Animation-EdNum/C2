# 🤖 Mode d'emploi : Simulateur Blue-Bot

Bienvenue dans le guide d'utilisation du **Simulateur Blue-Bot**, une application web interactive conçue pour initier les élèves à la **pensée algorithmique**, au **repérage spatial** et à la **programmation séquentielle**.

Ce simulateur reproduit le comportement du célèbre robot de sol éducatif, permettant aux élèves de s'entraîner virtuellement sur différents tapis, de relever des défis et de créer leurs propres parcours.

---

## 🎯 Intérêts pédagogiques et apports en classe

Le Simulateur Blue-Bot est un outil puissant pour développer des compétences transversales chez l'élève :

*   **Pensée algorithmique et logique :** L'élève apprend à décomposer un problème complexe (aller d'un point A à un point B) en une suite d'instructions simples. Il comprend que la machine exécute *exactement* ce qu'on lui demande, dans l'ordre donné.
*   **Repérage et structuration spatiale :** Contrairement aux déplacements absolus (haut, bas, gauche, droite sur une feuille), le robot utilise un repère **relatif** (avancer, reculer, pivoter sur soi-même). Cela oblige l'élève à se "mettre à la place" du robot (décentration), une compétence spatiale fondamentale.
*   **Anticipation et planification :** L'élève doit prévoir mentalement le trajet complet avant de l'exécuter. Il passe d'une logique d'essai-erreur immédiat à une logique de planification globale.
*   **Analyse d'erreurs (débogage) :** Quand le robot n'arrive pas au but, l'élève doit relire son programme, trouver l'instruction fautive et la corriger. L'erreur devient une simple étape de construction, dédramatisée et constructive.
*   **Flexibilité didactique :** Utilisable en collectif (TBI) pour la découverte, en binômes pour favoriser la verbalisation ("programmeur" / "vérificateur"), ou en autonomie pour l'entraînement.

---

## 🕹️ Comment utiliser le simulateur ?

L'application propose 5 modes de travail (onglets), adaptés à différents objectifs pédagogiques :

### 1. 🧭 Exploration (Mode Libre)
C'est le bac à sable. L'élève place le robot et la cible (le drapeau) où il veut sur le tapis en cliquant sur les cases.
*   **But :** Créer son propre programme pour rejoindre la cible.
*   **Idéal pour :** La prise en main libre, ou pour reproduire un exercice donné sur fiche papier par l'enseignant.

### 2. 🤖 Simulateur (Reproduction de parcours)
L'élève doit programmer le robot pour tracer un chemin précis, indiqué en surbrillance sur le tapis.
*   **But :** Suivre une trajectoire imposée.
*   **Idéal pour :** Travailler la précision et s'assurer que le cheminement exact est respecté.

### 3. 🎮 Pilotage (Défis aléatoires)
Le jeu génère automatiquement une position de départ et une cible. L'élève choisit la difficulté (nombre de mouvements nécessaires).
*   **But :** Résoudre des défis générés à la volée.
*   **Idéal pour :** L'entraînement en autonomie. La difficulté ajustable permet de différencier le travail.

### 4. 📖 Décodage (Lecture de programme)
Le jeu affiche un programme complet. L'élève doit "lire" le code mentalement et cliquer sur la case d'arrivée correspondante.
*   **But :** Inverser la logique : passer de la lecture du code à l'anticipation du résultat.
*   **Idéal pour :** Vérifier la compréhension profonde des instructions (surtout les pivots).

### 5. ✏️ Dessin (Pixel Art)
Le robot agit comme un stylo. Les déplacements dessinent sur la grille.
*   **But :** Créer des formes ou reproduire un modèle en programmant le tracé.
*   **Idéal pour :** Lier géométrie, arts visuels et programmation.

---

## ⌨️ Programmer le robot

Le panneau de contrôle reproduit les touches du vrai Blue-Bot :

| Bouton | Action |
|---|---|
| ⬆️ **Avancer** | Le robot avance d'une case dans la direction où il regarde. |
| ⬇️ **Reculer** | Le robot recule d'une case. |
| ↩️ **Pivoter Gauche** | Le robot tourne de 90° sur lui-même vers *sa* gauche (il reste sur la même case). |
| ↪️ **Pivoter Droite** | Le robot tourne de 90° sur lui-même vers *sa* droite. |
| ⏸️ **Pause** | Ajoute un temps d'arrêt d'une seconde dans le programme. |
| 🗑️ **Effacer (Croix)** | Supprime le **dernier** ordre ajouté. |
| 🔴 **Tout vider (X)** | Efface **tout** le programme actuel. |
| ▶️ **GO !** | Lance l'exécution du programme. |

> 💡 **Astuce :** Vous pouvez supprimer une instruction spécifique en cliquant directement dessus dans la barre de programme en bas de l'écran.

---

## ⚙️ Options et Partage Avancé pour la classe

Le menu **Options** (engrenage ⚙️ en haut à droite) est crucial pour les enseignants. Il permet non seulement de personnaliser l'interface (thème clair/sombre, son, choix du tapis et du skin du robot), mais surtout de **partager des activités sur mesure** avec les élèves.

En cliquant sur **"Partager l'activité"**, puis sur **"Options Avancées"**, vous pouvez générer un lien ou un QR Code qui configure l'application selon vos besoins pédagogiques stricts :

### Options de Partage (Les plus importantes en classe)

*   **Verrouiller l'onglet actuel :** Si vous voulez que les élèves fassent uniquement du "Décodage", cochez cette option. Ils ne verront pas les autres onglets et ne s'éparpilleront pas.
*   **Verrouiller la difficulté actuelle :** Empêche l'élève de changer le niveau de difficulté (par exemple, forcer le niveau "Difficile").
*   **Désactiver les paramètres / tapis :** Empêche les élèves de jouer avec les options visuelles (changer le tapis, le skin du robot) pour garantir leur concentration sur la tâche algorithmique.
*   **Cacher la séquence (Blindcoding) :** *Excellente option pour les élèves avancés.* Le programme est caché. L'élève doit tout planifier mentalement de mémoire. Cela pousse la capacité d'abstraction à son maximum.
*   **Mode "Ramassage" (si activé dans vos options locales) :** Demande de passer sur certains éléments du tapis pour les "récolter".

*(Pour plus de détails sur la procédure de partage, consultez le [Tutoriel de partage](MODE_EMPLOI_PARTAGE.md)).*

---

## 💡 Astuces supplémentaires

*   **Mode Mémoire (Memory Mode) :** Dans les options, vous pouvez activer le mode Mémoire. Comme sur le robot "Tale-Bot", ce mode permet de mémoriser des sous-séquences et de les rejouer avec une seule touche. C'est une excellente initiation aux *fonctions* en programmation.
*   **Mode Collecte :** Si activé, le robot interagit avec les éléments dessinés sur certains tapis (comme le tapis "Formes et Couleurs").
*   **Utilisation hors-ligne :** L'application fonctionne sans connexion Internet une fois chargée dans le navigateur.
*   **Accessibilité :** Les boutons de commande peuvent être activés au clavier (Flèches pour pivoter/avancer/reculer, Espace pour GO, Retour arrière pour effacer).

---

*Faites chauffer les neurones de vos élèves et bon codage ! 🤖🚀*
