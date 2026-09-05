# SAMA CST — Technologies Services (Next.js 14, Supabase, Tailwind CSS)

Application professionnelle de **Supervision des Équipements Biomédicaux & Industriels**, gestion des flux d'atelier CST, fiches de vie 360°, suivi des contrats de maintenance et respect des SLAs pour **Technologies Services**.

---

## 🚀 Stack Technique

- **Frontend** : Next.js 14 (App Router, Server & Client Components, TypeScript)
- **Base de Données & Authentification** : Supabase (PostgreSQL, Row Level Security, Auth Sessions, Realtime)
- **Design & UI** : Tailwind CSS avec la charte officielle Technologies Services (Vert Pantone 368 C `#72C100`, Bleu Pantone 7684 C `#2E5090`, Navy `#16243D`)
- **Icônes** : Lucide React
- **Hébergement & Déploiement** : Vercel (CI/CD natif)

---

## 📁 Structure du Projet

```
sama-cst/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx              # Page de connexion Supabase Auth & Accès Démo
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Layout Global (Sidebar, Topbar, Modales)
│   │   ├── page.tsx                    # Tableau de bord & KPIs Supervision
│   │   ├── atelier/page.tsx            # Équipements en Atelier & Fiche de Vie 360°
│   │   ├── base-ts/page.tsx            # Base TS (Vue Clients/Sites & Vue Équipements)
│   │   ├── catalogue/page.tsx          # Catalogue des Équipements TS
│   │   ├── clients/page.tsx            # Référentiel Clients & Contrats
│   │   └── personnel/page.tsx          # Personnel CST (12 Agents)
│   ├── api/auth/callback/route.ts      # Callback Auth Supabase
│   ├── globals.css                     # Directives Tailwind & styles globaux
│   └── layout.tsx                      # Root Layout
├── components/
│   ├── layout/                         # Sidebar, Topbar, HeaderBanner
│   ├── ui/                             # Badge, Button, Modal, Drawer, DatePicker
│   ├── dashboard/                      # KpiGrid, SupervisionCharts, RecentActivity
│   ├── atelier/                        # AtelierTable, FicheDeVieDrawer, NewEquipmentModal
│   ├── base-ts/                        # SitesGrid, ParcEquipementsGrid, ParcEquipementsTable
│   ├── clients/                        # ClientsTable, NewClientModal
│   ├── personnel/                      # PersonnelTable, NewPersonnelModal
│   └── catalogue/                      # CatalogueTable
├── lib/
│   ├── supabase/                       # Clients Browser, Server et Middleware SSR
│   ├── data/                           # Service de données avec bascule Supabase / Mock
│   ├── types/                          # Typages TypeScript PostgreSQL
│   └── utils/                          # Export CSV universel, formatters FCFA et dates
├── supabase/
│   ├── schema.sql                      # Schéma complet PostgreSQL (Tables, RLS, Index)
│   └── seed.sql                        # Données de démonstration initiales
├── vercel.json                         # Paramètres de build et sécurité Vercel
├── tailwind.config.ts
└── package.json
```

---

## 🛠️ Installation & Démarrage Local

### 1. Cloner le projet et installer les dépendances
```bash
git clone <votre-depot>
cd "Sama CST"
npm install
```

### 2. Configurer les variables d'environnement
Copiez le fichier exemple :
```bash
cp .env.example .env.local
```
*(Remarque : L'application fonctionne immédiatement en mode démo interactif même avant d'avoir renseigné vos clés Supabase).*

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🗄️ Configuration de Supabase en 2 Étapes

1. Créez un nouveau projet sur [Supabase](https://supabase.com/).
2. Allez dans le **SQL Editor** de Supabase et exécutez successivement :
   - Le script [`supabase/schema.sql`](supabase/schema.sql) (création des tables, index, règles RLS).
   - Le script [`supabase/seed.sql`](supabase/seed.sql) (chargement des 7 clients, 12 techniciens, 24 machines, et fiches d'atelier).
3. Dans **Project Settings > API**, copiez :
   - L'URL du projet ➔ `NEXT_PUBLIC_SUPABASE_URL`
   - La clé `anon/public` ➔ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - La clé `service_role` (optionnel) ➔ `SUPABASE_SERVICE_ROLE_KEY`
4. Collez-les dans votre `.env.local`.

---

## ☁️ Déploiement sur Vercel

1. Poussez votre code sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "feat: Migration Sama CST vers Next.js 14, Supabase et Tailwind"
   git push origin main
   ```
2. Rendez-vous sur [Vercel](https://vercel.com/) et cliquez sur **Add New Project**.
3. Importez votre dépôt GitHub.
4. Dans la section **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Cliquez sur **Deploy**. Votre application est en ligne en quelques secondes !

---

## 📋 Fonctionnalités Incluses

1. **Tableau de Bord & Supervision** :
   - 4 KPIs temps réel (Atelier, Taux de disponibilité, Devis FRB, Interventions clôturées).
   - Graphique de rotation mensuelle Atelier (Entrées vs Sorties).
   - Répartition par pôle (BIOMED vs IMAG-CHIRG) et conformité SLAs.
   - Journal d'activité CST en direct.

2. **Équipements en Atelier & Fiche de Vie 360°** :
   - Tableau dynamique avec recherche, tris et multi-filtres (Pôle, Statut, Priorité).
   - **Tiroir Fiche de Vie 360°** avec chronologie interactive des étapes d'intervention.
   - **Édition inline d'une intervention passée** avec bouton de crayon (`✏️`), modification de la date, du responsable et du résultat, et boutons `Valider` / `Annuler`.
   - Ajout dynamique d'étapes avec champ "Résultat obtenu" et responsable en liste déroulante.
   - Sélecteurs dynamiques de date et heure.
   - Modal d'entrée en atelier avec pré-remplissage.

3. **Base de Données TS** :
   - **Sélecteur de Vue haut de page** : Vue par Client / Site (7 contrats) vs Vue par Équipement (24 machines).
   - Bascule Grille de Cartes / Tableau détaillé avec jauge de disponibilité.
   - Redirection en 1 clic vers l'Atelier ou la Fiche de Vie.

4. **Clients & Personnel CST** :
   - Référentiel des 7 clients partenaires majeurs.
   - Répertoire des 12 techniciens CST avec leurs 6 pôles et spécialités.
   - Modales d'ajout d'agent et de client.

5. **Exports CSV Universels** :
   - Export avec encodage UTF-8 BOM compatible Microsoft Excel sur tous les tableaux.
