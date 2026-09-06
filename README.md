# 📘 Sama CST — Plateforme de GMAO & Supervision Opérationnelle (Technologies Services)

**Sama CST** est la plateforme numérique de **GMAO (Gestion de Maintenance Assistée par Ordinateur)** et de **Supervision Opérationnelle** conçue sur-mesure pour l'entreprise **Technologies Services (TS)**. 

Elle assure la traçabilité intégrale, le suivi technique et financier, ainsi que la gestion du cycle de vie des équipements médicaux (Pôle BIOMED), des équipements d'imagerie et blocs opératoires (Pôle IMAG-CHIRG), des matériels industriels et miniers sous contrat de maintenance.

---

## 🎯 Fonctionnalités Principales

### 1. 📊 Tableaux de Bord & Supervision (4 Vues Métier)
* **Synthèse Direction** : Taux de disponibilité globale en temps réel (**96.4%**), évolution MTTR sur 6 mois, répartition par marques (GE, Siemens, Philips, Caterpillar, Komatsu).
* **Performance Technique** : Analyse des 4 axes de blocage atelier (Pièces, FRB, Validation client, Banc d'essai), charges techniciens.
* **Risques & Dépendances** : Alertes rouges critiques (immobilisation > 30j), contrats sous surveillance.
* **Disponibilité du Parc** : Parc fonctionnel vs dégradé vs à l'arrêt, disponibilité par entité opérationnelle.

### 2. 🛠️ GMAO Atelier 23 Colonnes & Fiche de Vie 360°
* **Tableau GMAO exhaustif conforme aux 23 colonnes réglementaires** :
  `Code Équipement`, `Fiche de Vie`, `Description`, `N° Série`, `Client`, `Date Entrée`, `Date Sortie`, `Resp. Réception`, `Resp. Technique`, `Zone Actuelle`, `Motif`, `Situation`, `Statut`, `État Sortie`, `Jours Atelier`, `N° Devis/FRB`, `Montant FRB`, `Date Émission FRB`, `Date Accord Client`, `Date Commande Pièces`, `Date Réception Pièces`, `Diagnostic Réception`, `Actions / Décision`.
* **Tiroir Fiche de Vie 360°** coulissant avec chronologie visuelle des interventions.
* **Édition inline d'une intervention passée** : Modification dynamique de l'étape, de la date, du technicien responsable et du résultat technique obtenu.
* **Export Excel / CSV universel** avec encodage UTF-8 BOM.

### 3. 🏢 Base de Données TS — Double Vue Interactive
* **Vue Sites Clients (7 sites)** : Cartes détaillées, type de contrat (24/7, Platinum, Gold), SLA et technicien référent.
* **Vue Parc Équipements TS (24 machines)** : Grille responsive ou tableau synthétique avec jauges de disponibilité.

### 4. 👥 Répertoire Clients & Personnel CST
* **Répertoire Clients (9 colonnes)** : Raison sociale, secteur, N° Registre du Commerce (RC), N° NINEA.
* **Personnel CST** : Techniciens et ingénieurs par pôle (`BIOMED`, `IMAG-CHIRG`, `ATELIER`, `QUALITÉ`, `BANC D'ESSAI`, `SUPPORT`).
* **Catalogue des Équipements TS**.

---

## 💻 Architecture & Technologies

* **Moteur Web** : HTML5 sémantique, Vanilla CSS 3 & JavaScript ES6+ moderne
* **Graphiques & DataViz** : [Chart.js](https://www.chartjs.org/)
* **Sélecteurs de Dates** : [Flatpickr](https://flatpickr.js.org/) (français)
* **Zéro Dépendance Lourde** : Fonctionne instantanément dans n'importe quel navigateur sans serveur de base de données externe ni compilation obligatoire.

---

## 🚀 Lancement Rapide

### Option A : Serveur local rapide
```bash
npm start
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Option B : Directement dans le navigateur
Ouvrez simplement le fichier `index.html` dans votre navigateur web préféré.
