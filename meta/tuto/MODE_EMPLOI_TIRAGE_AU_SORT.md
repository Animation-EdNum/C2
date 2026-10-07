# 🎲 Mode d'emploi : Tirage au Sort

Le **Tirage au Sort** désigne un·e élève ou un numéro au hasard de manière ludique, transparente et équitable. Idéal pour interroger, attribuer des rôles ou former des groupes sans contestation.

100% hors-ligne · Aucune donnée transmise · Sauvegarde locale automatique (`localStorage`) · Mode projection TNI/TBI.

---

## Pourquoi cet outil ?

- **Équité absolue :** Chaque participant·e a strictement la même probabilité d'être tiré·e. Fini le biais involontaire d'interroger toujours les mêmes.
- **Engagement du groupe :** L'animation de roulement crée un court suspense collectif qui capte l'attention de la classe.
- **Deux modes polyvalents :** Tirage de numéros (1 à N) pour les manuels ou jeux, ou tirage nominal d'élèves pour la vie de classe.
- **Importation Swiss ENT / ISM :** Chargez votre liste de classe officielle au format Excel (`.xlsx`, `.xls`), `.csv` ou texte en un seul clic.

---

## 1. Deux modes de tirage

L'écran de configuration propose deux onglets :

| Mode | Usage pédagogique type | Configuration |
|---|---|---|
| 🔢 **Nombres** | Tirer un numéro d'exercice, une page de livre, un dé mathématique. | Indiquez le nombre total de participants (ex. `24`). Les numéros vont de $1$ à $N$. |
| 👥 **Noms** | Interroger un élève, attribuer une responsabilité, passage d'exposé. | Saisissez la liste de vos élèves ou importez votre fichier de classe. |

---

## 2. Configuration et importation des élèves

### Saisie manuelle & Sauvegarde locale
- Tapez ou collez vos prénoms dans la zone de texte.
- Séparateurs acceptés : **retour à la ligne** ou **virgule**.
- La liste est automatiquement mémorisée dans votre navigateur (`localStorage`) : elle est prête dès votre prochaine visite sans réimportation.

### Importation en 1 clic (XLS, XLSX, CSV, TXT)
- Cliquez sur le bouton **« Importer (XLS/CSV) »** ou glissez-déposez directement votre fichier dans la zone de texte.
- L'outil intègre la bibliothèque locale `SheetJS` pour extraire automatiquement les prénoms depuis les exports de logiciels scolaires cantonaux.
- Cliquez sur **« Exporter (.txt) »** pour télécharger une sauvegarde propre de la liste active.

---

## 3. Déroulement du tirage

1. Cliquez sur le bouton principal **« Démarrer le tirage »**.
2. L'interface bascule en phase de tirage avec la **Grille des participants** affichant tous les badges.
3. Appuyez sur **« Tirer au sort »** (ou touche `Entrée` / `Espace` au clavier) :
   - Un défilement animé parcourt les candidats.
   - Le prénom ou numéro sélectionné s'affiche en grand avec une pluie de confettis 🎉.
   - Son badge passe en statut *« tiré »* dans la grille.
4. **Tirage sans remise :** L'élève ou numéro tiré est exclu des tours suivants jusqu'à ce que tout le monde soit passé.
5. Une fois tous les participants tirés, un message indique *« Tirage terminé ! »*.
6. Cliquez sur **« Réinitialiser »** dans la barre d'outils pour démarrer un nouveau cycle sans remise, ou sur **« Modifier »** pour revenir à la configuration.

---

## 4. Historique et partage

- **Historique horodaté :** Un panneau latéral conserve l'ordre chronologique exact des passages.
- **Copier l'historique :** Cliquez sur l'icône de copie pour coller la liste ordonnée des passages dans votre journal de classe ou bloc-notes.
- **Partager par lien web :** Cliquez sur l'icône de partage 🔗 pour générer une URL intégrant directement votre liste ou configuration afin de l'ouvrir sur un autre ordinateur.

---

## 5. Barre d'outils & Raccourcis

| Réglage | Rôle |
|---|---|
| 📺 **Mode TNI/TBI** | Agrandit les éléments au maximum pour une lisibilité parfaite depuis le fond de la salle. |
| 🌙 **Thème clair / sombre** | Adapte le contraste à la luminosité de la classe ou au vidéoprojecteur. |
| 🔊 **Son on / off** | Active ou coupe les bruitages festifs et les annonces sonores. |
| `Entrée` ou `Espace` | Déclencher le tirage au sort suivant. |
| `Échap` | Revenir à la vue normale / fermer le plein écran. |