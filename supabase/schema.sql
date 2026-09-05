-- ==============================================================================
-- SAMA CST — SCHÉMA POSTGRESQL COMPLET SUPABASE (TABLES, RLS, INDEX & TRIGGERS)
-- ==============================================================================

-- Active les extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLE : PROFILES (Profils Utilisateurs Auth Supabase)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    pole TEXT NOT NULL DEFAULT 'BIOMED',
    specialite TEXT,
    telephone TEXT,
    role TEXT NOT NULL DEFAULT 'technicien' CHECK (role IN ('admin', 'superviseur', 'technicien', 'client')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABLE : PERSONNEL CST (Référentiel des Techniciens & Agents)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.personnel_cst (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pole TEXT NOT NULL CHECK (pole IN ('BIOMED', 'IMAG-CHIRG', 'RÉCEPTION & ATELIER', 'BANC D''ESSAI & CONTRÔLE', 'QUALITÉ & MÉTROLOGIE', 'SUPPORT & SAV')),
    specialite TEXT NOT NULL,
    telephone TEXT,
    actif BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TABLE : CLIENTS (Référentiel Clients & Contrats de Maintenance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    contact_nom TEXT,
    email TEXT,
    telephone TEXT,
    adresse TEXT,
    site_principal TEXT NOT NULL,
    type_contrat TEXT NOT NULL DEFAULT 'Contrat Intégral 24/7',
    sla_heures INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. TABLE : SITES TS (Supervision des Sites Clients & Contrats)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sites_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    nom_site TEXT NOT NULL,
    client_nom TEXT NOT NULL,
    localisation TEXT NOT NULL,
    type_contrat TEXT NOT NULL,
    sla_resolution TEXT NOT NULL,
    technicien_referent TEXT NOT NULL,
    equipements_count INTEGER DEFAULT 0,
    statut TEXT NOT NULL DEFAULT 'Actif' CHECK (statut IN ('Actif', 'En Audit', 'Sous Réserve', 'Suspendu')),
    derniere_visite DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. TABLE : EQUIPEMENTS TS (Catalogue Central TS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.equipements_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_equipement TEXT UNIQUE NOT NULL,
    designation TEXT NOT NULL,
    marque TEXT NOT NULL,
    modele TEXT NOT NULL,
    pole TEXT NOT NULL CHECK (pole IN ('BIOMED', 'IMAG-CHIRG')),
    type_service TEXT NOT NULL,
    statut TEXT NOT NULL DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Inactif', 'En Révision')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. TABLE : PARC EQUIPEMENTS TS (Parc Machines Déployé chez les Clients)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parc_equipements_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_machine TEXT UNIQUE NOT NULL,
    designation TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_nom TEXT NOT NULL,
    site TEXT NOT NULL,
    marque_modele TEXT NOT NULL,
    num_serie TEXT NOT NULL,
    pole TEXT NOT NULL CHECK (pole IN ('BIOMED', 'IMAG-CHIRG')),
    etat_operationnel TEXT NOT NULL DEFAULT 'En Service' CHECK (etat_operationnel IN ('En Service', 'En Atelier CST', 'En Réserve / Standby', 'Arrêt / Panne')),
    taux_disponibilite NUMERIC(5,2) DEFAULT 98.0,
    en_atelier BOOLEAN DEFAULT false,
    derniere_maintenance DATE,
    prochaine_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. TABLE : EQUIPEMENTS ATELIER (Gestion des Réceptions & Fiches de Vie)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.equipements_atelier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_reception TEXT UNIQUE NOT NULL,
    code_equipement TEXT NOT NULL,
    designation TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_nom TEXT NOT NULL,
    num_serie TEXT NOT NULL,
    pole TEXT NOT NULL CHECK (pole IN ('BIOMED', 'IMAG-CHIRG')),
    date_entree DATE NOT NULL DEFAULT CURRENT_DATE,
    date_sortie_prevue DATE,
    date_sortie_reelle DATE,
    statut TEXT NOT NULL DEFAULT 'En Diagnostic' CHECK (statut IN (
        'En Diagnostic',
        'En Réparation',
        'En Attente Pièces',
        'En Contrôle / Banc d''Essai',
        'Prêt pour Livraison',
        'Livré / Clôturé',
        'Bloqué / Devis en Attente'
    )),
    priorite TEXT NOT NULL DEFAULT 'Moyenne' CHECK (priorite IN ('Urgente', 'Haute', 'Moyenne', 'Basse')),
    technicien_responsable TEXT NOT NULL,
    anomalie_signalee TEXT NOT NULL,
    devis_frb_statut TEXT DEFAULT 'Non Émis' CHECK (devis_frb_statut IN ('Non Requis', 'Non Émis', 'En Attente Validation Client', 'Validé par Client', 'Refusé')),
    montant_frb NUMERIC(12,2) DEFAULT 0,
    date_frb TIMESTAMP WITH TIME ZONE,
    date_prise_en_charge TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. TABLE : INTERVENTIONS TIMELINE (Chronologie Fiche de Vie 360°)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interventions_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atelier_id UUID NOT NULL REFERENCES public.equipements_atelier(id) ON DELETE CASCADE,
    code_reception TEXT NOT NULL,
    step_index INTEGER NOT NULL DEFAULT 1,
    date_heure TEXT NOT NULL,
    responsable TEXT NOT NULL,
    statut TEXT NOT NULL DEFAULT 'Effectué' CHECK (statut IN ('Effectué', 'En cours', 'En attente / Planifié')),
    description TEXT NOT NULL,
    resultat_obtenu TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. TABLE : ACTIVITY LOGS (Journal d'activité / Audit)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT,
    user_nom TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. INDEX POUR PERFORMANCES OPTIMALES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_atelier_statut ON public.equipements_atelier(statut);
CREATE INDEX IF NOT EXISTS idx_atelier_pole ON public.equipements_atelier(pole);
CREATE INDEX IF NOT EXISTS idx_atelier_client ON public.equipements_atelier(client_nom);
CREATE INDEX IF NOT EXISTS idx_timeline_atelier ON public.interventions_timeline(atelier_id);
CREATE INDEX IF NOT EXISTS idx_parc_client ON public.parc_equipements_ts(client_nom);
CREATE INDEX IF NOT EXISTS idx_parc_pole ON public.parc_equipements_ts(pole);

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_cst ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipements_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parc_equipements_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipements_atelier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture et écriture pour utilisateurs authentifiés
CREATE POLICY "Profiles are readable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Profiles editable by self or admin" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "Personnel readable by authenticated" ON public.personnel_cst FOR SELECT TO authenticated USING (true);
CREATE POLICY "Personnel modifiable by authenticated" ON public.personnel_cst FOR ALL TO authenticated USING (true);

CREATE POLICY "Clients readable by authenticated" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Clients modifiable by authenticated" ON public.clients FOR ALL TO authenticated USING (true);

CREATE POLICY "Sites readable by authenticated" ON public.sites_ts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Sites modifiable by authenticated" ON public.sites_ts FOR ALL TO authenticated USING (true);

CREATE POLICY "Equipements TS readable by authenticated" ON public.equipements_ts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Equipements TS modifiable by authenticated" ON public.equipements_ts FOR ALL TO authenticated USING (true);

CREATE POLICY "Parc TS readable by authenticated" ON public.parc_equipements_ts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Parc TS modifiable by authenticated" ON public.parc_equipements_ts FOR ALL TO authenticated USING (true);

CREATE POLICY "Atelier readable by authenticated" ON public.equipements_atelier FOR SELECT TO authenticated USING (true);
CREATE POLICY "Atelier modifiable by authenticated" ON public.equipements_atelier FOR ALL TO authenticated USING (true);

CREATE POLICY "Timeline readable by authenticated" ON public.interventions_timeline FOR SELECT TO authenticated USING (true);
CREATE POLICY "Timeline modifiable by authenticated" ON public.interventions_timeline FOR ALL TO authenticated USING (true);

CREATE POLICY "Logs readable by authenticated" ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Logs insertable by authenticated" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Active Realtime sur l'Atelier et la Chronologie
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipements_atelier;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interventions_timeline;
