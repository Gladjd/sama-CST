# 📘 Sama CST — Documentation Complète du Projet

**Sama CST** est la plateforme numérique de **GMAO (Gestion de Maintenance Assistée par Ordinateur)** et de **Supervision Opérationnelle** conçue sur-mesure pour l'entreprise **Technologies Services (TS)**. 

Elle assure la traçabilité intégrale, le suivi technique et financier, ainsi que la gestion du cycle de vie des équipements médicaux (Pôle BIOMED), des équipements d'imagerie et blocs opératoires (Pôle IMAG-CHIRG), des matériels industriels et miniers sous contrat de maintenance.

---

## 1. 🎯 Ce que fait l'application

L'application **Sama CST** centralise l'ensemble des processus techniques et administratifs de Technologies Services :
1. **Traçabilité des Réceptions & Sorties d'Atelier** : Enregistrement rigoureux de chaque entrée d'équipement avec génération automatique d'un code unique (`EQ-AT-XXXX`), assignation technique, motif de panne et suivi des délais d'immobilisation.
2. **Fiche de Vie 360° de l'Équipement** : Historique chronologique complet (diagnostic, devis, attente pièces, commande, usinage, banc d'essai, contrôle qualité, livraison).
3. **Pilotage de la Performance & des Délais** : Analyse en direct des 4 axes de blocage opérationnels (Attente Pièces, Devis / FRB, Validation Client, Contrôle Banc d'Essai), calcul du MTTR (*Mean Time To Repair*) et calcul de la disponibilité globale du parc.
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
  - **Champ dédié « Résultat obtenu / Observation »** permettant d'enregistrer le résultat technique validé (ex : *« Test 180 bars conforme »*, *« Étalonnage réussi à 99.8% »*).
  - Gestion des pièces de rechange consommées (référence, désignation, quantité, montant unitaire et statut de commande).

### D. Datepickers Dynamiques
- Tous les champs de date et date/heure (`Date Entrée`, `Date Sortie`, `Date Émission FRB`, `Date Accord Client`, `Date Étape Intervention`, etc.) sont équipés de **sélecteurs dynamiques et ergonomiques** avec raccourcis rapides (*« Aujourd'hui »*, *« Maintenant »*, *« Effacer »*).

### E. Base de Données TS — Double Vue Interactive
- **Sélecteur de Vue Intégré** :
  - **Vue Sites Clients (7 sites)** : Cartes interactives détaillant le client, le type de contrat (24/7, Platinum, Gold), le SLA contractuel, le technicien référent et les actions rapides.
  - **Vue Parc Équipements TS (24 machines)** : Vue par équipement avec bascule **Mode Cartes (Grille responsive)** ou **Mode Tableau synthétique**, jauges de taux de disponibilité (`98.5%`, `94.2%`), et bouton direct de transfert/consultation en atelier.

### F. Répertoire des Clients Technologies Services
- **9 Colonnes Officielles & Fiscales** : `Code Client`, `Raison Sociale / Nom`, `Secteur d'Activité`, `Ville`, `Téléphone`, `Email`, `Contact Principal`, `N° Registre du Commerce (RC)`, `N° NINEA`.
- **KPIs en En-tête** : Total Clients (14), Villes Couvertes (7), Santé & Hôpitaux (6), Industrie & Mines (8).
- **Gestion complète** : Recherche multi-critères, ajout de nouveaux comptes, modification des coordonnées et export CSV.

### G. Référentiel du Personnel CST
- **Gestion des Agents & Techniciens** : `Code Agent`, `Nom & Prénom`, `Fonction / Poste`, `Pôle Opérationnel` (`BIOMED`, `IMAG-CHIRG`, `RÉCEPTION & ATELIER`, `BANC D'ESSAI & CONTRÔLE`, `QUALITÉ & MÉTROLOGIE`, `SUPPORT & SAV`), `Téléphone`, `Email professionnel`, `Spécialité technique`, `Statut de disponibilité`.
- **Filtres par Pôle, recherche instantanée, modales d'ajout/modification et export CSV**.

### H. Catalogue Référentiel des Équipements TS
- **5 colonnes** : `Code TS`, `Désignation`, `Catégorie`, `Fournisseur / Marque`, `Statut Référentiel`.

---

## 3. 📂 Structure des Fichiers

L'application est 100% autonome et fluide, structurée sans complexité inutile :

```text
Sama CST/
├── css/
│   └── style.css                       # Feuille de style complète (Charte graphique Technologies Services)
├── js/
│   ├── app.js                          # Moteur applicatif (Navigation, Modales, CRUD, Tiroir Fiche de Vie)
│   ├── charts.js                       # Graphiques Chart.js (Rotation, MTTR, Disponibilité, Pôles)
│   └── data.js                         # Données initiales et référentiels métiers TS
├── vendor/
│   └── flatpickr/                      # Librairie locale de sélection de date/heure en français
├── .gitignore                          # Fichiers ignorés par Git
├── index.html                          # Application Web Standalone complète
├── package.json                        # Scripts de lancement local
└── README.md                           # Documentation utilisateur et technique
```

---

## 4. 💻 Technologies Utilisées

| Domaine | Technologie | Version / Rôle |
| :--- | :--- | :--- |
| **Structure & Vues** | HTML5 Sémantique | Architecture multi-vues avec navigation fluide |
| **Design & Styles** | Vanilla CSS 3 | Charte graphique TS (Vert `#72C100`, Bleu `#2E5090`, Navy `#16243D`) |
| **Logique & Données** | JavaScript ES6+ | Moteur réactif, gestion du state local, filtrage instantané |
| **Graphiques & DataViz**| [Chart.js](https://www.chartjs.org/) | Camemberts, jauges, barres, MTTR sur 6 mois |
| **Sélecteurs de Dates** | [Flatpickr](https://flatpickr.js.org/) | Sélecteurs Date & Heure dynamiques en français |

---

## 5. 🎨 Charte Graphique & Ergonomie

- 🟢 **Vert Vif TS (Pantone 368 C)** : `#72C100` (Hover: `#61A500`, Light: `#F2FBE5`, Border: `#CEF092`)
- 🔵 **Bleu Foncé TS (Pantone 7684 C)** : `#2E5090` (Hover: `#223D70`, Light: `#EEF3FA`, Border: `#C2D5EE`)
- 🌑 **Bleu Navy Sombre TS** : `#16243D` & `#111D31`
- ⚪ **Fonds & Neutres** : Fond `#F8FAFC`, Cartes `#FFFFFF`, Bordures `#E2E8F0`
