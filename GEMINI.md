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

### I. Authentification & Sécurité (Next.js & Supabase)
- Authentification par session avec rôles utilisateurs (`admin`, `superviseur`, `technicien`, `client`).
- Boutons d'accès démo en 1 clic pour tester immédiatement l'application avec différents profils.
- Mode hybride avec bascule automatique sur données locales en mémoire si Supabase n'est pas encore connecté.

---

## 3. 📂 Structure des Fichiers

Le projet dispose d'une **double implémentation synchronisée** :
1. **L'Application Moderne Next.js 14 (App Router) + Supabase + Tailwind** (Prête pour déploiement Vercel).
2. **L'Application Web Standalone Ultra-Rapide** (`index.html` + `css/style.css` + `js/app.js`) utilisable immédiatement en local.

```text
Sama CST/
├── app/                                # Next.js 14 App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                # Page de connexion Supabase Auth & démo
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Layout authentifié avec Sidebar & Topbar responsive
│   │   ├── page.tsx                    # Tableau de bord principal (Supervision & KPIs)
│   │   ├── atelier/
│   │   │   └── page.tsx                # Module Équipements Atelier (23 colonnes & Fiche de vie)
│   │   ├── base-ts/
│   │   │   └── page.tsx                # Module Base de Données TS (Sites & Parc Équipements)
│   │   ├── catalogue/
│   │   │   └── page.tsx                # Module Catalogue Équipements TS
│   │   ├── clients/
│   │   │   └── page.tsx                # Module Référentiel Clients TS (RC & NINEA)
│   │   └── personnel/
│   │       └── page.tsx                # Module Personnel CST (Agents & Pôles)
│   ├── api/auth/callback/route.ts      # Route de callback OAuth/Auth Supabase
│   ├── globals.css                     # Styles globaux Tailwind CSS & variables CSS TS
│   └── layout.tsx                      # Root layout HTML / Polices Inter
│
├── components/                         # Composants React modulaires & réutilisables
│   ├── atelier/
│   │   ├── AtelierTable.tsx            # Tableau GMAO avec filtres et mode cartes mobile
│   │   ├── EditFicheDeVieModal.tsx     # Modale d'édition avancée (étapes, pièces, résultats)
│   │   ├── FicheDeVieDrawer.tsx        # Tiroir 360° de consultation du cycle de vie
│   │   └── NewEquipementModal.tsx      # Modale de création d'un équipement atelier
│   ├── base-ts/
│   │   ├── ParcGrid.tsx                # Grille responsive des 24 équipements du parc
│   │   └── SitesList.tsx               # Cartes interactives des 7 sites sous contrat
│   ├── catalogue/
│   │   ├── CatalogueTable.tsx          # Tableau du catalogue référentiel
│   │   └── NewCatalogueModal.tsx       # Modale d'ajout au catalogue
│   ├── clients/
│   │   ├── ClientsTable.tsx            # Tableau des clients (9 colonnes)
│   │   ├── EditClientModal.tsx         # Modale de modification client
│   │   └── NewClientModal.tsx          # Modale d'ajout client
│   ├── dashboard/
│   │   ├── KpiGrid.tsx                 # Grille des 4 KPIs directeurs
│   │   ├── RecentActivityList.tsx      # Journal des événements en direct
│   │   └── SupervisionCharts.tsx       # Graphiques Chart.js (Rotation, MTTR, Pôles)
│   ├── layout/
│   │   ├── HeaderBanner.tsx            # Bannière d'en-tête bleu marine avec badges
│   │   ├── Sidebar.tsx                 # Barre latérale avec mode mobile et collapse desktop
│   │   └── Topbar.tsx                  # Barre supérieure responsive (recherche, actions, profil)
│   ├── personnel/
│   │   ├── EditPersonnelModal.tsx      # Modale de modification agent
│   │   ├── NewPersonnelModal.tsx       # Modale d'ajout agent
│   │   └── PersonnelTable.tsx          # Tableau du personnel CST
│   └── ui/
│       ├── Button.tsx                  # Bouton stylisé avec variantes (primary, secondary, outline)
│       ├── DatePicker.tsx              # Sélecteur de date/heure dynamique
│       ├── Drawer.tsx                  # Conteneur de tiroir coulissant animé
│       └── Modal.tsx                   # Conteneur de modale responsive avec en-tête fixé
│
├── css/
│   └── style.css                       # Feuille de style complète de la version standalone (3300+ lignes)
│
├── js/
│   ├── app.js                          # Moteur applicatif standalone (navigation, modales, CRUD)
│   ├── charts.js                       # Graphiques Chart.js & jauges de la version standalone
│   └── data.js                         # Données initiales et référentiels de démonstration
│
├── lib/
│   ├── data/
│   │   └── supabaseService.ts          # Service d'accès aux données (Supabase + fallback mémoire)
│   ├── supabase/
│   │   ├── client.ts                   # Client Supabase navigateur
│   │   ├── middleware.ts               # Middleware de rafraîchissement de session
│   │   └── server.ts                   # Client Supabase Server Component
│   └── utils/
│       ├── cn.ts                       # Utilitaire de fusion de classes Tailwind (clsx + twMerge)
│       └── csvExport.ts                # Générateur universel de fichiers CSV avec BOM UTF-8
│
├── supabase/
│   ├── schema.sql                      # Schéma PostgreSQL relationnel, index et RLS
│   └── seed.sql                        # Données de démonstration complètes et réalistes
│
├── types/
│   └── database.types.ts               # Typages stricts TypeScript (Profils, Atelier, Clients, etc.)
│
├── vendor/                             # Librairies locales tierces (Flatpickr, etc.)
├── .env.example                        # Modèle des variables d'environnement Supabase
├── .env.local                          # Variables locales d'environnement
├── index.html                          # Application Web Standalone complète (sans build requis)
├── middleware.ts                       # Middleware Next.js pour la protection des routes
├── next.config.mjs                     # Configuration Next.js 14
├── package.json                        # Dépendances du projet
├── postcss.config.mjs                  # Configuration PostCSS / Tailwind
├── tailwind.config.ts                  # Configuration du Design System Tailwind TS
├── tsconfig.json                       # Configuration TypeScript (chemins @/*)
└── vercel.json                         # Configuration de déploiement Vercel
```

---

## 4. 💻 Technologies Utilisées

| Domaine | Technologie | Version / Rôle |
| :--- | :--- | :--- |
| **Framework Principal** | [Next.js](https://nextjs.org/) | `14.2.24` (App Router, Server & Client Components) |
| **Langage & Typage** | [TypeScript](https://www.typescriptlang.org/) | `5.7.3` (Typage strict, 0 erreur de compilation) |
| **Librairie UI** | [React](https://react.dev/) | `18.3.1` |
| **Design & Styles** | [Tailwind CSS](https://tailwindcss.com/) | `3.4.17` (Charte graphique Technologies Services) |
| **Icônes Vectorielles** | [Lucide React](https://lucide.dev/) | `0.475.0` (Pack d'icônes professionnelles) |
| **Graphiques & DataViz** | [Chart.js](https://www.chartjs.org/) / `react-chartjs-2` | `4.4.8` (Camemberts, jauges, barres, lignes) |
| **Sélecteurs de Dates** | [Flatpickr](https://flatpickr.js.org/) | `4.6.13` (Sélecteurs Date & Heure dynamiques en français) |
| **Base de Données & Auth**| [Supabase](https://supabase.com/) | PostgreSQL 15, Row Level Security, Auth & Realtime |
| **Hébergement & CI/CD** | [Vercel](https://vercel.com/) | Déploiement Serverless en production |
| **Moteur Standalone** | HTML5 / Vanilla CSS / ES6+ | Version autonome sans compilation nécessaire (`index.html`) |

---

## 5. 🎨 Décisions de Design & Charte Graphique

La charte graphique est rigoureusement alignée sur l'identité visuelle de **Technologies Services** :

### A. Palette de Couleurs Officielle
- 🟢 **Vert Vif TS (Pantone 368 C)** : `#72C100` (Hover: `#61A500`, Light: `#F2FBE5`, Border: `#CEF092`)
  - *Usage* : Accents d'action primaire, validations, disponiblités élevées, statuts fonctionnels, badges actifs.
- 🔵 **Bleu Foncé TS (Pantone 7684 C)** : `#2E5090` (Hover: `#223D70`, Light: `#EEF3FA`, Border: `#C2D5EE`)
  - *Usage* : Boutons d'action métier, liens interactifs, en-têtes secondaires, sélections actives.
- 🌑 **Bleu Navy Sombre TS** : `#16243D` & `#111D31`
  - *Usage* : Fond de la Sidebar, bannières d'en-tête de prestige, cartes KPI de synthèse.
- ⚪ **Fonds & Neutres** : Fond de page `#F8FAFC`, cartes `#FFFFFF`, bordures `#E2E8F0`, textes secondaires `#64748B`.

### B. Principes d'Ergonomie & UX
1. **Topbar Verrouillé (*Pinned Topbar*)** : Hauteur fixe (`64px`) avec gestion de débordement strict (`flex-wrap: nowrap; overflow: hidden; text-overflow: ellipsis;`) pour éviter tout chevauchement avec les bannières bleues.
2. **Double Navigation Desktop / Mobile** :
   - Sur grand écran : Sidebar complète rétractable en mode icônes compactes (76px) avec tooltips au survol.
   - Sur mobile (`< 1024px`) : Menu tiroir tactile coulissant avec fond flouté (*backdrop blur*) et bouton de fermeture rapide.
3. **Ergonomie Tactile (Mobile First)** :
   - Cibles tactiles d'au moins `40px x 40px` pour tous les boutons interactifs.
   - Tableaux équipés de conteneurs à défilement horizontal fluide avec indicateurs de scroll discrets.
   - Modales scrollables avec hauteur maximale (`max-h-[92vh]`) préservant l'accès aux boutons lors de l'ouverture du clavier virtuel.
4. **Micro-Interactions & Retours Visuels** :
   - Transitions fluides (`all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).
   - Effets d'élévation sur les cartes au survol (`translateY(-2px)` + ombre portée TS).
   - Badges d'alerte clignotants pour les pannes bloquantes en atelier.

---

## 6. 🤖 Instructions pour un Futur Modèle d'IA (Directives de Maintenance)

Lors de toute intervention future sur ce référentiel, l'agent ou le modèle d'IA doit respecter scrupuleusement les règles suivantes :

1. **Maintenir la Double Cohérence (Standalone & Next.js)** :
   - Toute modification de structure de données ou de logique métier doit être appliquée **à la fois** dans les composants Next.js (`components/`, `app/`, `lib/`) et dans la version standalone (`index.html`, `js/app.js`, `css/style.css`).
2. **Respect des Typages TypeScript Stricts** :
   - Ne jamais utiliser `any` sans justification explicite.
   - Toujours mettre à jour [`types/database.types.ts`](file:///Users/monmac/Desktop/Vibe%20Coding/Sama%20CST/types/database.types.ts) lors de l'ajout d'une nouvelle colonne ou table.
   - Vérifier systématiquement la compilation via `npx tsc --noEmit`.
3. **Règle d'Or sur les Boutons & Icônes** :
   - Ne **jamais** combiner une icône SVG vectorielle et un libellé textuel commençant par `+` (ex : interdire `+ + Ajouter`). Utiliser uniquement l'icône suivie du libellé clair (`Ajouter un Client`, `Nouvelle Réception`).
4. **Classes Tailwind CSS v3** :
   - Utiliser exclusivement la syntaxe standard Tailwind CSS v3 :
     - Utiliser `focus:outline-none` (et **non** `focus:outline-hidden`).
     - Utiliser `bg-gradient-to-r` (et **non** `bg-linear-to-r`).
     - Utiliser `backdrop-blur-sm` (et **non** `backdrop-blur-xs`).
     - Utiliser `shadow-sm` (et **non** `shadow-xs`).
5. **Validation de Build avant Livraison** :
   - Toujours exécuter `npx next build` pour s'assurer qu'aucune régression n'empêche le déploiement continu sur Vercel.
6. **Préservation de la Charte Graphique TS** :
   - Ne jamais introduire de couleurs génériques criardes. Utiliser exclusivement les variables CSS définies : Vert TS (`#72C100`), Bleu TS (`#2E5090`), Navy TS (`#16243D`).
