# 🧠 Mode d'emploi : IA & Machine Learning

Bienvenue dans le guide d'utilisation des applications d'initiation à l'**Intelligence Artificielle** de la Suite EdNum : **Dresseur de neurones** et **Détective IA**.

Ces modules permettent aux élèves de comprendre de façon visuelle et interactive comment les ordinateurs apprennent à partir de données (apprentissage supervisé, réseaux de neurones, biais algorithmiques).

---

## 🌟 Enjeux Pédagogiques (Utilité en classe)

- **Démystifier l'IA :** Comprendre qu'une intelligence artificielle ne "pense" pas par magie, mais applique des calculs mathématiques et statistiques sur des exemples qu'on lui a fournis.
- **Apprentissage supervisé :** Découvrir le cycle *Entraînement $\rightarrow$ Ajustement des poids $\rightarrow$ Test de généralisation*.
- **Sensibilisation aux biais algorithmiques :** Constater concrètement qu'une IA entraînée sur des données incomplètes ou stéréotypées prendra des décisions biaisées ou erronées.

---

## 1. Dresseur de neurones (`dresseur_neurones.html`)

Dans cette simulation, l'élève entraîne un neurone artificiel (perceptron) pour trier automatiquement des éléments (ex. pommes vs bananes, ou formes géométriques) selon leurs caractéristiques (couleur, taille, rondeur).

### Étapes de l'activité :
1. **Constitution du jeu d'apprentissage :** L'élève étiquette manuellement un échantillon de fruits pour montrer des exemples à l'IA.
2. **Phase d'entraînement :** L'élève ajuste les poids synaptiques (l'importance accordée à chaque critère) pour déplacer la ligne de séparation (frontière de décision).
3. **Phase de test :** De nouveaux fruits inconnus sont introduits : l'IA parvient-elle à les classer correctement ?
4. **Détection du biais :** Si l'élève n'a montré que des pommes rouges et des bananes jaunes, que se passe-t-il si on lui présente une pomme verte ? Cette situation concrète permet de discuter du biais des données d'entraînement.

---

## 2. Détective IA (`detective_ia.html`)

Dans ce jeu d'enquête, l'élève se met dans la peau d'un détective numérique qui doit analyser les décisions prises par différents algorithmes d'IA pour identifier pourquoi un système a commis une erreur et comment le corriger.

---

*Application conçue par Vivian Epiney (AP EdNum, HEP-VS) sous licence libre AGPL-3.0.*
