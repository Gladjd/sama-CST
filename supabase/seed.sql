-- ==============================================================================
-- JEU DE DONNÉES DE DÉMONSTRATION — SAMA CST (TECHNOLOGIES SERVICES)
-- ==============================================================================

-- 1. INSERTION CLIENTS (14 Clients Partenaires)
INSERT INTO clients (code_client, nom_client, secteur, ville_client, pays_client, telephone, email, contact_principal, registre_commerce, ninea, statut)
VALUES
('CLT-001', 'Hôpital Principal de Dakar', 'Santé & Médical', 'Dakar', 'Sénégal', '+221 33 839 50 50', 'contact@hpd.sn', 'Dr. Cheikh Tidiane Diop', 'SN.DKR.1998.B.1450', '002345671 2V1', 'Actif'),
('CLT-002', 'Ciments du Sahel', 'Industrie Cimentière', 'Kirène (Thiès)', 'Sénégal', '+221 33 957 80 00', 'direction.technique@cimentsdusahel.sn', 'Mamadou Lamine Diop', 'SN.THS.2001.B.890', '001987654 2G3', 'Actif'),
('CLT-003', 'CHU Fann (Dakar)', 'Santé & Universitaire', 'Dakar', 'Sénégal', '+221 33 869 18 18', 'direction@chufann.sn', 'Pr. Awa Marie Coll', 'SN.DKR.1975.B.230', '003456789 2K4', 'Actif'),
('CLT-004', 'Dangote Cement Senegal', 'Industrie Lourde', 'Pout (Thiès)', 'Sénégal', '+221 33 954 60 00', 'maintenance@dangote.sn', 'Fatou Bintou Seck', 'SN.THS.2012.B.1200', '004567890 2M5', 'Actif'),
('CLT-005', 'Hôpital Militaire de Ouakam', 'Santé Militaire', 'Dakar', 'Sénégal', '+221 33 860 30 30', 'sav@hmo.sn', 'Col. Dr. Babacar Fall', 'SN.DKR.2005.B.780', '005678901 2P6', 'Actif'),
('CLT-006', 'ICS - Industries Chimiques du Sénégal', 'Chimie & Engrais', 'Mboro / Darou Khoudoss', 'Sénégal', '+221 33 955 70 00', 'technique@ics-senegal.com', 'Cheikh Tidiane Sy', 'SN.THS.1982.B.450', '006789012 2R7', 'Actif'),
('CLT-007', 'Clinique du Cap', 'Clinique Privée', 'Dakar - Plateau', 'Sénégal', '+221 33 889 02 02', 'direction@cliniqueducap.sn', 'Dr. Philippe Martin', 'SN.DKR.1992.B.670', '007890123 2T8', 'Actif')
ON CONFLICT (code_client) DO NOTHING;

-- 2. INSERTION PERSONNEL CST (12 Agents par Pôles)
INSERT INTO personnel_cst (code_agent, nom_agent, fonction, pole, telephone, email, specialite, disponibilite)
VALUES
('AGT-001', 'Ousmane Fall', 'Ingénieur Biomédical Senior', 'BIOMED', '+221 77 123 45 67', 'o.fall@technologies-services.sn', 'Moniteurs, Respirateurs, Défibrillateurs', 'Disponible'),
('AGT-002', 'Abdoulaye Sow', 'Technicien Supérieur Biomédical', 'BIOMED', '+221 77 234 56 78', 'a.sow@technologies-services.sn', 'Stérilisation, Autoclaves, Bistouris', 'En Intervention'),
('AGT-003', 'Moussa Diakhaté', 'Ingénieur Imagerie Médicale', 'IMAG-CHIRG', '+221 77 345 67 89', 'm.diakhate@technologies-services.sn', 'IRM, Scanners, Tables Télécommandées', 'Disponible'),
('AGT-004', 'Ibrahima Gueye', 'Technicien Systèmes Échographie', 'IMAG-CHIRG', '+221 77 456 78 90', 'i.gueye@technologies-services.sn', 'Échographes fixes & portables, Sondes', 'En Intervention'),
('AGT-005', 'Mamadou Ba', 'Responsable Réception Atelier', 'RÉCEPTION & ATELIER', '+221 77 567 89 01', 'm.ba@technologies-services.sn', 'Diagnostic d''entrée, Gestion des flux', 'Disponible'),
('AGT-006', 'Cheikh Ndiaye', 'Technicien Électromécanique', 'RÉCEPTION & ATELIER', '+221 77 678 90 12', 'c.ndiaye@technologies-services.sn', 'Moteurs, Pompes, Groupes CST', 'Disponible'),
('AGT-007', 'Babacar Sarr', 'Ingénieur Banc d''Essai & Métrologie', 'BANC D''ESSAI & CONTRÔLE', '+221 77 789 01 23', 'b.sarr@technologies-services.sn', 'Tests de charge, Étalonnage électrique', 'Disponible'),
('AGT-008', 'Alioune Badara Diouf', 'Responsable Qualité & Conformité', 'QUALITÉ & MÉTROLOGIE', '+221 77 890 12 34', 'ab.diouf@technologies-services.sn', 'Certification ISO 13485, Contrôles finaux', 'Disponible')
ON CONFLICT (code_agent) DO NOTHING;

-- 3. INSERTION SITES TS
INSERT INTO sites_ts (site_code, nom_client, secteur, localisation, responsable_site, telephone, email, parc_equipements, equipements_en_atelier, sla_heures, taux_disponibilite, technicien_referent, contrat, statut)
VALUES
('SITE-001', 'Ciments du Sahel', 'Industrie Cimentière', 'Kirène, Thiès', 'Mamadou Lamine Diop', '+221 77 450 89 12', 'm.diop@cimentsdusahel.sn', 48, 5, 4, 96.80, 'Ousmane Fall', 'Contrat Premium 24/7', 'Actif'),
('SITE-002', 'Eiffage Sénégal (Autoroute)', 'BTP & Infrastructures', 'Dakar - Rufisque', 'Babacar Ndiaye', '+221 78 312 45 67', 'b.ndiaye@eiffage.sn', 36, 4, 6, 94.20, 'Abdoulaye Sow', 'Contrat Standard', 'Actif'),
('SITE-003', 'Dangote Cement Senegal', 'Industrie Lourde', 'Pout, Thiès', 'Fatou Bintou Seck', '+221 76 890 23 41', 'fatou.seck@dangote.com', 62, 7, 4, 98.10, 'Ibrahima Gueye', 'Contrat Full Maintenance', 'Actif'),
('SITE-004', 'ICS - Industries Chimiques du Sénégal', 'Chimie & Mines', 'Mboro / Darou Khoudoss', 'Cheikh Tidiane Sy', '+221 77 654 32 10', 'ct.sy@ics-senegal.com', 75, 6, 3, 91.50, 'Moussa Diakhaté', 'Contrat Industriel Critique', 'Actif')
ON CONFLICT (site_code) DO NOTHING;

-- 4. INSERTION ÉQUIPEMENTS ATELIER
INSERT INTO equipements_atelier (code_equipement, fiche_de_vie, description, numero_serie, client, date_entree, resp_reception, resp_technique, zone_actuelle, motif_panne, situation, statut, etat_sortie, jours_atelier, num_devis_frb, montant_frb, date_emission_frb, diagnostic_reception, actions_decision, entite, priorite)
VALUES
('EQ-AT-0041', 'FV-0041', 'Échographe Doppler Couleur Vivid E95', 'SN-GE-99824', 'Hôpital Principal de Dakar', NOW() - INTERVAL '4 days', 'Mamadou Ba', 'Ibrahima Gueye', 'BANC D''ESSAI', 'Sonde matricielle défaillante, artefacs à l''écran', 'EN COURS', 'DEPENDANT', 'EN COURS', 4, 'FRB-2026-089', 1850000, NOW() - INTERVAL '2 days', 'Module de traitement d''image en surchauffe', 'Remplacement module et sonde 4D', 'IMAG-CHIRG', 'Haute'),
('EQ-AT-0042', 'FV-0042', 'Respirateur d''Anesthésie Carestation 650', 'SN-CS-44102', 'CHU Fann (Dakar)', NOW() - INTERVAL '12 days', 'Mamadou Ba', 'Ousmane Fall', 'ATELIER MÉCANIQUE', 'Fuite circuit patient, capteur O2 hors service', 'ATTENTE PIECES', 'DEPENDANT', 'EN COURS', 12, 'FRB-2026-074', 920000, NOW() - INTERVAL '8 days', 'Bloc débitmétrique encrassé et membrane percée', 'Attente kit joint et cellule O2', 'BIOMED', 'Critique'),
('EQ-AT-0043', 'FV-0043', 'Moniteur Multiparamétrique IntelliVue MX800', 'SN-PH-11045', 'Clinique du Cap', NOW() - INTERVAL '1 day', 'Mamadou Ba', 'Abdoulaye Sow', 'DIAGNOSTIC & RÉCEPTION', 'Extinction inopinée, alimentation instable', 'DIAGNOSTIC', 'DEPENDANT', 'EN COURS', 1, 'FRB-2026-095', 450000, NOW() - INTERVAL '1 day', 'Bloc d''alimentation interne défectueux', 'Devis soumis au client', 'BIOMED', 'Moyenne')
ON CONFLICT (code_equipement) DO NOTHING;
