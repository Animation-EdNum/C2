# 🛠️ Mode d'emploi : Outils Enseignants & Inclusion

Portail des utilitaires pratiques pour les enseignant·e·s de la **Suite EdNum** : barème de notes, tirage au sort équitable, et simulateur de troubles d'apprentissage.

Tous ces outils fonctionnent **100% hors-ligne**, sans publicité, sans inscription, sans collecte de données personnelles sur serveur (stockage exclusivement local sous responsabilité pédagogique de l'enseignant·e, conformité LIPDA / LPD / RGPD), et sont distribués sous licence libre **AGPL-3.0**.

---

## Guides détaillés

| Outil | En bref | Guide |
|---|---|---|
| ⏱️ **Minuteur visuel** | Minuteur visuel circulaire 0-60 min, décompte sans stress, usage 1-clic et mode TBI | [Ouvrir le guide](MODE_EMPLOI_TIME_TIMER.md) |
| 📊 **Générateur de Barèmes** | Table de conversion points → notes (échelle suisse 1 à 6), seuil du 4.0 ajustable, -fautes, export image PNG, copie et impression | [Ouvrir le guide](MODE_EMPLOI_BAREME.md) |
| 🎲 **Tirage au Sort** | Désignation aléatoire équitable, modes Nombres et Noms, import ENT (XLS/CSV), export .txt, TBI et partage par lien web | [Ouvrir le guide](MODE_EMPLOI_TIRAGE_AU_SORT.md) |
| 🎡 **Roue de la chance** | Roue interactive personnalisable, métiers, privilèges, tirage 1 à N et mode TBI | [Ouvrir le guide](MODE_EMPLOI_ROUE_DE_LA_CHANCE.md) |
| 📱 **Créateur de QR Codes** | Générateur rapide de QR codes (liens, textes, Wi-Fi, planches imprimables, TBI) | [Ouvrir le guide](MODE_EMPLOI_QRCODE.md) |
| 👓 **Adaptateur & Simulateur DYS** | Aménagements de texte (Zorzi, CERAS, sons, lettres muettes grisées), édition directe, profils élèves, export Word (.docx) et sensibilisation sans neuromythe | [Ouvrir le guide](MODE_EMPLOI_SIMULATEUR_DYSLEXIE.md) |
| 🛡️ **Anonymiseur de texte** | Anonymisation, pseudonymisation et protection des données élèves pour l'IA | [Ouvrir le guide](MODE_EMPLOI_ANONYMISEUR.md) |

---

### 📊 Générateur de Barèmes

*Calculez instantanément la grille de notation de vos évaluations.*

- Courbe linéaire standard ou bi-linéaire avec seuil du 4.0 ajustable (en % ou en points).
- Choix de l'arrondi : au dixième, au quart de note, au demi-point ou à l'unité.
- Option « Afficher les points perdus (-fautes) » pour une correction rapide.
- Exports multiples : copie tabulaire vers Excel/Sheets, image PNG nette et impression / PDF sur une page A4.
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_BAREME.md)

---

### 🎲 Tirage au Sort

*Désignez un·e élève ou un numéro au hasard de manière ludique et incontestable.*

- Deux modes : Nombres (1 à N) ou Noms d'élèves.
- Importation en 1 clic de listes de classe (fichiers ENT XLS, XLSX, CSV ou texte via SheetJS) et export .txt.
- Grille interactive des participants avec statut en direct et mode sans remise.
- Animation festive avec confettis, historique horodaté, mode plein écran TNI/TBI et partage par lien URL.
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_TIRAGE_AU_SORT.md)

---

### 📱 Créateur de QR Codes

*Partagez facilement des liens, des textes ou le Wi-Fi de la classe sans taper d'URL.*

- Modes URL, texte libre, connexion Wi-Fi instantanée ou génération de planches multiples (batch).
- Personnalisation : palette de couleurs, taille de rendu, niveau de correction d'erreurs (ECC).
- Export flexible : copie directe de l'image PNG dans le presse-papier, téléchargement HD, ou impression A4 avec traits de découpe.
- Mode projection TBI : affichage plein écran adapté au tableau blanc interactif.
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_QRCODE.md)

---

### 🎡 Roue de la chance

*Tirages au sort dynamiques et ludiques pour la vie de classe.*

- Présélections prêtes à l'emploi : métiers et responsabilités de classe, privilèges scolaires, questions d'éducation numérique.
- Générateur automatique de nombres de 1 à N selon l'effectif d'élèves.
- Liste personnalisée sauvegardée automatiquement en local (`localStorage`).
- Mode plein écran adapté au tableau blanc interactif (TBI).
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_ROUE_DE_LA_CHANCE.md)

---

### 👓 Adaptateur & Simulateur DYS

*Adaptez facilement les textes pour vos élèves et sensibilisez à la dyslexie.*

- Boîte à outils complète d'adaptation de texte : espacement Zorzi, coloration des graphèmes CERAS, découpage syllabique bicolore, sons & lettres muettes grisés, choix de polices (Outfit, Century Gothic, OpenDyslexic, Verdana).
- Édition directe du texte sur la fiche (*in situ*), profils en 1 clic et enregistrement de profils personnalisés par élève.
- Export direct au format Word (.docx) modifiable et impression propre au format A4.
- Simulateur d'effort de décodage et scénario de sensibilisation sans neuromythe pour parents et élèves.
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_SIMULATEUR_DYSLEXIE.md)

---

### 🛡️ Anonymiseur de texte

*Protégez les données personnelles de vos élèves avant d'utiliser une IA.*

- 3 modes de traitement : étiquettes numérotées (`[Élève 1]`), pseudonymes cohérents ou caviardage textuel.
- 9 filtres de détection automatique (prénoms fréquents, emails, téléphones, dates, AVS suisse, adresses, etc.).
- Importation rapide de liste de classe (fichiers ENT XLS, XLSX, CSV) avec reconnaissance des noms et prénoms.
- Action « Copier pour IA » (Ctrl+Shift+I) intégrant un prompt pédagogique contextualisé.
- 👉 [Lire le mode d'emploi complet](MODE_EMPLOI_ANONYMISEUR.md)

---

## 🔒 Confidentialité

Les noms de vos élèves et vos résultats d'évaluations ne quittent **jamais** votre appareil. Tout s'exécute dans le navigateur, même sans connexion Internet.
