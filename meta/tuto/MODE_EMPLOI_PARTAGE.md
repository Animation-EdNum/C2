# 🔗 Mode d'emploi : Partager une activité

Le module de partage de la **Suite EdNum** permet de préparer une activité avec des réglages précis (mode, difficulté, tapis, restrictions, accessibilité) et de la transmettre aux élèves via un lien direct ou un QR Code imprimable / projetable.

---

## 1. Ouvrir la fenêtre de partage

1. Cliquez sur l'icône **Engrenage ⚙** (en haut à droite).
2. Sélectionnez **« Partager l'activité »** (ou cliquez sur le bouton de partage dédié).

L'URL générée contient automatiquement le mode et la difficulté en cours.

### Boutons d'exportation

| Bouton | Action |
|---|---|
| ↗ **Tester le lien** | Ouvre l'activité dans un nouvel onglet pour vérifier le rendu élève. |
| 📋 **Copier** | Copie l'URL complète dans le presse-papiers. |
| 📱 **QR** | Affiche le QR Code à l'écran pour projection au TBI. |
| 💾 **Télécharger le QR** | Télécharge l'image PNG du QR Code pour vos fiches de travail. |

---

## 2. Profils rapides (Presets pédagogiques)

Trois profils en un clic pour configurer l'activité selon l'intention pédagogique :

| Profil | Intention | Réglages appliqués |
|---|---|---|
| 🎯 **Mission** | *« Mes élèves font exactement ce que j'ai préparé. »* | Verrouille la difficulté + force le mode sélectionné + masque les réglages + retire le lien d'accueil. |
| 🏋️ **Entraînement** | *« Je leur donne l'outil, ils s'entraînent à leur rythme. »* | Force le mode sélectionné + retire le lien d'accueil + laisse la difficulté libre. |
| 🫶 **Inclusif** | *« J'ai un·e élève DYS, TSA ou non-latéralisé·e dans le groupe. »* | Contraste élevé + son coupé + commandes colorées + retire le lien d'accueil. |

---

## 3. Options avancées détaillées

Cliquez sur **« Options Avancées »** dans la modale pour affiner la configuration :

### 🎨 Apparence & Confort
- **Contraste élevé (`&highContrast=1`) :** Thème sombre à fort contraste (WCAG AA).
- **Pas de son (`&noAudio=1`) :** Coupe les bruitages pour préserver le calme en classe.
- **Commandes colorées (`&coloredCmds=1`)** *(Automate)* : Boutons directionnels colorés pour élèves non latéralisés.
- **Couleurs de poids (`&coloredWeights=1`)** *(Routage)* : Pastilles colorées selon la vitesse du lien.
- **Masquer les instructions (`&noInstructions=1`) :** Retire le texte explicatif sous le titre.
- **Pas de quadrillage (`&hideGrid=1`)** *(Automate)* : Supprime les lignes pour corser l'évaluation des distances.

### 🧠 Pédagogie & Démarche
- **Partager ma grille personnalisée** *(Automate)* : Transmet la taille, les obstacles, le trésor et l'orientation créés au clavier.
- **Mode aveugle / Blindcoding (`&blindcode=1`) :** Masque la séquence programmée pour un défi de mémoire pure.
- **Pas de dictionnaire ASCII (`&hideDict=1`)** *(Mots secrets)* : Masque l'alphabet binaire d'aide.
- **Mode strict (`&strictMode=1`)** *(Bit de parité)* : Aucun indice en temps réel, validation d'un bloc.
- **Mode Couleurs (`&colorMode=1`)** *(Pixel Studio)* : Force le mode 4 couleurs (2 bits/pixel).

### 🔐 Restrictions d'interface
- **Difficulté verrouillée (`&lockDiff=1`) :** Empêche l'élève de changer de niveau.
- **Mode unique (`&only=1`) :** Masque la barre d'onglets.
- **Pas de lien accueil (`&noHome=1`) :** Supprime le bouton de retour au menu général.
- **Pas de réglages (`&noSettings=1`) :** Supprime l'icône d'engrenage.
- **Tapis imposé (`&forceMat=nom`)** *(Automate)* : Charge un tapis spécifique (ex. `city`, `space`).

---

## 4. Paramètres d'URL experts (Ajout manuel)

| Paramètre | Effet |
|---|---|
| `&noDrag=1` | Remplace le glisser-déposer par le clic successif (idéal TBI peu précis ou motricité fine). |
| `&seed=1234` | Fixe la graine aléatoire pour obtenir exactement la même grille sur tous les postes. |
| `&importGrid=0110…` | Précharge un dessin binaire dans l'éditeur Pixel Studio. |
| `&noNudges=1` | Désactive les bulles d'onboarding animées au démarrage. |

---

## 5. Comment diffuser en classe

1. Choisissez vos options ou un profil rapide dans la fenêtre de partage.
2. Cliquez sur **« 💾 Télécharger le QR »** pour l'intégrer dans votre fiche de cours, ou affichez-le en grand au TBI.
3. Les élèves scannent le QR Code avec leur tablette : l'activité s'ouvre configurée à l'identique, prête à l'emploi.

---

*Documentation de la Suite EdNum — AP EdNum (HEP-VS) sous licence libre AGPL-3.0.*