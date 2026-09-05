# 📘 Sama CST — Documentation Complète du Projet

**Sama CST** est la plateforme numérique de **GMAO (Gestion de Maintenance Assistée par Ordinateur)** et de **Supervision Opérationnelle** conçue sur-mesure pour l'entreprise **Technologies Services (TS)**. 

Elle assure la traçabilité intégrale, le suivi technique et financier, ainsi que la gestion du cycle de vie des équipements médicaux (Pôle BIOMED), des équipements d'imagerie et blocs opératoires (Pôle IMAG-CHIRG), des matériels industriels et miniers sous contrat de maintenance.

---

## 1. 🎯 Ce que fait l'application

L'application **Sama CST** centralise l'ensemble des processus techniques et administratifs de Technologies Services :
1. **Traçabilité des Réceptions & Sorties d'Atelier** : Enregistrement rigoureux de chaque entrée d'équipement avec génération automatique d'un code unique (`EQ-AT-XXXX`), assignation technique, motif de panne et suivi des délais d'immobilisation.
2. **Fiche de Vie 360° de l'Équipement** : Historique chronologique complet (diagnostic, devis, attente pièces, commande, usinage, banc d'essai, contrôle qualité, livraison).
3. **Pilotage de la Performance & des Délais** : Analyse en direct des 4 axes de blocage opérationnels (Attente Pièces, Devis / FRB, Validation Client, Contrôle Banc d'Essai), calcul du MTTR (*Mean Time To Repair*) et calcul de la disponibilité globale du parc (**96.4%**).
4. **Gestion Centralisée des Référentiels Métier** :
   - Répertoire complet des clients (avec identifiants fiscaux NINEA & RC).
   - Répertoire du personnel technique et ingénieurs CST avec affectation par pôle.
   - Catalogue des équipements commercialisés et maintenus par Technologies Services.
   - Base de données des sites clients et du parc de machines déployé.

---

## 2. ⚡ Toutes les Fonctionnalités Implémentées

### A. Tableaux de Bord & Supervision (4 Vues Métier)
- **1. Synthèse Direction** :
  - Taux de disponibilité globale du parc en temps réel (**96.4%**).
  - Graphique d'évolution du **MTTR (Délai Moyen de Réparation)** sur 6 mois.
  - Répartition par marques majeures (GE Healthcare, Siemens Healthineers, Philips, Caterpillar, Komatsu).
  - KPIs clés : Équipements sous contrat, Entrées Atelier, Délais moyens, Taux de conformité qualité.
- **2. Performance Technique** :
  - Tableau de bord des 4 axes de blocage atelier.
  - Suivi individuel des techniciens (charges de travail, dossiers clôturés, taux de réussite).
- **3. Risques & Dépendances** :
  - Détection automatique et mise en évidence des **Alertes Rouges Critiques** (équipements immobilisés > 30 jours, attente pièces bloquantes).
  - Statut de couverture des contrats de maintenance par client.
- **4. Disponibilité du Parc** :
  - Répartition Parc Fonctionnel vs Dégradé vs À l'Arrêt.
  - Taux de disponibilité par entité opérationnelle (`BIOMED` vs `IMAG-CHIRG`).
  - Classement du **Top 5 des durées d'immobilisation maximales**.

### B. Gestion des Équipements en Atelier (GMAO 23 Colonnes)
- **Tableau GMAO exhaustif conforme aux 23 colonnes réglementaires** :
  `Code Équipement`, `Fiche de Vie`, `Description`, `N° Série`, `Client`, `Date Entrée`, `Date Sortie`, `Resp. Réception`, `Resp. Technique`, `Zone Actuelle`, `Motif`, `Situation`, `Statut (CLÔTURE / DEPENDANT)`, `État Sortie`, `Jours Atelier`, `N° Devis/FRB`, `Montant FRB`, `Date Émission FRB`, `Date Accord Client`, `Date Commande Pièces`, `Date Réception Pièces`, `Diagnostic Réception`, `Actions / Décision`.
- **Filtres multi-critères instantanés** : Recherche plein-texte, filtre Entité/Pôle, Statut, Situation, État de sortie, Priorité.
- **Ajout & Modification d'Équipements** : Modales complètes avec calcul automatique de la durée de séjour et validation des données.
- **Export CSV Universel** avec encodage UTF-8 BOM compatible Microsoft Excel.

### C. Fiche de Vie 360° & Édition Avancée des Interventions
- **Tiroir latéral coulissant (*Drawer*) fluide et ergonomique**.
- **Vue 360° en mode consultation** : En-tête de synthèse avec badges de criticité, chronologie visuelle (*stepper timeline*), liste détaillée des pièces de rechange consommées, diagnostic initial et bilan financier (devis/FRB).
- **Mode Édition Interactive & Modification d'Interventions Passées** :
  - Possibilité de modifier ou supprimer n'importe quelle étape passée via un bouton d'action dédié (`✏️ Modifier`).
  - **Sélecteur de responsable sous forme de liste déroulante** alimentée dynamiquement par le personnel CST et les ateliers internes.
  - **Champ dédié « Résultat obtenu / Observation »** permettant d'enregistrer le résultat technique validé.
  - Gestion des pièces de rechange consommées (référence, désignation, quantité, montant unitaire et statut de commande).

### D. Datepickers Dynamiques
- Tous les champs de date et date/heure sont équipés de sélecteurs Flatpickr dynamiques en français avec raccourcis rapides (*« Aujourd'hui »*, *« Maintenant »*, *« Effacer »*).

### E. Base de Données TS — Double Vue Interactive
- **Vue Sites Clients (7 sites)** : Cartes interactives détaillant le client, le contrat (24/7, Platinum, Gold), SLA, technicien référent.
- **Vue Parc Équipements TS (24 machines)** : Bascule Grille responsive / Tableau synthétique avec jauges de disponibilité et accès direct à la fiche atelier.

### F. Répertoire des Clients Technologies Services
- **9 Colonnes Officielles & Fiscales** : `Code Client`, `Raison Sociale / Nom`, `Secteur d'Activité`, `Ville`, `Téléphone`, `Email`, `Contact Principal`, `N° Registre du Commerce (RC)`, `N° NINEA`.
- Filtres, recherche instantanée, ajout/modification et export CSV.

### G. Référentiel du Personnel CST
- 12 agents et ingénieurs CST avec affectation par pôle, spécialité, contact et statut de disponibilité.

### H. Catalogue Référentiel des Équipements TS
- Référentiel complet des équipements commercialisés et maintenus par Technologies Services.

---

## 3. 📂 Structure des Fichiers

```text
Sama CST/
├── css/
│   └── style.css                       # Feuille de style complète (Charte Technologies Services)
│
├── js/
│   ├── app.js                          # Moteur applicatif (navigation, modales, CRUD, drawer)
│   ├── charts.js                       # Graphiques Chart.js & jauges de supervision
│   └── data.js                         # Données initiales et référentiels métiers
│
├── vendor/
│   └── flatpickr/                      # Librairie sélecteur de dates en français
│
├── index.html                          # Application Web Standalone complète
├── package.json                        # Configuration et scripts de lancement
└── README.md                           # Guide d'utilisation et documentation
```

---

## 4. 💻 Technologies Utilisées

| Domaine | Technologie | Rôle |
| :--- | :--- | :--- |
| **Structure** | HTML5 Sémantique | Architecture de la Single Page Application |
| **Styles & Design** | Vanilla CSS3 | Charte graphique TS (Variables CSS, Glassmorphism, Responsive) |
| **Logique Applicative** | JavaScript ES6+ | Moteur d'état réactif, filtrage, modales, exports CSV |
| **Graphiques & DataViz** | Chart.js 4.4.0 | Camemberts, MTTR, Pôles opérationnels, jauges de disponibilité |
| **Sélecteurs de Dates** | Flatpickr 4.6.13 | Sélecteurs Date & Heure dynamiques en français |

---

## 5. 🎨 Charte Graphique Officielle TS

- 🟢 **Vert Vif TS (Pantone 368 C)** : `#72C100` (Validation, disponibilité élevée, statuts fonctionnels)
- 🔵 **Bleu Foncé TS (Pantone 7684 C)** : `#2E5090` (Boutons d'action, sélections actives)
- 🌑 **Bleu Navy TS** : `#16243D` & `#111D31` (Fond sidebar, bannières d'en-tête de prestige)
- ⚪ **Fonds & Neutres** : Fond `#F8FAFC`, cartes `#FFFFFF`, bordures `#E2E8F0`
