// ==========================================================================
// PLATEFORME SAMA CST - BASE DE DONNÉES ET ÉTAT INITIAL (DATA STORE)
// Inspiré du Design System TCMMS
// ==========================================================================

const SAMA_DATA = {
  // Informations globales
  platform: {
    name: "Sama CST",
    subtitle: "Technologies Services — Gestion Centralisée de Maintenance & Atelier",
    version: "2.4.0",
    lastUpdated: "02 Septembre 2026, 16:55",
    currentEntity: "Toutes les entités"
  },

  // 1. BASE DE DONNÉES TS (Sites & Noms de Clients)
  sitesTS: [
    {
      id: "SITE-001",
      nomClient: "Ciments du Sahel",
      secteur: "Industrie Cimentière",
      localisation: "Kirène, Thiès",
      responsableSite: "Mamadou Lamine Diop",
      telephone: "+221 77 450 89 12",
      email: "m.diop@cimentsdusahel.sn",
      parcEquipements: 48,
      equipementsEnAtelier: 5,
      slaHeures: 4,
      tauxDisponibilite: 96.8,
      technicienReferent: "Ousmane Fall",
      contrat: "Contrat Premium 24/7",
      statut: "Actif"
    },
    {
      id: "SITE-002",
      nomClient: "Eiffage Sénégal (Autoroute)",
      secteur: "BTP & Infrastructures",
      localisation: "Dakar - Rufisque",
      responsableSite: "Babacar Ndiaye",
      telephone: "+221 78 312 45 67",
      email: "b.ndiaye@eiffage.sn",
      parcEquipements: 36,
      equipementsEnAtelier: 4,
      slaHeures: 6,
      tauxDisponibilite: 94.2,
      technicienReferent: "Abdoulaye Sow",
      contrat: "Contrat Standard",
      statut: "Actif"
    },
    {
      id: "SITE-003",
      nomClient: "Dangote Cement Senegal",
      secteur: "Industrie Lourde",
      localisation: "Pout, Thiès",
      responsableSite: "Fatou Bintou Seck",
      telephone: "+221 76 890 23 41",
      email: "fatou.seck@dangote.com",
      parcEquipements: 62,
      equipementsEnAtelier: 7,
      slaHeures: 4,
      tauxDisponibilite: 98.1,
      technicienReferent: "Ibrahima Gueye",
      contrat: "Contrat Full Maintenance",
      statut: "Actif"
    },
    {
      id: "SITE-004",
      nomClient: "ICS - Industries Chimiques du Sénégal",
      secteur: "Chimie & Mines",
      localisation: "Mboro / Darou Khoudoss",
      responsableSite: "Cheikh Tidiane Sy",
      telephone: "+221 77 654 32 10",
      email: "ct.sy@ics-senegal.com",
      parcEquipements: 75,
      equipementsEnAtelier: 6,
      slaHeures: 3,
      tauxDisponibilite: 91.5,
      technicienReferent: "Moussa Diakhaté",
      contrat: "Contrat Industriel Critique",
      statut: "Actif"
    },
    {
      id: "SITE-005",
      nomClient: "Port Autonome de Dakar (DP World)",
      secteur: "Logistique & Portuaire",
      localisation: "Zone Portuaire Dakar",
      responsableSite: "Serigne Mbaye",
      telephone: "+221 70 987 65 43",
      email: "smbaye@dpworld.com",
      parcEquipements: 84,
      equipementsEnAtelier: 4,
      slaHeures: 2,
      tauxDisponibilite: 97.4,
      technicienReferent: "Ousmane Fall",
      contrat: "Contrat 24/7 Haute Disponibilité",
      statut: "Actif"
    },
    {
      id: "SITE-006",
      nomClient: "Senelec - Centrale de Bel Air & Malicounda",
      secteur: "Énergie & Utilités",
      localisation: "Dakar / Mbour",
      responsableSite: "Aminata Traoré",
      telephone: "+221 77 123 98 76",
      email: "atraore@senelec.sn",
      parcEquipements: 54,
      equipementsEnAtelier: 2,
      slaHeures: 2,
      tauxDisponibilite: 99.2,
      technicienReferent: "Abdoulaye Sow",
      contrat: "Contrat Stratégique National",
      statut: "Actif"
    },
    {
      id: "SITE-007",
      nomClient: "Grande Côte Opérations (GCO Eramet)",
      secteur: "Mines & Extraction",
      localisation: "Diogo, Thiès",
      responsableSite: "Jean-Paul Mendy",
      telephone: "+221 78 456 12 89",
      email: "jp.mendy@eramet-gco.com",
      parcEquipements: 92,
      equipementsEnAtelier: 8,
      slaHeures: 4,
      tauxDisponibilite: 93.8,
      technicienReferent: "Ibrahima Gueye",
      contrat: "Contrat Heavy Duty",
      statut: "Actif"
    }
  ],

  // 1.5. PARC GLOBAL DES ÉQUIPEMENTS TS (Vue par Équipement)
  parcEquipementsTS: [
    {
      codeEquipement: "EQ-CAT-320D-01",
      designation: "Excavatrice Hydraulique sur Chenilles",
      fournisseur: "Caterpillar",
      modele: "320D L Series",
      numSerie: "CAT-320D-SN84920",
      client: "Ciments du Sahel",
      siteLocalisation: "Kirène, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2022,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-20",
      prochaineMaintenance: "2026-09-15",
      technicienReferent: "Ousmane Fall",
      criticite: "A (Critique)",
      tauxDisponibilite: 91.5
    },
    {
      codeEquipement: "EQ-ATL-GA75-02",
      designation: "Compresseur à Vis Rotative Lubrifiée",
      fournisseur: "Atlas Copco",
      modele: "GA 75 VSD+ Workplace",
      numSerie: "ATL-GA75-VSD-9941",
      client: "Dangote Cement Senegal",
      siteLocalisation: "Pout, Thiès",
      entite: "IMAG-CHIRG",
      categorie: "Air Comprimé & Fluides",
      anneeInstallation: 2023,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-09-03",
      prochaineMaintenance: "2026-12-03",
      technicienReferent: "Ibrahima Gueye",
      criticite: "A (Critique)",
      tauxDisponibilite: 98.6
    },
    {
      codeEquipement: "EQ-KMT-HD785-03",
      designation: "Tombereau Minier Rigide 100 Tonnes",
      fournisseur: "Komatsu",
      modele: "HD785-7 Heavy Duty",
      numSerie: "KMT-785-SN99210",
      client: "Grande Côte Opérations (GCO Eramet)",
      siteLocalisation: "Diogo, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2021,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-15",
      prochaineMaintenance: "2026-09-20",
      technicienReferent: "Ibrahima Gueye",
      criticite: "A (Critique)",
      tauxDisponibilite: 89.2
    },
    {
      codeEquipement: "EQ-VOL-EC480-04",
      designation: "Pelle Mécanique d'Extraction Lourde",
      fournisseur: "Volvo Construction",
      modele: "EC480E Heavy Duty",
      numSerie: "VOL-EC480-3301",
      client: "ICS - Industries Chimiques du Sénégal",
      siteLocalisation: "Mboro / Darou Khoudoss",
      entite: "IMAG-CHIRG",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2023,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-22",
      prochaineMaintenance: "2026-09-25",
      technicienReferent: "Moussa Diakhaté",
      criticite: "A (Critique)",
      tauxDisponibilite: 92.4
    },
    {
      codeEquipement: "EQ-SEN-W20V-05",
      designation: "Groupe Électrogène Diesel Lourd 18MW",
      fournisseur: "Wärtsilä",
      modele: "20V32 Heavy Fuel Engine",
      numSerie: "WRT-20V-9812",
      client: "Senelec - Centrale de Bel Air & Malicounda",
      siteLocalisation: "Centrale Bel Air Dakar",
      entite: "BIOMED",
      categorie: "Énergie & Groupes",
      anneeInstallation: 2020,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-18",
      prochaineMaintenance: "2026-09-18",
      technicienReferent: "Abdoulaye Sow",
      criticite: "A (Critique)",
      tauxDisponibilite: 94.8
    },
    {
      codeEquipement: "EQ-DPW-KCL-06",
      designation: "Reach Stacker Portuaire 45T Conteneurs",
      fournisseur: "Konecranes",
      modele: "SMV 4531 TC5",
      numSerie: "KON-SMV-4521",
      client: "Port Autonome de Dakar (DP World)",
      siteLocalisation: "Zone Portuaire Dakar",
      entite: "IMAG-CHIRG",
      categorie: "Manutention Portuaire",
      anneeInstallation: 2022,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-25",
      prochaineMaintenance: "2026-09-30",
      technicienReferent: "Ousmane Fall",
      criticite: "B (Majeur)",
      tauxDisponibilite: 96.1
    },
    {
      codeEquipement: "EQ-EIF-VOG-07",
      designation: "Finisseur d'Asphalte Haute Précision",
      fournisseur: "Vögele",
      modele: "SUPER 2100-3i Tracked",
      numSerie: "VOG-2100-1120",
      client: "Eiffage Sénégal (Autoroute)",
      siteLocalisation: "Dakar - Rufisque",
      entite: "BIOMED",
      categorie: "Routes & Asphalte",
      anneeInstallation: 2024,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-28",
      prochaineMaintenance: "2026-10-05",
      technicienReferent: "Abdoulaye Sow",
      criticite: "B (Majeur)",
      tauxDisponibilite: 95.3
    },
    {
      codeEquipement: "EQ-MED-VOL-08",
      designation: "Échographe Doppler Expert Gynéco-Obstétrique",
      fournisseur: "GE Healthcare",
      modele: "Voluson E10 HDLive",
      numSerie: "GE-VOL-E10-8841",
      client: "Clinique du Cap Dakar",
      siteLocalisation: "Avenue Pasteur, Dakar Plateau",
      entite: "BIOMED",
      categorie: "Imagerie Médicale",
      anneeInstallation: 2023,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-26",
      prochaineMaintenance: "2026-09-26",
      technicienReferent: "Fatou Kiné Ndiaye",
      criticite: "A (Critique)",
      tauxDisponibilite: 93.0
    },
    {
      codeEquipement: "EQ-MED-SOM-09",
      designation: "Scanner Hélicoïdal Multicoupes 128",
      fournisseur: "Siemens Healthineers",
      modele: "SOMATOM go.Top 128",
      numSerie: "SIEM-SOM-4019",
      client: "Hôpital Principal de Dakar",
      siteLocalisation: "1 Avenue Nelson Mandela, Dakar",
      entite: "IMAG-CHIRG",
      categorie: "Imagerie Médicale",
      anneeInstallation: 2022,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-29",
      prochaineMaintenance: "2026-10-10",
      technicienReferent: "Moussa Diakhaté",
      criticite: "A (Critique)",
      tauxDisponibilite: 94.5
    },
    {
      codeEquipement: "EQ-MED-MAG-10",
      designation: "IRM Haut Champ 1.5T BioMatrix",
      fournisseur: "Siemens Healthineers",
      modele: "Magnetom Altea 1.5T",
      numSerie: "SIEM-MAG-7712",
      client: "Clinique Madeleine Dakar",
      siteLocalisation: "Avenue des Cardes, Dakar",
      entite: "IMAG-CHIRG",
      categorie: "Imagerie Médicale",
      anneeInstallation: 2024,
      etatOperationnel: "En Atelier CST (Maintenance)",
      isAtelier: true,
      derniereRevision: "2026-08-30",
      prochaineMaintenance: "2026-10-15",
      technicienReferent: "Cheikh Amadou Tidiane",
      criticite: "A (Critique)",
      tauxDisponibilite: 96.0
    },
    {
      codeEquipement: "EQ-CS-BROY-11",
      designation: "Broyeur Vertical à Ciment 4 Roulants",
      fournisseur: "FLSmidth",
      modele: "OK 42-4 Cement Mill",
      numSerie: "FLS-OK42-7710",
      client: "Ciments du Sahel",
      siteLocalisation: "Kirène, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2020,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-20",
      prochaineMaintenance: "2026-11-20",
      technicienReferent: "Ousmane Fall",
      criticite: "A (Critique)",
      tauxDisponibilite: 99.1
    },
    {
      codeEquipement: "EQ-CS-FOUR-12",
      designation: "Ligne de Four Rotatif Clinker 4000T/j",
      fournisseur: "Fives FCB",
      modele: "FCB ClinkerLine 4000",
      numSerie: "FIV-FCB-8801",
      client: "Ciments du Sahel",
      siteLocalisation: "Kirène, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2019,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-06-15",
      prochaineMaintenance: "2026-12-15",
      technicienReferent: "Ousmane Fall",
      criticite: "A (Critique)",
      tauxDisponibilite: 98.4
    },
    {
      codeEquipement: "EQ-DAN-PUMP-13",
      designation: "Groupe Motopompe Multicellulaire HP",
      fournisseur: "KSB",
      modele: "Multitec D 50/8",
      numSerie: "KSB-MLT-4402",
      client: "Dangote Cement Senegal",
      siteLocalisation: "Pout, Thiès",
      entite: "IMAG-CHIRG",
      categorie: "Air Comprimé & Fluides",
      anneeInstallation: 2023,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-08-10",
      prochaineMaintenance: "2026-11-10",
      technicienReferent: "Ibrahima Gueye",
      criticite: "B (Majeur)",
      tauxDisponibilite: 99.5
    },
    {
      codeEquipement: "EQ-DAN-CRUSH-14",
      designation: "Concasseur Primaire à Mâchoires",
      fournisseur: "Metso Outotec",
      modele: "Nordberg C130",
      numSerie: "MET-C130-1920",
      client: "Dangote Cement Senegal",
      siteLocalisation: "Pout, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2021,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-28",
      prochaineMaintenance: "2026-10-28",
      technicienReferent: "Ibrahima Gueye",
      criticite: "A (Critique)",
      tauxDisponibilite: 97.9
    },
    {
      codeEquipement: "EQ-ICS-FLUID-15",
      designation: "Turbine à Vapeur de Cogénération 12MW",
      fournisseur: "MAN Energy Solutions",
      modele: "MARC-4 Steam Turbine",
      numSerie: "MAN-MARC-5510",
      client: "ICS - Industries Chimiques du Sénégal",
      siteLocalisation: "Mboro / Darou Khoudoss",
      entite: "BIOMED",
      categorie: "Énergie & Groupes",
      anneeInstallation: 2020,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-08-05",
      prochaineMaintenance: "2026-12-05",
      technicienReferent: "Moussa Diakhaté",
      criticite: "A (Critique)",
      tauxDisponibilite: 99.2
    },
    {
      codeEquipement: "EQ-ICS-ACID-16",
      designation: "Pompe de Circulation Acide Phosphorique",
      fournisseur: "Ensival Moret",
      modele: "CA-150 Sulzer Heavy Duty",
      numSerie: "ENS-CA150-3312",
      client: "ICS - Industries Chimiques du Sénégal",
      siteLocalisation: "Mboro / Darou Khoudoss",
      entite: "IMAG-CHIRG",
      categorie: "Air Comprimé & Fluides",
      anneeInstallation: 2022,
      etatOperationnel: "En Révision Préventive",
      isAtelier: false,
      derniereRevision: "2026-08-31",
      prochaineMaintenance: "2026-09-10",
      technicienReferent: "Moussa Diakhaté",
      criticite: "B (Majeur)",
      tauxDisponibilite: 94.0
    },
    {
      codeEquipement: "EQ-PAD-STS-17",
      designation: "Portique de Quai STS Super Post-Panamax",
      fournisseur: "ZPMC",
      modele: "STS-65T Twin-Lift",
      numSerie: "ZPMC-STS-9901",
      client: "Port Autonome de Dakar (DP World)",
      siteLocalisation: "Zone Portuaire Dakar",
      entite: "IMAG-CHIRG",
      categorie: "Manutention Portuaire",
      anneeInstallation: 2018,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-10",
      prochaineMaintenance: "2026-11-10",
      technicienReferent: "Ousmane Fall",
      criticite: "A (Critique)",
      tauxDisponibilite: 98.7
    },
    {
      codeEquipement: "EQ-PAD-RTG-18",
      designation: "Portique de Parc Électrique E-RTG 40T",
      fournisseur: "Kalmar",
      modele: "E-One2 Zero Emission",
      numSerie: "KAL-RTG-6620",
      client: "Port Autonome de Dakar (DP World)",
      siteLocalisation: "Zone Portuaire Dakar",
      entite: "BIOMED",
      categorie: "Manutention Portuaire",
      anneeInstallation: 2023,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-08-14",
      prochaineMaintenance: "2026-11-14",
      technicienReferent: "Ousmane Fall",
      criticite: "A (Critique)",
      tauxDisponibilite: 97.8
    },
    {
      codeEquipement: "EQ-SEN-TRANS-19",
      designation: "Transformateur de Puissance HT/MT 60MVA",
      fournisseur: "Schneider Electric",
      modele: "Minera Power 60MVA 90/30kV",
      numSerie: "SCH-TRF-60MVA-01",
      client: "Senelec - Centrale de Bel Air & Malicounda",
      siteLocalisation: "Centrale Bel Air Dakar",
      entite: "BIOMED",
      categorie: "Énergie & Groupes",
      anneeInstallation: 2021,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-06-25",
      prochaineMaintenance: "2026-12-25",
      technicienReferent: "Abdoulaye Sow",
      criticite: "A (Critique)",
      tauxDisponibilite: 99.8
    },
    {
      codeEquipement: "EQ-SEN-AERO-20",
      designation: "Aérocondenseur Refroidissement 8 Cellules",
      fournisseur: "Hamon",
      modele: "ACC-8Cell Air Cooled",
      numSerie: "HAM-ACC-8812",
      client: "Senelec - Centrale de Bel Air & Malicounda",
      siteLocalisation: "Centrale Bel Air Dakar",
      entite: "BIOMED",
      categorie: "Énergie & Groupes",
      anneeInstallation: 2022,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-30",
      prochaineMaintenance: "2026-10-30",
      technicienReferent: "Abdoulaye Sow",
      criticite: "B (Majeur)",
      tauxDisponibilite: 98.9
    },
    {
      codeEquipement: "EQ-GCO-DREDG-21",
      designation: "Drague d'Extraction Flottante Zircon",
      fournisseur: "Damen IHC Mining",
      modele: "Beaver 65 Mining Dredger",
      numSerie: "IHC-BEAV-9910",
      client: "Grande Côte Opérations (GCO Eramet)",
      siteLocalisation: "Diogo, Thiès",
      entite: "BIOMED",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2020,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-12",
      prochaineMaintenance: "2026-11-12",
      technicienReferent: "Ibrahima Gueye",
      criticite: "A (Critique)",
      tauxDisponibilite: 97.4
    },
    {
      codeEquipement: "EQ-GCO-MSP-22",
      designation: "Séparateur Électrostatique Minéraux Lourds",
      fournisseur: "Outotec",
      modele: "CoronaStat 3000 High Voltage",
      numSerie: "OUT-CST-4412",
      client: "Grande Côte Opérations (GCO Eramet)",
      siteLocalisation: "Diogo, Thiès",
      entite: "IMAG-CHIRG",
      categorie: "Génie Minier & BTP",
      anneeInstallation: 2022,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-08-01",
      prochaineMaintenance: "2026-11-01",
      technicienReferent: "Ibrahima Gueye",
      criticite: "B (Majeur)",
      tauxDisponibilite: 96.8
    },
    {
      codeEquipement: "EQ-MED-ANESTH-23",
      designation: "Station d'Anesthésie Numérique & Respirateur",
      fournisseur: "Mindray",
      modele: "A9 Anesthesia System",
      numSerie: "MND-A9-2201",
      client: "Clinique du Cap Dakar",
      siteLocalisation: "Avenue Pasteur, Dakar Plateau",
      entite: "BIOMED",
      categorie: "Bloc Opératoire",
      anneeInstallation: 2024,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-08-15",
      prochaineMaintenance: "2026-11-15",
      technicienReferent: "Fatou Kiné Ndiaye",
      criticite: "A (Critique)",
      tauxDisponibilite: 99.6
    },
    {
      codeEquipement: "EQ-MED-ANGIO-24",
      designation: "Système d'Angiographie et Salle Hybride",
      fournisseur: "Philips Medical",
      modele: "Azurion 7 C20",
      numSerie: "PH-AZU-7109",
      client: "Hôpital Principal de Dakar",
      siteLocalisation: "1 Avenue Nelson Mandela, Dakar",
      entite: "IMAG-CHIRG",
      categorie: "Imagerie Médicale",
      anneeInstallation: 2023,
      etatOperationnel: "En Service (Opérationnel)",
      isAtelier: false,
      derniereRevision: "2026-07-25",
      prochaineMaintenance: "2026-10-25",
      technicienReferent: "Moussa Diakhaté",
      criticite: "A (Critique)",
      tauxDisponibilite: 98.2
    }
  ],

  // 2. ÉQUIPEMENTS ATELIER (Complet avec les 23 colonnes)
  equipementsAtelier: [
    {
      codeEquipement: "EQ-CAT-320D-01",
      description: "Excavatrice Hydraulique sur Chenilles",
      numSerie: "CAT-320D-SN84920",
      client: "Ciments du Sahel",
      dateEntree: "2026-08-20",
      dateSortie: "-",
      responsableReception: "Modou Faye",
      responsableTechnique: "Ousmane Fall",
      zoneActuelle: "Atelier Mécanique Lourde",
      motif: "Fuite sur vérin de flèche & surchauffe moteur",
      situation: "En traitement",
      statut: "DEPENDANT",
      etatSortie: "Non fonctionnel",
      nombreJoursAtelier: "-",
      dureeAtelier: "14 j",
      entite: "BIOMED",
      fournisseur: "Caterpillar",
      modele: "320D L Series",
      datePriseEnCharge: "2026-08-20 14:30",
      delaisPriseEnCharge: "2h 30m",
      dateFRB: "2026-08-22 09:15",
      delaisFRB: "42h 45m",
      criticite: "A (Critique)",
      coutEstime: "8 450 000 FCFA",
      timeline: [
        { date: "2026-08-20 12:00", event: "Arrivée et Réception atelier", agent: "Modou Faye", status: "done", resultat: "Machine sécurisée & baie 3 assignée" },
        { date: "2026-08-20 14:30", event: "Prise en charge & Diagnostic initial", agent: "Ousmane Fall", status: "done", resultat: "Pression vérin mesurée à 110 bars (anormale)" },
        { date: "2026-08-22 09:15", event: "Fiche FRB émise (Joints vérin & radiateur)", agent: "Ousmane Fall", status: "done", resultat: "Validation client Ciments du Sahel reçue" },
        { date: "2026-08-25 11:00", event: "Réception pièces de rechange", agent: "Magasin Central", status: "done", resultat: "Kits joints Cat d'origine conformes" },
        { date: "2026-08-28 08:30", event: "Démontage et usinage chemise de vérin", agent: "Ousmane Fall", status: "done", resultat: "Tolérances d'alésage H7 respectées" },
        { date: "2026-09-02 10:00", event: "Remontage du bloc et test pression", agent: "Ousmane Fall", status: "in-progress", resultat: "Pression 250 bars tenue sans fuite" },
        { date: "2026-09-04 16:00", event: "Banc d'essai hydraulique prévu", agent: "Contrôle Qualité & Métrologie", status: "pending", resultat: "Contrôle débit et température en cours" }
      ],
      pieces: [
        { ref: "CAT-9W-8472", nom: "Kit joints vérin flèche", qte: 2, cout: "650 000 FCFA", statut: "Installé" },
        { ref: "CAT-1R-0716", nom: "Filtre à huile haute pression", qte: 4, cout: "180 000 FCFA", statut: "Installé" },
        { ref: "CAT-HYD-550", nom: "Fluide hydraulique Cat HYDO Advanced 10W (200L)", qte: 1, cout: "920 000 FCFA", statut: "En stock" }
      ]
    },
    {
      codeEquipement: "EQ-ATL-GA75-02",
      description: "Compresseur à Vis Rotative Lubrifiée",
      numSerie: "ATL-GA75-VSD-9941",
      client: "Dangote Cement Senegal",
      dateEntree: "2026-08-27",
      dateSortie: "2026-09-03",
      responsableReception: "Alioune Badara",
      responsableTechnique: "Ibrahima Gueye",
      zoneActuelle: "Banc d'Essai & Contrôle",
      motif: "Vibrations anormales sur palier étage HP",
      situation: "Clôturé",
      statut: "CLÔTURE",
      etatSortie: "Fonctionnel",
      nombreJoursAtelier: 7,
      dureeAtelier: "-",
      entite: "IMAG-CHIRG",
      fournisseur: "Atlas Copco",
      modele: "GA 75 VSD+ Workplace",
      datePriseEnCharge: "2026-08-27 10:15",
      delaisPriseEnCharge: "1h 15m",
      dateFRB: "2026-08-28 14:00",
      delaisFRB: "27h 45m",
      criticite: "A (Critique)",
      coutEstime: "4 200 000 FCFA",
      timeline: [
        { date: "2026-08-27 09:00", event: "Réception atelier & contrôle visuel", agent: "Alioune Badara", status: "done", resultat: "Compresseur propre, filtre colmaté" },
        { date: "2026-08-27 10:15", event: "Analyse vibratoire spectrale", agent: "Ibrahima Gueye", status: "done", resultat: "Fréquence défaut BPFO 128 Hz détectée" },
        { date: "2026-08-28 14:00", event: "Émission FRB (Remplacement roulements SKF)", agent: "Ibrahima Gueye", status: "done", resultat: "Accord client Dangote validé" },
        { date: "2026-08-30 09:00", event: "Remplacement roulements & lignage laser", agent: "Ibrahima Gueye", status: "done", resultat: "Désalignement radial < 0.03 mm" },
        { date: "2026-09-02 14:00", event: "Essais 8 bars en charge continue", agent: "Contrôle Qualité & Métrologie", status: "in-progress", resultat: "Température de refoulement 82°C nominale" }
      ],
      pieces: [
        { ref: "SKF-7312-BECBM", nom: "Roulement à billes à contact oblique", qte: 2, cout: "420 000 FCFA", statut: "Installé" },
        { ref: "ATL-2901-0566", nom: "Kit séparateur air/huile", qte: 1, cout: "310 000 FCFA", statut: "Installé" }
      ]
    },
    {
      codeEquipement: "EQ-SIE-MOT-03",
      description: "Moteur Électrique Asynchrone 250 kW",
      numSerie: "SIE-1LE1-883492",
      client: "ICS - Industries Chimiques",
      dateEntree: "2026-08-15",
      dateSortie: "-",
      responsableReception: "Modou Faye",
      responsableTechnique: "Moussa Diakhaté",
      zoneActuelle: "Atelier Bobinage & Électrique",
      motif: "Claquer d'isolement stator & surtension",
      situation: "En attente pièces",
      statut: "DEPENDANT",
      etatSortie: "Non fonctionnel",
      nombreJoursAtelier: "-",
      dureeAtelier: "19 j",
      entite: "BIOMED",
      fournisseur: "Siemens",
      modele: "Simotics SD 1LE15 315L",
      datePriseEnCharge: "2026-08-15 16:00",
      delaisPriseEnCharge: "3h 00m",
      dateFRB: "2026-08-17 11:30",
      delaisFRB: "43h 30m",
      criticite: "A (Critique)",
      coutEstime: "12 800 000 FCFA",
      timeline: [
        { date: "2026-08-15 13:00", event: "Entrée atelier sur plateau lourd", agent: "Modou Faye", status: "done", resultat: "Déchargement au pont roulant 10T" },
        { date: "2026-08-15 16:00", event: "Test diélectrique & Mégohmmètre", agent: "Moussa Diakhaté", status: "done", resultat: "Résistance isolement < 0.2 MΩ (défaut franc)" },
        { date: "2026-08-17 11:30", event: "FRB bloquée : Fil de bobinage Classe H 200°C", agent: "Moussa Diakhaté", status: "done", resultat: "Rupture de stock local UEMOA" },
        { date: "2026-08-22 10:00", event: "Commande express chez distributeur Europe", agent: "Service Achats", status: "done", resultat: "Tracking DHL AWB-84920 actif" },
        { date: "2026-09-01 09:00", event: "Alerte relance logistique douane", agent: "Service Achats", status: "in-progress", resultat: "Dossier prioritaire transmis au transitaire" }
      ],
      pieces: [
        { ref: "SIE-WIRE-CLH-200", nom: "Fil émaillé cuivre thermoclasse H (120kg)", qte: 1, cout: "3 800 000 FCFA", statut: "En transit douane" },
        { ref: "SIE-VARN-991", nom: "Résine d'imprégnation sous vide VPI", qte: 2, cout: "950 000 FCFA", statut: "En stock" }
      ]
    },
    {
      codeEquipement: "EQ-KOM-PC400-04",
      description: "Pelle Minière Hydraulique 45T",
      numSerie: "KOM-PC400LC-5510",
      client: "Grande Côte Opérations",
      dateEntree: "2026-08-25",
      dateSortie: "2026-09-04",
      responsableReception: "Alioune Badara",
      responsableTechnique: "Ibrahima Gueye",
      zoneActuelle: "Atelier Chaudronnerie & Godet",
      motif: "Fissure structurelle bras & révision réducteur tourelle",
      situation: "Clôturé",
      statut: "CLÔTURE",
      etatSortie: "Fonctionnel",
      nombreJoursAtelier: 10,
      dureeAtelier: "-",
      entite: "IMAG-CHIRG",
      fournisseur: "Komatsu",
      modele: "PC400LC-8R",
      datePriseEnCharge: "2026-08-25 11:00",
      delaisPriseEnCharge: "1h 45m",
      dateFRB: "2026-08-26 15:30",
      delaisFRB: "28h 30m",
      criticite: "B (Majeur)",
      coutEstime: "6 700 000 FCFA",
      timeline: [
        { date: "2026-08-25 09:15", event: "Réception & Nettoyage haute pression", agent: "Alioune Badara", status: "done", resultat: "Fissure de 180mm mise à nu sur flèche" },
        { date: "2026-08-25 11:00", event: "Contrôle par magnétoscopie des fissures", agent: "Ibrahima Gueye", status: "done", resultat: "Profondeur estimée à 12mm" },
        { date: "2026-08-26 15:30", event: "FRB validée par le client GCO", agent: "Ibrahima Gueye", status: "done", resultat: "Bon de commande GCO-BC-4491 reçu" },
        { date: "2026-08-29 08:00", event: "Gougeage et chanfreinage des fissures", agent: "Atelier Usinage", status: "done", resultat: "Chanfrein en X 60° prêt pour soudage" },
        { date: "2026-09-02 11:00", event: "Soudage multipasse sous flux gazeux", agent: "Ibrahima Gueye", status: "in-progress", resultat: "Contrôle ultrasons CND conforme 100%" }
      ],
      pieces: [
        { ref: "KOM-WELD-HARD", nom: "Électrodes spéciales rechargement dur", qte: 50, cout: "450 000 FCFA", statut: "Installé" },
        { ref: "KOM-SEAL-SWING", nom: "Kit d'étanchéité couronne d'orientation", qte: 1, cout: "1 250 000 FCFA", statut: "En stock" }
      ]
    },
    {
      codeEquipement: "EQ-SCH-TGBT-05",
      description: "Disjoncteur Débrochable Masterpact 3200A",
      numSerie: "SCH-NW32H1-10029",
      client: "Port Autonome de Dakar",
      dateEntree: "2026-08-30",
      dateSortie: "2026-09-02",
      responsableReception: "Modou Faye",
      responsableTechnique: "Abdoulaye Sow",
      zoneActuelle: "Zone Peinture & Finition",
      motif: "Déclenchement intempestif & usure pôles",
      situation: "Clôturé",
      statut: "CLÔTURE",
      etatSortie: "Fonctionnel",
      nombreJoursAtelier: 3,
      dureeAtelier: "-",
      entite: "BIOMED",
      fournisseur: "Schneider Electric",
      modele: "Masterpact NW32 H1 Micrologic 6.0E",
      datePriseEnCharge: "2026-08-30 08:30",
      delaisPriseEnCharge: "0h 45m",
      dateFRB: "2026-08-30 16:00",
      delaisFRB: "07h 30m",
      criticite: "A (Critique)",
      coutEstime: "2 100 000 FCFA",
      timeline: [
        { date: "2026-08-30 07:45", event: "Réception express livraison PAD", agent: "Modou Faye", status: "done", resultat: "Disjoncteur pris en charge immédiatement" },
        { date: "2026-08-30 08:30", event: "Prise en charge & banc de déclenchement", agent: "Abdoulaye Sow", status: "done", resultat: "Déclencheur thermique décalé de 25%" },
        { date: "2026-08-30 16:00", event: "FRB & Devis validés immédiatement par PAD", agent: "Abdoulaye Sow", status: "done", resultat: "Procédure d'urgence portuaire activée" },
        { date: "2026-08-31 10:00", event: "Remplacement chambres de coupure et contacts", agent: "Abdoulaye Sow", status: "done", resultat: "Contacts neufs calibrés à 1500N" },
        { date: "2026-09-02 09:00", event: "Rapport d'étalonnage délivré avec succès", agent: "Abdoulaye Sow", status: "done", resultat: "Temps de déclenchement 42ms certifié" }
      ],
      pieces: [
        { ref: "SCH-NW-ARC-32", nom: "Chambres de coupure d'arc 3200A (jeu de 3)", qte: 1, cout: "1 100 000 FCFA", statut: "Installé" },
        { ref: "SCH-MIC-60E", nom: "Bloc déclencheur Micrologic recalibré", qte: 1, cout: "450 000 FCFA", statut: "Installé" }
      ]
    },
    {
      codeEquipement: "EQ-VOL-FH16-06",
      description: "Tracteur Routier Lourd 750 ch",
      numSerie: "VOL-FH16-750-6641",
      client: "Eiffage Sénégal",
      dateEntree: "2026-08-22",
      dateSortie: "-",
      responsableReception: "Alioune Badara",
      responsableTechnique: "Abdoulaye Sow",
      zoneActuelle: "Atelier Diagnostic Électronique",
      motif: "Défaut boîte I-Shift & perte de puissance turbo",
      situation: "Devis envoyé",
      statut: "DEPENDANT",
      etatSortie: "Non fonctionnel",
      nombreJoursAtelier: "-",
      dureeAtelier: "12 j",
      entite: "IMAG-CHIRG",
      fournisseur: "Volvo Trucks",
      modele: "FH16 750 Globetrotter XL",
      datePriseEnCharge: "2026-08-22 11:30",
      delaisPriseEnCharge: "2h 00m",
      dateFRB: "2026-08-24 10:00",
      delaisFRB: "46h 30m",
      criticite: "B (Majeur)",
      coutEstime: "5 600 000 FCFA",
      timeline: [
        { date: "2026-08-22 09:30", event: "Arrivée remorqué depuis chantier autoroute", agent: "Alioune Badara", status: "done", resultat: "Véhicule stationné baie lourde 1" },
        { date: "2026-08-22 11:30", event: "Diagnostic Tech Tool Volvo (actionneur boîte HS)", agent: "Abdoulaye Sow", status: "done", resultat: "Code défaut MID 130 PSID 27 FMI 9" },
        { date: "2026-08-24 10:00", event: "FRB émise et envoyée à la direction Eiffage", agent: "Abdoulaye Sow", status: "done", resultat: "Devis 5.6M FCFA en cours d'examen" },
        { date: "2026-08-28 15:00", event: "Relance commerciale pour approbation devis", agent: "Service Achats", status: "done", resultat: "En attente signature Directeur Matériel" },
        { date: "2026-09-02 08:30", event: "Alerte dépassement délai FRB > 8 jours", agent: "Superviseur", status: "in-progress", resultat: "Escalade hiérarchique déclenchée" }
      ],
      pieces: [
        { ref: "VOL-ISHIFT-ACT", nom: "Actionneur de commande de boîte I-Shift", qte: 1, cout: "2 400 000 FCFA", statut: "En attente bon" },
        { ref: "VOL-TURBO-750", nom: "Turbocompresseur à géométrie variable", qte: 1, cout: "1 850 000 FCFA", statut: "En attente bon" }
      ]
    },
    {
      codeEquipement: "EQ-KSB-PUMP-07",
      description: "Pompe Multicellulaire d'Alimentation Chaudière",
      numSerie: "KSB-HGC-4-12-882",
      client: "Senelec",
      dateEntree: "2026-08-29",
      dateSortie: "-",
      responsableReception: "Modou Faye",
      responsableTechnique: "Ousmane Fall",
      zoneActuelle: "Atelier Rectification & Usinage",
      motif: "Cavitation sévère sur impulseur 3ème étage",
      situation: "Back Up",
      statut: "DEPENDANT",
      etatSortie: "Fonctionnel / Dégradé",
      nombreJoursAtelier: "-",
      dureeAtelier: "5 j",
      entite: "BIOMED",
      fournisseur: "KSB Pumps",
      modele: "HGC 4/12 Haute Pression",
      datePriseEnCharge: "2026-08-29 09:00",
      delaisPriseEnCharge: "1h 00m",
      dateFRB: "2026-08-30 11:15",
      delaisFRB: "26h 15m",
      criticite: "A (Critique)",
      coutEstime: "7 300 000 FCFA",
      timeline: [
        { date: "2026-08-29 08:00", event: "Réception urgence centrale thermique", agent: "Modou Faye", status: "done", resultat: "Pompe multicellulaire sécurisée" },
        { date: "2026-08-29 09:00", event: "Démontage corps de pompe et inspection", agent: "Ousmane Fall", status: "done", resultat: "Impulseur inox perforé par cavitation" },
        { date: "2026-08-30 11:15", event: "FRB acceptée par Senelec en procédure d'urgence", agent: "Ousmane Fall", status: "done", resultat: "Ordre de travail validé 24h/24" },
        { date: "2026-09-01 14:00", event: "Équilibrage dynamique du rotor", agent: "Ousmane Fall", status: "done", resultat: "Balourd résiduel < 1.2 g.mm (ISO G2.5)" },
        { date: "2026-09-02 12:00", event: "Montage garniture mécanique double", agent: "Ousmane Fall", status: "in-progress", resultat: "Test étanchéité hydrostatique 40 bars OK" }
      ],
      pieces: [
        { ref: "KSB-IMP-HGC4", nom: "Impulseur inox 1.4408 usiné", qte: 1, cout: "2 100 000 FCFA", statut: "Installé" },
        { ref: "BURG-MECH-SEAL", nom: "Garniture mécanique Burgmann Cartex", qte: 2, cout: "1 450 000 FCFA", statut: "Installé" }
      ]
    },
    {
      codeEquipement: "EQ-SAN-CONV-08",
      description: "Tête Motrice Convoyeur à Bande 1200mm",
      numSerie: "SAN-DRIVE-1200-93",
      client: "Ciments du Sahel",
      dateEntree: "2026-08-26",
      dateSortie: "2026-09-03",
      responsableReception: "Alioune Badara",
      responsableTechnique: "Moussa Diakhaté",
      zoneActuelle: "Zone Nettoyage & Dégraissage",
      motif: "Rupture arbre réducteur et usure tambour",
      situation: "Clôturé",
      statut: "CLÔTURE",
      etatSortie: "Fonctionnel / Dégradé",
      nombreJoursAtelier: 8,
      dureeAtelier: "-",
      entite: "IMAG-CHIRG",
      fournisseur: "Sandvik",
      modele: "Drive Unit HD-1200",
      datePriseEnCharge: "2026-08-26 13:00",
      delaisPriseEnCharge: "1h 30m",
      dateFRB: "2026-08-27 16:45",
      delaisFRB: "27h 45m",
      criticite: "B (Majeur)",
      coutEstime: "3 900 000 FCFA",
      timeline: [
        { date: "2026-08-26 11:30", event: "Arrivée atelier", agent: "Alioune Badara", status: "done", resultat: "Arbre de transmission cisaillé net" },
        { date: "2026-08-26 13:00", event: "Expertise réducteur et contrôle métrologique", agent: "Moussa Diakhaté", status: "done", resultat: "Pignons sains, portée roulement à réusiner" },
        { date: "2026-08-27 16:45", event: "Validation devis et FRB", agent: "Moussa Diakhaté", status: "done", resultat: "Accord client Ciments du Sahel reçu" },
        { date: "2026-08-31 16:00", event: "Usinage nouvel arbre traité thermiquement", agent: "Atelier Usinage", status: "done", resultat: "Dureté 52 HRC contrôlée après trempe" },
        { date: "2026-09-02 09:30", event: "Garnissage céramique tambour moteur", agent: "Moussa Diakhaté", status: "in-progress", resultat: "Adhérence vulcanisée à froid conforme" }
      ],
      pieces: [
        { ref: "SAN-SHAFT-42CD4", nom: "Arbre usiné acier 42CrMo4", qte: 1, cout: "1 200 000 FCFA", statut: "Installé" },
        { ref: "RBL-CERAM-1200", nom: "Plaquettes de calorifugeage céramique", qte: 12, cout: "780 000 FCFA", statut: "Installé" }
      ]
    },
    {
      codeEquipement: "EQ-CAT-GEN-09",
      description: "Groupe Électrogène de Secours 1500 kVA",
      numSerie: "CAT-3512B-0982",
      client: "Dangote Cement Senegal",
      dateEntree: "2026-08-31",
      dateSortie: "2026-09-07",
      responsableReception: "Modou Faye",
      responsableTechnique: "Ousmane Fall",
      zoneActuelle: "Atelier Mécanique Lourde",
      motif: "Régulation électronique injection & vidange majeure",
      situation: "Clôturé",
      statut: "CLÔTURE",
      etatSortie: "Fonctionnel",
      nombreJoursAtelier: 7,
      dureeAtelier: "-",
      entite: "BIOMED",
      fournisseur: "Caterpillar",
      modele: "Cat 3512B HD Generator Set",
      datePriseEnCharge: "2026-08-31 10:00",
      delaisPriseEnCharge: "1h 15m",
      dateFRB: "2026-09-01 11:00",
      delaisFRB: "25h 00m",
      criticite: "B (Majeur)",
      coutEstime: "5 100 000 FCFA",
      timeline: [
        { date: "2026-08-31 08:45", event: "Réception sur châssis lourd", agent: "Modou Faye", status: "done", resultat: "Groupe électrogène 1500 kVA calé" },
        { date: "2026-08-31 10:00", event: "Prise en charge & Diagnostic Cat ET", agent: "Ousmane Fall", status: "done", resultat: "ECM moteur signale dérive injection cyl. 4/9" },
        { date: "2026-09-01 11:00", event: "FRB transmise au client", agent: "Ousmane Fall", status: "done", resultat: "Devis de 5.1M FCFA approuvé" },
        { date: "2026-09-02 08:00", event: "Remplacement régulateur EMCP 4.2", agent: "Ousmane Fall", status: "in-progress", resultat: "Fréquence stabilisée à 50.0 Hz ±0.1%" }
      ],
      pieces: [
        { ref: "CAT-EMCP-42", nom: "Panneau de contrôle EMCP 4.2", qte: 1, cout: "2 300 000 FCFA", statut: "En stock" },
        { ref: "CAT-INJ-3512", nom: "Injecteurs électroniques MEUI (jeu de 12)", qte: 1, cout: "1 950 000 FCFA", statut: "En stock" }
      ]
    },
    {
      codeEquipement: "EQ-ABB-VFD-10",
      description: "Variateur de Fréquence Moyenne Tension 800 kW",
      numSerie: "ABB-ACS880-9938",
      client: "ICS - Industries Chimiques",
      dateEntree: "2026-08-18",
      dateSortie: "-",
      responsableReception: "Alioune Badara",
      responsableTechnique: "Moussa Diakhaté",
      zoneActuelle: "Atelier Bobinage & Électrique",
      motif: "Explosion module IGBT Phase V",
      situation: "Devis à envoyer",
      statut: "DEPENDANT",
      etatSortie: "Non fonctionnel",
      nombreJoursAtelier: "-",
      dureeAtelier: "16 j",
      entite: "IMAG-CHIRG",
      fournisseur: "ABB",
      modele: "ACS880-07-1160A-7",
      datePriseEnCharge: "2026-08-18 14:00",
      delaisPriseEnCharge: "2h 00m",
      dateFRB: "2026-08-20 09:30",
      delaisFRB: "43h 30m",
      criticite: "A (Critique)",
      coutEstime: "9 800 000 FCFA",
      timeline: [
        { date: "2026-08-18 12:00", event: "Réception armoire variateur", agent: "Alioune Badara", status: "done", resultat: "Armoire 800 kW installée en salle d'essai" },
        { date: "2026-08-18 14:00", event: "Diagnostic & oscilloscope", agent: "Moussa Diakhaté", status: "done", resultat: "Modules IGBT phase V en court-circuit" },
        { date: "2026-08-20 09:30", event: "FRB bloquée : Cartes de pilotage introuvables", agent: "Moussa Diakhaté", status: "done", resultat: "Pièces indisponibles sur marché local" },
        { date: "2026-08-25 15:00", event: "Relance fournisseur ABB Zurich", agent: "Service Achats", status: "done", resultat: "Approvisionnement express validé usine Suisse" },
        { date: "2026-09-02 08:30", event: "Alerte blocage critique niveau Direction", agent: "Superviseur", status: "in-progress", resultat: "Réunion de crise avec le client ICS" }
      ],
      pieces: [
        { ref: "ABB-IGBT-3300V", nom: "Module IGBT HiPak 3.3kV 1200A", qte: 3, cout: "4 200 000 FCFA", statut: "En commande internationale" },
        { ref: "ABB-GATE-BCON", nom: "Carte de contrôle BCU-02", qte: 1, cout: "1 650 000 FCFA", statut: "En transit" }
      ]
    }
  ],

  // 3. STATISTIQUES DES TECHNICIENS (Pour Page 2 : Performance Technique)
  techniciensStats: [
    {
      nom: "Ousmane Fall",
      specialite: "Mécanique & Hydraulique Lourde",
      mttrMoyenHeures: 3.2,
      ordresTotal: 46,
      ordresCloturesDelai: 43,
      tauxCloture: 93.5,
      tempsMoyenDiag: "1h 15m",
      efficaciteIndex: 97,
      backlogActuel: 3
    },
    {
      nom: "Ibrahima Gueye",
      specialite: "Usinage, Chaudronnerie & Turbomachines",
      mttrMoyenHeures: 3.6,
      ordresTotal: 38,
      ordresCloturesDelai: 35,
      tauxCloture: 92.1,
      tempsMoyenDiag: "1h 40m",
      efficaciteIndex: 94,
      backlogActuel: 2
    },
    {
      nom: "Abdoulaye Sow",
      specialite: "Électricité Haute Puissance & Automatisme",
      mttrMoyenHeures: 2.8,
      ordresTotal: 52,
      ordresCloturesDelai: 49,
      tauxCloture: 94.2,
      tempsMoyenDiag: "0h 50m",
      efficaciteIndex: 98,
      backlogActuel: 2
    },
    {
      nom: "Moussa Diakhaté",
      specialite: "Électronique de Puissance & Bobinage",
      mttrMoyenHeures: 4.8,
      ordresTotal: 34,
      ordresCloturesDelai: 27,
      tauxCloture: 79.4,
      tempsMoyenDiag: "2h 30m",
      efficaciteIndex: 82,
      backlogActuel: 4
    }
  ],

  // 4. MATRICE DE BLOCAGE 4 AXES (Pour Page 2 : Performance Technique)
  blocages4Axes: [
    {
      axe: "1. Axe Pièces & Approvisionnement",
      description: "Rupture de stock local, délais d'importation et dédouanement",
      nbEquipementsImpactes: 8,
      delaiMoyenAttente: "11.4 jours",
      severite: "Élevée (Rouge)",
      valeurBloquee: "34 800 000 FCFA",
      planAction: "Création d'un stock tampon consigné chez Sama CST avec fournisseurs partenaires"
    },
    {
      axe: "2. Axe Validation Client / Devis FRB",
      description: "Temps d'approbation des devis et bons de commande par les comités clients",
      nbEquipementsImpactes: 5,
      delaiMoyenAttente: "6.8 jours",
      severite: "Moyenne (Orange)",
      valeurBloquee: "18 200 000 FCFA",
      planAction: "Mise en place d'un seuil d'autorisation automatique FRB < 3M FCFA dans les contrats"
    },
    {
      axe: "3. Axe Compétence & Outillage Spécifique",
      description: "Besoin d'outils de calage constructeur ou bancs d'essai haute tension",
      nbEquipementsImpactes: 2,
      delaiMoyenAttente: "3.2 jours",
      severite: "Faible (Vert)",
      valeurBloquee: "6 400 000 FCFA",
      planAction: "Acquisition de la valise de programmation multimarque et formation de 2 techniciens"
    },
    {
      axe: "4. Axe Logistique & Accès Site",
      description: "Disponibilité des remorques porte-engins lourds et autorisations d'accès",
      nbEquipementsImpactes: 3,
      delaiMoyenAttente: "2.1 jours",
      severite: "Faible (Vert)",
      valeurBloquee: "9 100 000 FCFA",
      planAction: "Partenariat prioritaire avec transporteur agréé convois exceptionnels"
    }
  ],

  // 5. DONNÉES DE CRITICITÉ (Pour Page 3 : Risques & Dépendances)
  criticiteData: [
    {
      code: "EQ-SIE-MOT-03",
      nom: "Moteur Stator 250 kW (ICS)",
      classe: "Critique A",
      impactOperationnel: "Arrêt ligne phosphorique principale",
      spof: "Oui (Point unique sans secours)",
      joursBlocage: 18,
      delaiFRB: "> 48h dépassé",
      statutAlerte: "Critique Rouge"
    },
    {
      code: "EQ-ABB-VFD-10",
      nom: "Variateur ACS880 800kW (ICS)",
      classe: "Critique A",
      impactOperationnel: "Baisse cadence broyage 40%",
      spof: "Oui (Sans redondance)",
      joursBlocage: 15,
      delaiFRB: "> 48h dépassé",
      statutAlerte: "Critique Rouge"
    },
    {
      code: "EQ-VOL-FH16-06",
      nom: "Tracteur Routier Lourd (Eiffage)",
      classe: "Majeur B",
      impactOperationnel: "Ralentissement logistique chantiers",
      spof: "Non (Redondance partielle)",
      joursBlocage: 11,
      delaiFRB: "En attente Bon Client",
      statutAlerte: "Alerte Orange"
    },
    {
      code: "EQ-CAT-320D-01",
      nom: "Pelle Chenilles 320D (Ciments du Sahel)",
      classe: "Critique A",
      impactOperationnel: "Extraction carrière calcaire",
      spof: "Non (Machine de secours déployée)",
      joursBlocage: 13,
      delaiFRB: "Validé - Remontage",
      statutAlerte: "En cours maîtrisé"
    },
    {
      code: "EQ-KOM-PC400-04",
      nom: "Pelle Minière PC400 (GCO)",
      classe: "Majeur B",
      impactOperationnel: "Transfert stériles mine",
      spof: "Non (Flotte de 4 pelles)",
      joursBlocage: 8,
      delaiFRB: "Validé",
      statutAlerte: "En cours maîtrisé"
    }
  ],

  // 6. ALERTES BLOQUANTES URGENTES (Fond Rouge)
  alertesBlocages: [
    {
      id: "ALT-2026-091",
      titre: "BLOCAGE CRITIQUE : Rupture pièce sur Moteur Stator 250 kW (ICS)",
      equipement: "EQ-SIE-MOT-03 (Siemens 1LE1)",
      client: "ICS - Industries Chimiques",
      duree: "Bloqué depuis 18 jours",
      motif: "Fil de bobinage thermoclasse H bloqué en douane.",
      actionRequise: "Escalade auprès du commissionnaire agréé en douane pour dédouanement express sous 24h.",
      urgence: "Immédiate",
      dateDetection: "2026-08-17"
    },
    {
      id: "ALT-2026-092",
      titre: "BLOCAGE CRITIQUE : Approvisionnement Modules IGBT ABB ACS880",
      equipement: "EQ-ABB-VFD-10 (ABB Variateur)",
      client: "ICS - Industries Chimiques",
      duree: "Bloqué depuis 15 jours",
      motif: "Composants de puissance introuvables sur le marché UEMOA.",
      actionRequise: "Autoriser l'envoi avion prioritaire DHL Express depuis le hub central ABB Zurich.",
      urgence: "Immédiate",
      dateDetection: "2026-08-20"
    },
    {
      id: "ALT-2026-093",
      titre: "RETARD FRB CLIENT : Dépassement validation devis > 8 jours (Eiffage)",
      equipement: "EQ-VOL-FH16-06 (Volvo FH16)",
      client: "Eiffage Sénégal",
      duree: "En attente depuis 11 jours",
      motif: "Comité d'engagement client en attente de contre-expertise.",
      actionRequise: "Rendez-vous physique Direction Technique Sama CST avec Directeur Matériel Eiffage.",
      urgence: "Haute",
      dateDetection: "2026-08-24"
    }
  ],

  // 7. HISTOGRAMME MTTR & SÉRIES TEMPORELLES
  mttrHistorique: {
    labels: ["Avr 2026", "Mai 2026", "Juin 2026", "Juil 2026", "Août 2026", "Sept 2026"],
    mttrReel: [5.2, 4.7, 4.1, 3.9, 3.8, 3.5],
    objectifSLA: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0],
    interventionsCount: [118, 134, 142, 128, 156, 38]
  },

  // 8. RÉPARTITION PAR MARQUES (Technologies Services Palette)
  repartitionMarques: {
    labels: ["Caterpillar", "Siemens", "Atlas Copco", "Komatsu", "Schneider Electric", "Autres"],
    data: [35, 22, 18, 12, 8, 5],
    colors: ["#2E5090", "#72C100", "#4671B8", "#8BD91B", "#16243D", "#94A3B8"]
  },

  // 9. COUVERTURE DES CONTRATS & DISPONIBILITÉ ENTITÉS
  couvertureContrats: {
    labels: ["Contrat 24/7 Full", "Garantie Constructeur", "Régie / Ponctuel", "Non couvert"],
    data: [58, 24, 12, 6],
    colors: ["#2E5090", "#72C100", "#F59E0B", "#EF4444"]
  },

  etatParcGlobal: {
    labels: ["Opérationnel sur site", "En Maintenance Préventive", "En Panne Atelier", "En Attente Pièces", "Réformé"],
    data: [72, 14, 8, 4, 2],
    colors: ["#72C100", "#2E5090", "#F59E0B", "#EF4444", "#94A3B8"]
  },

  disponibiliteEntites: [
    { entite: "BIOMED", dispo: 96.8, cible: 95.0, total: 210, atelier: 14 },
    { entite: "IMAG-CHIRG", dispo: 95.4, cible: 95.0, total: 192, atelier: 11 }
  ],

  // 10. TOP 5 DES PLUS LONGUES DURÉES D'IMMOBILISATION
  top5Durees: [
    { rang: 1, code: "EQ-SIE-MOT-03", equipement: "Moteur Stator 250 kW", client: "ICS Sénégal", jours: 18, motif: "Rupture fil de bobinage Classe H" },
    { rang: 2, code: "EQ-ABB-VFD-10", equipement: "Variateur ACS880 800kW", client: "ICS Sénégal", jours: 15, motif: "Modules IGBT en commande internationale" },
    { rang: 3, code: "EQ-CAT-320D-01", equipement: "Pelle Chenilles 320D", client: "Ciments du Sahel", jours: 13, motif: "Usinage chemise & remontage hydraulique" },
    { rang: 4, code: "EQ-VOL-FH16-06", equipement: "Tracteur Lourd FH16", client: "Eiffage Sénégal", jours: 11, motif: "En attente validation devis FRB client" },
    { rang: 5, code: "EQ-KOM-PC400-04", equipement: "Pelle Minière PC400", client: "Grande Côte Opérations", jours: 8, motif: "Soudage multipasse bras de flèche" }
  ],

  // 11. CATALOGUE ÉQUIPEMENTS TS (5 COLONNES OFFICIELLES)
  equipementsTS: [
    {
      fournisseur: "GE Healthcare",
      designation: "Échographe Doppler Couleur Haute Définition",
      modele: "Voluson E10",
      categorie: "Imagerie Médicale & Échographie",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Siemens Healthineers",
      designation: "Scanner Tomodensitométrique 64 Coupes",
      modele: "SOMATOM go.Top",
      categorie: "Imagerie Médicale & Radiologie",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Siemens Healthineers",
      designation: "IRM 1.5 Tesla Haute Résolution",
      modele: "MAGNETOM Altea",
      categorie: "Imagerie Médicale & Résonance",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Mindray",
      designation: "Moniteur Multiparamétrique de Réanimation",
      modele: "BeneVision N17",
      categorie: "Monitorage & Soins Intensifs",
      entite: "BIOMED"
    },
    {
      fournisseur: "Mindray",
      designation: "Défibrillateur / Moniteur avec Pacemaker",
      modele: "BeneHeart D3",
      categorie: "Urgences & Réanimation",
      entite: "BIOMED"
    },
    {
      fournisseur: "Dräger",
      designation: "Station d'Anesthésie Haut de Gamme",
      modele: "Primus IE Infinity",
      categorie: "Anesthésie & Bloc Opératoire",
      entite: "BIOMED"
    },
    {
      fournisseur: "Dräger",
      designation: "Ventilateur de Réanimation Adulte & Néonatal",
      modele: "Evita V800",
      categorie: "Ventilation & Réanimation",
      entite: "BIOMED"
    },
    {
      fournisseur: "Karl Storz",
      designation: "Colonne de Coelioscopie & Vidéochirurgie 4K",
      modele: "IMAGE1 S 4K Rubina",
      categorie: "Endoscopie & Vidéochirurgie",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Karl Storz",
      designation: "Insufflateur Électronique Haute Pression 50L",
      modele: "Endoflator 50",
      categorie: "Chirurgie Laparoscopique",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Philips Healthcare",
      designation: "Arceau Chirurgical Mobile Haute Définition",
      modele: "Zenition 70 Flat Detector",
      categorie: "Radiologie Interventionnelle",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Philips Healthcare",
      designation: "Appareil de Radiologie Numérique Télécommandé",
      modele: "DigitalDiagnost C90",
      categorie: "Radiologie Conventionnelle",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Alcon",
      designation: "Système Phacoémulsification Ophtalmologique",
      modele: "Centurion Vision System",
      categorie: "Microchirurgie Ophtalmique",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Getinge",
      designation: "Table d'Opération Universelle Électro-hydraulique",
      modele: "Magnus 1180.01",
      categorie: "Chirurgie & Bloc Opératoire",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Getinge",
      designation: "Autoclave Stérilisateur à Vapeur 600 Litres",
      modele: "GSS67H Steam Sterilizer",
      categorie: "Stérilisation Centrale",
      entite: "BIOMED"
    },
    {
      fournisseur: "Olympus",
      designation: "Vidéo-Endoscope Digestif Haute Définition",
      modele: "EVIS EXERA III CLV-190",
      categorie: "Endoscopie Médicale",
      entite: "BIOMED"
    },
    {
      fournisseur: "Roche Diagnostics",
      designation: "Automate d'Analyses Biochimiques & Immuno",
      modele: "Cobas 6000 c501",
      categorie: "Laboratoire & Diagnostic",
      entite: "BIOMED"
    },
    {
      fournisseur: "Fresenius Medical Care",
      designation: "Générateur d'Hémodialyse de Haute Précision",
      modele: "5008S CorDiax",
      categorie: "Néphrologie & Hémodialyse",
      entite: "BIOMED"
    },
    {
      fournisseur: "Stryker",
      designation: "Moteur Chirurgical Orthopédique Haute Vitesse",
      modele: "System 8 Power Tool",
      categorie: "Chirurgie Orthopédique & Traumatologie",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Medtronic",
      designation: "Générateur Électrochirurgical avec Thermofusion",
      modele: "ForceTriad Energy Platform",
      categorie: "Électrochirurgie & Bloc",
      entite: "BIOMED"
    },
    {
      fournisseur: "Caterpillar",
      designation: "Excavatrice Hydraulique sur Chenilles 22T",
      modele: "320D L Series",
      categorie: "Engins & Électromécanique",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Caterpillar",
      designation: "Groupe Électrogène de Secours 1500 kVA",
      modele: "Cat 3512B HD",
      categorie: "Énergie & Groupes Électrogènes",
      entite: "BIOMED"
    },
    {
      fournisseur: "Schneider Electric",
      designation: "Disjoncteur Débrochable Basse Tension 3200A",
      modele: "Masterpact NW32 H1",
      categorie: "Distribution Électrique & TGBT",
      entite: "BIOMED"
    },
    {
      fournisseur: "Schneider Electric",
      designation: "Onduleur Triphasé Modulaire Haute Disponibilité",
      modele: "Galaxy VX 500kVA",
      categorie: "Onduleurs & Qualité Électrique",
      entite: "BIOMED"
    },
    {
      fournisseur: "Atlas Copco",
      designation: "Compresseur à Vis Lubrifiée Haute Efficacité",
      modele: "GA 75 VSD+ Workplace",
      categorie: "Fluides Médicaux & Air Comprimé",
      entite: "BIOMED"
    },
    {
      fournisseur: "Komatsu",
      designation: "Pelle Minière Hydraulique Lourde 45T",
      modele: "PC400LC-8R",
      categorie: "Engins Miniers & Chaudronnerie",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Siemens",
      designation: "Moteur Asynchrone Triphasé Haute Puissance 250kW",
      modele: "Simotics SD 1LE15 315L",
      categorie: "Électromécanique & Moteurs",
      entite: "BIOMED"
    },
    {
      fournisseur: "KSB Pumps",
      designation: "Pompe Multicellulaire d'Alimentation Haute Pression",
      modele: "HGC 4/12 Haute Pression",
      categorie: "Pompes & Turbomachines",
      entite: "BIOMED"
    },
    {
      fournisseur: "ABB",
      designation: "Variateur de Fréquence Moyenne Tension 800 kW",
      modele: "ACS880-07-1160A-7",
      categorie: "Électronique de Puissance",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Volvo Trucks",
      designation: "Tracteur Routier Lourd 750 ch",
      modele: "FH16 750 Globetrotter XL",
      categorie: "Véhicules Lourds & Logistique",
      entite: "IMAG-CHIRG"
    },
    {
      fournisseur: "Sandvik",
      designation: "Tête Motrice Convoyeur à Bande 1200mm",
      modele: "Drive Unit HD-1200",
      categorie: "Convoyage & Manutention",
      entite: "IMAG-CHIRG"
    }
  ],

  // 12. RÉFÉRENTIEL CLIENTS (9 COLONNES OFFICIELLES)
  clients: [
    {
      client: "CLT-001",
      adresseClient: "Zone Industrielle de Kirène, RN 2",
      villeClient: "Thiès",
      paysClient: "Sénégal",
      codePostal: "21000",
      nomClient: "Ciments du Sahel",
      telephoneClient: "+221 33 957 80 00",
      mailClient: "contact@cimentsdusahel.sn",
      rcNinea: "SN-THS-2002-B-4120 / 002148902"
    },
    {
      client: "CLT-002",
      adresseClient: "Km 3.5 Boulevard du Centenaire de la Commune",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10200",
      nomClient: "Eiffage Sénégal",
      telephoneClient: "+221 33 839 74 74",
      mailClient: "contact.senegal@eiffage.com",
      rcNinea: "SN-DKR-1960-B-0415 / 000189420"
    },
    {
      client: "CLT-003",
      adresseClient: "Village de Keur Moussa, Route de Pout",
      villeClient: "Pout",
      paysClient: "Sénégal",
      codePostal: "21500",
      nomClient: "Dangote Cement Senegal",
      telephoneClient: "+221 33 898 30 00",
      mailClient: "info.senegal@dangote.com",
      rcNinea: "SN-THS-2007-B-5890 / 004829103"
    },
    {
      client: "CLT-004",
      adresseClient: "Route des Phosphates, Usines de Darou Khoudoss",
      villeClient: "Mboro",
      paysClient: "Sénégal",
      codePostal: "21400",
      nomClient: "ICS - Industries Chimiques du Sénégal",
      telephoneClient: "+221 33 955 12 40",
      mailClient: "direction@ics-senegal.com",
      rcNinea: "SN-THS-1976-B-0112 / 000542318"
    },
    {
      client: "CLT-005",
      adresseClient: "21 Boulevard de la Libération, Zone Portuaire",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10000",
      nomClient: "Port Autonome de Dakar (DP World)",
      telephoneClient: "+221 33 849 45 45",
      mailClient: "portdakar@portdakar.sn",
      rcNinea: "SN-DKR-1987-B-0941 / 000874219"
    },
    {
      client: "CLT-006",
      adresseClient: "28 Rue Vincens, Direction Générale",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10200",
      nomClient: "Senelec",
      telephoneClient: "+221 33 839 30 30",
      mailClient: "contact@senelec.sn",
      rcNinea: "SN-DKR-1990-B-1184 / 000412890"
    },
    {
      client: "CLT-007",
      adresseClient: "Concession Minière de Diogo, Darou Khoudoss",
      villeClient: "Diogo",
      paysClient: "Sénégal",
      codePostal: "21450",
      nomClient: "Grande Côte Opérations (GCO Eramet)",
      telephoneClient: "+221 33 869 82 00",
      mailClient: "gco.contact@eramet.com",
      rcNinea: "SN-THS-2011-B-8941 / 005698124"
    },
    {
      client: "CLT-008",
      adresseClient: "1 Avenue Nelson Mandela, Plateau",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10000",
      nomClient: "Hôpital Principal de Dakar",
      telephoneClient: "+221 33 839 50 50",
      mailClient: "sec.direction@hpd.sn",
      rcNinea: "SN-DKR-1970-A-0045 / 000214589"
    },
    {
      client: "CLT-009",
      adresseClient: "Golf Sud, Route des Niayes",
      villeClient: "Guédiawaye",
      paysClient: "Sénégal",
      codePostal: "14000",
      nomClient: "Centre Hospitalier National Dalal Jamm",
      telephoneClient: "+221 33 879 33 33",
      mailClient: "contact@dalaljamm.sn",
      rcNinea: "SN-DKR-2016-A-1284 / 006451290"
    },
    {
      client: "CLT-010",
      adresseClient: "18 Avenue des Ambassadeurs, Fann Résidence",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10700",
      nomClient: "Clinique de la Madeleine",
      telephoneClient: "+221 33 889 94 70",
      mailClient: "accueil@cliniquemadeleine.sn",
      rcNinea: "SN-DKR-1995-B-2319 / 001458792"
    },
    {
      client: "CLT-011",
      adresseClient: "36 Avenue Pasteur, BP 220",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "10000",
      nomClient: "Institut Pasteur de Dakar",
      telephoneClient: "+221 33 839 92 00",
      mailClient: "pasteur@pasteur.sn",
      rcNinea: "SN-DKR-1980-A-0199 / 000329184"
    },
    {
      client: "CLT-012",
      adresseClient: "Route de Dakar, Quartier Dixième",
      villeClient: "Louga",
      paysClient: "Sénégal",
      codePostal: "42000",
      nomClient: "Centre Hospitalier Régional Amadou Sakhir Mbaye",
      telephoneClient: "+221 33 987 10 25",
      mailClient: "chrlouga@sante.gouv.sn",
      rcNinea: "SN-LGA-1992-A-0314 / 000918234"
    },
    {
      client: "CLT-013",
      adresseClient: "Km 9 Route des Almadies, Ouakam",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "12500",
      nomClient: "Hôpital Militaire de Ouakam",
      telephoneClient: "+221 33 869 14 00",
      mailClient: "contact@hmo.defense.sn",
      rcNinea: "SN-DKR-2005-A-0781 / 003981245"
    },
    {
      client: "CLT-014",
      adresseClient: "Route de Rufisque, Km 16, Mbao",
      villeClient: "Dakar",
      paysClient: "Sénégal",
      codePostal: "13000",
      nomClient: "Société Africaine de Raffinage (SAR)",
      telephoneClient: "+221 33 859 13 00",
      mailClient: "direction@sar.sn",
      rcNinea: "SN-DKR-1961-B-0082 / 000104592"
    }
  ],

  // 13. PERSONNEL CST (AGENT, EMAIL, POLE)
  personnelCST: [
    {
      agent: "Ousmane Fall",
      email: "ousmane.fall@technologies-services.sn",
      pole: "BIOMED",
      specialite: "Mécanique & Hydraulique Biomédicale",
      telephone: "+221 77 450 89 12",
      statut: "Actif"
    },
    {
      agent: "Ibrahima Gueye",
      email: "ibrahima.gueye@technologies-services.sn",
      pole: "IMAG-CHIRG",
      specialite: "Imagerie Lourde & Blocs Opératoires",
      telephone: "+221 78 312 45 67",
      statut: "Actif"
    },
    {
      agent: "Abdoulaye Sow",
      email: "abdoulaye.sow@technologies-services.sn",
      pole: "BIOMED",
      specialite: "Électricité & Automatisme Médical",
      telephone: "+221 76 890 23 41",
      statut: "Actif"
    },
    {
      agent: "Moussa Diakhaté",
      email: "moussa.diakhate@technologies-services.sn",
      pole: "IMAG-CHIRG",
      specialite: "Électronique de Puissance & Radiologie",
      telephone: "+221 77 654 32 10",
      statut: "Actif"
    },
    {
      agent: "Modou Faye",
      email: "modou.faye@technologies-services.sn",
      pole: "RÉCEPTION & ATELIER",
      specialite: "Supervision Réception & Entrées GMAO",
      telephone: "+221 70 987 65 43",
      statut: "Actif"
    },
    {
      agent: "Alioune Badara",
      email: "alioune.badara@technologies-services.sn",
      pole: "BANC D'ESSAI & CONTRÔLE",
      specialite: "Essais Dynamiques & Certification",
      telephone: "+221 77 123 98 76",
      statut: "Actif"
    },
    {
      agent: "Fatou Kiné Ndiaye",
      email: "fatou.ndiaye@technologies-services.sn",
      pole: "BIOMED",
      specialite: "Stérilisation, Fluides & Monitorage",
      telephone: "+221 78 456 12 89",
      statut: "Actif"
    },
    {
      agent: "Cheikh Amadou Tidiane",
      email: "cheikh.tidiane@technologies-services.sn",
      pole: "IMAG-CHIRG",
      specialite: "Scanner, IRM & Échographie 4D",
      telephone: "+221 76 543 21 09",
      statut: "Actif"
    },
    {
      agent: "Babacar Diop",
      email: "babacar.diop@technologies-services.sn",
      pole: "QUALITÉ & MÉTROLOGIE",
      specialite: "Étalonnage & Contrôle Qualité ISO",
      telephone: "+221 77 890 12 34",
      statut: "Actif"
    },
    {
      agent: "Awa Sarr",
      email: "awa.sarr@technologies-services.sn",
      pole: "BIOMED",
      specialite: "Laboratoire & Analyseurs Médicaux",
      telephone: "+221 70 321 65 47",
      statut: "Actif"
    },
    {
      agent: "Mamadou Lamine Cissé",
      email: "mamadou.cisse@technologies-services.sn",
      pole: "IMAG-CHIRG",
      specialite: "Tables d'Opération & Lampes Scialytiques",
      telephone: "+221 78 654 98 21",
      statut: "Actif"
    },
    {
      agent: "Samba Diallo",
      email: "samba.diallo@technologies-services.sn",
      pole: "SUPPORT & SAV",
      specialite: "Hotline Technique & Dépannage Site",
      telephone: "+221 76 123 45 67",
      statut: "Actif"
    }
  ]
};
