# 🔍 Audit Global du Dépôt — Suite Éducation Numérique (C2)

> **Date :** 4 septembre 2026 · **Auditeur :** Antigravity (Google DeepMind)
> **Contexte :** HEP-VS (Animation Pédagogique en Éducation Numérique - AP-EdNum), Valais, Suisse · Dépôt `Animation-EdNum/C2`
> **Périmètre audité :** 
> - 7 webapps élèves de production (`webapps/`)
> - 3 outils enseignant de production (`webapps/teacher/`)
> - 10 webapps alpha élèves (`alpha/webapps/`)
> - 1 outil enseignant alpha (`alpha/webapps/teacher/`)
> - 3 portails d'accueil (`index.html`, `indexC1.html`, `merci.html`)
> - Framework partagé (`assets/css/`, `assets/js/`, `assets/fonts/`, `assets/img/`)
> - CLI autonome (`bin/ednum.js`), Service Worker (`sw.js`)
> - Suites de tests unitaires (`node --test meta/tests/unit/*.js`) et scripts d'intégrité (`meta/scripts/`)
> - Documentation pédagogique (`meta/tuto/`)

---

## 1. Résumé exécutif & Tableau de bord

| Domaine | Score | Évolution | Constats clés |
|---|:---:|:---:|---|
| **Architecture & Vanilla** | **9.9/10** | ⬆ | Architecture sans compilation ni framework lourd à l'exécution. Rendu ultra-rapide (< 100ms), composabilité pure, registre centralisé (`registry.js`). |
| **PWA & 100% Offline** | **9.9/10** | ⬆ | Service Worker autonome avec hash SHA-256 (`ednum-4a6048e3`, 65 ressources). Zéro dépendance CDN externe. Balise `<link rel="root">` présente et exacte sur **24/24 pages (100%)**. |
| **Sécurité & Protection des données** | **9.6/10** | ⬆ | **CSP présente sur 24/24 HTML (100%)**. **0 attribut `onclick` inline** dans tout le code HTML. Sanitisation via DOMPurify. Respect strict LPD/RGPD (aucune donnée élève stockée sur serveur ou pistée). |
| **Accessibilité (a11y) & Design System** | **9.4/10** | ⬆ | Respect WCAG AA. Thèmes clair, sombre et haute visibilité (`high-contrast`). Boutons tactiles conformes (≥ 44×44px). Polices locales adaptées (Outfit, JetBrains Mono, OpenDyslexic). Annonces vocales et toasts `aria-live="polite"`. |
| **Iconographie & Assets** | **9.8/10** | ⬆ | Sous-ensemble FontAwesome local (`fa-subset.js`, 203 icônes). **100% des icônes `data-fa` validées sans omission**. Images de tapis optimisées en WebP (`city.webp`, `valais.webp`). Zéro ressource orpheline ou lien brisé (0 script/style/image 404). |
| **Tests & Assurance Qualité** | **9.8/10** | ⬆ | **111/111 tests unitaires réussis** (progression : 49 en mai ➔ 80 en août ➔ 111 en septembre). Validation automatisée du cache SW (`npm run check:sw`). |
| **Documentation & Pédagogie** | **9.9/10** | ⬆ | **100% de couverture** : 22 guides détaillés d'utilisation (`meta/tuto/MODE_EMPLOI_*.md`) couvrant la totalité des 21 applications et alignés avec le PER et les moyens d'enseignement officiels (*DÉ>CODAGE*, *Connected 3*, *Connected 4*). |

> 🌟 **Score technique global consolidé : 9.7 / 10**

---

## 2. Inventaire exhaustif des applications (21 webapps + 3 portails)

### 2.1 Applications Élèves — Production (`webapps/`)
1. **Codage binaire** (`binaire_codage.html` - 7-8H) : Conversion binaire/décimal, modes entraînement, chrono et défis.
2. **Mots secrets** (`binaire_message.html` - 7-8H) : Encodage et décodage ASCII / binaire.
3. **Pixel Studio** (`binaire_studio.html` - 5-6H) : Dessin bitmap matriciel, formats Noir/Blanc et couleurs, export.
4. **Bit de parité** (`bit_de_parite.html` - 7-8H) : Détection et correction d'erreurs sur matrice de bits (tour de magie informatique).
5. **Générateur de mot de passe** (`generateur_mot_de_passe.html` - 5H-8H) : Sensibilisation à l'entropie et à la robustesse des mots de passe.
6. **Routage réseau** (`routage_reseau.html` - 7-8H) : Simulation de paquets, tables de routage et topologie d'interconnexion.
7. **Simulateur d'automate** (`simulateur_automate.html` - 3-4H) : Programmation de déplacements spatiaux type Blue-Bot sur tapis virtuels (Valais, Ville, etc.).

### 2.2 Outils Enseignant — Production (`webapps/teacher/`)
8. **Générateur de barèmes** (`bareme.html`) : Conversion points/notes scolaire suisse (1 à 6), note 4.0 ajustable, arrondis configurables, export d'impression compacte A4.
9. **Créateur de QR codes** (`qrcode.html`) : Générateur hors-ligne (URL, texte, Wi-Fi, vCard), mode batch (planches d'étiquettes A4 pour la classe), mode projection grand écran / TBI.
10. **Tirage au sort** (`tirage.html`) : Sélection aléatoire sans remise, gestion des absents en direct, confettis festifs, zéro persistance de données nominatives.

### 2.3 Applications Élèves — Alpha (`alpha/webapps/`)
11. **Une chose après l'autre (Tri par insertion)** (`tri_insertion.html` - 10CO) : Algorithme Connected 4, organigramme interactif, cartes de Jass piquet suisse, démo animée avec contrôle de vitesse (Lente / Normale / Rapide).
12. **Apprendre le pseudo-code** (`apprendre_pseudocode.html` - 9CO) : Découverte des structures algorithmiques pas à pas (Connected 3).
13. **Coffre-fort numérique** (`coffre_fort.html` - 3-4H / 5-6H) : Sensibilisation aux données personnelles et à la confidentialité.
14. **Compresseur magique** (`compresseur_magique.html` - 7-8H) : Compression sans perte par encodage RLE (Run-Length Encoding).
15. **Détective IA** (`detective_ia.html` - 7-8H) : Arbres de décision et classification logique.
16. **Dresseur de neurones** (`dresseur_neurones.html` - 7-8H) : Entraînement d'un perceptron/réseau de neurones et illustration du biais d'apprentissage.
17. **Jeu de la grue** (`jeu_de_la_grue.html` - 1-2H) : Empilement logique et séquences de commandes pour le Cycle 1.
18. **Machine à chiffrer** (`machine_a_chiffrer.html` - 7-8H) : Chiffrement par décalage (chiffre de César).
19. **Machine à trier** (`machine_a_trier.html` - 1-2H) : Tri visuel par couleur et forme (Cycle 1).
20. **Réseau de tri** (`reseau_de_tri.html` - 5-6H) : Algorithme de tri parallèle par comparateurs (sorting network).

### 2.4 Outils Enseignant — Alpha (`alpha/webapps/teacher/`)
21. **Lentille de dyslexie & Adaptateur DYS** (`sim_dyslexie.html`) : Simulateur de troubles de la lecture (b/d, flottement, encombrement), moteur phonologique syllabique bicolore, police OpenDyslexic, générateur de fiches adaptées imprimables.

### 2.5 Portails et pages d'accueil
22. **Portail principal Cycle 2 / Cycle 3** (`index.html`) : Filtrage par niveau (1-2H à 10CO), catégories, recherche temps réel, PWA installable.
23. **Portail Cycle 1** (`indexC1.html`) : Interface ultra-visuelle avec pictogrammes larges adaptée aux jeunes élèves (1-4H).
24. **Remerciements et crédits** (`merci.html`) : Mentions légales, licence libre AGPL-3.0, attributions des bibliothèques et crédits HEP-VS.

---

## 3. Résultats des vérifications techniques approfondies

### 3.1 Sécurité & Content Security Policy (CSP)
- **Couverture CSP :** Présente sur **24/24 fichiers HTML** via la balise `<meta http-equiv="Content-Security-Policy">`.
- **Politique appliquée :** `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;`
- **Assainissement des événements :** **0 attribut `onclick="..."` inline** dans l'intégralité du code HTML. Tous les écouteurs sont enregistrés par `addEventListener` ou via des handlers JavaScript programmatiques.
- **Conformité LPD (Suisse) / RGPD :**
  * Zéro collecte de télémétrie ou de cookies de pistage.
  * `tirage.html` conserve les prénoms de la classe exclusivement en mémoire vive (RAM de session) — aucune persistance dans `localStorage` afin de protéger les données des élèves sur ordinateurs partagés.
  * Les clés `localStorage` répertoriées sont strictement techniques (`global_theme`, `c2_audio_muted`, `at_*` pour les états du simulateur Blue-Bot).

### 3.2 Service Worker & PWA Hors-ligne
- **Génération automatisée :** Script `meta/scripts/generate-sw-manifest.js` calculant l'empreinte SHA-256 de tous les assets critiques.
- **État actuel du cache :** Version `ednum-4a6048e3` couvrant 65 ressources essentielles.
- **Validation automatique :** La commande `npm run check:sw` confirme la parité stricte entre le manifest et les fichiers sur disque.
- **Résolution universelle de l'arborescence :** Balise `<link rel="root">` configurée avec exactitude :
  * `./` pour les pages racines (`index.html`, `indexC1.html`, `merci.html`)
  * `../` pour les pages de premier niveau (`webapps/*.html`)
  * `../../` pour le second niveau (`webapps/teacher/*.html`, `alpha/webapps/*.html`)
  * `../../../` pour le troisième niveau (`alpha/webapps/teacher/*.html`)

### 3.3 Cohérence visuelle, Footers et Cartes
- **Footers :** Vérification sur les 24 fichiers HTML. Tous intègrent :
  * Mention AP EdNum, HEP-VS avec lien officiel.
  * Icône cœur avec lien relatif exact vers `merci.html` (`merci.html`, `../merci.html`, `../../merci.html`, `../../../merci.html`).
  * Lien vers le dépôt GitHub public `Animation-EdNum/C2`.
  * Licence libre AGPL-3.0.
  * Positionnement soigné dans les conteneurs de cartes sans débordement vertical excessif.
- **Design System :**
  * Boutons d'onglets unifiés (`.tab-btn`) respectant la palette `#0d9488` (vert émeraude / sarcelle) en état actif.
  * Thème Haute Visibilité (`high-contrast`) validé dans `base.css` avec bordures contrastées et ratios WCAG AAA.

### 3.4 Iconographie & Intégrité des Assets
- **FontAwesome local (`fa-subset.js`) :** 203 icônes vectorielles embarquées sous forme de chaînes SVG brutes.
- **Audit des attributs `data-fa` :**
  * *Correction apportée :* Remplacement de l'icône orpheline `network-wired` par l'icône existante `chart-network` dans `tri_insertion.html` (titre de l'organigramme de tri).
  * Résultat après correction : **100% des icônes référencées dans les 24 fichiers HTML sont présentes** dans le dictionnaire `fa-subset.js`.
- **Intégrité des fichiers :**
  * **0** script introuvable (404).
  * **0** feuille de style introuvable (404).
  * **0** image ou référence CSS `url(...)` cassée.

### 3.5 Suite de tests unitaires
- Exécution de `npm run test:unit` (`node --test meta/tests/unit/*.js`) :
  * 11 suites de tests exécutées.
  * **111 tests passés avec succès / 111 (100% de réussite)** en ~12 secondes.
  * Composants testés : audio Web Audio API, simulateur automate, codage binaire, moteur de confettis, générateur de mots de passe, portail & registre, score manager, algorithme de mélange de Fisher-Yates, thèmes & haute visibilité, système de toasts accessibles, gestion des formulaires.

---

## 4. Points d'attention & Opportunités d'amélioration

Bien que le projet atteigne un niveau exceptionnel de maturité et de robustesse, voici quelques suggestions d'optimisation pour les futures versions :

1. ✅ **Guide pédagogique pour le Générateur de mot de passe (Résolu) :**
   - Le guide dédié [`meta/tuto/MODE_EMPLOI_GENERATEUR_MOT_DE_PASSE.md`](../tuto/MODE_EMPLOI_GENERATEUR_MOT_DE_PASSE.md) a été rédigé et intégré, portant la couverture de documentation à 100% (22 guides pour 21 webapps + guide de partage).

2. **Extraction progressive des scripts inline :**
   - Plusieurs webapps intègrent leur logique JavaScript directement dans un bloc `<script>` en bas de page HTML. Déplacer progressivement cette logique vers des fichiers `.js` dédiés dans `assets/js/` permettrait à terme de durcir la CSP en retirant la directive `'unsafe-inline'` de `script-src`.

3. **Intégration d'un script de test E2E Node.js natif :**
   - Les tests E2E existants s'appuient sur `pytest` (Python). Comme le projet dispose désormais de Playwright et JSDOM dans `devDependencies` de `package.json`, l'ajout d'un runner E2E en Node.js pur permettrait de lancer les tests de bout en bout sans dépendance Python sur la machine de développement.

---

## 5. Certification de l'audit

Le dépôt **`Animation-EdNum/C2`** est dans un état technique irréprochable :
- ✅ **100% Hors-ligne / PWA autonome**
- ✅ **111/111 tests unitaires validés**
- ✅ **Zéro fuite de données nominatives (Privacy by Design)**
- ✅ **Code 100% libre sous licence AGPL-3.0**
- ✅ **Cohérence visuelle et ergonomique respectée sur les 21 webapps**
