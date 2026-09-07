// ==============================================================================
// MOTEUR DE SYNCHRONISATION SUPABASE — SAMA CST
// Technologies Services (GMAO & Supervision Opérationnelle)
// ==============================================================================

window.supabaseSync = {
  client: null,
  isConnected: false,
  isSyncing: false,
  realtimeChannel: null,

  // Initialisation du client Supabase
  async init() {
    this.updateStatusBadge();

    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.isConfigured()) {
      console.log('ℹ️ Sama CST fonctionne en mode local (Données initiales data.js)');
      this.updateStatusBadge();
      return false;
    }

    if (typeof supabase === 'undefined' && typeof window.supabase === 'undefined') {
      console.warn('⚠️ La librairie @supabase/supabase-js n\'est pas chargée. Mode local actif.');
      this.updateStatusBadge();
      return false;
    }

    try {
      const createClient = (typeof supabase !== 'undefined' && supabase.createClient) ? supabase.createClient : window.supabase.createClient;
      this.client = createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
      
      // Test de connexion rapide
      const { data, error } = await this.client.from('clients').select('count', { count: 'exact', head: true });
      if (error) {
        console.warn('⚠️ Impossible de se connecter à Supabase:', error.message);
        this.isConnected = false;
        this.updateStatusBadge();
        return false;
      }

      this.isConnected = true;
      console.log('✅ Connecté avec succès à Supabase PostgreSQL !');
      this.updateStatusBadge();

      // Chargement initial des données distantes
      await this.loadAllDataFromSupabase();

      // Abonnement aux modifications Realtime
      this.setupRealtimeSubscription();
      return true;
    } catch (err) {
      console.error('❌ Erreur lors de l\'initialisation Supabase:', err);
      this.isConnected = false;
      this.updateStatusBadge();
      return false;
    }
  },

  // Charge toutes les tables depuis Supabase et met à jour SAMA_DATA
  async loadAllDataFromSupabase() {
    if (!this.isConnected || !this.client) return;

    this.isSyncing = true;
    this.updateStatusBadge();

    try {
      // 1. Clients
      const { data: clientsData } = await this.client
        .from('clients')
        .select('*')
        .order('code_client', { ascending: true })
        .range(0, 4999);
        
      if (clientsData && clientsData.length > 0) {
        SAMA_DATA.clients = clientsData.map(c => ({
          client: c.code_client,
          codeClient: c.code_client,
          nomClient: c.nom_client,
          secteur: c.secteur || 'Santé & Médical',
          adresseClient: c.adresse_client || c.adresse || c.ville_client || '-',
          villeClient: c.ville_client || 'Dakar',
          paysClient: c.pays_client || 'Sénégal',
          codePostal: c.code_postal || '-',
          telephoneClient: c.telephone || '-',
          telephone: c.telephone || '-',
          mailClient: c.email || '-',
          email: c.email || '-',
          contactPrincipal: c.contact_principal || c.contact_nom || 'Direction / SAV',
          registreCommerce: c.registre_commerce || '-',
          ninea: c.ninea || '-',
          rcNinea: c.rc_ninea || (c.ninea && c.ninea !== '-' ? `${c.registre_commerce || ''} / ${c.ninea}` : c.registre_commerce || '-'),
          statut: c.statut || 'Actif'
        }));
      }

      // 2. Personnel CST
      const { data: personnelData } = await this.client.from('personnel_cst').select('*').order('created_at', { ascending: false });
      if (personnelData && personnelData.length > 0) {
        SAMA_DATA.personnelCST = personnelData.map(p => ({
          codeAgent: p.code_agent,
          nomAgent: p.nom_agent,
          fonction: p.fonction,
          pole: p.pole,
          telephone: p.telephone,
          email: p.email,
          specialite: p.specialite,
          disponibilite: p.disponibilite || 'Disponible'
        }));
      }

      // 3. Catalogue Équipements TS
      const { data: catData } = await this.client.from('equipements_ts').select('*').order('created_at', { ascending: false });
      if (catData && catData.length > 0) {
        SAMA_DATA.equipementsTS = catData.map(e => ({
          codeTS: e.code_ts,
          designation: e.designation,
          modele: e.modele,
          fournisseur: e.fournisseur,
          entite: e.entite,
          categorie: e.categorie,
          statut: e.statut || 'Actif'
        }));
      }

      // 4. Sites TS
      const { data: sitesData } = await this.client.from('sites_ts').select('*').order('created_at', { ascending: false });
      if (sitesData && sitesData.length > 0) {
        SAMA_DATA.sitesTS = sitesData.map(s => ({
          id: s.site_code,
          nomClient: s.nom_client,
          secteur: s.secteur,
          localisation: s.localisation,
          responsableSite: s.responsable_site,
          telephone: s.telephone,
          email: s.email,
          parcEquipements: s.parc_equipements || 0,
          equipementsEnAtelier: s.equipements_en_atelier || 0,
          slaHeures: s.sla_heures || 4,
          tauxDisponibilite: parseFloat(s.taux_disponibilite) || 95.0,
          technicienReferent: s.technicien_referent,
          contrat: s.contrat,
          statut: s.statut || 'Actif'
        }));
      }

      // 5. Parc Équipements Déployé
      const { data: parcData } = await this.client.from('parc_equipements_ts').select('*').order('created_at', { ascending: false });
      if (parcData && parcData.length > 0) {
        SAMA_DATA.parcEquipementsTS = parcData.map(p => ({
          codeEquipement: p.code_equipement,
          nomEquipement: p.nom_equipement,
          client: p.client,
          site: p.site,
          pole: p.pole,
          numeroSerie: p.numero_serie,
          modele: p.modele,
          fournisseur: p.fournisseur,
          statut: p.statut,
          disponibilite: parseFloat(p.disponibilite) || 98.0,
          contrat: p.contrat,
          dateInstallation: p.date_installation,
          technicienReferent: p.technicien_referent
        }));
      }

      // 6. Équipements Atelier & Interventions
      const { data: atelierData } = await this.client.from('equipements_atelier').select('*').order('created_at', { ascending: false });
      if (atelierData && atelierData.length > 0) {
        // Récupérer les étapes et pièces
        const { data: etapesData } = await this.client.from('interventions_etapes').select('*').order('ordre', { ascending: true });
        const { data: piecesData } = await this.client.from('pieces_rechange').select('*');

        SAMA_DATA.equipementsAtelier = atelierData.map(eq => {
          const eqEtapes = (etapesData || []).filter(et => et.code_equipement === eq.code_equipement).map(et => ({
            titre: et.titre,
            date: et.date_etape,
            responsable: et.responsable,
            statut: et.statut,
            observation: et.observation || '',
            resultatObtenu: et.resultat_obtenu || ''
          }));

          const eqPieces = (piecesData || []).filter(pi => pi.code_equipement === eq.code_equipement).map(pi => ({
            reference: pi.reference,
            designation: pi.designation,
            quantite: pi.quantite,
            prixUnitaire: parseFloat(pi.prix_unitaire) || 0,
            statut: pi.statut_commande || 'Livrée'
          }));

          return {
            codeEquipement: eq.code_equipement,
            ficheDeVie: eq.fiche_de_vie,
            description: eq.description,
            numeroSerie: eq.numero_serie,
            client: eq.client,
            dateEntree: eq.date_entree,
            dateSortie: eq.date_sortie || '',
            respReception: eq.resp_reception,
            respTechnique: eq.resp_technique,
            zoneActuelle: eq.zone_actuelle,
            motifPanne: eq.motif_panne,
            situation: eq.situation,
            statut: eq.statut,
            etatSortie: eq.etat_sortie,
            joursAtelier: eq.jours_atelier || 0,
            numDevisFRB: eq.num_devis_frb || '',
            montantFRB: parseFloat(eq.montant_frb) || 0,
            dateEmissionFRB: eq.date_emission_frb || '',
            dateAccordClient: eq.date_accord_client || '',
            dateCommandePieces: eq.date_commande_pieces || '',
            dateReceptionPieces: eq.date_reception_pieces || '',
            diagnosticReception: eq.diagnostic_reception || '',
            actionsDecision: eq.actions_decision || '',
            entite: eq.entite,
            priorite: eq.priorite || 'Moyenne',
            etapesIntervention: eqEtapes.length > 0 ? eqEtapes : (eq.etapesIntervention || []),
            piecesRechange: eqPieces
          };
        });
      }

      console.log('🔄 Données SAMA_DATA synchronisées avec Supabase !');
      if (window.APP && typeof window.APP.renderCurrentView === 'function') {
        window.APP.renderCurrentView();
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données Supabase:', err);
    } finally {
      this.isSyncing = false;
      this.updateStatusBadge();
    }
  },

  // Abonnement Realtime Supabase
  setupRealtimeSubscription() {
    if (!this.isConnected || !this.client) return;

    try {
      if (this.realtimeChannel) {
        this.client.removeChannel(this.realtimeChannel);
      }

      this.realtimeChannel = this.client
        .channel('sama-cst-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
          console.log('⚡ Modification Supabase Realtime détectée:', payload.eventType, payload.table);
          this.loadAllDataFromSupabase();
        })
        .subscribe();
    } catch (err) {
      console.warn('⚠️ Abonnement Realtime non actif:', err);
    }
  },

  // --- CRUD SYNCHRONISATION ---

  // Sauvegarde / Ajout d'un équipement atelier
  async syncSaveEquipementAtelier(eq) {
    if (!this.isConnected || !this.client) return;

    try {
      const { data, error } = await this.client.from('equipements_atelier').upsert({
        code_equipement: eq.codeEquipement,
        fiche_de_vie: eq.ficheDeVie,
        description: eq.description,
        numero_serie: eq.numeroSerie,
        client: eq.client,
        date_entree: eq.dateEntree,
        date_sortie: eq.dateSortie || null,
        resp_reception: eq.respReception,
        resp_technique: eq.respTechnique,
        zone_actuelle: eq.zoneActuelle,
        motif_panne: eq.motifPanne,
        situation: eq.situation,
        statut: eq.statut,
        etat_sortie: eq.etatSortie,
        jours_atelier: eq.joursAtelier || 0,
        num_devis_frb: eq.numDevisFRB || null,
        montant_frb: eq.montantFRB || 0,
        date_emission_frb: eq.dateEmissionFRB || null,
        date_accord_client: eq.dateAccordClient || null,
        date_commande_pieces: eq.dateCommandePieces || null,
        date_reception_pieces: eq.dateReceptionPieces || null,
        diagnostic_reception: eq.diagnosticReception || null,
        actions_decision: eq.actionsDecision || null,
        entite: eq.entite,
        priorite: eq.priorite || 'Moyenne',
        updated_at: new Date().toISOString()
      }, { onConflict: 'code_equipement' });

      if (error) throw error;
      console.log('✅ Équipement Atelier sauvegardé dans Supabase:', eq.codeEquipement);
    } catch (err) {
      console.error('❌ Erreur syncSaveEquipementAtelier:', err);
    }
  },

  // Ajout / Modification d'une étape de Fiche de Vie
  async syncSaveTimelineStep(codeEquipement, step, orderIdx = 0) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('interventions_etapes').insert({
        code_equipement: codeEquipement,
        titre: step.titre,
        date_etape: step.date,
        responsable: step.responsable,
        statut: step.statut,
        observation: step.observation || '',
        resultat_obtenu: step.resultatObtenu || '',
        ordre: orderIdx
      });

      if (error) throw error;
      console.log('✅ Étape intervention synchronisée dans Supabase:', step.titre);
    } catch (err) {
      console.error('❌ Erreur syncSaveTimelineStep:', err);
    }
  },

  // Mise à jour complète des étapes d'un équipement
  async syncReplaceAllTimelineSteps(codeEquipement, steps) {
    if (!this.isConnected || !this.client) return;

    try {
      // 1. Supprimer les anciennes étapes
      await this.client.from('interventions_etapes').delete().eq('code_equipement', codeEquipement);
      
      // 2. Insérer les nouvelles étapes ordonnées
      if (steps && steps.length > 0) {
        const rows = steps.map((s, idx) => ({
          code_equipement: codeEquipement,
          titre: s.titre,
          date_etape: s.date,
          responsable: s.responsable,
          statut: s.statut,
          observation: s.observation || '',
          resultat_obtenu: s.resultatObtenu || '',
          ordre: idx
        }));
        const { error } = await this.client.from('interventions_etapes').insert(rows);
        if (error) throw error;
      }
      console.log('✅ Étapes Fiche de vie mises à jour dans Supabase pour', codeEquipement);
    } catch (err) {
      console.error('❌ Erreur syncReplaceAllTimelineSteps:', err);
    }
  },

  // Sauvegarde Client
  async syncSaveClient(client) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('clients').upsert({
        code_client: client.codeClient || client.client,
        nom_client: client.nomClient,
        secteur: client.secteur || 'Santé & Médical',
        adresse_client: client.adresseClient || client.adresse || '',
        ville_client: client.villeClient || 'Dakar',
        pays_client: client.paysClient || 'Sénégal',
        code_postal: client.codePostal || '-',
        telephone: client.telephoneClient || client.telephone || '-',
        email: client.mailClient || client.email || '-',
        contact_principal: client.contactPrincipal || client.contact_nom || 'Direction / SAV',
        registre_commerce: client.registreCommerce || '-',
        ninea: client.ninea || '-',
        rc_ninea: client.rcNinea || '-',
        statut: client.statut || 'Actif',
        updated_at: new Date().toISOString()
      }, { onConflict: 'code_client' });

      if (error) throw error;
      console.log('✅ Client synchronisé dans Supabase:', client.nomClient);
    } catch (err) {
      console.error('❌ Erreur syncSaveClient:', err);
    }
  },

  // Suppression Client
  async syncDeleteClient(codeClient) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('clients').delete().eq('code_client', codeClient);
      if (error) throw error;
      console.log('🗑️ Client supprimé de Supabase:', codeClient);
    } catch (err) {
      console.error('❌ Erreur syncDeleteClient:', err);
    }
  },

  // Sauvegarde Personnel
  async syncSavePersonnel(agent) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('personnel_cst').upsert({
        code_agent: agent.codeAgent,
        nom_agent: agent.nomAgent,
        fonction: agent.fonction,
        pole: agent.pole,
        telephone: agent.telephone,
        email: agent.email,
        specialite: agent.specialite,
        disponibilite: agent.disponibilite || 'Disponible',
        updated_at: new Date().toISOString()
      }, { onConflict: 'code_agent' });

      if (error) throw error;
      console.log('✅ Agent synchronisé dans Supabase:', agent.nomAgent);
    } catch (err) {
      console.error('❌ Erreur syncSavePersonnel:', err);
    }
  },

  // Suppression Personnel
  async syncDeletePersonnel(codeAgent) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('personnel_cst').delete().eq('code_agent', codeAgent);
      if (error) throw error;
      console.log('🗑️ Agent supprimé de Supabase:', codeAgent);
    } catch (err) {
      console.error('❌ Erreur syncDeletePersonnel:', err);
    }
  },

  // Sauvegarde Catalogue Équipement TS
  async syncSaveEquipementTS(eq) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('equipements_ts').upsert({
        code_ts: eq.codeTS,
        designation: eq.designation,
        modele: eq.modele,
        fournisseur: eq.fournisseur,
        entite: eq.entite,
        categorie: eq.categorie,
        statut: eq.statut || 'Actif',
        updated_at: new Date().toISOString()
      }, { onConflict: 'code_ts' });

      if (error) throw error;
      console.log('✅ Équipement catalogue synchronisé dans Supabase:', eq.designation);
    } catch (err) {
      console.error('❌ Erreur syncSaveEquipementTS:', err);
    }
  },

  // Suppression Catalogue Équipement TS
  async syncDeleteEquipementTS(codeTS) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('equipements_ts').delete().eq('code_ts', codeTS);
      if (error) throw error;
      console.log('🗑️ Équipement catalogue supprimé de Supabase:', codeTS);
    } catch (err) {
      console.error('❌ Erreur syncDeleteEquipementTS:', err);
    }
  },

  // Met à jour le badge de statut dans l'en-tête (Topbar)
  updateStatusBadge() {
    const badge = document.getElementById('supabase-status-badge');
    if (!badge) return;

    if (this.isConnected) {
      badge.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#72C100; margin-right:6px; box-shadow:0 0 6px rgba(114,193,0,0.6);"></span>
        <span style="color:#16243D; font-weight:600; font-size:12px;">Supabase Connecté</span>
      `;
      badge.title = 'Base de données Supabase PostgreSQL connectée et synchronisée en temps réel.';
    } else if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.isConfigured()) {
      badge.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#F59E0B; margin-right:6px;"></span>
        <span style="color:#16243D; font-weight:600; font-size:12px;">Connexion...</span>
      `;
      badge.title = 'Tentative de connexion à Supabase...';
    } else {
      badge.innerHTML = `
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#94A3B8; margin-right:6px;"></span>
        <span style="color:#64748B; font-weight:600; font-size:12px;">Mode Local (Démo)</span>
      `;
      badge.title = 'Cliquez pour configurer vos clés Supabase et synchroniser vos données en direct.';
    }
  },

  // Modal de configuration Supabase (accessible en cliquant sur le badge)
  openConfigModal() {
    let modal = document.getElementById('modal-supabase-config');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-supabase-config';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 520px;">
          <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(114, 193, 0, 0.15); display: flex; align-items: center; justify-content: center; color: #72C100;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3 class="modal-title" style="margin:0; font-size:16px;">Connexion Base de Données Supabase</h3>
                <p style="margin:0; font-size:12px; color:#64748B;">Technologies Services • GMAO Sama CST</p>
              </div>
            </div>
            <button class="modal-close" onclick="supabaseSync.closeConfigModal()">&times;</button>
          </div>
          <form id="form-supabase-config" onsubmit="supabaseSync.handleConfigSubmit(event)" style="padding: 20px;">
            <p style="font-size: 13px; color: #475569; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">
              Connectez directement Sama CST à votre projet Supabase PostgreSQL. Vos clés sont conservées en toute sécurité dans votre navigateur.
            </p>
            <div class="form-group" style="margin-bottom: 14px;">
              <label style="font-size: 12px; font-weight: 600; color: #1E293B; display: block; margin-bottom: 6px;">URL du Projet Supabase (NEXT_PUBLIC_SUPABASE_URL)</label>
              <input type="url" id="cfg-supabase-url" class="form-input" placeholder="https://votre-projet.supabase.co" required style="width: 100%;">
            </div>
            <div class="form-group" style="margin-bottom: 18px;">
              <label style="font-size: 12px; font-weight: 600; color: #1E293B; display: block; margin-bottom: 6px;">Clé Publique Anon (NEXT_PUBLIC_SUPABASE_ANON_KEY)</label>
              <input type="password" id="cfg-supabase-key" class="form-input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required style="width: 100%;">
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 18px; font-size: 11.5px; color: #64748B;">
              💡 <strong>Scripts SQL fournis :</strong> Exécutez <code style="color:#2E5090;">supabase/schema.sql</code> dans le SQL Editor de Supabase pour initialiser les tables et index en 1 clic.
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <button type="button" class="btn-secondary" style="color:#DC2626; border-color:#FECACA;" onclick="supabaseSync.handleResetConfig()">Effacer & Mode Local</button>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn-secondary" onclick="supabaseSync.closeConfigModal()">Fermer</button>
                <button type="submit" class="btn-primary" style="background:#72C100; border-color:#61A500;">Enregistrer & Connecter</button>
              </div>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Pré-remplir avec les valeurs actuelles
    document.getElementById('cfg-supabase-url').value = window.SUPABASE_CONFIG.url || '';
    document.getElementById('cfg-supabase-key').value = window.SUPABASE_CONFIG.anonKey || '';

    modal.classList.add('active');
  },

  closeConfigModal() {
    const modal = document.getElementById('modal-supabase-config');
    if (modal) modal.classList.remove('active');
  },

  async handleConfigSubmit(e) {
    e.preventDefault();
    const url = document.getElementById('cfg-supabase-url').value;
    const key = document.getElementById('cfg-supabase-key').value;

    window.SUPABASE_CONFIG.saveCredentials(url, key);
    this.closeConfigModal();

    if (window.APP && typeof window.APP.showToast === 'function') {
      window.APP.showToast('Tentative de connexion à Supabase...', 'info');
    }

    const ok = await this.init();
    if (ok) {
      if (window.APP && typeof window.APP.showToast === 'function') {
        window.APP.showToast('✅ Connecté avec succès à Supabase PostgreSQL !', 'success');
      }
    } else {
      if (window.APP && typeof window.APP.showToast === 'function') {
        window.APP.showToast('⚠️ Impossible de joindre Supabase avec ces identifiants.', 'warning');
      }
    }
  },

  handleResetConfig() {
    window.SUPABASE_CONFIG.clearCredentials();
    this.isConnected = false;
    this.client = null;
    this.closeConfigModal();
    this.updateStatusBadge();
    if (window.APP && typeof window.APP.showToast === 'function') {
      window.APP.showToast('Mode local activé (Données initiales)', 'info');
    }
  }
};
