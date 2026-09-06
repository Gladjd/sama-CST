# SAMA CST — Technologies Services (Next.js 14, Supabase, Tailwind CSS)

Application professionnelle de **GMAO (Gestion de Maintenance Assistée par Ordinateur)** et de **Supervision Opérationnelle** pour **Technologies Services**.

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

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application est disponible sur [http://localhost:3000](http://localhost:3000).

3. **Variables d'Environnement Supabase (Optionnel pour le mode connecté)** :
   Créez un fichier `.env.local` basé sur `.env.example` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   ```
   *Note : Si ces variables ne sont pas renseignées, l'application utilise automatiquement le mode de secours local avec données complètes.*
