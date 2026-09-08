-- ==============================================================================
-- SCHEMA POSTGRESQL COMPLET — SAMA CST (TECHNOLOGIES SERVICES)
-- GMAO & SUPERVISION OPÉRATIONNELLE
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: CLIENTS TECHNOLOGIES SERVICES (9 Colonnes Officielles)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_client VARCHAR(50) UNIQUE NOT NULL,
    nom_client VARCHAR(255) NOT NULL,
    secteur VARCHAR(100) NOT NULL,
    ville_client VARCHAR(100) NOT NULL,
    pays_client VARCHAR(100) DEFAULT 'Sénégal',
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    contact_principal VARCHAR(150) NOT NULL,
    registre_commerce VARCHAR(100) NOT NULL,
    ninea VARCHAR(100) NOT NULL,
    statut VARCHAR(50) DEFAULT 'Actif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: PERSONNEL CST & TECHNICIENS (12 Agents par Pôles)
CREATE TABLE IF NOT EXISTS personnel_cst (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_agent VARCHAR(50) UNIQUE NOT NULL,
    nom_agent VARCHAR(255) NOT NULL,
    fonction VARCHAR(150) NOT NULL,
    pole VARCHAR(100) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    specialite VARCHAR(200) NOT NULL,
    disponibilite VARCHAR(50) DEFAULT 'Disponible',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: SITES CLIENTS & CONTRATS TS (483 Sites Partenaires)
CREATE TABLE IF NOT EXISTS sites_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_code VARCHAR(100) UNIQUE NOT NULL,
    nom_site VARCHAR(255),
    nom_client VARCHAR(255) NOT NULL,
    client_nom VARCHAR(255),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    secteur VARCHAR(100) NOT NULL,
    localisation VARCHAR(200) NOT NULL,
    responsable_site VARCHAR(150) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    parc_equipements INTEGER DEFAULT 0,
    equipements_count INTEGER DEFAULT 0,
    equipements_en_atelier INTEGER DEFAULT 0,
    sla_heures INTEGER DEFAULT 4,
    sla_resolution VARCHAR(50) DEFAULT '4h max',
    type_contrat VARCHAR(150),
    contrat VARCHAR(150) NOT NULL,
    taux_disponibilite NUMERIC(5, 2) DEFAULT 95.00,
    technicien_referent VARCHAR(150) NOT NULL,
    statut VARCHAR(50) DEFAULT 'Actif',
    derniere_visite DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: CATALOGUE ÉQUIPEMENTS TS (Référentiel Fournisseurs)
CREATE TABLE IF NOT EXISTS equipements_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_ts VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(255) NOT NULL,
    modele VARCHAR(200) NOT NULL,
    fournisseur VARCHAR(150) NOT NULL,
    entite VARCHAR(50) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    statut VARCHAR(50) DEFAULT 'Actif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE: PARC ÉQUIPEMENTS DÉPLOYÉ (2 883 Machines chez les Clients)
CREATE TABLE IF NOT EXISTS parc_equipements_ts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_machine VARCHAR(100) UNIQUE,
    code_equipement VARCHAR(100) UNIQUE NOT NULL,
    nom_equipement VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    client VARCHAR(255) NOT NULL,
    client_nom VARCHAR(255),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    site VARCHAR(200) NOT NULL,
    marque_modele VARCHAR(255),
    pole VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) NOT NULL,
    num_serie VARCHAR(100),
    modele VARCHAR(200) NOT NULL,
    fournisseur VARCHAR(150) NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'Actif',
    etat_operationnel VARCHAR(100) DEFAULT 'En Service',
    disponibilite NUMERIC(5, 2) DEFAULT 98.00,
    taux_disponibilite NUMERIC(5, 2) DEFAULT 98.00,
    contrat VARCHAR(150) NOT NULL,
    date_installation DATE,
    technicien_referent VARCHAR(150) NOT NULL,
    categorie VARCHAR(50) DEFAULT 'C1',
    en_atelier BOOLEAN DEFAULT FALSE,
    garantie_debut DATE,
    garantie_fin DATE,
    derniere_maintenance DATE,
    prochaine_maintenance DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE: ÉQUIPEMENTS EN ATELIER GMAO (23 Colonnes Réglementaires)
CREATE TABLE IF NOT EXISTS equipements_atelier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_equipement VARCHAR(50) UNIQUE NOT NULL,
    fiche_de_vie VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    numero_serie VARCHAR(100) NOT NULL,
    client VARCHAR(255) NOT NULL,
    date_entree TIMESTAMPTZ NOT NULL,
    date_sortie TIMESTAMPTZ,
    resp_reception VARCHAR(150) NOT NULL,
    resp_technique VARCHAR(150) NOT NULL,
    zone_actuelle VARCHAR(150) NOT NULL,
    motif_panne TEXT NOT NULL,
    situation VARCHAR(100) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    etat_sortie VARCHAR(50) NOT NULL,
    jours_atelier INTEGER DEFAULT 0,
    num_devis_frb VARCHAR(100),
    montant_frb NUMERIC(15, 2) DEFAULT 0,
    date_emission_frb TIMESTAMPTZ,
    date_accord_client TIMESTAMPTZ,
    date_commande_pieces TIMESTAMPTZ,
    date_reception_pieces TIMESTAMPTZ,
    diagnostic_reception TEXT,
    actions_decision TEXT,
    entite VARCHAR(50) NOT NULL,
    priorite VARCHAR(50) DEFAULT 'Moyenne',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE: ÉTAPES D'INTERVENTIONS (Fiche de Vie 360°)
CREATE TABLE IF NOT EXISTS interventions_etapes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipement_id UUID REFERENCES equipements_atelier(id) ON DELETE CASCADE,
    code_equipement VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    date_etape TIMESTAMPTZ NOT NULL,
    responsable VARCHAR(150) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    observation TEXT,
    resultat_obtenu TEXT,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE: PIÈCES DE RECHANGE CONSOMMÉES
CREATE TABLE IF NOT EXISTS pieces_rechange (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipement_id UUID REFERENCES equipements_atelier(id) ON DELETE CASCADE,
    code_equipement VARCHAR(50) NOT NULL,
    reference VARCHAR(100) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    quantite INTEGER DEFAULT 1,
    prix_unitaire NUMERIC(15, 2) DEFAULT 0,
    statut_commande VARCHAR(50) DEFAULT 'Livrée',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INDEX POUR PERFORMANCES OPTIMALES
CREATE INDEX IF NOT EXISTS idx_equipements_atelier_code ON equipements_atelier(code_equipement);
CREATE INDEX IF NOT EXISTS idx_equipements_atelier_statut ON equipements_atelier(statut);
CREATE INDEX IF NOT EXISTS idx_interventions_etapes_code ON interventions_etapes(code_equipement);
CREATE INDEX IF NOT EXISTS idx_parc_code ON parc_equipements_ts(code_equipement);
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(code_client);
CREATE INDEX IF NOT EXISTS idx_personnel_code ON personnel_cst(code_agent);

-- 11. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_cst ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipements_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE parc_equipements_ts ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipements_atelier ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions_etapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces_rechange ENABLE ROW LEVEL SECURITY;

-- 12. POLITIQUES D'ACCÈS PERMISSIVES (Accès complet Authentifié & Anon sécurisé)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public read access on clients" ON clients;
    CREATE POLICY "Allow public read access on clients" ON clients FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on clients" ON clients;
    CREATE POLICY "Allow public write access on clients" ON clients FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on personnel_cst" ON personnel_cst;
    CREATE POLICY "Allow public read access on personnel_cst" ON personnel_cst FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on personnel_cst" ON personnel_cst FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on sites_ts" ON sites_ts;
    CREATE POLICY "Allow public read access on sites_ts" ON sites_ts FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on sites_ts" ON sites_ts FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on equipements_ts" ON equipements_ts;
    CREATE POLICY "Allow public read access on equipements_ts" ON equipements_ts FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on equipements_ts" ON equipements_ts FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on parc_equipements_ts" ON parc_equipements_ts;
    CREATE POLICY "Allow public read access on parc_equipements_ts" ON parc_equipements_ts FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on parc_equipements_ts" ON parc_equipements_ts FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on equipements_atelier" ON equipements_atelier;
    CREATE POLICY "Allow public read access on equipements_atelier" ON equipements_atelier FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on equipements_atelier" ON equipements_atelier FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on interventions_etapes" ON interventions_etapes;
    CREATE POLICY "Allow public read access on interventions_etapes" ON interventions_etapes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on interventions_etapes" ON interventions_etapes FOR ALL USING (true);

    DROP POLICY IF EXISTS "Allow public read access on pieces_rechange" ON pieces_rechange;
    CREATE POLICY "Allow public read access on pieces_rechange" ON pieces_rechange FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow public write access on pieces_rechange" ON pieces_rechange FOR ALL USING (true);
END $$;

-- 13. ACTIVATION DU TEMPS RÉEL (Supabase Realtime)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE equipements_atelier;
        ALTER PUBLICATION supabase_realtime ADD TABLE interventions_etapes;
        ALTER PUBLICATION supabase_realtime ADD TABLE clients;
        ALTER PUBLICATION supabase_realtime ADD TABLE personnel_cst;
        ALTER PUBLICATION supabase_realtime ADD TABLE parc_equipements_ts;
        ALTER PUBLICATION supabase_realtime ADD TABLE equipements_ts;
    EXCEPTION WHEN duplicate_object THEN
        -- Déjà présent dans la publication
        NULL;
    END;
END $$;
