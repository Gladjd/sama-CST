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

    const createClient = (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') 
      ? supabase.createClient 
      : (window.supabase && typeof window.supabase.createClient === 'function' ? window.supabase.createClient : null);

    if (!createClient) {
      console.warn('⚠️ La librairie @supabase/supabase-js n\'est pas chargée. Mode local actif.');
      this.isConnected = false;
      this.updateStatusBadge();
      return false;
    }

    try {
      this.client = createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
      
      // Test de connexion rapide
      const { data, error } = await this.client.from('clients').select('id').limit(1);
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

  // Helper ultra-robuste et parallèle pour récupérer TOUTES les lignes d'une table sans limite PostgREST
  async fetchAllTableRows(tableName, orderBy = 'id', ascending = true) {
    if (!this.client) return [];
    const PAGE_SIZE = 1000;
    
    try {
      // 1. Obtenir le compte exact de lignes
      let totalCount = 0;
      try {
        const { count, error: countErr } = await this.client
          .from(tableName)
          .select('id', { count: 'exact', head: true });
        if (!countErr && typeof count === 'number' && count > 0) {
          totalCount = count;
        }
      } catch (ce) {
        console.warn(`Count head notice for ${tableName}:`, ce);
      }

      // Si le count n'a pas pu être récupéré, on tente par défaut 3 pages
      const pagesToFetch = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 3;

      // 2. Récupérer toutes les tranches en parallèle pour une vitesse instantanée
      const pagePromises = [];
      for (let i = 0; i < pagesToFetch; i++) {
        const from = i * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        
        let q = this.client
          .from(tableName)
          .select('*');

        if (orderBy) {
          q = q.order(orderBy, { ascending });
        }

        pagePromises.push(
          q.range(from, to).then(res => {
            if (res.error) {
              console.warn(`Avertissement pagination ${tableName} [${from}-${to}]:`, res.error.message);
              return [];
            }
            return res.data || [];
          }).catch(err => {
            console.warn(`Exception fetch slice ${tableName}:`, err);
            return [];
          })
        );
      }

      const results = await Promise.all(pagePromises);
      const allRows = results.flat().filter(Boolean);

      if (allRows.length > 0) {
        return allRows;
      }
    } catch (e) {
      console.error(`❌ Exception fetchAllTableRows(${tableName}):`, e);
    }

    return [];
  },

  // Charge toutes les tables depuis Supabase et met à jour SAMA_DATA avec préservation absolue des données
  async loadAllDataFromSupabase() {
    if (!this.isConnected || !this.client) return;

    this.isSyncing = true;
    this.updateStatusBadge();

    try {
      // 1. Clients (608 clients)
      const clientsData = await this.fetchAllTableRows('clients', 'code_client', true);
      if (clientsData && clientsData.length > 0) {
        const mappedClients = clientsData.map(c => ({
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

        if (mappedClients.length >= (SAMA_DATA.clients?.length || 0)) {
          SAMA_DATA.clients = mappedClients;
        } else {
          const clientMap = new Map();
          (SAMA_DATA.clients || []).forEach(c => { if (c.codeClient) clientMap.set(c.codeClient, c); });
          mappedClients.forEach(c => { if (c.codeClient) clientMap.set(c.codeClient, { ...clientMap.get(c.codeClient), ...c }); });
          SAMA_DATA.clients = Array.from(clientMap.values());
        }
      }

      // 2. Personnel CST (24 agents)
      const personnelData = await this.fetchAllTableRows('personnel_cst', 'code_agent', true);
      if (personnelData && personnelData.length > 0) {
        const mappedPersonnel = personnelData.map(p => ({
          agent: p.nom_agent,
          nomAgent: p.nom_agent,
          codeAgent: p.code_agent,
          fonction: p.fonction,
          pole: p.pole,
          telephone: p.telephone || '-',
          email: p.email || '-',
          specialite: p.specialite || p.fonction || '-',
          statut: p.disponibilite || 'Actif',
          disponibilite: p.disponibilite || 'Disponible'
        }));

        if (mappedPersonnel.length >= (SAMA_DATA.personnelCST?.length || 0)) {
          SAMA_DATA.personnelCST = mappedPersonnel;
        } else {
          const persMap = new Map();
          (SAMA_DATA.personnelCST || []).forEach(p => { if (p.codeAgent) persMap.set(p.codeAgent, p); });
          mappedPersonnel.forEach(p => { if (p.codeAgent) persMap.set(p.codeAgent, { ...persMap.get(p.codeAgent), ...p }); });
          SAMA_DATA.personnelCST = Array.from(persMap.values());
        }
      }

      // 3. Catalogue Équipements TS (449 références)
      const catData = await this.fetchAllTableRows('equipements_ts', 'code_ts', true);
      if (catData && catData.length > 0) {
        const mappedCat = catData.map(e => ({
          codeTS: e.code_ts,
          designation: e.designation,
          modele: e.modele,
          fournisseur: e.fournisseur,
          entite: e.entite,
          categorie: e.categorie,
          statut: e.statut || 'Actif'
        }));

        if (mappedCat.length >= (SAMA_DATA.equipementsTS?.length || 0)) {
          SAMA_DATA.equipementsTS = mappedCat;
        } else {
          const catMap = new Map();
          (SAMA_DATA.equipementsTS || []).forEach(e => { if (e.codeTS) catMap.set(e.codeTS, e); });
          mappedCat.forEach(e => { if (e.codeTS) catMap.set(e.codeTS, { ...catMap.get(e.codeTS), ...e }); });
          SAMA_DATA.equipementsTS = Array.from(catMap.values());
        }
      }

      // 4. Sites TS (483 sites)
      const sitesData = await this.fetchAllTableRows('sites_ts', 'site_code', true);
      if (sitesData && sitesData.length > 0) {
        const mappedSites = sitesData.map(s => ({
          id: s.site_code || s.nom_site || s.id,
          site_code: s.site_code,
          siteCode: s.site_code,
          nomClient: s.nom_client || s.client_nom || s.nom_site,
          nom_client: s.nom_client || s.client_nom || s.nom_site,
          secteur: s.secteur || 'Santé & Médical',
          localisation: s.localisation || 'Dakar',
          responsableSite: s.responsable_site || 'Direction Technique / Biomédicale',
          responsable_site: s.responsable_site || 'Direction Technique / Biomédicale',
          telephone: s.telephone || '+221 33 800 00 00',
          email: s.email || 'contact@technologies-services.sn',
          parcEquipements: s.parc_equipements || s.equipements_count || 0,
          parc_equipements: s.parc_equipements || s.equipements_count || 0,
          equipementsEnAtelier: s.equipements_en_atelier || 0,
          equipements_en_atelier: s.equipements_en_atelier || 0,
          slaHeures: s.sla_heures || 4,
          sla_heures: s.sla_heures || 4,
          tauxDisponibilite: parseFloat(s.taux_disponibilite) || 98.0,
          taux_disponibilite: parseFloat(s.taux_disponibilite) || 98.0,
          technicienReferent: s.technicien_referent || 'Momar CISSE',
          technicien_referent: s.technicien_referent || 'Momar CISSE',
          contrat: s.contrat || s.type_contrat || 'Contrat Maintenance Gold TS',
          statut: s.statut || 'Actif'
        }));

        if (mappedSites.length >= (SAMA_DATA.sitesTS?.length || 0)) {
          SAMA_DATA.sitesTS = mappedSites;
        } else {
          const siteMap = new Map();
          (SAMA_DATA.sitesTS || []).forEach(s => { if (s.site_code) siteMap.set(s.site_code, s); });
          mappedSites.forEach(s => { if (s.site_code) siteMap.set(s.site_code, { ...siteMap.get(s.site_code), ...s }); });
          SAMA_DATA.sitesTS = Array.from(siteMap.values());
        }
      }

      // 5. Parc Équipements Déployé (2 883 machines - toutes les pages en parallèle)
      const parcData = await this.fetchAllTableRows('parc_equipements_ts', 'id', true);
      if (parcData && parcData.length > 0) {
        const mappedParc = parcData.map(p => {
          const code = p.code_equipement || p.code_machine;
          const des = p.designation || p.nom_equipement;
          const pole = p.pole || 'BIOMED';
          const numSerie = p.numero_serie || p.num_serie || 'N/A';
          const client = p.client || p.client_nom || p.site;
          const dispo = parseFloat(p.taux_disponibilite || p.disponibilite) || 98.5;
          return {
            id: p.id || code,
            codeEquipement: code,
            nomEquipement: des,
            designation: des,
            client: client,
            site: p.site || client,
            siteLocalisation: p.site || client,
            pole: pole,
            entite: pole,
            numeroSerie: numSerie,
            numSerie: numSerie,
            modele: p.modele || '',
            fournisseur: p.fournisseur || 'Technologies Services',
            categorie: p.categorie || 'C1',
            statut: p.statut || 'Actif',
            etatOperationnel: p.etat_operationnel || '🟢 En Service (Nominal)',
            isAtelier: Boolean(p.en_atelier),
            disponibilite: dispo,
            tauxDisponibilite: dispo,
            contrat: p.contrat || 'Sous Contrat GMAO TS',
            dateInstallation: p.date_installation || '2023-01-15',
            technicienReferent: p.technicien_referent || 'Momar CISSE',
            prochaineMaintenance: p.prochaine_maintenance || '15/11/2026'
          };
        });

        // Protection intégrale : si le retour distant est complet (>= 2883), on met à jour.
        // Sinon, on fusionne pour ne JAMAIS descendre à 1000 items !
        if (mappedParc.length >= (SAMA_DATA.parcEquipementsTS?.length || 2883)) {
          SAMA_DATA.parcEquipementsTS = mappedParc;
        } else {
          const parcMap = new Map();
          (SAMA_DATA.parcEquipementsTS || []).forEach(e => {
            if (e.codeEquipement) parcMap.set(e.codeEquipement, e);
          });
          mappedParc.forEach(e => {
            if (e.codeEquipement) {
              parcMap.set(e.codeEquipement, { ...parcMap.get(e.codeEquipement), ...e });
            }
          });
          SAMA_DATA.parcEquipementsTS = Array.from(parcMap.values());
        }
      }

      // 6. Équipements Atelier & Interventions (Non-destructif, fusion intelligente avec LocalStorage)
      const atelierData = await this.fetchAllTableRows('equipements_atelier', 'created_at', false);
      const etapesData = await this.fetchAllTableRows('interventions_etapes', 'ordre', true);
      const piecesData = await this.fetchAllTableRows('pieces_rechange');

      let remoteAtelier = [];
      if (atelierData && atelierData.length > 0) {
        remoteAtelier = atelierData.map(eq => {
          const eqEtapes = (etapesData || []).filter(et => et.code_equipement === eq.code_equipement).map(et => ({
            event: et.titre,
            titre: et.titre,
            date: et.date_etape ? String(et.date_etape).replace('T', ' ').substring(0, 16) : '',
            responsable: et.responsable || 'Glad MOUKOUIRI',
            statut: et.statut || 'done',
            observation: et.observation || '',
            resultat: et.resultat_obtenu || et.observation || '',
            resultatObtenu: et.resultat_obtenu || et.observation || '',
            badgeColor: et.statut === 'done' ? 'green' : et.statut === 'in-progress' ? 'amber' : 'slate'
          }));

          const eqPieces = (piecesData || []).filter(pi => pi.code_equipement === eq.code_equipement).map(pi => ({
            reference: pi.reference || 'REF-GEN',
            designation: pi.designation || 'Pièce détachée',
            quantite: parseInt(pi.quantite, 10) || 1,
            prixUnitaire: parseFloat(pi.prix_unitaire) || 0,
            statut: pi.statut_commande || 'Livrée'
          }));

          const hasDateSortie = Boolean(eq.date_sortie && eq.date_sortie !== '-' && String(eq.date_sortie).trim() !== '');
          const dEntreeStr = eq.date_entree ? String(eq.date_entree).split('T')[0] : '';
          const dSortieStr = hasDateSortie ? String(eq.date_sortie).split('T')[0] : '-';
          
          let nbJours = '-';
          let dureeAtelier = '-';
          if (hasDateSortie && dEntreeStr && dSortieStr && dSortieStr !== '-') {
            const d1 = new Date(dEntreeStr);
            const d2 = new Date(dSortieStr);
            if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
              nbJours = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
            }
          } else if (!hasDateSortie && dEntreeStr) {
            const d1 = new Date(dEntreeStr);
            const d2 = new Date();
            if (!isNaN(d1.getTime())) {
              const diff = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
              dureeAtelier = `${diff} j`;
            }
          }

          const effectiveStatut = hasDateSortie ? 'CLÔTURE' : (eq.statut || 'DEPENDANT');
          const effectiveSituation = eq.situation || (hasDateSortie ? 'Clôturé' : 'En traitement');
          const effectiveEtatSortie = eq.etat_sortie || (hasDateSortie ? 'Fonctionnel' : 'Non fonctionnel');

          return {
            codeEquipement: eq.code_equipement,
            ficheDeVie: eq.fiche_de_vie || `FV-${eq.code_equipement}`,
            description: eq.description || eq.designation || 'Équipement Atelier',
            numSerie: eq.numero_serie || eq.num_serie || 'N/A',
            numeroSerie: eq.numero_serie || eq.num_serie || 'N/A',
            client: eq.client || eq.client_nom || 'Client TS',
            dateEntree: dEntreeStr,
            dateSortie: dSortieStr,
            responsableReception: eq.resp_reception || 'Glad MOUKOUIRI',
            respReception: eq.resp_reception || 'Glad MOUKOUIRI',
            responsableTechnique: eq.resp_technique || eq.technicien_responsable || 'Ousmane Fall',
            respTechnique: eq.resp_technique || eq.technicien_responsable || 'Ousmane Fall',
            zoneActuelle: eq.zone_actuelle || 'Zone réception',
            motif: eq.motif_panne || eq.anomalie_signalee || 'Révision atelier',
            motifPanne: eq.motif_panne || eq.anomalie_signalee || 'Révision atelier',
            situation: effectiveSituation,
            statut: effectiveStatut,
            etatSortie: effectiveEtatSortie,
            nombreJoursAtelier: nbJours,
            joursAtelier: typeof nbJours === 'number' ? nbJours : (parseInt(dureeAtelier, 10) || eq.jours_atelier || 0),
            dureeAtelier: dureeAtelier,
            numDevisFRB: eq.num_devis_frb || '',
            montantFRB: parseFloat(eq.montant_frb) || 0,
            dateEmissionFRB: eq.date_emission_frb ? String(eq.date_emission_frb).split('T')[0] : '',
            dateAccordClient: eq.date_accord_client ? String(eq.date_accord_client).split('T')[0] : '',
            dateCommandePieces: eq.date_commande_pieces ? String(eq.date_commande_pieces).split('T')[0] : '',
            dateReceptionPieces: eq.date_reception_pieces ? String(eq.date_reception_pieces).split('T')[0] : '',
            diagnosticReception: eq.diagnostic_reception || '',
            actionsDecision: eq.actions_decision || '',
            entite: eq.entite || eq.pole || 'BIOMED',
            fournisseur: eq.fournisseur || 'Technologies Services',
            modele: eq.modele || 'Standard',
            datePriseEnCharge: dEntreeStr ? `${dEntreeStr} 08:30` : '-',
            delaisPriseEnCharge: '0h 30m',
            dateFRB: eq.date_emission_frb ? String(eq.date_emission_frb).split('T')[0] : '-',
            delaisFRB: eq.date_emission_frb ? '48h 00m' : 'En attente',
            coutEstime: eq.montant_frb ? `${parseFloat(eq.montant_frb).toLocaleString('fr-FR')} FCFA` : '0 FCFA',
            priorite: eq.priorite || 'Moyenne',
            timeline: eqEtapes,
            etapesIntervention: eqEtapes,
            pieces: eqPieces,
            piecesRechange: eqPieces
          };
        });
      }

      // Fusion intelligente avec localStorage : NE JAMAIS SUPPRIMER les équipements créés localement
      const atelierMap = new Map();
      (SAMA_DATA.equipementsAtelier || []).forEach(eq => {
        if (eq.codeEquipement) atelierMap.set(eq.codeEquipement, eq);
      });
      remoteAtelier.forEach(eq => {
        if (eq.codeEquipement) {
          const local = atelierMap.get(eq.codeEquipement);
          atelierMap.set(eq.codeEquipement, local ? { ...local, ...eq } : eq);
        }
      });
      SAMA_DATA.equipementsAtelier = Array.from(atelierMap.values());
      try {
        localStorage.setItem('sama_cst_equipements_atelier', JSON.stringify(SAMA_DATA.equipementsAtelier));
      } catch (e) {}

      console.log('🔄 Données SAMA_DATA synchronisées avec Supabase ! Total Parc:', SAMA_DATA.parcEquipementsTS.length);
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

  // Abonnement Realtime Supabase (Optimisé avec Debounce)
  setupRealtimeSubscription() {
    if (!this.isConnected || !this.client) return;

    try {
      if (this.realtimeChannel) {
        this.client.removeChannel(this.realtimeChannel);
      }

      if (!this._debouncedRealtimeSync) {
        this._debouncedRealtimeSync = (window.SamaUtils && window.SamaUtils.debounce)
          ? window.SamaUtils.debounce(() => this.loadAllDataFromSupabase(), 600)
          : () => this.loadAllDataFromSupabase();
      }

      this.realtimeChannel = this.client
        .channel('sama-cst-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
          console.log('⚡ Modification Supabase Realtime détectée:', payload.eventType, payload.table);
          this._debouncedRealtimeSync();
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
      const dateEntree = eq.dateEntree ? (String(eq.dateEntree).includes('T') ? eq.dateEntree : `${eq.dateEntree}T08:00:00Z`) : new Date().toISOString();
      const hasDateSortie = eq.dateSortie && eq.dateSortie !== '-' && String(eq.dateSortie).trim() !== '';
      const dateSortie = hasDateSortie ? (String(eq.dateSortie).includes('T') ? eq.dateSortie : `${eq.dateSortie}T17:00:00Z`) : null;
      const nbJours = hasDateSortie ? (typeof eq.nombreJoursAtelier === 'number' ? eq.nombreJoursAtelier : parseInt(eq.nombreJoursAtelier || 0, 10)) : (parseInt(eq.dureeAtelier || 0, 10) || 0);

      const row = {
        code_equipement: eq.codeEquipement,
        fiche_de_vie: eq.ficheDeVie || `FV-${eq.codeEquipement}`,
        description: eq.description || eq.designation || '',
        designation: eq.description || eq.designation || '',
        numero_serie: eq.numSerie || eq.numeroSerie || 'N/A',
        num_serie: eq.numSerie || eq.numeroSerie || 'N/A',
        client: eq.client || eq.client_nom || '',
        client_nom: eq.client || eq.client_nom || '',
        date_entree: dateEntree,
        date_sortie: dateSortie,
        resp_reception: eq.responsableReception || eq.respReception || 'Glad MOUKOUIRI',
        resp_technique: eq.responsableTechnique || eq.respTechnique || 'Ousmane Fall',
        technicien_responsable: eq.responsableTechnique || eq.respTechnique || 'Ousmane Fall',
        zone_actuelle: eq.zoneActuelle || 'Zone réception',
        motif_panne: eq.motif || eq.motifPanne || 'Révision atelier',
        anomalie_signalee: eq.motif || eq.motifPanne || 'Révision atelier',
        situation: eq.situation || (hasDateSortie ? 'Clôturé' : 'En traitement'),
        statut: hasDateSortie ? 'CLÔTURE' : (eq.statut || 'DEPENDANT'),
        etat_sortie: eq.etatSortie || (hasDateSortie ? 'Fonctionnel' : 'Non fonctionnel'),
        jours_atelier: isNaN(nbJours) ? 0 : nbJours,
        num_devis_frb: eq.numDevisFRB || null,
        montant_frb: parseFloat(String(eq.montantFRB || eq.coutEstime || '0').replace(/[^0-9.]/g, '')) || 0,
        date_emission_frb: eq.dateEmissionFRB || (eq.dateFRB && eq.dateFRB !== '-' ? `${eq.dateFRB}T09:00:00Z` : null),
        date_accord_client: eq.dateAccordClient || null,
        date_commande_pieces: eq.dateCommandePieces || null,
        date_reception_pieces: eq.dateReceptionPieces || null,
        diagnostic_reception: eq.diagnosticReception || eq.motif || null,
        actions_decision: eq.actionsDecision || null,
        entite: eq.entite || 'BIOMED',
        pole: eq.entite || 'BIOMED',
        priorite: eq.priorite || 'Moyenne',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.client.from('equipements_atelier').upsert(row, { onConflict: 'code_equipement' });
      if (error) throw error;

      // Update local storage backup
      try {
        localStorage.setItem('sama_cst_equipements_atelier', JSON.stringify(SAMA_DATA.equipementsAtelier));
      } catch (e) {}

      console.log('✅ Équipement Atelier sauvegardé dans Supabase:', eq.codeEquipement);
    } catch (err) {
      console.error('❌ Erreur syncSaveEquipementAtelier:', err);
    }
  },

  // Suppression d'un équipement atelier
  async syncDeleteEquipementAtelier(codeEquipement) {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.from('interventions_etapes').delete().eq('code_equipement', codeEquipement);
      await this.client.from('pieces_rechange').delete().eq('code_equipement', codeEquipement);
      const { error } = await this.client.from('equipements_atelier').delete().eq('code_equipement', codeEquipement);
      if (error) throw error;

      // Update local storage backup
      try {
        localStorage.setItem('sama_cst_equipements_atelier', JSON.stringify(SAMA_DATA.equipementsAtelier));
      } catch (e) {}

      console.log('🗑️ Équipement Atelier supprimé de Supabase:', codeEquipement);
    } catch (err) {
      console.error('❌ Erreur syncDeleteEquipementAtelier:', err);
    }
  },

  // Remplacement complet des pièces de rechange d'un équipement
  async syncReplaceAllPieces(codeEquipement, pieces) {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.from('pieces_rechange').delete().eq('code_equipement', codeEquipement);
      if (pieces && pieces.length > 0) {
        const rows = pieces.map(p => ({
          code_equipement: codeEquipement,
          reference: p.reference || 'REF-GEN',
          designation: p.designation || 'Pièce détachée',
          quantite: parseInt(p.quantite, 10) || 1,
          prix_unitaire: parseFloat(p.prixUnitaire) || 0,
          statut_commande: p.statut || 'Livrée'
        }));
        const { error } = await this.client.from('pieces_rechange').insert(rows);
        if (error) throw error;
      }
      console.log('✅ Pièces de rechange synchronisées dans Supabase pour', codeEquipement);
    } catch (err) {
      console.error('❌ Erreur syncReplaceAllPieces:', err);
    }
  },

  // Ajout / Modification d'une étape de Fiche de Vie
  async syncSaveTimelineStep(codeEquipement, step, orderIdx = 0) {
    if (!this.isConnected || !this.client) return;

    try {
      const { error } = await this.client.from('interventions_etapes').insert({
        code_equipement: codeEquipement,
        titre: step.titre || step.event || 'Étape intervention',
        date_etape: step.date ? (String(step.date).includes('T') ? step.date : `${step.date.replace(' ', 'T')}:00Z`) : new Date().toISOString(),
        responsable: step.responsable || 'Glad MOUKOUIRI',
        statut: step.statut || 'done',
        observation: step.observation || step.resultat || '',
        resultat_obtenu: step.resultatObtenu || step.resultat || step.observation || '',
        ordre: orderIdx
      });

      if (error) throw error;
      console.log('✅ Étape intervention synchronisée dans Supabase:', step.titre || step.event);
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
          titre: s.titre || s.event || 'Étape intervention',
          date_etape: s.date ? (String(s.date).includes('T') ? s.date : `${s.date.replace(' ', 'T')}:00Z`) : new Date().toISOString(),
          responsable: s.responsable || 'Glad MOUKOUIRI',
          statut: s.statut || 'done',
          observation: s.observation || s.resultat || '',
          resultat_obtenu: s.resultatObtenu || s.resultat || s.observation || '',
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
