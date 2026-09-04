# 🔑 Mode d'emploi : Générateur & Testeur de mot de passe

**Générateur de mot de passe** est une application interactive de cyberhygiène conçue pour le Cycle 2 (5H-8H) et le Cycle 3 (9CO-11CO). Elle permet aux élèves de comprendre ce qui fait la force d'un mot de passe, de s'approprier une méthode mnémotechnique robuste (« la méthode des blocs ») et de tester en temps réel la résistance de leurs clés d'accès face aux attaques informatiques.

Alignement programme : Cycle 2 et Cycle 3 · Environnement numérique de travail (*edu.vs.ch*), Éducation numérique (Sécurité, Vie privée, Usages).

---

## Pourquoi cet outil ?

- **Résoudre le dilemme de l'élève :** Comment créer un mot de passe *facile à retenir* pour un enfant de 9 à 14 ans, mais *impossible à deviner* pour des pirates ou des ordinateurs surpuissants ?
- **Comprendre la mécanique des attaques :** Visualiser la différence entre une attaque par dictionnaire (mots du langage courant) et une attaque par force brute (combinaisons mathématiques exhaustives).
- **Adopter de bonnes habitudes dès l'école primaire :** Se connecter à son compte scolaire cantonal, son messagerie ou ses plateformes d'apprentissage sans utiliser des mots de passe triviaux (*123456*, *chocolat*, *pokemon*).
- **Garantie 100% respect de la vie privée :** Aucun mot de passe saisi ne quitte l'appareil. Tout calcul est réalisé localement dans le navigateur, même hors-ligne.

---

## 1. Vue d'ensemble des 3 modes

L'application propose trois onglets complémentaires :

| Mode | Objectif pédagogique | Ce que fait l'élève |
|---|---|---|
| 🪄 **Créer un mot de passe** | S'approprier une méthode de construction mémorisable et personnalisée. | Remplit 4 blocs simples et génère un mot de passe unique par service. |
| 🧪 **Tester un mot de passe** | Auditer la robustesse d'un mot de passe et identifier ses failles. | Tape un mot de passe libre et observe la jauge de sécurité et les avertissements. |
| 🛡️ **Bonnes pratiques** | Synthétiser les règles fondamentales de sécurité numérique. | Découvre et mémorise les 4 règles d'or de protection des comptes. |

---

## 2. Mode 1 : 🪄 Créer un mot de passe (La méthode des blocs)

Pour éviter les mots de passe trop simples ou les suites aléatoires impossibles à retenir, l'application guide l'élève dans **la méthode des blocs de construction** :

```
[ Mot de base ] + [ Nombre ] + [ Symbole ] + [ Service ]
    LiCorne         2026           !            inst     ➜  LiCorne2026!inst
```

### Les 4 ingrédients indispensables :
1. **Mot de base (min. 4 lettres) :** Un mot familier pour l'élève (animal, objet, lieu, passion). Une majuscule est automatiquement suggérée ou requise pour casser l'uniformité.
2. **Nombre (1 à 4 chiffres) :** Une année marquante ou un nombre fétiche (ex. `2026`, `42`).
3. **Nom du site ou service :** Le nom de la plateforme ciblée (ex. *scratch*, *teams*, *instagram*). L'application prélève automatiquement les **4 premières lettres** du service (ex. `scra`, `team`, `inst`). Cela garantit que l'élève utilise un mot de passe **différent pour chaque compte**, tout en retenant la même formule !
4. **Caractère spécial :** Un symbole de ponctuation (`!`, `@`, `#`, `$`, `%`, `+`) pour bloquer les attaques automatisées.

### Paramètres complémentaires :
- **Curseur de longueur minimale (6 à 24 caractères) :** Permet de prolonger la robustesse du mot de passe en répétant intelligemment le mot de base si nécessaire.
- **Réorganisation des blocs :** L'élève peut intervertir l'ordre des éléments (par glisser-déposer ou avec les boutons fléchés ← / →), par exemple : `[Service] + [Mot] + [Symbole] + [Nombre]`.
- **Visualisation par blocs colorés :** Le résultat s'affiche sous forme de pastilles colorées distinctes, permettant à l'élève d'identifier visuellement chaque composant de sa formule.
- **Copie et masquage :** Un bouton œil permet de masquer le mot de passe (affichage par points) ou de le copier dans le presse-papier.

---

## 3. Mode 2 : 🧪 Tester un mot de passe (Audit en direct)

Ce laboratoire permet à l'élève de saisir n'importe quel mot de passe (ou ceux qu'il a l'habitude d'utiliser) pour comprendre comment un pirate informatique l'analyserait.

### 📏 Checklist de validation des critères
L'interface vérifie dynamiquement 5 règles fondamentales :
- ✅ **Longueur :** Au moins 12 caractères (norme moderne de sécurité).
- ✅ **Diversité des types de caractères (au moins 3 sur 4) :**
  - 🔠 Au moins une lettre **MAJUSCULE** (A-Z)
  - 🔤 Au moins une lettre **minuscule** (a-z)
  - 🔢 Au moins un **chiffre** (0-9)
  - 🔣 Au moins un **caractère spécial** (!, @, #, $, etc.)

### ⚠️ Détection automatique des motifs faibles
L'algorithme analyse le texte et affiche des alertes pédagogiques en cas de pièges classiques :
- **Mots du dictionnaire trop fréquents :** `password`, `motdepasse`, `chocolat`, `soleil`, `secret`, `pokemon`, etc.
- **Suites évidentes de touches ou de chiffres :** `1234`, `azerty`, `qwerty`, `abcd`.
- **Répétitions de caractères consécutifs :** `aaa`, `111`, `!!!`.

### ⏱️ Jauge SVG et estimation du temps de craquage
Une jauge semi-circulaire colorée classe le mot de passe :
- 🔴 **Vulnérable / Faible :** Moins de 8 caractères ou motifs triviaux.
- 🟡 **Moyen :** 8 à 11 caractères avec bonne variété, mais vulnérable à une attaque distribuée.
- 🟢 **Fort / Invulnérable :** 12 caractères et plus, sans motif prévisible.

Le temps estimé pour casser le mot de passe s'appuie sur une puissance de calcul moderne (ferme de calcul par GPU estimée à 1 000 milliards d'essais par seconde) :
- *« Instantané »* ➔ Moins d'une seconde (ex. `soleil12`, `azerty2024`).
- *« Quelques minutes / heures »* (ex. 8 lettres simples).
- *« Des siècles / Des millions d'années »* ➔ Dès qu'une formule à blocs de 12-14 caractères diversifiés est employée.

---

## 4. Mode 3 : 🛡️ Les 4 règles d'or de la cybersécurité

Cet onglet résume les règles de vie numérique à adopter au quotidien :

1. **🔑 Un compte = un mot de passe unique :** Si un site de jeu est piraté, les pirates ne pourront pas accéder à la boîte e-mail ni au compte scolaire.
2. **🤫 Garde-le 100% secret :** Ne jamais donner son mot de passe à un copain ou sur un chat en ligne. En cas d'oubli, l'enseignant ou un adulte de confiance peut le réinitialiser sans avoir besoin de le connaître.
3. **🧱 Utilise la méthode des blocs :** Un mot mémorisable + un nombre + un symbole + le nom du site = sécurité maximale sans effort de mémoire.
4. **📓 Comment s'en souvenir sans danger ? :** Ne pas coller de post-it sur l'écran. Noter la formule (ou les indices des blocs) dans un carnet secret à la maison, ou utiliser un gestionnaire de mots de passe de confiance.

---

## 5. Déroulement d'un atelier en classe (45 min)

### Étape 1 : Le défi du pirate (10 min)
- L'enseignant projette l'application au TBI (en activant le **Mode TBI** dans le menu Options ⚙️).
- Les élèves suggèrent des mots de passe « qu'ils pensent forts » dans l'onglet **Tester**.
- Constat collectif : *« chocolat2024! »* ou *« monchat123 »* sont craqués en quelques secondes à cause des dictionnaires !

### Étape 2 : L'atelier de fabrication (20 min)
- Sur leur tablette ou ordinateur, les élèves ouvrent l'onglet **Créer**.
- Chacun choisit son mot secret, son nombre, son symbole, et teste plusieurs services (*scratch*, *edu.vs.ch*, *learningapps*).
- Ils observent la jauge passer au vert (« Des millions d'années »).

### Étape 3 : Institutionnalisation et carnet secret (15 min)
- Lecture des **4 règles d'or**.
- Les élèves notent sur une fiche papier personnelle uniquement leur **méthode / formule** (pas le mot de passe complet en clair), qu'ils conservent dans leur classeur ou à la maison.

---

## 6. Options pratiques pour l'enseignant

- **🖥️ Mode TBI (Tableau Blanc Interactif) :** Agrandit l'affichage, les contrastes et les polices pour une lisibilité parfaite depuis le fond de la classe.
- **🌓 Thème sombre / Haute Visibilité :** Conforme aux normes d'accessibilité WCAG AA.
- **🔊 Effets sonores et confettis :** Feedback sonore gratifiant lors de la validation d'un mot de passe robuste (désactivable via le menu Options).
- **🔒 Zéro fuite de données :** L'outil peut être utilisé sur des ordinateurs partagés sans risque : rien n'est conservé dans le cache local ni envoyé sur Internet.
