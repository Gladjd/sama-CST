// ==============================================================================
// SAMA CST — SERVICE DE GESTION DES DONNÉES (SUPABASE AVEC FALLBACK HYBRIDE)
// ==============================================================================

import { createClient } from '@/lib/supabase/client';
import {
  Client,
  PersonnelCST,
  SiteTS,
  EquipementTS,
  ParcEquipementTS,
  EquipementAtelier,
  InterventionTimelineStep,
  ActivityLog,
} from '@/types/database.types';
import {
  INITIAL_CLIENTS,
  INITIAL_PERSONNEL,
  INITIAL_SITES,
  INITIAL_CATALOGUE,
  INITIAL_PARC_EQUIPEMENTS,
  INITIAL_ATELIER,
  INITIAL_LOGS,
} from './mockData';

// Stockage en mémoire local pour la réactivité immédiate sans configuration préalable
let localClients = [...INITIAL_CLIENTS];
let localPersonnel = [...INITIAL_PERSONNEL];
let localSites = [...INITIAL_SITES];
let localCatalogue = [...INITIAL_CATALOGUE];
let localParc = [...INITIAL_PARC_EQUIPEMENTS];
let localAtelier = [...INITIAL_ATELIER];
let localLogs = [...INITIAL_LOGS];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
}

export const SupabaseService = {
  // --------------------------------------------------------------------------
  // 1. PERSONNEL CST
  // --------------------------------------------------------------------------
  async getPersonnel(): Promise<PersonnelCST[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('personnel_cst')
          .select('*')
          .order('nom', { ascending: true });
        if (!error && data && data.length > 0) return data as PersonnelCST[];
      } catch (err) {
        console.warn('Supabase getPersonnel error, using local fallback:', err);
      }
    }
    return localPersonnel;
  },

  async addPersonnel(agent: Omit<PersonnelCST, 'id' | 'created_at'>): Promise<PersonnelCST> {
    const newAgent: PersonnelCST = {
      id: 'p-' + Date.now(),
      ...agent,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('personnel_cst').insert([agent]).select().single();
        if (!error && data) return data as PersonnelCST;
      } catch (err) {
        console.warn('Supabase addPersonnel error:', err);
      }
    }
    localPersonnel.unshift(newAgent);
    return newAgent;
  },

  // --------------------------------------------------------------------------
  // 2. CLIENTS
  // --------------------------------------------------------------------------
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('nom', { ascending: true });
        if (!error && data && data.length > 0) return data as Client[];
      } catch (err) {
        console.warn('Supabase getClients error, using fallback:', err);
      }
    }
    return localClients;
  },

  async addClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    const newClient: Client = {
      id: 'c-' + Date.now(),
      ...client,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('clients').insert([client]).select().single();
        if (!error && data) return data as Client;
      } catch (err) {
        console.warn('Supabase addClient error:', err);
      }
    }
    localClients.unshift(newClient);
    return newClient;
  },

  // --------------------------------------------------------------------------
  // 3. SITES TS
  // --------------------------------------------------------------------------
  async getSites(): Promise<SiteTS[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('sites_ts')
          .select('*')
          .order('nom_site', { ascending: true });
        if (!error && data && data.length > 0) return data as SiteTS[];
      } catch (err) {
        console.warn('Supabase getSites error, using fallback:', err);
      }
    }
    return localSites;
  },

  // --------------------------------------------------------------------------
  // 4. PARC EQUIPEMENTS TS
  // --------------------------------------------------------------------------
  async getParcEquipements(): Promise<ParcEquipementTS[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('parc_equipements_ts')
          .select('*')
          .order('code_machine', { ascending: true });
        if (!error && data && data.length > 0) return data as ParcEquipementTS[];
      } catch (err) {
        console.warn('Supabase getParcEquipements error, using fallback:', err);
      }
    }
    return localParc;
  },

  // --------------------------------------------------------------------------
  // 5. ATELIER & FICHES DE VIE 360°
  // --------------------------------------------------------------------------
  async getEquipementsAtelier(): Promise<EquipementAtelier[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('equipements_atelier')
          .select('*, timeline:interventions_timeline(*)')
          .order('date_entree', { ascending: false });
        if (!error && data && data.length > 0) return data as EquipementAtelier[];
      } catch (err) {
        console.warn('Supabase getEquipementsAtelier error, using fallback:', err);
      }
    }
    return localAtelier;
  },

  async addEquipementAtelier(item: Omit<EquipementAtelier, 'id' | 'created_at'>): Promise<EquipementAtelier> {
    const newAtelierItem: EquipementAtelier = {
      id: 'ea-' + Date.now(),
      ...item,
      timeline: item.timeline || [
        {
          step_index: 1,
          date_heure: new Date().toISOString().slice(0, 16).replace('T', ' '),
          responsable: item.technicien_responsable || 'Modou Faye',
          statut: 'Effectué',
          description: 'Réception en atelier et enregistrement de la fiche de vie',
          resultat_obtenu: 'Équipement inspecté et pris en charge au registre CST',
        }
      ],
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('equipements_atelier').insert([{
          code_reception: item.code_reception,
          code_equipement: item.code_equipement,
          designation: item.designation,
          client_nom: item.client_nom,
          num_serie: item.num_serie,
          pole: item.pole,
          date_entree: item.date_entree,
          date_sortie_prevue: item.date_sortie_prevue,
          statut: item.statut,
          priorite: item.priorite,
          technicien_responsable: item.technicien_responsable,
          anomalie_signalee: item.anomalie_signalee,
          devis_frb_statut: item.devis_frb_statut,
          montant_frb: item.montant_frb,
        }]).select().single();

        if (!error && data) {
          if (newAtelierItem.timeline && newAtelierItem.timeline.length > 0) {
            await supabase.from('interventions_timeline').insert(
              newAtelierItem.timeline.map((step) => ({
                atelier_id: data.id,
                code_reception: data.code_reception,
                step_index: step.step_index,
                date_heure: step.date_heure,
                responsable: step.responsable,
                statut: step.statut,
                description: step.description,
                resultat_obtenu: step.resultat_obtenu,
              }))
            );
          }
          return data as EquipementAtelier;
        }
      } catch (err) {
        console.warn('Supabase addEquipementAtelier error:', err);
      }
    }

    localAtelier.unshift(newAtelierItem);
    return newAtelierItem;
  },

  async updateInterventionStep(
    atelierId: string,
    stepIndex: number,
    updatedStep: Partial<InterventionTimelineStep>
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase
          .from('interventions_timeline')
          .update({
            date_heure: updatedStep.date_heure,
            responsable: updatedStep.responsable,
            statut: updatedStep.statut,
            description: updatedStep.description,
            resultat_obtenu: updatedStep.resultat_obtenu,
          })
          .match({ atelier_id: atelierId, step_index: stepIndex });
      } catch (err) {
        console.warn('Supabase updateInterventionStep error:', err);
      }
    }

    const item = localAtelier.find((a) => a.id === atelierId || a.code_reception === atelierId);
    if (item && item.timeline) {
      const step = item.timeline.find((s) => s.step_index === stepIndex);
      if (step) {
        Object.assign(step, updatedStep);
        return true;
      }
    }
    return false;
  },

  async addInterventionStep(atelierId: string, step: Omit<InterventionTimelineStep, 'step_index'>): Promise<boolean> {
    const item = localAtelier.find((a) => a.id === atelierId || a.code_reception === atelierId);
    if (item) {
      if (!item.timeline) item.timeline = [];
      const newStep: InterventionTimelineStep = {
        step_index: item.timeline.length + 1,
        ...step,
      };
      item.timeline.push(newStep);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          await supabase.from('interventions_timeline').insert([{
            atelier_id: item.id,
            code_reception: item.code_reception,
            step_index: newStep.step_index,
            date_heure: newStep.date_heure,
            responsable: newStep.responsable,
            statut: newStep.statut,
            description: newStep.description,
            resultat_obtenu: newStep.resultat_obtenu,
          }]);
        } catch (err) {
          console.warn('Supabase addInterventionStep error:', err);
        }
      }
      return true;
    }
    return false;
  },

  // --------------------------------------------------------------------------
  // 6. CATALOGUE TS
  // --------------------------------------------------------------------------
  async getCatalogue(): Promise<EquipementTS[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('equipements_ts')
          .select('*')
          .order('code_equipement', { ascending: true });
        if (!error && data && data.length > 0) return data as EquipementTS[];
      } catch (err) {
        console.warn('Supabase getCatalogue error, using fallback:', err);
      }
    }
    return localCatalogue;
  },

  // --------------------------------------------------------------------------
  // 7. AUDIT LOGS
  // --------------------------------------------------------------------------
  async getLogs(): Promise<ActivityLog[]> {
    return localLogs;
  },
};
