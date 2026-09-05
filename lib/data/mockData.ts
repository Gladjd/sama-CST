// ==============================================================================
// SAMA CST — DONNÉES DE SECOURS ET DÉMONSTRATION COMPLÈTES
// ==============================================================================

import {
  Client,
  PersonnelCST,
  SiteTS,
  EquipementTS,
  ParcEquipementTS,
  EquipementAtelier,
  ActivityLog,
} from '@/types/database.types';

export const INITIAL_PERSONNEL: PersonnelCST[] = [
  { id: 'p1', nom: 'Ousmane Fall', email: 'ousmane.fall@technologies-services.sn', pole: 'BIOMED', specialite: 'Moniteurs & Respirateurs de Réanimation', telephone: '+221 77 500 11 22', actif: true, equipements_assignes: 4 },
  { id: 'p2', nom: 'Ibrahima Gueye', email: 'ibrahima.gueye@technologies-services.sn', pole: 'IMAG-CHIRG', specialite: 'Échographes Haute Fréquence & Doppler', telephone: '+221 77 500 33 44', actif: true, equipements_assignes: 3 },
  { id: 'p3', nom: 'Abdoulaye Sow', email: 'abdoulaye.sow@technologies-services.sn', pole: 'BIOMED', specialite: 'Bloc Opératoire & Tables Chirurgicales', telephone: '+221 77 500 55 66', actif: true, equipements_assignes: 3 },
  { id: 'p4', nom: 'Moussa Diakhaté', email: 'moussa.diakhate@technologies-services.sn', pole: 'IMAG-CHIRG', specialite: 'Scanners CT & Arceaux Chirurgicaux', telephone: '+221 77 500 77 88', actif: true, equipements_assignes: 2 },
  { id: 'p5', nom: 'Modou Faye', email: 'modou.faye@technologies-services.sn', pole: 'RÉCEPTION & ATELIER', specialite: 'Réception, Dépoussiérage & Décontamination', telephone: '+221 77 500 99 00', actif: true, equipements_assignes: 5 },
  { id: 'p6', nom: 'Alioune Badara', email: 'alioune.badara@technologies-services.sn', pole: 'BANC D\'ESSAI & CONTRÔLE', specialite: 'Tests Électriques & Banc de Puissance', telephone: '+221 77 500 12 34', actif: true, equipements_assignes: 4 },
  { id: 'p7', nom: 'Fatou Kiné Ndiaye', email: 'fatou.ndiaye@technologies-services.sn', pole: 'BIOMED', specialite: 'Analyseurs de Laboratoire & Stérilisation', telephone: '+221 77 500 56 78', actif: true, equipements_assignes: 2 },
  { id: 'p8', nom: 'Cheikh Amadou Tidiane', email: 'cheikh.tidiane@technologies-services.sn', pole: 'IMAG-CHIRG', specialite: 'IRM & Systèmes de Radiologie Numérique', telephone: '+221 77 500 90 12', actif: true, equipements_assignes: 2 },
  { id: 'p9', nom: 'Babacar Diop', email: 'babacar.diop@technologies-services.sn', pole: 'QUALITÉ & MÉTROLOGIE', specialite: 'Étalonnage Métrologique & Normes ISO 13485', telephone: '+221 77 500 34 56', actif: true, equipements_assignes: 3 },
  { id: 'p10', nom: 'Awa Sarr', email: 'awa.sarr@technologies-services.sn', pole: 'BIOMED', specialite: 'Électrocardiographes & Défibrillateurs', telephone: '+221 77 500 78 90', actif: true, equipements_assignes: 2 },
  { id: 'p11', nom: 'Mamadou Lamine Cissé', email: 'mamadou.cisse@technologies-services.sn', pole: 'IMAG-CHIRG', specialite: 'Microscopes Chirurgicaux & Endoscopie', telephone: '+221 77 500 23 45', actif: true, equipements_assignes: 2 },
  { id: 'p12', nom: 'Samba Diallo', email: 'samba.diallo@technologies-services.sn', pole: 'SUPPORT & SAV', specialite: 'Logistique, Pièces de Rechange & FRB', telephone: '+221 77 500 67 89', actif: true, equipements_assignes: 6 },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', code: 'CL-001', nom: 'Caterpillar Mining Senegal', contact_nom: 'M. Jean-Luc Moreau', email: 'j.moreau@cat-mining.sn', telephone: '+221 33 839 00 11', adresse: 'Zone Industrielle de Bel-Air, Dakar', site_principal: 'Site Minier Sabodala & Dépôt Dakar', type_contrat: 'Contrat Intégral 24/7', sla_heures: 2, equipements_count: 38 },
  { id: 'c2', code: 'CL-002', nom: 'Komatsu Heavy Machinery', contact_nom: 'Mme Aminata Traoré', email: 'a.traore@komatsu-sn.com', telephone: '+221 33 864 12 34', adresse: 'Km 14, Route de Rufisque, Dakar', site_principal: 'Base Logistique Diamniadio', type_contrat: 'Contrat Préventif & Curatif Plus', sla_heures: 4, equipements_count: 24 },
  { id: 'c3', code: 'CL-003', nom: 'Atlas Copco Sénégal', contact_nom: 'M. David Ndour', email: 'd.ndour@atlascopco.sn', telephone: '+221 33 879 55 00', adresse: 'Parc Industriel Intégré de Diamniadio', site_principal: 'Plateforme Forage & Compresseurs', type_contrat: 'Contrat Curatif Standard', sla_heures: 6, equipements_count: 16 },
  { id: 'c4', code: 'CL-004', nom: 'Volvo Construction Equipments', contact_nom: 'M. Patrick Gomez', email: 'p.gomez@volvoce-sn.com', telephone: '+221 33 821 77 88', adresse: 'Avenue Félix Éboué, Port Autonome', site_principal: 'Hub Logistique Portuaire Dakar', type_contrat: 'Contrat Intégral 24/7', sla_heures: 2, equipements_count: 19 },
  { id: 'c5', code: 'CL-005', nom: 'Wärtsilä West Africa', contact_nom: 'M. Ousmane Kane', email: 'o.kane@wartsila.sn', telephone: '+221 33 849 33 22', adresse: 'Zone Franche Industrielle de Mbao', site_principal: 'Centrale Électrique Bel-Air & Tobène', type_contrat: 'Contrat Préventif & Curatif Plus', sla_heures: 4, equipements_count: 12 },
  { id: 'c6', code: 'CL-006', nom: 'Konecranes Port Solutions', contact_nom: 'M. Cheikh Sarr', email: 'c.sarr@konecranes-port.sn', telephone: '+221 33 889 11 00', adresse: 'Terminal à Conteneurs DP World Dakar', site_principal: 'Port Autonome de Dakar (PAD)', type_contrat: 'Contrat Intégral 24/7', sla_heures: 2, equipements_count: 15 },
  { id: 'c7', code: 'CL-007', nom: 'Centre Hospitalier Principal de Dakar', contact_nom: 'Dr. Marie Sow', email: 'm.sow@hopital-principal.sn', telephone: '+221 33 839 50 50', adresse: 'Avenue Nelson Mandela, Dakar Plateau', site_principal: 'Plateau Technique & Blocs Opératoires', type_contrat: 'Contrat Biomédical Vital 24/7', sla_heures: 1, equipements_count: 42 },
];

export const INITIAL_SITES: SiteTS[] = [
  { id: 's1', nom_site: 'Site Minier Sabodala & Base Dakar', client_nom: 'Caterpillar Mining Senegal', localisation: 'Kédougou & Bel-Air Dakar', type_contrat: 'Contrat Intégral 24/7', sla_resolution: '< 2h Intervention', technicien_referent: 'Ousmane Fall', equipements_count: 38, statut: 'Actif', derniere_visite: '2026-08-28' },
  { id: 's2', nom_site: 'Base Technique Diamniadio', client_nom: 'Komatsu Heavy Machinery', localisation: 'Diamniadio Pôle Urbain', type_contrat: 'Contrat Préventif & Curatif Plus', sla_resolution: '< 4h Intervention', technicien_referent: 'Ibrahima Gueye', equipements_count: 24, statut: 'Actif', derniere_visite: '2026-08-30' },
  { id: 's3', nom_site: 'Plateforme Forage & Air Comprimé', client_nom: 'Atlas Copco Sénégal', localisation: 'Diamniadio Parc Industriel', type_contrat: 'Contrat Curatif Standard', sla_resolution: '< 6h Intervention', technicien_referent: 'Abdoulaye Sow', equipements_count: 16, statut: 'Actif', derniere_visite: '2026-09-01' },
  { id: 's4', nom_site: 'Hub Logistique Portuaire', client_nom: 'Volvo Construction Equipments', localisation: 'Port Autonome de Dakar', type_contrat: 'Contrat Intégral 24/7', sla_resolution: '< 2h Intervention', technicien_referent: 'Moussa Diakhaté', equipements_count: 19, statut: 'Actif', derniere_visite: '2026-08-25' },
  { id: 's5', nom_site: 'Centrale Électrique Tobène', client_nom: 'Wärtsilä West Africa', localisation: 'Tobène & Mbao', type_contrat: 'Contrat Préventif & Curatif Plus', sla_resolution: '< 4h Intervention', technicien_referent: 'Alioune Badara', equipements_count: 12, statut: 'Actif', derniere_visite: '2026-08-29' },
  { id: 's6', nom_site: 'Terminal à Conteneurs Port', client_nom: 'Konecranes Port Solutions', localisation: 'Môle 8 Port Dakar', type_contrat: 'Contrat Intégral 24/7', sla_resolution: '< 2h Intervention', technicien_referent: 'Modou Faye', equipements_count: 15, statut: 'Actif', derniere_visite: '2026-08-31' },
  { id: 's7', nom_site: 'Plateau Technique Hôpital Principal', client_nom: 'Centre Hospitalier Principal de Dakar', localisation: 'Dakar Plateau', type_contrat: 'Contrat Biomédical Vital 24/7', sla_resolution: '< 1h Intervention', technicien_referent: 'Dr. Abdoulaye Sow', equipements_count: 42, statut: 'Actif', derniere_visite: '2026-09-03' },
];

export const INITIAL_PARC_EQUIPEMENTS: ParcEquipementTS[] = [
  { id: 'pe1', code_machine: 'MC-CAT-777G', designation: 'Camion Tombereau Minier 100T', client_nom: 'Caterpillar Mining Senegal', site: 'Site Sabodala', marque_modele: 'Caterpillar 777G Off-Highway', num_serie: 'CAT-777-9821-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 98.5, en_atelier: false, derniere_maintenance: '2026-08-15', prochaine_maintenance: '2026-11-15' },
  { id: 'pe2', code_machine: 'MC-KOM-PC2000', designation: 'Pelle Hydraulique Minière 200T', client_nom: 'Komatsu Heavy Machinery', site: 'Base Diamniadio', marque_modele: 'Komatsu PC2000-11', num_serie: 'KM-PC20-4410-DK', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 97.2, en_atelier: false, derniere_maintenance: '2026-08-10', prochaine_maintenance: '2026-11-10' },
  { id: 'pe3', code_machine: 'MC-ATL-XATS', designation: 'Compresseur Haute Pression 12 Bar', client_nom: 'Atlas Copco Sénégal', site: 'Diamniadio Hub', marque_modele: 'Atlas Copco XATS 400 PACE', num_serie: 'AC-XATS-1049-SN', pole: 'BIOMED', etat_operationnel: 'En Atelier CST', taux_disponibilite: 92.0, en_atelier: true, derniere_maintenance: '2026-07-20', prochaine_maintenance: '2026-10-20' },
  { id: 'pe4', code_machine: 'MC-VOL-L350H', designation: 'Chargeuse sur Pneus Grand Tonnage', client_nom: 'Volvo Construction Equipments', site: 'Hub Portuaire', marque_modele: 'Volvo L350H 540HP', num_serie: 'VCE-L350-7732-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 99.1, en_atelier: false, derniere_maintenance: '2026-08-22', prochaine_maintenance: '2026-11-22' },
  { id: 'pe5', code_machine: 'MC-WAR-W50DF', designation: 'Groupe Électrogène Lourd Dual-Fuel', client_nom: 'Wärtsilä West Africa', site: 'Centrale Tobène', marque_modele: 'Wärtsilä 18V50DF 17.5MW', num_serie: 'WAR-50DF-0091-SN', pole: 'BIOMED', etat_operationnel: 'En Service', taux_disponibilite: 99.8, en_atelier: false, derniere_maintenance: '2026-08-01', prochaine_maintenance: '2026-11-01' },
  { id: 'pe6', code_machine: 'MC-KON-RTG04', designation: 'Grue Portique Portuaire RTG 41T', client_nom: 'Konecranes Port Solutions', site: 'Terminal PAD', marque_modele: 'Konecranes Hybrid RTG 41T', num_serie: 'KON-RTG-5520-PAD', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 96.8, en_atelier: false, derniere_maintenance: '2026-08-18', prochaine_maintenance: '2026-11-18' },
  { id: 'pe7', code_machine: 'MC-HPD-RESP01', designation: 'Respirateur d\'Anesthésie Avancé', client_nom: 'Centre Hospitalier Principal de Dakar', site: 'Bloc Central', marque_modele: 'Mindray A7 Anesthesia System', num_serie: 'MY-A7-88301-SN', pole: 'BIOMED', etat_operationnel: 'En Atelier CST', taux_disponibilite: 91.5, en_atelier: true, derniere_maintenance: '2026-08-28', prochaine_maintenance: '2026-09-28' },
  { id: 'pe8', code_machine: 'MC-HPD-SCAN01', designation: 'Scanner Tomodensitomètre 64 Coupes', client_nom: 'Centre Hospitalier Principal de Dakar', site: 'Imagerie Médicale', marque_modele: 'GE Healthcare Revolution CT 64', num_serie: 'GE-REV64-5501-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 99.4, en_atelier: false, derniere_maintenance: '2026-08-05', prochaine_maintenance: '2026-11-05' },
  { id: 'pe9', code_machine: 'MC-CAT-349D', designation: 'Excavatrice Chenilles de Carrière', client_nom: 'Caterpillar Mining Senegal', site: 'Site Sabodala', marque_modele: 'Caterpillar 349D2 L', num_serie: 'CAT-349-4109-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 98.0, en_atelier: false, derniere_maintenance: '2026-08-12', prochaine_maintenance: '2026-11-12' },
  { id: 'pe10', code_machine: 'MC-KOM-WA600', designation: 'Chargeuse Géante sur Roues', client_nom: 'Komatsu Heavy Machinery', site: 'Base Diamniadio', marque_modele: 'Komatsu WA600-8', num_serie: 'KM-WA60-2291-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Atelier CST', taux_disponibilite: 93.4, en_atelier: true, derniere_maintenance: '2026-08-26', prochaine_maintenance: '2026-09-26' },
  { id: 'pe11', code_machine: 'MC-HPD-ECHO01', designation: 'Échographe Doppler Cardiaque 4D', client_nom: 'Centre Hospitalier Principal de Dakar', site: 'Cardiologie', marque_modele: 'Philips EPIQ CVx Cardiology', num_serie: 'PH-EPIQ-4491-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 99.7, en_atelier: false, derniere_maintenance: '2026-08-19', prochaine_maintenance: '2026-11-19' },
  { id: 'pe12', code_machine: 'MC-VOL-A40G', designation: 'Tombereau Articulé Tout-Terrain', client_nom: 'Volvo Construction Equipments', site: 'Carrière Rufisque', marque_modele: 'Volvo A40G Hauler', num_serie: 'VCE-A40-9901-SN', pole: 'IMAG-CHIRG', etat_operationnel: 'En Service', taux_disponibilite: 97.9, en_atelier: false, derniere_maintenance: '2026-08-14', prochaine_maintenance: '2026-11-14' },
];

export const INITIAL_ATELIER: EquipementAtelier[] = [
  {
    id: 'ea1',
    code_reception: 'REC-2026-0041',
    code_equipement: 'MC-CAT-777G',
    designation: 'Distributeur Hydraulique & Électrovannes',
    client_nom: 'Caterpillar Mining Senegal',
    num_serie: 'CAT-HYD-8821',
    pole: 'IMAG-CHIRG',
    date_entree: '2026-09-01',
    statut: 'En Réparation',
    priorite: 'Haute',
    technicien_responsable: 'Ibrahima Gueye',
    anomalie_signalee: 'Fuite haute pression sur tiroir 3 et surchauffe bobine de commande',
    devis_frb_statut: 'Validé par Client',
    montant_frb: 850000,
    date_frb: '2026-09-01T16:00:00Z',
    date_prise_en_charge: '2026-09-01T08:30:00Z',
    timeline: [
      { step_index: 1, date_heure: '2026-09-01 08:30', responsable: 'Modou Faye', statut: 'Effectué', description: 'Réception atelier, inspection visuelle et dégraissage chimique', resultat_obtenu: 'Composants nettoyés et repérés sans dommage externe' },
      { step_index: 2, date_heure: '2026-09-01 11:15', responsable: 'Ibrahima Gueye', statut: 'Effectué', description: 'Test d\'étanchéité sous pression d\'épreuve (250 bars)', resultat_obtenu: 'Fuite constatée sur joint torique du tiroir 3' },
      { step_index: 3, date_heure: '2026-09-02 14:00', responsable: 'Ibrahima Gueye', statut: 'En cours', description: 'Remplacement du kit de joints et rectification du siège de tiroir', resultat_obtenu: 'Usinage en cours de finalisation' },
      { step_index: 4, date_heure: '2026-09-06 09:00', responsable: 'Alioune Badara', statut: 'En attente / Planifié', description: 'Passage au banc d\'essai hydraulique dynamique et validation rapport', resultat_obtenu: '' },
    ]
  },
  {
    id: 'ea2',
    code_reception: 'REC-2026-0038',
    code_equipement: 'MC-HPD-RESP01',
    designation: 'Moniteur Multiparamétrique & Électrodes',
    client_nom: 'Centre Hospitalier Principal de Dakar',
    num_serie: 'SN-MIND-99120',
    pole: 'BIOMED',
    date_entree: '2026-08-28',
    statut: 'En Diagnostic',
    priorite: 'Urgente',
    technicien_responsable: 'Ousmane Fall',
    anomalie_signalee: 'Perte intermittente de signal ECG et erreur de calibration pression invasive',
    devis_frb_statut: 'En Attente Validation Client',
    montant_frb: 320000,
    date_frb: '2026-08-29T10:00:00Z',
    date_prise_en_charge: '2026-08-28T09:00:00Z',
    timeline: [
      { step_index: 1, date_heure: '2026-08-28 09:00', responsable: 'Modou Faye', statut: 'Effectué', description: 'Décontamination selon protocole biomédical hospitalier', resultat_obtenu: 'Attestation de décontamination émise' },
      { step_index: 2, date_heure: '2026-08-28 14:30', responsable: 'Ousmane Fall', statut: 'Effectué', description: 'Diagnostic sur simulateur patient Fluke Biomedical', resultat_obtenu: 'Carte d\'acquisition ECG instable confirmée' },
      { step_index: 3, date_heure: '2026-08-29 10:00', responsable: 'Samba Diallo', statut: 'Effectué', description: 'Émission du devis FRB n°FRB-2026-088 pour remplacement module', resultat_obtenu: 'Devis 320 000 FCFA transmis à l\'Hôpital Principal' },
      { step_index: 4, date_heure: '2026-09-06 11:00', responsable: 'Ousmane Fall', statut: 'En attente / Planifié', description: 'Remplacement de la carte mère après bon pour accord client', resultat_obtenu: '' },
    ]
  },
  {
    id: 'ea3',
    code_reception: 'REC-2026-0035',
    code_equipement: 'MC-ATL-XATS',
    designation: 'Module Régulateur Électronique PACE',
    client_nom: 'Atlas Copco Sénégal',
    num_serie: 'AC-ELEC-40192',
    pole: 'BIOMED',
    date_entree: '2026-08-24',
    statut: 'En Attente Pièces',
    priorite: 'Moyenne',
    technicien_responsable: 'Abdoulaye Sow',
    anomalie_signalee: 'Défaut communication bus CAN avec l\'afficheur principal',
    devis_frb_statut: 'Validé par Client',
    montant_frb: 490000,
    date_frb: '2026-08-25T15:30:00Z',
    date_prise_en_charge: '2026-08-24T10:00:00Z',
    timeline: [
      { step_index: 1, date_heure: '2026-08-24 10:00', responsable: 'Modou Faye', statut: 'Effectué', description: 'Prise en charge atelier et identification série', resultat_obtenu: 'Matériel enregistré au registre' },
      { step_index: 2, date_heure: '2026-08-24 16:00', responsable: 'Abdoulaye Sow', statut: 'Effectué', description: 'Contrôle à l\'oscilloscope des signaux CAN High / CAN Low', resultat_obtenu: 'Transceiver CAN défectueux' },
      { step_index: 3, date_heure: '2026-08-25 11:00', responsable: 'Samba Diallo', statut: 'Effectué', description: 'Commande pièces détachées express Europe', resultat_obtenu: 'Expédition DHL n°9842104 en transit' },
    ]
  },
  {
    id: 'ea4',
    code_reception: 'REC-2026-0032',
    code_equipement: 'MC-KOM-WA600',
    designation: 'Pompe Hydraulique Principale Haute Pression',
    client_nom: 'Komatsu Heavy Machinery',
    num_serie: 'KM-PUMP-9921',
    pole: 'IMAG-CHIRG',
    date_entree: '2026-08-20',
    statut: 'En Contrôle / Banc d\'Essai',
    priorite: 'Haute',
    technicien_responsable: 'Alioune Badara',
    anomalie_signalee: 'Baisse de débit sous charge maximale (180 bars)',
    devis_frb_statut: 'Validé par Client',
    montant_frb: 1450000,
    timeline: [
      { step_index: 1, date_heure: '2026-08-20 09:30', responsable: 'Modou Faye', statut: 'Effectué', description: 'Réception et démontage complet', resultat_obtenu: 'Usure prononcée des plateaux oscillants' },
      { step_index: 2, date_heure: '2026-08-22 15:00', responsable: 'Ibrahima Gueye', statut: 'Effectué', description: 'Remplacement pistons et plateaux neufs', resultat_obtenu: 'Remontage au couple prescrit' },
      { step_index: 3, date_heure: '2026-08-25 10:00', responsable: 'Alioune Badara', statut: 'En cours', description: 'Test de débit continu sur banc 350 bars pendant 4h', resultat_obtenu: 'Pression stable à 348 bars sans élévation thermique' },
    ]
  }
];

export const INITIAL_CATALOGUE: EquipementTS[] = [
  { id: 'cat1', code_equipement: 'EQ-BIO-001', designation: 'Moniteur de Surveillance Réanimation', marque: 'Mindray', modele: 'BeneVision N17', pole: 'BIOMED', type_service: 'Maintenance Préventive & Curative', statut: 'Actif' },
  { id: 'cat2', code_equipement: 'EQ-BIO-002', designation: 'Respirateur d\'Anesthésie Électronique', marque: 'Mindray', modele: 'A7 Anesthesia System', pole: 'BIOMED', type_service: 'Contrat Maintenance Vital 24/7', statut: 'Actif' },
  { id: 'cat3', code_equipement: 'EQ-IMG-001', designation: 'Échographe Doppler Couleur Premium', marque: 'Philips Healthcare', modele: 'EPIQ CVx', pole: 'IMAG-CHIRG', type_service: 'Maintenance Full Support', statut: 'Actif' },
  { id: 'cat4', code_equipement: 'EQ-IMG-002', designation: 'Scanner Tomodensitomètre CT 64 Coupes', marque: 'GE Healthcare', modele: 'Revolution CT 64', pole: 'IMAG-CHIRG', type_service: 'Contrat Constructeur Partenaire', statut: 'Actif' },
  { id: 'cat5', code_equipement: 'EQ-IND-001', designation: 'Groupe Électrogène Lourd Dual-Fuel', marque: 'Wärtsilä', modele: '18V50DF 17.5MW', pole: 'BIOMED', type_service: 'Supervision & Révision Majeure', statut: 'Actif' },
  { id: 'cat6', code_equipement: 'EQ-IND-002', designation: 'Tombereau Minier Grand Tonnage', marque: 'Caterpillar', modele: '777G Off-Highway', pole: 'IMAG-CHIRG', type_service: 'Maintenance Hydraulique & Mécanique', statut: 'Actif' },
];

export const INITIAL_LOGS: ActivityLog[] = [
  { id: 'l1', user_nom: 'Ibrahima Gueye', action: 'Modification Étape Timeline', entity_type: 'Atelier', entity_id: 'REC-2026-0041', details: 'Mise à jour du résultat obtenu sur l\'usinage du tiroir hydraulique', created_at: '2026-09-05T09:40:00Z' },
  { id: 'l2', user_nom: 'Ousmane Fall', action: 'Création Réception Atelier', entity_type: 'Atelier', entity_id: 'REC-2026-0038', details: 'Enregistrement moniteur biomédical Hôpital Principal', created_at: '2026-09-04T15:20:00Z' },
  { id: 'l3', user_nom: 'Samba Diallo', action: 'Validation Devis FRB', entity_type: 'FRB', entity_id: 'FRB-2026-088', details: 'Devis 320 000 FCFA validé par le client', created_at: '2026-09-04T11:15:00Z' },
];
