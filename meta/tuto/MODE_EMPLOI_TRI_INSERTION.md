# 🃏 Mode d'emploi : Une chose après l'autre — Tri par insertion

**Une chose après l'autre** est une simulation interactive du **tri par insertion** (*Insertion Sort*) spécialement conçue pour les élèves de **10CO (Cycle 3)**, en lien direct avec l'activité 1C du moyen d'enseignement romand **Connected 4** (*Concours d'algorithmes*, pages 12-13).

---

## 🎯 Objectifs pédagogiques

- **Comprendre le fonctionnement d'un algorithme classique de tri :** Découvrir comment insérer chaque nouvel élément à sa juste place dans une liste déjà ordonnée.
- **Suivre et exécuter un organigramme (schéma algorithmique) :** Associer chaque action concrète (piocher, comparer, permuter) au bloc correspondant dans le schéma (début/fin, action, test conditionnel).
- **Aborder la notion de complexité algorithmique :** Compter le nombre de comparaisons nécessaires pour trier un ensemble de données et comprendre le concept de **cas moyen** (*average case*).
- **Faire le lien entre activité débranchée et simulation numérique :** Prolonger l'expérience vécue en classe par une modélisation dynamique et auto-corrective.

---

## 🃏 Les cartes de Jass (Jeu de Piquet suisse)

Pour ancrer l'activité dans le quotidien des élèves suisses romands, le jeu utilise les cartes de Jass traditionnelles (enseignes françaises : Cœur ♥, Carreau ♦, Pique ♠, Trèfle ♣) :
- Valeurs numériques : **6, 7, 8, 9, 10**
- Figures : **Valet (V = 11), Dame (D = 12), Roi (R = 13), As (A = 14)**
- Règle de tri : du plus petit au plus grand (ordre croissant : `6 < 7 < 8 < 9 < 10 < V < D < R < A`).

---

## ⚙️ Les 2 modes d'utilisation

### 1. Mode Manuel (Interactif par défaut)
- L'élève joue le rôle du programme et du robot :
  1. Il clique sur la pioche pour tirer une carte.
  2. La carte est placée à l'extrême droite de sa main.
  3. L'élève compare la nouvelle carte avec celle située immédiatement à sa gauche.
  4. Il répond à la question : *« Cette carte a-t-elle une valeur plus haute que la nouvelle carte ? »*
     - **Oui, permuter :** les deux cartes échangent leur place, puis l'examen continue vers la gauche.
     - **Non, laisser ici :** la carte est insérée au bon endroit, on retourne à la pioche.
- En cas d'erreur de comparaison, un message bienveillant explique la valeur des deux cartes et guide l'élève.

### 2. Mode Démo automatique
- L'algorithme s'exécute de manière autonome en suivant pas à pas l'organigramme.
- **Réglage de la vitesse d'exécution :**
  - **Lente (2,2 s) :** Idéal pour commenter en direct chaque étape avec la classe, faire verbaliser les élèves ou leur poser des questions prédictives (*« D'après vous, va-t-on permuter ou non ? »*).
  - **Normale (1,1 s) :** Vitesse par défaut, fluide et naturelle pour observer le rythme du tri.
  - **Rapide (0,45 s) :** Pour visualiser rapidement le résultat final, particulièrement utile sur 8 ou 12 cartes.
- Les élèves peuvent observer l'organigramme s'allumer en temps réel à chaque étape (nœud actif surligné en jaune/ambre avec halo lumineux).
- Idéal pour une projection collective au tableau interactif (TBI) lors de la mise en commun en classe.

---

## 📊 Paramètres et statistiques

- **Nombre de cartes :**
  - **8 cartes :** Configuration officielle du manuel *Connected 4* (moyenne théorique d'environ 14 comparaisons).
  - **5 cartes :** Format rapide pour découvrir la logique (~6 comparaisons).
  - **12 cartes :** Défi avancé pour constater l'augmentation non linéaire du temps de tri (~33 comparaisons).
- **Compteurs en temps réel :**
  - **Comparaisons :** Chaque question posée incrémente le compteur.
  - **Permutations :** Nombre d'échanges effectifs de positions entre deux cartes.
- **Écran de victoire :** Met en regard le score obtenu par l'élève avec la moyenne théorique de la classe, illustrant la citation de la page 12 de *Connected 4*.

---

## 🏫 Démarche pédagogique recommandée en classe

1. **Phase 1 — Jeu de rôle débranché en binôme (pages 12-13) :**
   - L'élève 1 joue le **Robot de tri** : il manipule les 8 cartes faces cachées, sans voir le schéma.
   - L'élève 2 joue le **Programme** : il suit rigoureusement l'organigramme de la page 13 et donne les ordres.
   - À chaque question posée, les élèves tracent un trait de comptage sur leur fiche.
2. **Phase 2 — Collecte collective et moyenne de classe :**
   - L'enseignant note au tableau les scores de tous les duos et calcule la moyenne de la classe (proche de 14).
   - Discussion sur la notion de complexité en moyenne et sur le temps nécessaire pour trier de grandes bases de données.
3. **Phase 3 — Consolidation individuelle ou en remédiation avec la Webapp :**
   - Chaque élève lance la webapp pour vérifier sa maîtrise de l'organigramme.
   - Le mode interactif valide le respect strict des étapes et renforce la compréhension du test d'arrêt de la boucle.
