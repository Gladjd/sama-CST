// ==============================================================================
// SAMA CST — TYPES TYPESCRIPT SUPABASE & MODÈLES DE DONNÉES
// ==============================================================================

export type UserRole = 'admin' | 'superviseur' | 'technicien' | 'client';
export type PoleType = 'BIOMED' | 'IMAG-CHIRG' | 'RÉCEPTION & ATELIER' | "BANC D'ESSAI & CONTRÔLE" | 'QUALITÉ & MÉTROLOGIE' | 'SUPPORT & SAV';

export type WorkshopStatus =
  | 'En Diagnostic'
  | 'En Réparation'
  | 'En Attente Pièces'
  | "En Contrôle / Banc d'Essai"
  | 'Prêt pour Livraison'
  | 'Livré / Clôturé'
  | 'Bloqué / Devis en Attente';

export type PriorityType = 'Urgente' | 'Haute' | 'Moyenne' | 'Basse';

export type FrbStatus = 'Non Requis' | 'Non Émis' | 'En Attente Validation Client' | 'Validé par Client' | 'Refusé';

export interface Profile {
  id: string;
  email: string;
  nom: string;
  pole: PoleType;
  specialite?: string;
  telephone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonnelCST {
  id: string;
  nom: string;
  email: string;
  pole: PoleType;
  specialite: string;
  telephone: string;
  actif: boolean;
  equipements_assignes?: number;
  created_at?: string;
}

export interface Client {
  id: string;
  code: string;
  nom: string;
  contact_nom: string;
  email: string;
  telephone: string;
  adresse: string;
  site_principal: string;
  type_contrat: string;
  sla_heures: number;
  equipements_count?: number;
  created_at?: string;
}

export interface SiteTS {
  id: string;
  client_id?: string;
  nom_site: string;
  client_nom: string;
  localisation: string;
  type_contrat: string;
  sla_resolution: string;
  technicien_referent: string;
  equipements_count: number;
  statut: 'Actif' | 'En Audit' | 'Sous Réserve' | 'Suspendu';
  derniere_visite?: string;
  created_at?: string;
}

export interface EquipementTS {
  id: string;
  code_equipement: string;
  designation: string;
  marque: string;
  modele: string;
  pole: 'BIOMED' | 'IMAG-CHIRG';
  type_service: string;
  statut: 'Actif' | 'Inactif' | 'En Révision';
  created_at?: string;
}

export interface ParcEquipementTS {
  id: string;
  code_machine: string;
  designation: string;
  client_id?: string;
  client_nom: string;
  site: string;
  marque_modele: string;
  num_serie: string;
  pole: 'BIOMED' | 'IMAG-CHIRG';
  etat_operationnel: 'En Service' | 'En Atelier CST' | 'En Réserve / Standby' | 'Arrêt / Panne';
  taux_disponibilite: number;
  en_atelier: boolean;
  derniere_maintenance?: string;
  prochaine_maintenance?: string;
  created_at?: string;
}

export interface InterventionTimelineStep {
  id?: string;
  atelier_id?: string;
  code_reception?: string;
  step_index: number;
  date_heure: string;
  responsable: string;
  statut: 'Effectué' | 'En cours' | 'En attente / Planifié';
  description: string;
  resultat_obtenu?: string;
}

export interface EquipementAtelier {
  id: string;
  code_reception: string;
  code_equipement: string;
  designation: string;
  client_id?: string;
  client_nom: string;
  num_serie: string;
  pole: 'BIOMED' | 'IMAG-CHIRG';
  date_entree: string;
  date_sortie_prevue?: string;
  date_sortie_reelle?: string;
  statut: WorkshopStatus;
  priorite: PriorityType;
  technicien_responsable: string;
  anomalie_signalee: string;
  devis_frb_statut: FrbStatus;
  montant_frb: number;
  date_frb?: string;
  date_prise_en_charge?: string;
  timeline?: InterventionTimelineStep[];
  created_at?: string;
}

export interface ActivityLog {
  id: string;
  user_email?: string;
  user_nom?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}
