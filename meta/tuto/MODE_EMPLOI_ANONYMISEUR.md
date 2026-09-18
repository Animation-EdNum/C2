# 🛡️ Mode d'emploi : Anonymiseur de texte

L'**Anonymiseur de texte** est un outil professionnel conçu pour permettre aux enseignant·e·s de masquer, baliser ou pseudonymiser instantanément toute information personnelle identifiable contenue dans des textes scolaires (bulletins, observations d'élèves, bilans, courriels, rédactions) avant de les traiter avec une intelligence artificielle générative (ChatGPT, Claude, Gemini, Copilot, etc.) ou de les partager.

L'application fonctionne **100% en local dans le navigateur** : aucun texte, nom ou fichier n'est jamais envoyé sur un serveur ou un réseau externe.

---

## 🎯 Pourquoi anonymiser avant d'utiliser une IA ?

Les modèles d'IA générative grand public peuvent mémoriser, réutiliser pour leur entraînement ou faire fuiter involontairement des données transmises dans les requêtes (*prompts*). Les informations scolaires relèvent de la sphère privée et sont strictement encadrées par la législation suisse sur la protection des données (LPD et lois cantonales).

### Les 3 règles d'or de l'enseignant·e pour l'IA

1. **Jamais de données identifiantes :** Aucun nom de famille, prénom, date de naissance, adresse postale, numéro AVS ou coordonnée personnelle ne doit être transmis à une IA tierce.
2. **Principe de minimisation :** Ne soumettre que les faits strictement nécessaires à l'analyse pédagogique demandée, sans détails de vie privée superflus.
3. **Vérification humaine :** Relire attentivement le texte avant envoi et conserver un regard critique sur toute réponse générée par l'IA.

---

## 1. Les 3 modes de remplacement

La barre d'outils supérieure permet de choisir la stratégie d'anonymisation selon votre usage :

| Mode | Effet dans le texte | Exemple | Idéal pour |
|---|---|---|---|
| 🏷️ **Étiquettes** *(défaut)* | Remplace chaque donnée par une balise explicite et numérotée | `[Élève 1]`, `[Élève 2]`, `[Email]`, `[Téléphone]` | Analyses de classe, grilles de compétences, bilans formels. |
| 👤 **Pseudonymes** | Remplace par des prénoms et noms francophones réalistes et cohérents | *Lucas Dupont* devient *Alexandre Martin* partout | Conserver la fluidité syntaxique et le naturel du texte pour l'IA. |
| ⬛ **Caviardage** | Masque les informations sous des barres noires opaques | `████████` | Affichage public, impressions confidentielles, archivage. |

> **Cohérence garantie :** Dans les modes *Étiquettes* et *Pseudonymes*, une même personne conserve le même identifiant ou le même pseudonyme d'un bout à l'autre du document.

---

## 2. Les 9 filtres de détection automatique

En cliquant sur **« Filtres & Liste de classe »**, vous accédez au panneau de configuration des détections. Chaque filtre peut être activé ou désactivé individuellement :

| Filtre | Ce qui est détecté et masqué |
|---|---|
| 👥 **Élèves de ma classe** | Détection prioritaire basée sur votre liste de classe (gère prénoms seuls, noms complets et inversions). |
| 👤 **Prénoms fréquents & Civilités** | Dictionnaire de prénoms suisses romands fréquents et formules de politesse (M., Mme, Monsieur, Madame). |
| ✉️ **Adresses email** | Tous domaines de messagerie, y compris les adresses institutionnelles (`@edu.vs.ch`, `@eduvd.ch`...). |
| 📞 **Numéros de téléphone** | Formats suisses mobiles et fixes (07x, 02x, +41) ainsi que formats internationaux. |
| 📅 **Dates de naissance & Âges** | Formats suisses (`jj.mm.aaaa`, `jj/mm/aaaa`), mentions textuelles (*« né le 14 mai 2014 »*, *« âgé de 11 ans »*). |
| 🪪 **Numéros AVS suisses** | Numéro de sécurité sociale officiel suisse à 13 chiffres (`756.xxxx.xxxx.xx`). |
| 📍 **Adresses & NPA suisses** | Rues, avenues, chemins, numéros de bâtiment, codes postaux suisses à 4 chiffres et localités. |
| 🏫 **Classes & Établissements** | Degrés scolaires HarmoS (1H à 11CO), cycles (Cycle 1, Cycle 2, CO) et centres scolaires. |
| 💳 **IBAN & Comptes** | Coordonnées bancaires suisses et internationales. |

Des boutons **« Tout cocher »** et **« Tout décocher »** permettent d'adapter rapidement les filtres à votre contexte.

---

## 3. Liste de classe et importation (Swiss ENT / ISM)

Pour garantir une détection sans faille de tous vos élèves (y compris les prénoms rares ou originaux) :

1. Cliquez sur **« Filtres & Liste de classe »**.
2. Dans le champ **« Liste des élèves de votre classe »**, saisissez vos élèves séparés par des virgules ou des retours à la ligne.
3. **Importation en 1 clic :** Cliquez sur **« Importer (XLS/CSV) »** ou glissez-déposez directement le fichier d'exportation de votre logiciel scolaire cantonal (XLS, XLSX, CSV, TSV ou TXT). L'application extrait automatiquement les noms et prénoms sans rien envoyer sur internet.
4. Cliquez sur **« Mémoriser »** pour enregistrer la liste dans votre navigateur pour vos futures sessions.

> **Reconnaissance intelligente des patronymes :**
> L'algorithme prend en compte les prénoms composés (*Jean-Pierre*), les noms avec particule (*de*, *van*, *di*), les inversions fréquentes de l'administration scolaire (*« Dupont Lucas »* ↔ *« Lucas Dupont »*) et attribue automatiquement une étiquette unique par élève.

---

## 4. Contrôle humain et affinage en direct

L'interface présente un espace de travail en vis-à-vis :
- **À gauche :** Le texte original saisi ou collé via le bouton **« Coller »**.
- **À droite :** Le texte anonymisé en temps réel avec le compteur de données masquées.

### Corriger une fausse détection en 1 clic
Si l'application masque un mot qui n'est pas une donnée confidentielle (par exemple un toponyme ou un mot courant homonyme d'un prénom) :
- **Cliquez directement sur l'étiquette colorée** dans le panneau de droite.
- Le terme redevient immédiatement visible dans le texte et est ajouté à la liste des termes ignorés pour la session.
- Un bouton **« Rétablir les exclusions »** permet de réactiver toutes les détections d'un clic si nécessaire.

---

## 5. Exportation et utilisation avec l'IA

Trois options d'action rapide sont disponibles en haut du panneau de résultat :

1. 📋 **Copier (Ctrl+Shift+C) :** Copie le texte anonymisé brut dans votre presse-papiers.
2. ✨ **Copier pour IA (Ctrl+Shift+I) :** Prépare un prompt pédagogique optimisé prêt à l'emploi. Il intègre le texte anonymisé précédé d'une consigne contextualisant pour l'IA que les identifiants (`[Élève 1]`, etc.) sont des pseudonymes anonymisés, évitant que l'IA ne bloque ou ne s'interroge sur les noms.
3. 💾 **Télécharger (.txt) :** Exporte le résultat sous forme de fichier texte propre.

---

## 6. Confidentialité et sécurité technique

- **Zéro réseau :** L'analyse textuelle est exécutée intégralement par le moteur JavaScript interne de votre navigateur.
- **Zéro stockage externe :** Les listes et textes restent cantonnés à la mémoire de votre appareil.
- **Licence libre AGPL-3.0 :** Code source transparent, auditable et disponible sur le [dépôt GitHub de la Suite EdNum](https://github.com/Animation-EdNum/C2).
