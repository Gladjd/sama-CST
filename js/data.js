// ==========================================================================
// PLATEFORME SAMA CST - BASE DE DONNÉES ET ÉTAT INITIAL (DATA STORE)
// Technologies Services (GMAO & Supervision Opérationnelle)
// ==========================================================================

const SAMA_DATA = {
  // Informations globales de la plateforme
  platform: {
    name: "Sama CST",
    subtitle: "Technologies Services — Gestion Centralisée de Maintenance & Atelier",
    version: "2.4.0",
    lastUpdated: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    currentEntity: "Toutes les entités"
  },

  // 1. BASE DE DONNÉES TS (Sites Clients sous contrat)
  sitesTS: [],

  // 2. PARC D'ÉQUIPEMENTS DÉPLOYÉS (Machines actives chez les clients)
  parcEquipementsTS: [],

  // 3. TABLEAU GMAO ÉQUIPEMENTS EN ATELIER (23 Colonnes Réglementaires)
  equipementsAtelier: [],

  // 4. STATISTIQUES TECHNICIENS CST
  techniciensStats: [],

  // 5. AXES DE BLOCAGE OPÉRATIONNELS (Attente Pièces, Devis FRB, Validation, Contrôle)
  blocages4Axes: [
    { axe: "Attente Pièces Détachées", nombre: 0, delaiMoyen: "0j", impact: "Faible", couleur: "#3B82F6" },
    { axe: "Devis / FRB en Validation", nombre: 0, delaiMoyen: "0j", impact: "Faible", couleur: "#F59E0B" },
    { axe: "Attente Accord Client", nombre: 0, delaiMoyen: "0j", impact: "Faible", couleur: "#8B5CF6" },
    { axe: "Banc d'Essai & Contrôle Qualité", nombre: 0, delaiMoyen: "0j", impact: "Faible", couleur: "#72C100" }
  ],

  // 6. MATRICE DE CRITICITÉ
  criticiteData: [],

  // 7. ALERTES ROUGES & BLOCAGES CRITIQUES
  alertesBlocages: [],

  // 8. HISTORIQUE MTTR (Délai Moyen de Réparation en Jours sur 6 Mois)
  mttrHistorique: {
    labels: ["Avril", "Mai", "Juin", "Juillet", "Août", "Septembre"],
    valeurs: [0, 0, 0, 0, 0, 0]
  },

  // 9. RÉPARTITION PAR MARQUES
  repartitionMarques: {
    labels: [],
    valeurs: []
  },

  // 10. COUVERTURE DES CONTRATS DE MAINTENANCE
  couvertureContrats: {
    labels: ["Contrat 24/7", "Contrat Standard", "Full Maintenance", "Industriel Critique"],
    valeurs: [0, 0, 0, 0]
  },

  // 11. ÉTAT GLOBAL DU PARC
  etatParcGlobal: {
    labels: ["Fonctionnel", "Dégradé", "À l'arrêt"],
    valeurs: [0, 0, 0]
  },

  // 12. TAUX DE DISPONIBILITÉ PAR ENTITÉ OPÉRATIONNELLE
  disponibiliteEntites: [
    { entite: "Pôle BIOMED", disponibilite: 100.0, total: 0, fonctionnels: 0, couleur: "#2E5090" },
    { entite: "Pôle IMAG-CHIRG", disponibilite: 100.0, total: 0, fonctionnels: 0, couleur: "#72C100" }
  ],

  // 13. TOP 5 DES IMMOBILISATIONS MAXIMALES
  top5Durees: [],

  // 14. CATALOGUE RÉFÉRENTIEL DES ÉQUIPEMENTS TS
  equipementsTS: [],

  // 15. RÉPERTOIRE DES CLIENTS TS (9 Colonnes Officielles)
  clients: [],

  // 16. RÉFÉRENTIEL DU PERSONNEL CST (Techniciens & Ingénieurs par Pôles)
  personnelCST: []
};
