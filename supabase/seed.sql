-- ==============================================================================
-- SAMA CST — DONNÉES INITIALES DE DÉMONSTRATION (SEED)
-- ==============================================================================

-- 1. PERSONNEL CST (12 Agents)
INSERT INTO public.personnel_cst (nom, email, pole, specialite, telephone) VALUES
('Ousmane Fall', 'ousmane.fall@technologies-services.sn', 'BIOMED', 'Moniteurs & Respirateurs de Réanimation', '+221 77 500 11 22'),
('Ibrahima Gueye', 'ibrahima.gueye@technologies-services.sn', 'IMAG-CHIRG', 'Échographes Haute Fréquence & Doppler', '+221 77 500 33 44'),
('Abdoulaye Sow', 'abdoulaye.sow@technologies-services.sn', 'BIOMED', 'Bloc Opératoire & Tables Chirurgicales', '+221 77 500 55 66'),
('Moussa Diakhaté', 'moussa.diakhate@technologies-services.sn', 'IMAG-CHIRG', 'Scanners CT & Arceaux Chirurgicaux', '+221 77 500 77 88'),
('Modou Faye', 'modou.faye@technologies-services.sn', 'RÉCEPTION & ATELIER', 'Réception, Dépoussiérage & Décontamination', '+221 77 500 99 00'),
('Alioune Badara', 'alioune.badara@technologies-services.sn', 'BANC D''ESSAI & CONTRÔLE', 'Tests Électriques & Banc de Puissance', '+221 77 500 12 34'),
('Fatou Kiné Ndiaye', 'fatou.ndiaye@technologies-services.sn', 'BIOMED', 'Analyseurs de Laboratoire & Stérilisation', '+221 77 500 56 78'),
('Cheikh Amadou Tidiane', 'cheikh.tidiane@technologies-services.sn', 'IMAG-CHIRG', 'IRM & Systèmes de Radiologie Numérique', '+221 77 500 90 12'),
('Babacar Diop', 'babacar.diop@technologies-services.sn', 'QUALITÉ & MÉTROLOGIE', 'Étalonnage Métrologique & Normes ISO 13485', '+221 77 500 34 56'),
('Awa Sarr', 'awa.sarr@technologies-services.sn', 'BIOMED', 'Électrocardiographes & Défibrillateurs', '+221 77 500 78 90'),
('Mamadou Lamine Cissé', 'mamadou.cisse@technologies-services.sn', 'IMAG-CHIRG', 'Microscopes Chirurgicaux & Endoscopie', '+221 77 500 23 45'),
('Samba Diallo', 'samba.diallo@technologies-services.sn', 'SUPPORT & SAV', 'Logistique, Pièces de Rechange & FRB', '+221 77 500 67 89')
ON CONFLICT (email) DO NOTHING;

-- 2. CLIENTS (7 Clients Stratégiques)
INSERT INTO public.clients (code, nom, contact_nom, email, telephone, adresse, site_principal, type_contrat, sla_heures) VALUES
('CL-001', 'Caterpillar Mining Senegal', 'M. Jean-Luc Moreau', 'j.moreau@cat-mining.sn', '+221 33 839 00 11', 'Zone Industrielle de Bel-Air, Dakar', 'Site Minier Sabodala & Dépôt Dakar', 'Contrat Intégral 24/7', 2),
('CL-002', 'Komatsu Heavy Machinery', 'Mme Aminata Traoré', 'a.traore@komatsu-sn.com', '+221 33 864 12 34', 'Km 14, Route de Rufisque, Dakar', 'Base Logistique Diamniadio', 'Contrat Préventif & Curatif Plus', 4),
('CL-003', 'Atlas Copco Sénégal', 'M. David Ndour', 'd.ndour@atlascopco.sn', '+221 33 879 55 00', 'Parc Industriel Intégré de Diamniadio', 'Plateforme Forage & Compresseurs', 'Contrat Curatif Standard', 6),
('CL-004', 'Volvo Construction Equipments', 'M. Patrick Gomez', 'p.gomez@volvoce-sn.com', '+221 33 821 77 88', 'Avenue Félix Éboué, Port Autonome', 'Hub Logistique Portuaire Dakar', 'Contrat Intégral 24/7', 2),
('CL-005', 'Wärtsilä West Africa', 'M. Ousmane Kane', 'o.kane@wartsila.sn', '+221 33 849 33 22', 'Zone Franche Industrielle de Mbao', 'Centrale Électrique Bel-Air & Tobène', 'Contrat Préventif & Curatif Plus', 4),
('CL-006', 'Konecranes Port Solutions', 'M. Cheikh Sarr', 'c.sarr@konecranes-port.sn', '+221 33 889 11 00', 'Terminal à Conteneurs DP World Dakar', 'Port Autonome de Dakar (PAD)', 'Contrat Intégral 24/7', 2),
('CL-007', 'Centre Hospitalier Principal de Dakar', 'Dr. Marie Sow', 'm.sow@hopital-principal.sn', '+221 33 839 50 50', 'Avenue Nelson Mandela, Dakar Plateau', 'Plateau Technique & Blocs Opératoires', 'Contrat Biomédical Vital 24/7', 1)
ON CONFLICT (code) DO NOTHING;

-- 3. SITES TS (Supervision Sites)
INSERT INTO public.sites_ts (nom_site, client_nom, localisation, type_contrat, sla_resolution, technicien_referent, equipements_count, statut, derniere_visite) VALUES
('Site Minier Sabodala & Base Dakar', 'Caterpillar Mining Senegal', 'Kédougou & Bel-Air Dakar', 'Contrat Intégral 24/7', '< 2h Intervention', 'Ousmane Fall', 38, 'Actif', '2026-08-28'),
('Base Technique Diamniadio', 'Komatsu Heavy Machinery', 'Diamniadio Pôle Urbain', 'Contrat Préventif & Curatif Plus', '< 4h Intervention', 'Ibrahima Gueye', 24, 'Actif', '2026-08-30'),
('Plateforme Forage & Air Comprimé', 'Atlas Copco Sénégal', 'Diamniadio Parc Industriel', 'Contrat Curatif Standard', '< 6h Intervention', 'Abdoulaye Sow', 16, 'Actif', '2026-09-01'),
('Hub Logistique Portuaire', 'Volvo Construction Equipments', 'Port Autonome de Dakar', 'Contrat Intégral 24/7', '< 2h Intervention', 'Moussa Diakhaté', 19, 'Actif', '2026-08-25'),
('Centrale Électrique Tobène', 'Wärtsilä West Africa', 'Tobène & Mbao', 'Contrat Préventif & Curatif Plus', '< 4h Intervention', 'Alioune Badara', 12, 'Actif', '2026-08-29'),
('Terminal à Conteneurs Port', 'Konecranes Port Solutions', 'Môle 8 Port Dakar', 'Contrat Intégral 24/7', '< 2h Intervention', 'Modou Faye', 15, 'Actif', '2026-08-31'),
('Plateau Technique Hôpital Principal', 'Centre Hospitalier Principal de Dakar', 'Dakar Plateau', 'Contrat Biomédical Vital 24/7', '< 1h Intervention', 'Dr. Abdoulaye Sow', 42, 'Actif', '2026-09-03');

-- 4. PARC EQUIPEMENTS TS (24 Équipements Clés Déployés)
INSERT INTO public.parc_equipements_ts (code_machine, designation, client_nom, site, marque_modele, num_serie, pole, etat_operationnel, taux_disponibilite, en_atelier, derniere_maintenance, prochaine_maintenance) VALUES
('MC-CAT-777G', 'Camion Tombereau Minier 100T', 'Caterpillar Mining Senegal', 'Site Sabodala', 'Caterpillar 777G Off-Highway', 'CAT-777-9821-SN', 'IMAG-CHIRG', 'En Service', 98.5, false, '2026-08-15', '2026-11-15'),
('MC-KOM-PC2000', 'Pelle Hydraulique Minière 200T', 'Komatsu Heavy Machinery', 'Base Diamniadio', 'Komatsu PC2000-11', 'KM-PC20-4410-DK', 'IMAG-CHIRG', 'En Service', 97.2, false, '2026-08-10', '2026-11-10'),
('MC-ATL-XATS', 'Compresseur Haute Pression 12 Bar', 'Atlas Copco Sénégal', 'Diamniadio Hub', 'Atlas Copco XATS 400 PACE', 'AC-XATS-1049-SN', 'BIOMED', 'En Atelier CST', 92.0, true, '2026-07-20', '2026-10-20'),
('MC-VOL-L350H', 'Chargeuse sur Pneus Grand Tonnage', 'Volvo Construction Equipments', 'Hub Portuaire', 'Volvo L350H 540HP', 'VCE-L350-7732-SN', 'IMAG-CHIRG', 'En Service', 99.1, false, '2026-08-22', '2026-11-22'),
('MC-WAR-W50DF', 'Groupe Électrogène Lourd Dual-Fuel', 'Wärtsilä West Africa', 'Centrale Tobène', 'Wärtsilä 18V50DF 17.5MW', 'WAR-50DF-0091-SN', 'BIOMED', 'En Service', 99.8, false, '2026-08-01', '2026-11-01'),
('MC-KON-RTG04', 'Grue Portique Portuaire RTG 41T', 'Konecranes Port Solutions', 'Terminal PAD', 'Konecranes Hybrid RTG 41T', 'KON-RTG-5520-PAD', 'IMAG-CHIRG', 'En Service', 96.8, false, '2026-08-18', '2026-11-18'),
('MC-HPD-RESP01', 'Respirateur d''Anesthésie Avancé', 'Centre Hospitalier Principal de Dakar', 'Bloc Central', 'Mindray A7 Anesthesia System', 'MY-A7-88301-SN', 'BIOMED', 'En Atelier CST', 91.5, true, '2026-08-28', '2026-09-28'),
('MC-HPD-SCAN01', 'Scanner Tomodensitomètre 64 Coupes', 'Centre Hospitalier Principal de Dakar', 'Imagerie Médicale', 'GE Healthcare Revolution CT 64', 'GE-REV64-5501-SN', 'IMAG-CHIRG', 'En Service', 99.4, false, '2026-08-05', '2026-11-05');

-- 5. EQUIPEMENTS ATELIER (Exemples de Réceptions Actives avec Timeline)
INSERT INTO public.equipements_atelier (id, code_reception, code_equipement, designation, client_nom, num_serie, pole, date_entree, statut, priorite, technicien_responsable, anomalie_signalee, devis_frb_statut, montant_frb) VALUES
('b3017cf4-32b0-4f59-994c-cf9742a78101', 'REC-2026-0041', 'MC-CAT-777G', 'Distributeur Hydraulique & Électrovannes', 'Caterpillar Mining Senegal', 'CAT-HYD-8821', 'IMAG-CHIRG', '2026-09-01', 'En Réparation', 'Haute', 'Ibrahima Gueye', 'Fuite haute pression sur tiroir 3 et surchauffe bobine de commande', 'Validé par Client', 850000),
('b3017cf4-32b0-4f59-994c-cf9742a78102', 'REC-2026-0038', 'MC-HPD-RESP01', 'Moniteur Multiparamétrique & Électrodes', 'Centre Hospitalier Principal de Dakar', 'SN-MIND-99120', 'BIOMED', '2026-08-28', 'En Diagnostic', 'Urgente', 'Ousmane Fall', 'Perte intermittente de signal ECG et erreur de calibration pression invasive', 'En Attente Validation Client', 320000),
('b3017cf4-32b0-4f59-994c-cf9742a78103', 'REC-2026-0035', 'MC-ATL-XATS', 'Module Régulateur Électronique PACE', 'Atlas Copco Sénégal', 'AC-ELEC-40192', 'BIOMED', '2026-08-24', 'En Attente Pièces', 'Moyenne', 'Abdoulaye Sow', 'Défaut communication bus CAN avec l''afficheur principal', 'Validé par Client', 490000);

-- 6. INTERVENTIONS TIMELINE (Étapes de Fiche de Vie 360°)
INSERT INTO public.interventions_timeline (atelier_id, code_reception, step_index, date_heure, responsable, statut, description, resultat_obtenu) VALUES
('b3017cf4-32b0-4f59-994c-cf9742a78101', 'REC-2026-0041', 1, '2026-09-01 08:30', 'Modou Faye', 'Effectué', 'Réception atelier, inspection visuelle et dégraissage chimique', 'Composants nettoyés et repérés sans dommage externe'),
('b3017cf4-32b0-4f59-994c-cf9742a78101', 'REC-2026-0041', 2, '2026-09-01 11:15', 'Ibrahima Gueye', 'Effectué', 'Test d''étanchéité sous pression d''épreuve (250 bars)', 'Fuite constatée sur joint torique du tiroir 3'),
('b3017cf4-32b0-4f59-994c-cf9742a78101', 'REC-2026-0041', 3, '2026-09-02 14:00', 'Ibrahima Gueye', 'En cours', 'Remplacement du kit de joints et rectification du siège de tiroir', 'Usinage en cours de finalisation'),

('b3017cf4-32b0-4f59-994c-cf9742a78102', 'REC-2026-0038', 1, '2026-08-28 09:00', 'Modou Faye', 'Effectué', 'Décontamination selon protocole biomédical hospitalier', 'Attestation de décontamination émise'),
('b3017cf4-32b0-4f59-994c-cf9742a78102', 'REC-2026-0038', 2, '2026-08-28 14:30', 'Ousmane Fall', 'Effectué', 'Diagnostic sur simulateur patient Fluke Biomedical', 'Carte d''acquisition ECG instable confirmée'),
('b3017cf4-32b0-4f59-994c-cf9742a78102', 'REC-2026-0038', 3, '2026-08-29 10:00', 'Samba Diallo', 'Effectué', 'Émission du devis FRB n°FRB-2026-088 pour remplacement module', 'Devis 320 000 FCFA transmis à l''Hôpital Principal');
