// ==========================================================================
// PLATEFORME SAMA CST - LOGIQUE APPLICATIVE (APP CONTROLLER)
// ==========================================================================

const APP = {
  currentTab: 'synthese-direction',
  currentModule: 'dashboard',
  tableSearchQuery: '',
  filterEntite: 'all',
  filterStatut: 'all',
  filterSituation: 'all',
  filterEtatSortie: 'all',
  sortColumn: 'codeEquipement',
  sortDirection: 'asc',
  currentPage: 1,
  itemsPerPage: 10,
  tsSearchQuery: '',
  tsFilterEntite: 'all',
  tsFilterFournisseur: 'all',
  tsFilterCategorie: 'all',
  tsSortColumn: 'fournisseur',
  tsSortDirection: 'asc',
  tsCurrentPage: 1,
  tsItemsPerPage: 10,
  clientSearchQuery: '',
  clientFilterVille: 'all',
  clientFilterPays: 'all',
  clientSortColumn: 'client',
  clientSortDirection: 'asc',
  clientCurrentPage: 1,
  clientItemsPerPage: 10,
  personnelSearchQuery: '',
  personnelFilterPole: 'all',
  personnelSortColumn: 'agent',
  personnelSortDirection: 'asc',
  personnelCurrentPage: 1,
  personnelItemsPerPage: 10,
  editingPersonnelIdx: null,
  currentFvCode: null,
  currentFvMode: 'view',
  editingFvTimeline: [],
  editingTimelineIndex: null,
  editingFvPieces: [],
  currentBaseTSView: 'clients',
  baseEqDisplayMode: 'cards',
  baseEqSearchQuery: '',
  baseEqClientFilter: 'all',
  baseEqEntiteFilter: 'all',
  baseEqEtatFilter: 'all',

  init() {
    this.bindEvents();
    this.renderEquipementTable();
    this.renderEquipementsTS();
    this.renderClients();
    this.renderPersonnel();
    this.renderSitesTS();
    this.renderParcEquipementsTS();
    this.renderTechnicians();
    this.renderBlocages4Axes();
    this.renderCriticiteTable();
    this.renderRedAlerts();
    this.renderEntityAvailability();
    this.renderTop5List();

    // Navigation initiale basée sur le hash de l'URL ou dashboard par défaut
    const initialHash = window.location.hash.replace('#', '');
    if (['dashboard', 'atelier-equipements', 'equipements-ts', 'clients', 'personnel-cst', 'base-ts', 'showcase'].includes(initialHash)) {
      this.switchModule(initialHash);
    } else {
      this.switchModule('dashboard');
    }

    // Écouteur pour navigation par hash (boutons retour/avant du navigateur)
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && h !== this.currentModule && ['dashboard', 'atelier-equipements', 'equipements-ts', 'clients', 'personnel-cst', 'base-ts', 'showcase'].includes(h)) {
        this.switchModule(h);
      }
    });

    // Initialisation des graphiques
    setTimeout(() => {
      SAMA_CHARTS.initAllDashboardCharts();
    }, 150);

    // Initialisation des sélecteurs de Date et Date & Heure dynamiques
    this.initDatePickers();

    // Initialisation Supabase asynchrone (mode hybride)
    if (window.supabaseSync && typeof window.supabaseSync.init === 'function') {
      window.supabaseSync.init();
    }
  },

  renderCurrentView() {
    this.renderEquipementTable();
    this.renderEquipementsTS();
    this.renderClients();
    this.renderPersonnel();
    this.renderSitesTS();
    this.renderParcEquipementsTS();
    this.renderTechnicians();
    this.renderBlocages4Axes();
    this.renderCriticiteTable();
    this.renderRedAlerts();
    this.renderEntityAvailability();
    this.renderTop5List();
    if (window.SAMA_CHARTS && typeof window.SAMA_CHARTS.initAllDashboardCharts === 'function') {
      window.SAMA_CHARTS.initAllDashboardCharts();
    }
  },

  // ------------------------------------------------------------------------
  // DYNAMIC DATE & TIME PICKERS ENGINE (Technologies Services Theme)
  // ------------------------------------------------------------------------
  setPickerValue(inputId, val) {
    const el = document.getElementById(inputId);
    if (!el) return;
    const cleanVal = (val && val !== '-') ? val : '';
    el.value = cleanVal;
    if (el._flatpickr) {
      try {
        el._flatpickr.setDate(cleanVal, false);
      } catch (err) {
        console.warn('flatpickr setDate notice:', err);
      }
    }
  },

  initDatePickers() {
    const quickActionsPlugin = (isDateTime) => (fp) => ({
      onReady() {
        const container = fp.calendarContainer;
        if (!container || container.querySelector('.flatpickr-quick-actions')) return;

        const actionsBar = document.createElement('div');
        actionsBar.className = 'flatpickr-quick-actions';

        const nowBtn = document.createElement('button');
        nowBtn.type = 'button';
        nowBtn.className = 'flatpickr-quick-btn';
        nowBtn.innerHTML = isDateTime ? '🕒 Maintenant' : '📅 Aujourd\'hui';
        nowBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const now = new Date();
          fp.setDate(now, true);
        });

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'flatpickr-quick-btn btn-clear';
        clearBtn.innerHTML = '✕ Effacer';
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          fp.clear();
          fp.close();
        });

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'flatpickr-quick-btn';
        closeBtn.innerHTML = '✓ Valider';
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          fp.close();
        });

        actionsBar.appendChild(nowBtn);
        actionsBar.appendChild(clearBtn);
        actionsBar.appendChild(closeBtn);
        container.appendChild(actionsBar);
      }
    });

    if (typeof flatpickr !== 'undefined') {
      const frLocale = (typeof flatpickr.l10ns !== 'undefined' && flatpickr.l10ns.fr) ? flatpickr.l10ns.fr : 'fr';

      // 1. Initialisation des sélecteurs DATE seule (YYYY-MM-DD)
      document.querySelectorAll('.date-picker-input').forEach(input => {
        if (!input._flatpickr) {
          flatpickr(input, {
            locale: frLocale,
            dateFormat: "Y-m-d",
            allowInput: true,
            animate: true,
            disableMobile: false,
            plugins: [quickActionsPlugin(false)],
            onChange: (selectedDates, dateStr) => {
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }
      });

      // 2. Initialisation des sélecteurs DATE & HEURE (YYYY-MM-DD HH:MM)
      document.querySelectorAll('.datetime-picker-input').forEach(input => {
        if (!input._flatpickr) {
          flatpickr(input, {
            locale: frLocale,
            dateFormat: "Y-m-d H:i",
            enableTime: true,
            time_24hr: true,
            minuteIncrement: 1,
            allowInput: true,
            animate: true,
            disableMobile: false,
            plugins: [quickActionsPlugin(true)],
            onChange: (selectedDates, dateStr) => {
              input.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }
      });
    }

    // Gestion du clic sur l'icône de calendrier / horloge
    document.querySelectorAll('.input-date-wrapper').forEach(wrap => {
      const input = wrap.querySelector('input');
      const icon = wrap.querySelector('.input-date-icon');
      if (icon && input && !icon._hasDateListener) {
        icon._hasDateListener = true;
        icon.style.cursor = 'pointer';
        icon.style.pointerEvents = 'auto';
        icon.addEventListener('click', (e) => {
          e.preventDefault();
          if (input._flatpickr) {
            input._flatpickr.open();
          } else {
            input.focus();
            if (typeof input.showPicker === 'function') {
              try { input.showPicker(); } catch (err) {}
            }
          }
        });
      }
    });
  },

  // ------------------------------------------------------------------------
  // GESTION DES ÉVÉNEMENTS & NAVIGATION
  // ------------------------------------------------------------------------
  bindEvents() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('modal-overlay');
    const toggleBtnSidebar = document.getElementById('btn-sidebar-toggle');
    const toggleBtnTopbar = document.getElementById('btn-desktop-sidebar-toggle');
    const mobileBtn = document.getElementById('btn-mobile-menu');

    // Restaurer l'état réduit mémorisé
    const isCollapsed = localStorage.getItem('sama_sidebar_collapsed') === 'true';
    if (isCollapsed && sidebar && window.innerWidth > 1024) {
      sidebar.classList.add('collapsed');
    }

    // Toggle Réduire / Agrandir la Sidebar (Desktop)
    const toggleCollapse = () => {
      if (!sidebar) return;
      sidebar.classList.toggle('collapsed');
      const collapsedNow = sidebar.classList.contains('collapsed');
      localStorage.setItem('sama_sidebar_collapsed', collapsedNow ? 'true' : 'false');

      // Mettre à jour l'infobulle du bouton
      if (toggleBtnSidebar) {
        toggleBtnSidebar.setAttribute('title', collapsedNow ? 'Agrandir le menu latéral' : 'Réduire le menu latéral');
      }

      // Déclencher un redimensionnement des graphiques
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 260);
    };

    if (toggleBtnSidebar) toggleBtnSidebar.addEventListener('click', toggleCollapse);
    if (toggleBtnTopbar) toggleBtnTopbar.addEventListener('click', toggleCollapse);

    // Menu Mobile Toggle
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) {
          if (sidebar.classList.contains('mobile-open')) {
            overlay.classList.add('active');
            overlay.setAttribute('data-mobile-menu', 'true');
          } else {
            overlay.classList.remove('active');
            overlay.removeAttribute('data-mobile-menu');
          }
        }
      });
    }

    // Navigation Sidebar
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = link.getAttribute('data-target');
        if (!target) return;
        
        document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Fermer la sidebar sur mobile
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          if (overlay) {
            overlay.classList.remove('active');
            overlay.removeAttribute('data-mobile-menu');
          }
        }

        this.switchModule(target);
      });
    });

    // Sub-navigation Tabs (Dashboard: 4 Pages)
    document.querySelectorAll('.tab-nav-item').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = tab.getAttribute('data-tab');
        if (!targetTab) return;

        document.querySelectorAll('.tab-nav-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.switchDashboardTab(targetTab);
      });
    });

    // Recherche globale
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        this.tableSearchQuery = e.target.value.toLowerCase();
        this.renderEquipementTable();
      });
    }

    // Filtres Entité Global (Topbar)
    const globalEntityFilter = document.getElementById('global-entity-filter');
    const filterEntiteSelect = document.getElementById('filter-entite');

    if (globalEntityFilter) {
      globalEntityFilter.addEventListener('change', (e) => {
        this.filterEntite = e.target.value;
        if (filterEntiteSelect) filterEntiteSelect.value = e.target.value;
        this.renderEquipementTable();
        this.renderEntityAvailability();
      });
    }

    // Filtres Atelier
    if (filterEntiteSelect) {
      filterEntiteSelect.addEventListener('change', (e) => {
        this.filterEntite = e.target.value;
        if (globalEntityFilter) globalEntityFilter.value = e.target.value;
        this.renderEquipementTable();
      });
    }

    const filterStatutSelect = document.getElementById('filter-statut');
    if (filterStatutSelect) {
      filterStatutSelect.addEventListener('change', (e) => {
        this.filterStatut = e.target.value;
        this.renderEquipementTable();
      });
    }

    const filterSituationSelect = document.getElementById('filter-situation');
    if (filterSituationSelect) {
      filterSituationSelect.addEventListener('change', (e) => {
        this.filterSituation = e.target.value;
        this.renderEquipementTable();
      });
    }

    const filterEtatSortieSelect = document.getElementById('filter-etat-sortie');
    if (filterEtatSortieSelect) {
      filterEtatSortieSelect.addEventListener('change', (e) => {
        this.filterEtatSortie = e.target.value;
        this.renderEquipementTable();
      });
    }

    // Modal Nouvel Équipement / Client / Personnel (Topbar bouton principal intelligent)
    const btnNewEquip = document.getElementById('btn-add-equipment');
    if (btnNewEquip) {
      btnNewEquip.addEventListener('click', () => {
        if (this.currentModule === 'personnel-cst') {
          this.openNewPersonnelModal();
        } else if (this.currentModule === 'clients') {
          this.openNewClientModal();
        } else if (this.currentModule === 'equipements-ts') {
          this.openNewEquipementTSModal();
        } else {
          this.openNewEquipmentModal();
        }
      });
    }

    // Filtres Catalogue Équipements TS
    const searchTS = document.getElementById('search-equipements-ts');
    if (searchTS) {
      searchTS.addEventListener('input', (e) => {
        this.tsSearchQuery = e.target.value.toLowerCase();
        this.tsCurrentPage = 1;
        this.renderEquipementsTS();
      });
    }

    const filterTSEntite = document.getElementById('filter-ts-entite');
    if (filterTSEntite) {
      filterTSEntite.addEventListener('change', (e) => {
        this.tsFilterEntite = e.target.value;
        this.tsCurrentPage = 1;
        this.renderEquipementsTS();
      });
    }

    const filterTSFournisseur = document.getElementById('filter-ts-fournisseur');
    if (filterTSFournisseur) {
      filterTSFournisseur.addEventListener('change', (e) => {
        this.tsFilterFournisseur = e.target.value;
        this.tsCurrentPage = 1;
        this.renderEquipementsTS();
      });
    }

    const filterTSCategorie = document.getElementById('filter-ts-categorie');
    if (filterTSCategorie) {
      filterTSCategorie.addEventListener('change', (e) => {
        this.tsFilterCategorie = e.target.value;
        this.tsCurrentPage = 1;
        this.renderEquipementsTS();
      });
    }

    // Modal Nouvel Équipement TS
    const btnNewTSEquip = document.getElementById('btn-add-equipement-ts');
    if (btnNewTSEquip) {
      btnNewTSEquip.addEventListener('click', () => this.openNewEquipementTSModal());
    }

    // Filtres et Recherche Module Clients
    const searchClients = document.getElementById('search-clients');
    if (searchClients) {
      searchClients.addEventListener('input', (e) => {
        this.clientSearchQuery = e.target.value.toLowerCase();
        this.clientCurrentPage = 1;
        this.renderClients();
      });
    }

    const filterClientVille = document.getElementById('filter-client-ville');
    if (filterClientVille) {
      filterClientVille.addEventListener('change', (e) => {
        this.clientFilterVille = e.target.value;
        this.clientCurrentPage = 1;
        this.renderClients();
      });
    }

    const filterClientPays = document.getElementById('filter-client-pays');
    if (filterClientPays) {
      filterClientPays.addEventListener('change', (e) => {
        this.clientFilterPays = e.target.value;
        this.clientCurrentPage = 1;
        this.renderClients();
      });
    }

    // Boutons Actions Module Clients
    const btnNewClient = document.getElementById('btn-add-client');
    if (btnNewClient) {
      btnNewClient.addEventListener('click', () => this.openNewClientModal());
    }

    const btnExportClients = document.getElementById('btn-export-clients-csv');
    if (btnExportClients) {
      btnExportClients.addEventListener('click', () => this.exportClientsToCSV());
    }

    // Filtres et Recherche Module Personnel CST
    const searchPersonnel = document.getElementById('search-personnel');
    if (searchPersonnel) {
      searchPersonnel.addEventListener('input', (e) => {
        this.personnelSearchQuery = e.target.value.toLowerCase();
        this.personnelCurrentPage = 1;
        this.renderPersonnel();
      });
    }

    const filterPersonnelPole = document.getElementById('filter-personnel-pole');
    if (filterPersonnelPole) {
      filterPersonnelPole.addEventListener('change', (e) => {
        this.personnelFilterPole = e.target.value;
        this.personnelCurrentPage = 1;
        this.renderPersonnel();
      });
    }

    // Boutons Actions Module Personnel CST
    const btnNewPersonnel = document.getElementById('btn-add-personnel');
    if (btnNewPersonnel) {
      btnNewPersonnel.addEventListener('click', () => this.openNewPersonnelModal());
    }

    const btnExportPersonnel = document.getElementById('btn-export-personnel-csv');
    if (btnExportPersonnel) {
      btnExportPersonnel.addEventListener('click', () => this.exportPersonnelToCSV());
    }

    // Export CSV Atelier
    const btnExport = document.getElementById('btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportTableToCSV());
    }
  },

  // Changement de module principal (Dashboard, Atelier, Catalogue TS, Clients, Personnel CST, Base TS, Showcase)
  switchModule(moduleId) {
    this.currentModule = moduleId;
    window.location.hash = moduleId;
    
    // Mettre à jour l'élément actif dans la sidebar
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      if (link.getAttribute('data-target') === moduleId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Masquer toutes les sections
    document.querySelectorAll('.module-container').forEach(mod => mod.style.display = 'none');
    
    const targetEl = document.getElementById(`module-${moduleId}`);
    if (targetEl) {
      targetEl.style.display = 'block';
    }

    // Mettre à jour le titre du topbar et adapter le bouton d'action primaire
    const titleEl = document.getElementById('current-page-title');
    const breadcrumbSubEl = document.getElementById('breadcrumb-sub');
    const topbarActionBtn = document.getElementById('btn-add-equipment');

    if (moduleId === 'dashboard') {
      if (titleEl) titleEl.textContent = "Tableau de Bord Sama CST";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Supervision & KPIs";
      if (topbarActionBtn) {
        topbarActionBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Nouvel Équipement</span>
        `;
      }
      setTimeout(() => SAMA_CHARTS.initAllDashboardCharts(), 100);
    } else if (moduleId === 'atelier-equipements') {
      if (titleEl) titleEl.textContent = "Équipements en Atelier";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Gestion des 23 colonnes & Fiche de vie";
      if (topbarActionBtn) {
        topbarActionBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Nouvel Équipement Atelier</span>
        `;
      }
      this.renderEquipementTable();
    } else if (moduleId === 'equipements-ts') {
      if (titleEl) titleEl.textContent = "Équipements Technologies Services";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Catalogue Référentiel TS (5 colonnes)";
      if (topbarActionBtn) {
        topbarActionBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Ajouter Équipement TS</span>
        `;
      }
      this.renderEquipementsTS();
    } else if (moduleId === 'clients') {
      if (titleEl) titleEl.textContent = "Répertoire des Clients Technologies Services";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Gestion centralisée des comptes & coordonnées (9 colonnes)";
      if (topbarActionBtn) {
        topbarActionBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Ajouter un Client</span>
        `;
      }
      this.renderClients();
    } else if (moduleId === 'personnel-cst') {
      if (titleEl) titleEl.textContent = "Personnel CST";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Affectations & Pôles Opérationnels (Agent, Email, Pôle)";
      if (topbarActionBtn) {
        topbarActionBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Ajouter un Agent</span>
        `;
      }
      this.renderPersonnel();
    } else if (moduleId === 'base-ts') {
      if (titleEl) titleEl.textContent = "Base de Données TS";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Sites Clients, Contrats & Parc Équipements";
      this.renderSitesTS();
      this.renderParcEquipementsTS();
    } else if (moduleId === 'showcase') {
      if (titleEl) titleEl.textContent = "Showcase Produit Sama CST";
      if (breadcrumbSubEl) breadcrumbSubEl.textContent = "Présentation Haute Définition";
    }
  },

  // Changement de sous-page du tableau de bord (4 Pages)
  switchDashboardTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.dash-view-section').forEach(sec => sec.style.display = 'none');
    
    const targetSection = document.getElementById(`view-${tabId}`);
    if (targetSection) {
      targetSection.style.display = 'block';
    }

    // Re-rendre les graphiques spécifiques au tab
    if (tabId === 'synthese-direction') {
      SAMA_CHARTS.renderAvailabilityGauge('gauge-dispo-container', 96.4);
      SAMA_CHARTS.renderMTTRChart('chart-mttr');
      SAMA_CHARTS.renderBrandsDonut('chart-brands');
    } else if (tabId === 'performance-technique') {
      SAMA_CHARTS.renderTechPerformanceChart('chart-tech-closure');
    } else if (tabId === 'risques-dependances') {
      SAMA_CHARTS.renderContractsDonut('chart-contracts-coverage');
    } else if (tabId === 'disponibilite-parc') {
      SAMA_CHARTS.renderFleetStatusDonut('chart-fleet-status');
    }
  },

  // ------------------------------------------------------------------------
  // RENDU DU TABLEAU ÉQUIPEMENT ATELIER (23 COLONNES)
  // ------------------------------------------------------------------------
  renderEquipementTable() {
    const tbody = document.getElementById('table-equipements-body');
    if (!tbody) return;

    let items = [...SAMA_DATA.equipementsAtelier];

    // 1. Filtrage Recherche plein texte
    if (this.tableSearchQuery) {
      const q = this.tableSearchQuery;
      items = items.filter(item => 
        item.codeEquipement.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.numSerie.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.responsableTechnique.toLowerCase().includes(q) ||
        item.zoneActuelle.toLowerCase().includes(q) ||
        item.motif.toLowerCase().includes(q)
      );
    }

    // 2. Filtre Entité
    if (this.filterEntite !== 'all') {
      items = items.filter(item => item.entite === this.filterEntite);
    }

    // 3. Filtre Statut
    if (this.filterStatut !== 'all') {
      items = items.filter(item => item.statut === this.filterStatut);
    }

    // 4. Filtre Situation
    if (this.filterSituation !== 'all') {
      items = items.filter(item => item.situation === this.filterSituation);
    }

    // 5. Filtre État de Sortie
    if (this.filterEtatSortie !== 'all') {
      items = items.filter(item => item.etatSortie === this.filterEtatSortie);
    }

    // 5. Tri robuste
    items.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];
      if (valA === '-' || valA === undefined || valA === null) valA = this.sortDirection === 'asc' ? 999999 : -1;
      if (valB === '-' || valB === undefined || valB === null) valB = this.sortDirection === 'asc' ? 999999 : -1;
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    // Rendu HTML
    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="23" style="text-align: center; padding: 40px; color: #64748B;">
            <div style="font-size: 16px; font-weight: 600;">Aucun équipement trouvé</div>
            <div style="font-size: 12px; margin-top: 4px;">Essayez de réinitialiser vos critères de recherche ou filtres.</div>
          </td>
        </tr>
      `;
      return;
    }

    // Calcul et rendu des lignes
    tbody.innerHTML = items.map(eq => {
      const hasDateSortie = eq.dateSortie && eq.dateSortie !== '-' && eq.dateSortie.trim() !== '';
      const effectiveStatut = hasDateSortie ? 'CLÔTURE' : 'DEPENDANT';
      const statusClass = hasDateSortie ? 'cloture' : 'dependant';

      // 15. NOMBRE JOURS ATELIER : Si Date Sortie renseignée -> Date Sortie - Date Entrée. Sinon -> '-'
      const calculatedDaysCloture = hasDateSortie ? this.calculateDays(eq.dateEntree, eq.dateSortie) : '-';
      let daysDisplay = '-';
      if (hasDateSortie && calculatedDaysCloture !== '-') {
        let daysBadgeClass = 'green';
        if (calculatedDaysCloture > 10) daysBadgeClass = 'red';
        else if (calculatedDaysCloture > 5) daysBadgeClass = 'amber';
        daysDisplay = `<span class="days-badge ${daysBadgeClass}">${calculatedDaysCloture} j</span>`;
      } else {
        daysDisplay = `<span style="color: var(--text-muted); font-weight: 700; font-size: 14px;">-</span>`;
      }

      // 16. DUREE ATELIER : Si Date Sortie NON renseignée -> Date du jour - Date Entrée. Sinon -> '-'
      const calculatedDaysEnCours = !hasDateSortie ? this.calculateDaysFromToday(eq.dateEntree) : '-';
      let dureeDisplay = '-';
      if (!hasDateSortie && calculatedDaysEnCours !== '-') {
        let dureeBadgeClass = 'green';
        if (calculatedDaysEnCours > 10) dureeBadgeClass = 'red';
        else if (calculatedDaysEnCours > 5) dureeBadgeClass = 'amber';
        dureeDisplay = `<span class="days-badge ${dureeBadgeClass}">${calculatedDaysEnCours} j</span>`;
      } else {
        dureeDisplay = `<span style="color: var(--text-muted); font-weight: 700; font-size: 14px;">-</span>`;
      }

      // Badge Situation (8 options)
      let situationBadgeClass = 'blue';
      if (eq.situation === 'Clôturé') situationBadgeClass = 'green';
      else if (eq.situation === 'En attente pièces' || eq.situation === 'Back Up') situationBadgeClass = 'amber';
      else if (eq.situation === 'Devis à envoyer' || eq.situation === 'Devis envoyé') situationBadgeClass = 'cyan';
      else if (eq.situation === 'A retourner') situationBadgeClass = 'red';
      else if (eq.situation === 'Inventaire atelier') situationBadgeClass = 'slate';
      const situationDisplay = `<span class="badge-tag ${situationBadgeClass}">${eq.situation}</span>`;

      // Badge État de Sortie (3 options)
      let etatBadgeClass = 'slate';
      if (eq.etatSortie === 'Fonctionnel') etatBadgeClass = 'green';
      else if (eq.etatSortie === 'Fonctionnel / Dégradé') etatBadgeClass = 'amber';
      else if (eq.etatSortie === 'Non fonctionnel') etatBadgeClass = 'red';
      const etatSortieDisplay = `<span class="badge-tag ${etatBadgeClass}">${eq.etatSortie}</span>`;

      return `
        <tr>
          <!-- 1. Code Equipement (Sticky) -->
          <td class="col-sticky-code">
            <span style="font-weight: 800; color: #2E5090;">${eq.codeEquipement}</span>
          </td>
          <!-- 2. Action Fiche de vie & Édition -->
          <td>
            <div style="display: inline-flex; align-items: center; gap: 5px;">
              <button class="btn-fiche-vie" title="Consulter la Fiche de Vie 360°" onclick="APP.openFicheDeVie('${eq.codeEquipement}', 'view')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Fiche</span>
              </button>
              <button class="btn-ts-action" title="Modifier cette fiche d'équipement" style="padding: 5px 8px; font-size: 11.5px; border-radius: 6px; background: #EEF2FF; color: #2E5090; border: 1px solid #C7D2FE;" onclick="APP.openFicheDeVie('${eq.codeEquipement}', 'edit')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Éditer</span>
              </button>
            </div>
          </td>
          <!-- 3. Description -->
          <td><strong>${eq.description}</strong></td>
          <!-- 4. N° de série -->
          <td><span style="font-family: monospace; font-size: 11.5px; color: #475569;">${eq.numSerie}</span></td>
          <!-- 5. Client -->
          <td><span class="badge-tag blue">${eq.client}</span></td>
          <!-- 6. Date_Entree -->
          <td>${eq.dateEntree}</td>
          <!-- 7. Date_Sortie -->
          <td>${eq.dateSortie}</td>
          <!-- 8. Responsable Reception -->
          <td>${eq.responsableReception}</td>
          <!-- 9. Responsable Technique -->
          <td><strong>${eq.responsableTechnique}</strong></td>
          <!-- 10. Zone_Actuelle -->
          <td><span class="badge-tag slate">${eq.zoneActuelle}</span></td>
          <!-- 11. Motif -->
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${eq.motif}">${eq.motif}</td>
          <!-- 12. Situation -->
          <td>${situationDisplay}</td>
          <!-- 13. Statut -->
          <td><span class="status-pill ${statusClass}">${effectiveStatut}</span></td>
          <!-- 14. Etat_Sortie -->
          <td>${etatSortieDisplay}</td>
          <!-- 15. Nombre de Jours à l'atelier -->
          <td>${daysDisplay}</td>
          <!-- 16. Duree atelier -->
          <td>${dureeDisplay}</td>
          <!-- 17. Entité -->
          <td>${eq.entite}</td>
          <!-- 18. Fournisseur -->
          <td><strong>${eq.fournisseur}</strong></td>
          <!-- 19. Modèle -->
          <td>${eq.modele}</td>
          <!-- 20. Date prise en charge -->
          <td>${eq.datePriseEnCharge}</td>
          <!-- 21. Delais prise en charge -->
          <td><span class="badge-tag green">${eq.delaisPriseEnCharge}</span></td>
          <!-- 22. Date FRB -->
          <td>${eq.dateFRB}</td>
          <!-- 23. Delais FRB -->
          <td><span class="badge-tag amber">${eq.delaisFRB}</span></td>
        </tr>
      `;
    }).join('');

    // Mise à jour du compteur
    const countEl = document.getElementById('table-records-count');
    if (countEl) countEl.textContent = `${items.length} équipement(s) répertorié(s)`;
  },

  // Calcul du nombre de jours entre deux dates ISO (YYYY-MM-DD)
  calculateDays(dateEntree, dateSortie) {
    if (!dateSortie || dateSortie === '-' || dateSortie.trim() === '') return '-';
    const d1 = new Date(dateEntree);
    const d2 = new Date(dateSortie);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '-';
    const diffTime = d2.getTime() - d1.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  },

  // Calcul du nombre de jours entre la date d'entrée et aujourd'hui
  calculateDaysFromToday(dateEntree) {
    if (!dateEntree || dateEntree === '-' || dateEntree.trim() === '') return '-';
    const d1 = new Date(dateEntree);
    const today = new Date();
    if (isNaN(d1.getTime())) return '-';
    const diffTime = today.getTime() - d1.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  },

  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------
  // GESTION DE LA FICHE DE VIE (CONSULTATION 360° & MODIFICATION INTERACTIVE)
  // ------------------------------------------------------------------------
  openFicheDeVie(codeEquipement, mode = 'view') {
    const eq = SAMA_DATA.equipementsAtelier.find(e => e.codeEquipement === codeEquipement);
    if (!eq) return;

    this.currentFvCode = codeEquipement;
    const drawer = document.getElementById('drawer-fiche-vie');
    const overlay = document.getElementById('modal-overlay');
    if (!drawer || !overlay) return;

    this.setFicheDeVieMode(mode);

    overlay.classList.add('active');
    drawer.classList.add('active');
  },

  setFicheDeVieMode(mode) {
    this.currentFvMode = mode;
    const eq = SAMA_DATA.equipementsAtelier.find(e => e.codeEquipement === this.currentFvCode);
    if (!eq) return;

    const btnView = document.getElementById('btn-fv-mode-view');
    const btnEdit = document.getElementById('btn-fv-mode-edit');
    const viewContainer = document.getElementById('fv-view-container');
    const editContainer = document.getElementById('fv-edit-container');
    const footerView = document.getElementById('fv-footer-view');
    const footerEdit = document.getElementById('fv-footer-edit');

    if (mode === 'edit') {
      if (btnView) btnView.classList.remove('active');
      if (btnEdit) btnEdit.classList.add('active');
      if (viewContainer) viewContainer.style.display = 'none';
      if (editContainer) editContainer.style.display = 'block';
      if (footerView) footerView.style.display = 'none';
      if (footerEdit) footerEdit.style.display = 'flex';
      this.populateFicheDeVieEdit(eq);
    } else {
      if (btnView) btnView.classList.add('active');
      if (btnEdit) btnEdit.classList.remove('active');
      if (viewContainer) viewContainer.style.display = 'block';
      if (editContainer) editContainer.style.display = 'none';
      if (footerView) footerView.style.display = 'flex';
      if (footerEdit) footerEdit.style.display = 'none';
      this.populateFicheDeVieView(eq);
    }
  },

  populateFicheDeVieView(eq) {
    const hasDateSortie = eq.dateSortie && eq.dateSortie !== '-' && eq.dateSortie.trim() !== '';
    const calculatedDaysCloture = hasDateSortie ? this.calculateDays(eq.dateEntree, eq.dateSortie) : '-';
    const calculatedDaysEnCours = !hasDateSortie ? this.calculateDaysFromToday(eq.dateEntree) : '-';
    const effectiveStatut = hasDateSortie ? 'CLÔTURE' : (eq.statut || 'DEPENDANT');

    // Header
    const codeEl = document.getElementById('fv-code');
    const titleEl = document.getElementById('fv-title');
    const statutPill = document.getElementById('fv-statut-pill');
    if (codeEl) codeEl.textContent = eq.codeEquipement;
    if (titleEl) titleEl.textContent = eq.description;
    if (statutPill) {
      statutPill.textContent = effectiveStatut;
      statutPill.className = `status-pill ${hasDateSortie ? 'cloture' : 'dependant'}`;
    }

    // Card 1: Fiche d'identité
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '-';
    };

    setTxt('fv-client', eq.client);
    setTxt('fv-serial', eq.numSerie);
    setTxt('fv-model', `${eq.fournisseur || ''} ${eq.modele || ''}`.trim());
    setTxt('fv-entite', eq.entite || 'BIOMED');
    setTxt('fv-situation', eq.situation || 'En traitement');
    setTxt('fv-etat-sortie', eq.etatSortie || 'Non fonctionnel');
    setTxt('fv-zone', eq.zoneActuelle || 'Atelier Mécanique Lourde');
    setTxt('fv-tech', eq.responsableTechnique || 'Ousmane Fall');
    setTxt('fv-reception', eq.responsableReception || 'Modou Faye');
    setTxt('fv-date-entree', eq.dateEntree);
    setTxt('fv-date-sortie', eq.dateSortie);
    setTxt('fv-pec', `${eq.datePriseEnCharge || '-'} (Délai : ${eq.delaisPriseEnCharge || '-'})`);
    setTxt('fv-frb', `${eq.dateFRB || '-'} (Délai : ${eq.delaisFRB || '-'})`);
    setTxt('fv-cout', eq.coutEstime || '0 FCFA');
    setTxt('fv-motif', eq.motif || 'Aucun motif renseigné');

    const daysEl = document.getElementById('fv-days');
    if (daysEl) {
      if (hasDateSortie && calculatedDaysCloture !== '-') {
        daysEl.textContent = `${calculatedDaysCloture} jours (Clôturé)`;
        daysEl.className = `days-badge ${calculatedDaysCloture > 10 ? 'red' : calculatedDaysCloture > 5 ? 'amber' : 'green'}`;
      } else if (!hasDateSortie && calculatedDaysEnCours !== '-') {
        daysEl.textContent = `${calculatedDaysEnCours} jours (En cours)`;
        daysEl.className = `days-badge ${calculatedDaysEnCours > 10 ? 'red' : calculatedDaysEnCours > 5 ? 'amber' : 'green'}`;
      } else {
        daysEl.textContent = '-';
        daysEl.className = 'badge-tag slate';
      }
    }

    // Card 2: Timeline
    const timelineContainer = document.getElementById('fv-timeline-steps');
    if (timelineContainer) {
      if (!eq.timeline || eq.timeline.length === 0) {
        timelineContainer.innerHTML = `<div style="font-size: 12.5px; color: #64748B; padding: 8px 0;">Aucune étape enregistrée pour cet équipement.</div>`;
      } else {
        timelineContainer.innerHTML = eq.timeline.map(t => `
          <div class="timeline-step-item ${t.status || 'done'}">
            <div class="timeline-node"></div>
            <div class="timeline-title-row">
              <span class="timeline-step-title">${t.event}</span>
              <span class="timeline-step-date">${t.date}</span>
            </div>
            <div class="timeline-step-meta" style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 4px; font-size: 11.5px;">
              <div class="timeline-step-agent">👤 Intervenant : <strong>${t.agent}</strong></div>
              ${t.resultat ? `
                <div class="timeline-step-result">
                  <span>🎯 Résultat :</span>
                  <strong>${t.resultat}</strong>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // Card 3: Pièces
    const piecesTbody = document.getElementById('fv-pieces-body');
    if (piecesTbody) {
      if (!eq.pieces || eq.pieces.length === 0) {
        piecesTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748B; padding: 16px;">Aucune pièce de rechange consommée enregistrée.</td></tr>`;
      } else {
        piecesTbody.innerHTML = eq.pieces.map(p => `
          <tr>
            <td><span style="font-family: monospace; font-weight: 600; color: #2E5090;">${p.ref}</span></td>
            <td><strong>${p.nom}</strong></td>
            <td style="text-align: center;"><strong>${p.qte}</strong></td>
            <td>${p.cout}</td>
            <td><span class="badge-tag ${p.statut && p.statut.includes('Installé') ? 'green' : 'amber'}">${p.statut}</span></td>
          </tr>
        `).join('');
      }
    }
  },

  populateFicheDeVieEdit(eq) {
    // Populate client options
    const clientSelect = document.getElementById('edit-fv-client');
    if (clientSelect) {
      const clientNames = [
        ...new Set([
          ...SAMA_DATA.sitesTS.map(s => s.nomClient),
          ...(SAMA_DATA.clients || []).map(c => c.nomClient),
          eq.client
        ])
      ].filter(Boolean).sort();

      clientSelect.innerHTML = clientNames.map(c => 
        `<option value="${c}" ${c === eq.client ? 'selected' : ''}>${c}</option>`
      ).join('');
    }

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    setVal('edit-fv-code', eq.codeEquipement);
    setVal('edit-fv-desc', eq.description);
    setVal('edit-fv-serial', eq.numSerie === 'N/A' ? '' : eq.numSerie);
    setVal('edit-fv-fournisseur', eq.fournisseur);
    setVal('edit-fv-modele', eq.modele);
    setVal('edit-fv-entite', eq.entite || 'BIOMED');
    setVal('edit-fv-statut', eq.statut || 'DEPENDANT');
    setVal('edit-fv-situation', eq.situation || 'En traitement');
    setVal('edit-fv-etat-sortie', eq.etatSortie || 'Non fonctionnel');
    setVal('edit-fv-zone', eq.zoneActuelle || 'Atelier Mécanique Lourde');
    setVal('edit-fv-tech', eq.responsableTechnique || 'Ousmane Fall');
    setVal('edit-fv-reception', eq.responsableReception || 'Modou Faye');
    setVal('edit-fv-delais-pec', eq.delaisPriseEnCharge || '');
    setVal('edit-fv-delais-frb', eq.delaisFRB || '');
    setVal('edit-fv-cout', eq.coutEstime || '');
    setVal('edit-fv-motif', eq.motif || '');

    // Synchronisation des datepickers
    this.initDatePickers();
    this.setPickerValue('edit-fv-date-entree', eq.dateEntree);
    this.setPickerValue('edit-fv-date-sortie', (eq.dateSortie && eq.dateSortie !== '-') ? eq.dateSortie : '');
    this.setPickerValue('edit-fv-date-pec', (eq.datePriseEnCharge && eq.datePriseEnCharge !== '-') ? eq.datePriseEnCharge : '');
    this.setPickerValue('edit-fv-date-frb', (eq.dateFRB && eq.dateFRB !== '-') ? eq.dateFRB : '');

    // Reset inline add inputs with helpful defaults
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const stepAgentSelect = document.getElementById('add-step-agent');
    const stepResultatInput = document.getElementById('add-step-resultat');
    const stepEventInput = document.getElementById('add-step-event');

    this.setPickerValue('add-step-date', nowStr);
    if (stepResultatInput) stepResultatInput.value = '';
    if (stepEventInput) stepEventInput.value = '';

    // Populate and pre-select step agent dropdown
    if (stepAgentSelect) {
      const agentsList = [
        ...new Set([
          ...(SAMA_DATA.personnelCST || []).map(p => p.agent),
          eq.responsableTechnique,
          eq.responsableReception,
          "Ousmane Fall",
          "Ibrahima Gueye",
          "Abdoulaye Sow",
          "Moussa Diakhaté",
          "Modou Faye",
          "Alioune Badara",
          "Fatou Kiné Ndiaye",
          "Cheikh Amadou Tidiane",
          "Babacar Diop",
          "Awa Sarr",
          "Mamadou Lamine Cissé",
          "Samba Diallo",
          "Atelier Usinage",
          "Atelier Mécanique Lourde",
          "Banc d'Essai & Contrôle",
          "Contrôle Qualité & Métrologie",
          "Magasin Central",
          "Service Achats",
          "Superviseur"
        ])
      ].filter(Boolean);

      stepAgentSelect.innerHTML = agentsList.map(a => 
        `<option value="${a}" ${a === (eq.responsableTechnique || 'Ousmane Fall') ? 'selected' : ''}>${a}</option>`
      ).join('');
    }

    // Deep copy timeline & pieces for editing
    this.editingFvTimeline = JSON.parse(JSON.stringify(eq.timeline || []));
    this.editingTimelineIndex = null;
    this.editingFvPieces = JSON.parse(JSON.stringify(eq.pieces || []));

    this.renderFvEditTimeline();
    this.renderFvEditPieces();
  },

  handleFvDateChange() {
    const sortieEl = document.getElementById('edit-fv-date-sortie');
    const statutSelect = document.getElementById('edit-fv-statut');
    const situationSelect = document.getElementById('edit-fv-situation');
    const etatSortieSelect = document.getElementById('edit-fv-etat-sortie');

    if (sortieEl && sortieEl.value && sortieEl.value.trim() !== '') {
      if (statutSelect) statutSelect.value = 'CLÔTURE';
      if (situationSelect) situationSelect.value = 'Clôturé';
      if (etatSortieSelect) etatSortieSelect.value = 'Fonctionnel';
    } else {
      if (statutSelect && statutSelect.value === 'CLÔTURE') statutSelect.value = 'DEPENDANT';
      if (situationSelect && situationSelect.value === 'Clôturé') situationSelect.value = 'En traitement';
      if (etatSortieSelect && etatSortieSelect.value === 'Fonctionnel') etatSortieSelect.value = 'Non fonctionnel';
    }
  },

  renderFvEditTimeline() {
    const container = document.getElementById('edit-fv-timeline-list');
    if (!container) return;

    if (this.editingFvTimeline.length === 0) {
      container.innerHTML = `<div style="font-size: 12px; color: #64748B; font-style: italic;">Aucune étape enregistrée. Utilisez le formulaire ci-dessous pour en ajouter une.</div>`;
      return;
    }

    const eq = SAMA_DATA.equipementsAtelier.find(e => e.codeEquipement === this.currentFvCode) || {};
    const agentsList = [
      ...new Set([
        ...(SAMA_DATA.personnelCST || []).map(p => p.agent),
        eq.responsableTechnique,
        eq.responsableReception,
        "Ousmane Fall",
        "Ibrahima Gueye",
        "Abdoulaye Sow",
        "Moussa Diakhaté",
        "Modou Faye",
        "Alioune Badara",
        "Fatou Kiné Ndiaye",
        "Cheikh Amadou Tidiane",
        "Babacar Diop",
        "Awa Sarr",
        "Mamadou Lamine Cissé",
        "Samba Diallo",
        "Atelier Usinage",
        "Atelier Mécanique Lourde",
        "Banc d'Essai & Contrôle",
        "Contrôle Qualité & Métrologie",
        "Magasin Central",
        "Service Achats",
        "Superviseur"
      ])
    ].filter(Boolean);

    container.innerHTML = this.editingFvTimeline.map((step, idx) => {
      const isEditing = this.editingTimelineIndex === idx;

      if (isEditing) {
        return `
          <div class="fv-editor-item-row is-editing">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: 800; font-size: 13px; color: var(--ts-blue); display: flex; align-items: center; gap: 6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Modifier l'intervention #${idx + 1}</span>
              </div>
              <span class="badge-tag blue" style="font-size: 10.5px; font-weight: 700;">Mode Modification</span>
            </div>

            <div class="fv-step-form-grid" style="margin-bottom: 8px;">
              <!-- Ligne 1 : Date & Heure, Responsable, Statut -->
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 3px;">Date & Heure *</label>
                <div class="input-date-wrapper">
                  <input type="text" id="edit-step-date-${idx}" class="form-input datetime-picker-input" value="${step.date}" style="font-size: 12px; padding: 7px 30px 7px 10px;">
                  <span class="input-date-icon" style="right: 8px;" title="Ouvrir le calendrier">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </span>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 3px;">Responsable / Intervenant *</label>
                <select id="edit-step-agent-${idx}" class="form-select" style="font-size: 12px; padding: 7px 10px;">
                  ${agentsList.map(a => `<option value="${a}" ${a === step.agent ? 'selected' : ''}>${a}</option>`).join('')}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 3px;">Statut de l'étape</label>
                <select id="edit-step-status-${idx}" class="form-select" style="font-size: 12px; padding: 7px 10px;">
                  <option value="done" ${step.status === 'done' ? 'selected' : ''}>Effectué</option>
                  <option value="in-progress" ${step.status === 'in-progress' ? 'selected' : ''}>En cours</option>
                  <option value="pending" ${step.status === 'pending' ? 'selected' : ''}>En attente / Planifié</option>
                </select>
              </div>

              <!-- Ligne 2 : Description, Résultat, Boutons -->
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 3px;">Description de l'action *</label>
                <input type="text" id="edit-step-event-${idx}" class="form-input" value="${step.event.replace(/"/g, '&quot;')}" style="font-size: 12px; padding: 7px 10px;">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 3px;">Résultat obtenu / Observation</label>
                <input type="text" id="edit-step-resultat-${idx}" class="form-input" value="${(step.resultat || '').replace(/"/g, '&quot;')}" placeholder="ex: Conforme, Test validé..." style="font-size: 12px; padding: 7px 10px;">
              </div>

              <div style="display: flex; align-items: flex-end; gap: 8px;">
                <button type="button" class="btn-primary" style="flex: 1; height: 35px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="APP.saveTimelineStep(${idx})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Valider</span>
                </button>
                <button type="button" class="btn-secondary" style="height: 35px; font-size: 12px; padding: 0 12px;" onclick="APP.cancelEditTimelineStep()">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="fv-editor-item-row">
          <div class="fv-editor-item-info">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge-tag ${step.status === 'done' ? 'green' : step.status === 'in-progress' ? 'blue' : 'slate'}" style="font-size: 10px; padding: 2px 6px;">
                  ${step.status === 'done' ? 'Effectué' : step.status === 'in-progress' ? 'En cours' : 'Planifié'}
                </span>
                <strong style="color: #16243D; font-size: 13px;">${step.event}</strong>
              </div>
              <span style="font-size: 11px; color: #64748B; font-weight: 600;">📅 ${step.date}</span>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 12px; margin-top: 4px;">
              <div>👤 Responsable : <strong style="color: #2E5090;">${step.agent}</strong></div>
              ${step.resultat ? `
                <div class="timeline-step-result">
                  <span>🎯 Résultat :</span>
                  <strong>${step.resultat}</strong>
                </div>
              ` : ''}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" class="btn-fv-edit-item" title="Modifier cette intervention" onclick="APP.editTimelineStep(${idx})">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button type="button" class="btn-fv-delete-item" title="Supprimer cette intervention" onclick="APP.removeTimelineStepFromFv(${idx})">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  editTimelineStep(index) {
    this.editingTimelineIndex = index;
    this.renderFvEditTimeline();
    setTimeout(() => {
      this.initDatePickers();
      const eventInput = document.getElementById(`edit-step-event-${index}`);
      if (eventInput) eventInput.focus();
    }, 40);
  },

  cancelEditTimelineStep() {
    this.editingTimelineIndex = null;
    this.renderFvEditTimeline();
  },

  saveTimelineStep(index) {
    if (index < 0 || index >= this.editingFvTimeline.length) return;
    const dateInput = document.getElementById(`edit-step-date-${index}`);
    const eventInput = document.getElementById(`edit-step-event-${index}`);
    const agentSelect = document.getElementById(`edit-step-agent-${index}`);
    const statusSelect = document.getElementById(`edit-step-status-${index}`);
    const resultatInput = document.getElementById(`edit-step-resultat-${index}`);

    const eventVal = eventInput?.value?.trim();
    if (!eventVal) {
      this.showToast("Veuillez renseigner la description de l'action / intervention.", "error");
      eventInput?.focus();
      return;
    }

    const dateVal = dateInput?.value?.trim() || this.editingFvTimeline[index].date;
    const agentVal = agentSelect?.value || this.editingFvTimeline[index].agent;
    const statusVal = statusSelect?.value || this.editingFvTimeline[index].status;
    const resultatVal = resultatInput?.value?.trim() || '';

    this.editingFvTimeline[index] = {
      ...this.editingFvTimeline[index],
      date: dateVal,
      event: eventVal,
      agent: agentVal,
      status: statusVal,
      resultat: resultatVal
    };

    this.editingTimelineIndex = null;
    this.renderFvEditTimeline();
    this.showToast("Intervention modifiée avec succès !", "success");
  },

  addTimelineStepToFv() {
    const dateInput = document.getElementById('add-step-date');
    const eventInput = document.getElementById('add-step-event');
    const agentSelect = document.getElementById('add-step-agent');
    const statusSelect = document.getElementById('add-step-status');
    const resultatInput = document.getElementById('add-step-resultat');

    const eventVal = eventInput?.value?.trim();
    if (!eventVal) {
      this.showToast("Veuillez renseigner la description de l'action / intervention.", "error");
      eventInput?.focus();
      return;
    }

    const dateVal = dateInput?.value?.trim() || new Date().toISOString().replace('T', ' ').substring(0, 16);
    const agentVal = agentSelect?.value || 'Ousmane Fall';
    const statusVal = statusSelect?.value || 'done';
    const resultatVal = resultatInput?.value?.trim() || '';

    this.editingFvTimeline.push({
      date: dateVal,
      event: eventVal,
      agent: agentVal,
      status: statusVal,
      resultat: resultatVal
    });

    if (eventInput) eventInput.value = '';
    if (resultatInput) resultatInput.value = '';
    this.setPickerValue('add-step-date', new Date().toISOString().replace('T', ' ').substring(0, 16));

    this.renderFvEditTimeline();
    this.showToast("Étape ajoutée avec résultat à la chronologie !", "success");
  },

  removeTimelineStepFromFv(index) {
    if (index >= 0 && index < this.editingFvTimeline.length) {
      this.editingFvTimeline.splice(index, 1);
      if (this.editingTimelineIndex === index) {
        this.editingTimelineIndex = null;
      }
      this.renderFvEditTimeline();
      this.showToast("Intervention supprimée de la chronologie.", "info");
    }
  },

  renderFvEditPieces() {
    const container = document.getElementById('edit-fv-pieces-list');
    if (!container) return;

    if (this.editingFvPieces.length === 0) {
      container.innerHTML = `<div style="font-size: 12px; color: #64748B; font-style: italic;">Aucune pièce enregistrée. Utilisez le formulaire ci-dessous pour en ajouter une.</div>`;
      return;
    }

    container.innerHTML = this.editingFvPieces.map((piece, idx) => `
      <div class="fv-editor-item-row">
        <div class="fv-editor-item-info">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #2E5090; background: #EEF2FF; padding: 2px 6px; border-radius: 4px; border: 1px solid #C7D2FE;">
              ${piece.ref || 'N/A'}
            </span>
            <strong style="color: #16243D;">${piece.nom}</strong>
            <span class="badge-tag ${piece.statut && piece.statut.includes('Installé') ? 'green' : 'amber'}" style="font-size: 10px; padding: 2px 6px;">
              ${piece.statut || 'Installé'}
            </span>
          </div>
          <div style="font-size: 11.5px; color: #64748B;">
            Quantité : <strong>${piece.qte}</strong> • Montant : <strong>${piece.cout}</strong>
          </div>
        </div>
        <button type="button" class="btn-fv-delete-item" title="Supprimer cette pièce" onclick="APP.removePieceFromFv(${idx})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `).join('');
  },

  addPieceToFv() {
    const refInput = document.getElementById('add-piece-ref');
    const nomInput = document.getElementById('add-piece-nom');
    const qteInput = document.getElementById('add-piece-qte');
    const coutInput = document.getElementById('add-piece-cout');
    const statutSelect = document.getElementById('add-piece-statut');

    const nomVal = nomInput?.value?.trim();
    if (!nomVal) {
      this.showToast("Veuillez renseigner la désignation de la pièce.", "error");
      nomInput?.focus();
      return;
    }

    const refVal = refInput?.value?.trim() || `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const qteVal = parseInt(qteInput?.value, 10) || 1;
    const coutVal = coutInput?.value?.trim() || "0 FCFA";
    const statutVal = statutSelect?.value || "Installé";

    this.editingFvPieces.push({
      ref: refVal,
      nom: nomVal,
      qte: qteVal,
      cout: coutVal,
      statut: statutVal
    });

    if (refInput) refInput.value = '';
    if (nomInput) nomInput.value = '';
    if (qteInput) qteInput.value = '1';
    if (coutInput) coutInput.value = '';

    this.renderFvEditPieces();
    this.showToast("Pièce de rechange ajoutée à la fiche !", "info");
  },

  removePieceFromFv(index) {
    if (index >= 0 && index < this.editingFvPieces.length) {
      this.editingFvPieces.splice(index, 1);
      this.renderFvEditPieces();
    }
  },

  saveFicheDeVie(e) {
    if (e) e.preventDefault();
    const eq = SAMA_DATA.equipementsAtelier.find(item => item.codeEquipement === this.currentFvCode);
    if (!eq) {
      this.showToast("Erreur : Équipement introuvable.", "error");
      return;
    }

    const desc = document.getElementById('edit-fv-desc')?.value?.trim();
    const client = document.getElementById('edit-fv-client')?.value;
    const serial = document.getElementById('edit-fv-serial')?.value?.trim() || "N/A";
    const fournisseur = document.getElementById('edit-fv-fournisseur')?.value?.trim() || eq.fournisseur;
    const modele = document.getElementById('edit-fv-modele')?.value?.trim() || eq.modele;
    const entite = document.getElementById('edit-fv-entite')?.value || eq.entite;
    const dateEntree = document.getElementById('edit-fv-date-entree')?.value || eq.dateEntree;
    const dateSortieVal = document.getElementById('edit-fv-date-sortie')?.value;
    const formStatut = document.getElementById('edit-fv-statut')?.value;
    const situation = document.getElementById('edit-fv-situation')?.value || eq.situation;
    const etatSortie = document.getElementById('edit-fv-etat-sortie')?.value || eq.etatSortie;
    const zone = document.getElementById('edit-fv-zone')?.value || eq.zoneActuelle;
    const tech = document.getElementById('edit-fv-tech')?.value || eq.responsableTechnique;
    const reception = document.getElementById('edit-fv-reception')?.value?.trim() || eq.responsableReception;
    const datePec = document.getElementById('edit-fv-date-pec')?.value?.trim() || eq.datePriseEnCharge;
    const delaisPec = document.getElementById('edit-fv-delais-pec')?.value?.trim() || eq.delaisPriseEnCharge;
    const dateFrb = document.getElementById('edit-fv-date-frb')?.value?.trim() || eq.dateFRB;
    const delaisFrb = document.getElementById('edit-fv-delais-frb')?.value?.trim() || eq.delaisFRB;
    const cout = document.getElementById('edit-fv-cout')?.value?.trim() || eq.coutEstime;
    const motif = document.getElementById('edit-fv-motif')?.value?.trim() || eq.motif;

    if (!desc || !client) {
      this.showToast("Veuillez renseigner au moins la Description et le Client.", "error");
      return;
    }

    const hasDateSortie = Boolean(dateSortieVal && dateSortieVal.trim() !== '');
    const dateSortie = hasDateSortie ? dateSortieVal : '-';
    const nbJours = hasDateSortie ? this.calculateDays(dateEntree, dateSortie) : '-';
    const dureeAtelier = !hasDateSortie ? `${this.calculateDaysFromToday(dateEntree)} j` : '-';
    const statut = hasDateSortie ? 'CLÔTURE' : (formStatut || 'DEPENDANT');

    // Mise à jour de l'objet équipement
    eq.description = desc;
    eq.client = client;
    eq.numSerie = serial;
    eq.fournisseur = fournisseur;
    eq.modele = modele;
    eq.entite = entite;
    eq.dateEntree = dateEntree;
    eq.dateSortie = dateSortie;
    eq.statut = statut;
    eq.situation = situation;
    eq.etatSortie = etatSortie;
    eq.zoneActuelle = zone;
    eq.responsableTechnique = tech;
    eq.responsableReception = reception;
    eq.nombreJoursAtelier = nbJours;
    eq.dureeAtelier = dureeAtelier;
    eq.datePriseEnCharge = datePec;
    eq.delaisPriseEnCharge = delaisPec;
    eq.dateFRB = dateFrb;
    eq.delaisFRB = delaisFrb;
    eq.coutEstime = cout;
    eq.motif = motif;
    eq.timeline = [...this.editingFvTimeline];
    eq.pieces = [...this.editingFvPieces];

    // Re-rendre le tableau et actualiser les composants dépendants
    this.renderEquipementTable();
    this.renderCriticiteTable();
    this.renderRedAlerts();
    this.renderEntityAvailability();

    // Synchronisation Supabase en arrière-plan
    if (window.supabaseSync && typeof window.supabaseSync.syncSaveEquipementAtelier === 'function') {
      window.supabaseSync.syncSaveEquipementAtelier(eq);
      window.supabaseSync.syncReplaceAllTimelineSteps(eq.codeEquipement, eq.timeline);
    }

    // Rebasculer en mode consultation
    this.setFicheDeVieMode('view');
    this.showToast(`Fiche de vie "${eq.codeEquipement}" (${eq.description}) enregistrée avec succès !`, "success");
  },

  printFicheDeVie() {
    const eq = SAMA_DATA.equipementsAtelier.find(e => e.codeEquipement === this.currentFvCode);
    if (!eq) return;

    const printWin = window.open('', '_blank', 'width=900,height=750');
    if (!printWin) {
      this.showToast("Veuillez autoriser les fenêtres contextuelles pour imprimer la fiche.", "error");
      return;
    }

    const hasDateSortie = eq.dateSortie && eq.dateSortie !== '-' && eq.dateSortie.trim() !== '';
    const calculatedDaysCloture = hasDateSortie ? this.calculateDays(eq.dateEntree, eq.dateSortie) : '-';
    const calculatedDaysEnCours = !hasDateSortie ? this.calculateDaysFromToday(eq.dateEntree) : '-';
    const effectiveStatut = hasDateSortie ? 'CLÔTURE' : (eq.statut || 'DEPENDANT');

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Fiche de Vie — ${eq.codeEquipement}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 30px; color: #1E293B; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2E5090; padding-bottom: 16px; margin-bottom: 20px; }
          .logo { font-size: 20px; font-weight: 900; color: #2E5090; }
          .logo span { color: #72C100; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
          .cloture { background: #DCFCE7; color: #15803D; }
          .dependant { background: #FEF3C7; color: #B45309; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; font-size: 13px; }
          .box { border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
          .box h3 { margin-top: 0; font-size: 14px; color: #2E5090; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; }
          th { background: #F8FAFC; color: #475569; }
          .footer { margin-top: 30px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">TECHNOLOGIES SERVICES <span>• SAMA CST</span></div>
            <h1 style="margin: 4px 0 0 0; font-size: 20px;">Fiche de Vie 360° — ${eq.codeEquipement}</h1>
            <div style="font-size: 14px; color: #64748B;">${eq.description}</div>
          </div>
          <div style="text-align: right;">
            <div class="badge ${hasDateSortie ? 'cloture' : 'dependant'}">${effectiveStatut}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Édité le ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        <div class="box">
          <h3>1. Identité Matérielle & Données d'Atelier</h3>
          <div class="grid">
            <div><strong>Client / Site :</strong> ${eq.client}</div>
            <div><strong>N° de Série :</strong> ${eq.numSerie}</div>
            <div><strong>Marque / Modèle :</strong> ${eq.fournisseur} ${eq.modele}</div>
            <div><strong>Entité :</strong> ${eq.entite}</div>
            <div><strong>Situation :</strong> ${eq.situation}</div>
            <div><strong>État de Sortie :</strong> ${eq.etatSortie}</div>
            <div><strong>Zone Actuelle :</strong> ${eq.zoneActuelle}</div>
            <div><strong>Responsable Technique :</strong> ${eq.responsableTechnique}</div>
            <div><strong>Date Entrée :</strong> ${eq.dateEntree}</div>
            <div><strong>Date Sortie :</strong> ${eq.dateSortie}</div>
            <div><strong>Durée Atelier :</strong> ${hasDateSortie ? calculatedDaysCloture + ' j' : calculatedDaysEnCours + ' j'}</div>
            <div><strong>Coût Estimé :</strong> ${eq.coutEstime}</div>
            <div style="grid-column: span 2;"><strong>Motif & Diagnostic :</strong> ${eq.motif}</div>
          </div>
        </div>

        <div class="box">
          <h3>2. Chronologie & Interventions en Atelier</h3>
          <table>
            <thead>
              <tr><th>Date</th><th>Événement / Intervention</th><th>Intervenant</th><th>Statut</th></tr>
            </thead>
            <tbody>
              ${(eq.timeline || []).map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td><strong>${t.event}</strong></td>
                  <td>${t.agent}</td>
                  <td>${t.status === 'done' ? 'Effectué' : t.status === 'in-progress' ? 'En cours' : 'Planifié'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="box">
          <h3>3. Pièces de Rechange Consommées</h3>
          <table>
            <thead>
              <tr><th>Référence</th><th>Désignation</th><th>Quantité</th><th>Montant</th><th>Statut</th></tr>
            </thead>
            <tbody>
              ${(eq.pieces || []).map(p => `
                <tr>
                  <td>${p.ref}</td>
                  <td>${p.nom}</td>
                  <td style="text-align: center;">${p.qte}</td>
                  <td>${p.cout}</td>
                  <td>${p.statut}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          Document généré automatiquement par la plateforme GMAO Sama CST — Technologies Services.
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 300);
  },

  closeFicheDeVie() {
    const drawer = document.getElementById('drawer-fiche-vie');
    const overlay = document.getElementById('modal-overlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    this.currentFvCode = null;
  },

  // ------------------------------------------------------------------------
  // RENDU DE LA BASE DE DONNÉES TS (SITES & CLIENTS)
  // ------------------------------------------------------------------------
  renderSitesTS() {
    const container = document.getElementById('sites-ts-grid');
    if (!container) return;

    container.innerHTML = SAMA_DATA.sitesTS.map(site => `
      <div class="site-card">
        <div>
          <div class="site-header-row">
            <div>
              <div class="site-name">${site.nomClient}</div>
              <div class="site-sector">${site.secteur} • ${site.localisation}</div>
            </div>
            <span class="badge-tag green">${site.statut}</span>
          </div>

          <div class="site-info-list">
            <div class="site-info-item">
              <span class="lbl">Responsable de Site :</span>
              <span class="val">${site.responsableSite}</span>
            </div>
            <div class="site-info-item">
              <span class="lbl">Téléphone & Contact :</span>
              <span class="val">${site.telephone}</span>
            </div>
            <div class="site-info-item">
              <span class="lbl">Parc sous contrat :</span>
              <span class="val" style="color: #2E5090; font-weight: 800;">${site.parcEquipements} équipements</span>
            </div>
            <div class="site-info-item">
              <span class="lbl">En Atelier actuellement :</span>
              <span class="val" style="color: #EF4444;">${site.equipementsEnAtelier} en cours</span>
            </div>
            <div class="site-info-item">
              <span class="lbl">SLA Garanti :</span>
              <span class="val"><span class="badge-tag blue">${site.slaHeures}h max</span></span>
            </div>
            <div class="site-info-item">
              <span class="lbl">Taux de Disponibilité :</span>
              <span class="val" style="color: #4A8000; font-size: 14px; font-weight: 800;">${site.tauxDisponibilite}%</span>
            </div>
            <div class="site-info-item">
              <span class="lbl">Technicien Référent TS :</span>
              <span class="val"><strong>${site.technicienReferent}</strong></span>
            </div>
          </div>
        </div>

        <button class="site-footer-btn" onclick="APP.filterByClient('${site.nomClient}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Voir les équipements de ce site
        </button>
      </div>
    `).join('');
  },

  // ------------------------------------------------------------------------
  // BASE DE DONNÉES TS : GESTION DE LA VUE PAR ÉQUIPEMENT
  // ------------------------------------------------------------------------
  switchBaseTSView(view) {
    this.currentBaseTSView = view;
    
    const btnClients = document.getElementById('btn-base-view-clients');
    const btnEquips = document.getElementById('btn-base-view-equipements');
    const viewClients = document.getElementById('base-ts-view-clients');
    const viewEquips = document.getElementById('base-ts-view-equipements');

    if (view === 'clients') {
      btnClients?.classList.add('active');
      btnEquips?.classList.remove('active');
      if (viewClients) viewClients.style.display = 'block';
      if (viewEquips) viewEquips.style.display = 'none';
      this.renderSitesTS();
    } else {
      btnEquips?.classList.add('active');
      btnClients?.classList.remove('active');
      if (viewClients) viewClients.style.display = 'none';
      if (viewEquips) viewEquips.style.display = 'block';
      this.renderParcEquipementsTS();
    }
  },

  setBaseEqDisplayMode(mode) {
    this.baseEqDisplayMode = mode;
    const btnCards = document.getElementById('btn-base-eq-mode-cards');
    const btnTable = document.getElementById('btn-base-eq-mode-table');
    const gridEl = document.getElementById('base-equipements-grid');
    const tableEl = document.getElementById('base-equipements-table-wrap');

    if (mode === 'cards') {
      btnCards?.classList.add('active');
      btnTable?.classList.remove('active');
      if (gridEl) gridEl.style.display = 'grid';
      if (tableEl) tableEl.style.display = 'none';
    } else {
      btnTable?.classList.add('active');
      btnCards?.classList.remove('active');
      if (gridEl) gridEl.style.display = 'none';
      if (tableEl) tableEl.style.display = 'block';
    }
  },

  handleBaseEqSearch(val) {
    this.baseEqSearchQuery = (val || '').toLowerCase().trim();
    this.renderParcEquipementsTS();
  },

  handleBaseEqClientFilter(client) {
    this.baseEqClientFilter = client;
    this.renderParcEquipementsTS();
  },

  handleBaseEqEntiteFilter(entite) {
    this.baseEqEntiteFilter = entite;
    this.renderParcEquipementsTS();
  },

  handleBaseEqEtatFilter(etat) {
    this.baseEqEtatFilter = etat;
    this.renderParcEquipementsTS();
  },

  renderParcEquipementsTS() {
    const rawItems = SAMA_DATA.parcEquipementsTS || [];
    const gridContainer = document.getElementById('base-equipements-grid');
    const tableBody = document.getElementById('base-equipements-table-body');
    const clientSelect = document.getElementById('filter-base-eq-client');

    // 1. Remplissage dynamique du filtre client
    if (clientSelect) {
      const currentSelected = clientSelect.value;
      const clientsList = [...new Set(rawItems.map(e => e.client))].sort();
      clientSelect.innerHTML = '<option value="all">🏢 Tous les Clients</option>';
      clientsList.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentSelected) opt.selected = true;
        clientSelect.appendChild(opt);
      });
    }

    // 2. Calcul et mise à jour des KPIs
    const totalEq = rawItems.length;
    const enService = rawItems.filter(e => e.etatOperationnel.includes('En Service')).length;
    const enAtelier = rawItems.filter(e => e.isAtelier || e.etatOperationnel.includes('Atelier')).length;
    const dispoAvg = (rawItems.reduce((acc, e) => acc + (parseFloat(e.tauxDisponibilite) || 0), 0) / (totalEq || 1)).toFixed(1);

    const kpiTotal = document.getElementById('kpi-base-eq-total');
    const kpiService = document.getElementById('kpi-base-eq-service');
    const kpiAtelier = document.getElementById('kpi-base-eq-atelier');
    const kpiDispo = document.getElementById('kpi-base-eq-dispo');
    const badgeCount = document.getElementById('base-eq-badge-count');

    if (kpiTotal) kpiTotal.textContent = totalEq;
    if (kpiService) kpiService.textContent = enService;
    if (kpiAtelier) kpiAtelier.textContent = enAtelier;
    if (kpiDispo) kpiDispo.textContent = `${dispoAvg}%`;
    if (badgeCount) badgeCount.textContent = totalEq;

    // 3. Filtrage des équipements
    let filtered = [...rawItems];

    if (this.baseEqSearchQuery) {
      const q = this.baseEqSearchQuery;
      filtered = filtered.filter(e => 
        (e.codeEquipement && e.codeEquipement.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q)) ||
        (e.client && e.client.toLowerCase().includes(q)) ||
        (e.fournisseur && e.fournisseur.toLowerCase().includes(q)) ||
        (e.modele && e.modele.toLowerCase().includes(q)) ||
        (e.numSerie && e.numSerie.toLowerCase().includes(q)) ||
        (e.siteLocalisation && e.siteLocalisation.toLowerCase().includes(q)) ||
        (e.technicienReferent && e.technicienReferent.toLowerCase().includes(q))
      );
    }

    if (this.baseEqClientFilter && this.baseEqClientFilter !== 'all') {
      filtered = filtered.filter(e => e.client === this.baseEqClientFilter);
    }

    if (this.baseEqEntiteFilter && this.baseEqEntiteFilter !== 'all') {
      filtered = filtered.filter(e => e.entite === this.baseEqEntiteFilter);
    }

    if (this.baseEqEtatFilter && this.baseEqEtatFilter !== 'all') {
      filtered = filtered.filter(e => e.etatOperationnel.includes(this.baseEqEtatFilter));
    }

    // 4. Rendu de la Grille de Cartes
    if (gridContainer) {
      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1px dashed #CBD5E1; border-radius: 12px; padding: 48px 24px; text-align: center; color: #64748B;">
            <div style="font-size: 36px; margin-bottom: 8px;">⚙️</div>
            <div style="font-size: 16px; font-weight: 800; color: #1E293B;">Aucun équipement trouvé</div>
            <div style="font-size: 13px; margin-top: 4px;">Modifiez vos critères de recherche ou réinitialisez les filtres.</div>
          </div>
        `;
      } else {
        gridContainer.innerHTML = filtered.map(eq => {
          const isAtelier = Boolean(eq.isAtelier);
          const entiteBadgeClass = eq.entite === 'BIOMED' ? 'blue' : 'green';
          const dispoVal = parseFloat(eq.tauxDisponibilite) || 95;
          const dispoColor = dispoVal >= 98 ? '#16A34A' : dispoVal >= 94 ? '#2E5090' : '#EAB308';
          
          let etatBadgeClass = 'green';
          if (isAtelier || eq.etatOperationnel.includes('Atelier')) etatBadgeClass = 'red';
          else if (eq.etatOperationnel.includes('Révision')) etatBadgeClass = 'amber';

          return `
            <div class="eq-parc-card">
              <div>
                <div class="eq-parc-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="eq-parc-code">${eq.codeEquipement}</span>
                    <span class="badge-tag ${entiteBadgeClass}" style="font-size: 10px; padding: 2px 6px;">${eq.entite}</span>
                  </div>
                  <span class="badge-tag ${etatBadgeClass}" style="font-size: 10.5px; font-weight: 700;">
                    ${isAtelier ? '🔴 En Atelier CST' : eq.etatOperationnel.includes('Révision') ? '🟠 Révision Prév.' : '🟢 Opérationnel'}
                  </span>
                </div>

                <div class="eq-parc-title">${eq.designation}</div>
                <div class="eq-parc-subtitle">🏭 ${eq.fournisseur} • <strong>${eq.modele}</strong></div>

                <div class="eq-parc-info-grid">
                  <div class="eq-parc-info-item">
                    <span class="lbl">Client / Déploiement</span>
                    <span class="val" title="${eq.client}">🏢 ${eq.client}</span>
                  </div>
                  <div class="eq-parc-info-item">
                    <span class="lbl">Localisation Site</span>
                    <span class="val" title="${eq.siteLocalisation}">📍 ${eq.siteLocalisation}</span>
                  </div>
                  <div class="eq-parc-info-item">
                    <span class="lbl">N° de Série Machine</span>
                    <span class="val" style="font-family: monospace; color: #475569;">${eq.numSerie}</span>
                  </div>
                  <div class="eq-parc-info-item">
                    <span class="lbl">Technicien Référent</span>
                    <span class="val" style="color: #2E5090;">👤 ${eq.technicienReferent}</span>
                  </div>
                  <div class="eq-parc-info-item">
                    <span class="lbl">Disponibilité Opér.</span>
                    <span class="val" style="color: ${dispoColor}; font-weight: 900; font-size: 13px;">${eq.tauxDisponibilite}%</span>
                  </div>
                  <div class="eq-parc-info-item">
                    <span class="lbl">Prochaine Maintenance</span>
                    <span class="val" style="color: #64748B;">📅 ${eq.prochaineMaintenance}</span>
                  </div>
                </div>
              </div>

              <div class="eq-parc-footer">
                ${isAtelier ? `
                  <button class="eq-parc-footer-btn primary" onclick="APP.openFicheDeVie('${eq.codeEquipement}', 'view')" title="Consulter la Fiche de Vie 360°">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Fiche de Vie 360°</span>
                  </button>
                  <button class="eq-parc-footer-btn" onclick="APP.filterEquipementsTableByCode('${eq.codeEquipement}')" title="Voir l'historique atelier">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <span>Atelier</span>
                  </button>
                ` : `
                  <button class="eq-parc-footer-btn" onclick="APP.showToast('Équipement ${eq.codeEquipement} opérationnel sur site (${eq.client}).', 'info')" title="Fiche technique machine">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    <span>Fiche Parc</span>
                  </button>
                  <button class="eq-parc-footer-btn primary" onclick="APP.createAtelierFromParc('${eq.codeEquipement}')" title="Créer une intervention atelier pour cet équipement">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Entrée Atelier</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Rendu du Tableau Exhaustif
    if (tableBody) {
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 32px; color: #64748B;">Aucun équipement trouvé.</td></tr>`;
      } else {
        tableBody.innerHTML = filtered.map(eq => {
          const isAtelier = Boolean(eq.isAtelier);
          const entiteBadgeClass = eq.entite === 'BIOMED' ? 'blue' : 'green';
          let etatBadgeClass = 'green';
          if (isAtelier || eq.etatOperationnel.includes('Atelier')) etatBadgeClass = 'red';
          else if (eq.etatOperationnel.includes('Révision')) etatBadgeClass = 'amber';

          return `
            <tr>
              <td><span style="font-family: monospace; font-weight: 800; color: #2E5090;">${eq.codeEquipement}</span></td>
              <td><strong>${eq.designation}</strong><br><span style="font-size: 11.5px; color: #64748B;">Modèle : ${eq.modele}</span></td>
              <td><strong>${eq.fournisseur}</strong></td>
              <td><span style="font-family: monospace; font-size: 11.5px; color: #475569;">${eq.numSerie}</span></td>
              <td><strong>${eq.client}</strong><br><span style="font-size: 11px; color: #64748B;">📍 ${eq.siteLocalisation}</span></td>
              <td><span class="badge-tag ${entiteBadgeClass}">${eq.entite}</span></td>
              <td><span class="badge-tag ${etatBadgeClass}">${eq.etatOperationnel}</span></td>
              <td><strong>${eq.technicienReferent}</strong></td>
              <td><strong style="color: #16A34A;">${eq.tauxDisponibilite}%</strong></td>
              <td><span style="font-size: 11.5px;">${eq.derniereRevision}</span></td>
              <td><span style="font-size: 11.5px; font-weight: 600; color: #2E5090;">${eq.prochaineMaintenance}</span></td>
              <td>
                <div style="display: flex; gap: 6px;">
                  ${isAtelier ? `
                    <button class="icon-btn" title="Fiche de Vie 360°" onclick="APP.openFicheDeVie('${eq.codeEquipement}', 'view')" style="color: #2E5090;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="icon-btn" title="Voir dans l'atelier" onclick="APP.filterEquipementsTableByCode('${eq.codeEquipement}')" style="color: #72C100;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </button>
                  ` : `
                    <button class="icon-btn" title="Entrée en atelier" onclick="APP.createAtelierFromParc('${eq.codeEquipement}')" style="color: #2E5090;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  `}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  },

  filterEquipementsTableByCode(code) {
    this.switchModule('atelier-equipements');
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.value = code;
      this.searchQuery = code.toLowerCase();
      this.renderEquipementTable();
    }
  },

  createAtelierFromParc(code) {
    const eq = (SAMA_DATA.parcEquipementsTS || []).find(e => e.codeEquipement === code);
    if (!eq) return;
    this.openNewEquipmentModal();
    
    setTimeout(() => {
      const codeInput = document.getElementById('form-code');
      const descInput = document.getElementById('form-desc');
      const clientSelect = document.getElementById('form-client');
      const serialInput = document.getElementById('form-serial');
      const fournInput = document.getElementById('form-fournisseur');
      const modeleInput = document.getElementById('form-modele');
      const entiteSelect = document.getElementById('form-entite');
      const techSelect = document.getElementById('form-tech');

      if (codeInput) codeInput.value = eq.codeEquipement;
      if (descInput) descInput.value = eq.designation;
      if (clientSelect) clientSelect.value = eq.client;
      if (serialInput) serialInput.value = eq.numSerie;
      if (fournInput) fournInput.value = eq.fournisseur;
      if (modeleInput) modeleInput.value = eq.modele;
      if (entiteSelect) entiteSelect.value = eq.entite;
      if (techSelect) techSelect.value = eq.technicienReferent || 'Ousmane Fall';
    }, 50);
  },

  exportBaseEquipementsCSV() {
    const items = SAMA_DATA.parcEquipementsTS || [];
    if (items.length === 0) {
      this.showToast("Aucun équipement à exporter.", "error");
      return;
    }

    let csvContent = "\uFEFFCode_Equipement,Designation,Fournisseur,Modele,Numero_Serie,Client,Localisation_Site,Entite,Categorie,Etat_Operationnel,Disponibilite,Derniere_Revision,Prochaine_Maintenance,Technicien_Referent,Criticite\n";

    items.forEach(e => {
      const row = [
        `"${(e.codeEquipement || '').replace(/"/g, '""')}"`,
        `"${(e.designation || '').replace(/"/g, '""')}"`,
        `"${(e.fournisseur || '').replace(/"/g, '""')}"`,
        `"${(e.modele || '').replace(/"/g, '""')}"`,
        `"${(e.numSerie || '').replace(/"/g, '""')}"`,
        `"${(e.client || '').replace(/"/g, '""')}"`,
        `"${(e.siteLocalisation || '').replace(/"/g, '""')}"`,
        `"${(e.entite || '').replace(/"/g, '""')}"`,
        `"${(e.categorie || '').replace(/"/g, '""')}"`,
        `"${(e.etatOperationnel || '').replace(/"/g, '""')}"`,
        `"${(e.tauxDisponibilite || '')}%"`,
        `"${(e.derniereRevision || '').replace(/"/g, '""')}"`,
        `"${(e.prochaineMaintenance || '').replace(/"/g, '""')}"`,
        `"${(e.technicienReferent || '').replace(/"/g, '""')}"`,
        `"${(e.criticite || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Parc_Equipements_TS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Export CSV du parc d'équipements généré !", "success");
  },

  // ------------------------------------------------------------------------
  // GESTION DU CATALOGUE ÉQUIPEMENTS TS (5 COLONNES)
  // ------------------------------------------------------------------------
  changeTSPerPage(val) {
    this.tsItemsPerPage = val === 'all' ? 99999 : parseInt(val, 10);
    this.tsCurrentPage = 1;
    this.renderEquipementsTS();
  },

  renderEquipementsTS() {
    const tbody = document.getElementById('table-equipements-ts-body');
    if (!tbody || !SAMA_DATA.equipementsTS) return;

    // Remplissage dynamique des filtres Fournisseur & Catégorie
    const selectFournisseur = document.getElementById('filter-ts-fournisseur');
    if (selectFournisseur) {
      const currentSelectedF = selectFournisseur.value;
      const fournisseurs = [...new Set(SAMA_DATA.equipementsTS.map(e => e.fournisseur))].sort();
      selectFournisseur.innerHTML = '<option value="all">🏭 Tous les Fournisseurs</option>';
      fournisseurs.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        if (f === currentSelectedF) opt.selected = true;
        selectFournisseur.appendChild(opt);
      });
    }

    const selectCategorie = document.getElementById('filter-ts-categorie');
    if (selectCategorie) {
      const currentSelectedC = selectCategorie.value;
      const categories = [...new Set(SAMA_DATA.equipementsTS.map(e => e.categorie))].sort();
      selectCategorie.innerHTML = '<option value="all">📂 Toutes les Catégories</option>';
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentSelectedC) opt.selected = true;
        selectCategorie.appendChild(opt);
      });
    }

    let items = [...SAMA_DATA.equipementsTS];

    // Recherche
    if (this.tsSearchQuery) {
      const q = this.tsSearchQuery.toLowerCase().trim();
      items = items.filter(e => 
        (e.fournisseur && e.fournisseur.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q)) ||
        (e.modele && e.modele.toLowerCase().includes(q)) ||
        (e.categorie && e.categorie.toLowerCase().includes(q)) ||
        (e.entite && e.entite.toLowerCase().includes(q))
      );
    }

    // Filtre Entite
    if (this.tsFilterEntite !== 'all') {
      items = items.filter(e => e.entite === this.tsFilterEntite);
    }

    // Filtre Fournisseur
    if (this.tsFilterFournisseur !== 'all') {
      items = items.filter(e => e.fournisseur === this.tsFilterFournisseur);
    }

    // Filtre Categorie
    if (this.tsFilterCategorie !== 'all') {
      items = items.filter(e => e.categorie === this.tsFilterCategorie);
    }

    // Tri
    items.sort((a, b) => {
      let valA = a[this.tsSortColumn] || '';
      let valB = b[this.tsSortColumn] || '';
      return this.tsSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    // Mise à jour des indicateurs de tri visuels dans le header
    ['fournisseur', 'designation', 'modele', 'categorie', 'entite'].forEach(col => {
      const indEl = document.getElementById(`sort-ts-${col}`);
      if (indEl) {
        if (this.tsSortColumn === col) {
          indEl.textContent = this.tsSortDirection === 'asc' ? '▲' : '▼';
          indEl.style.color = 'var(--ts-green-dark)';
          indEl.style.fontWeight = '900';
        } else {
          indEl.textContent = '↕';
          indEl.style.color = '#94A3B8';
          indEl.style.fontWeight = 'normal';
        }
      }
    });

    // KPIs
    const totalEl = document.getElementById('ts-kpi-total');
    const biomedEl = document.getElementById('ts-kpi-biomed');
    const imagEl = document.getElementById('ts-kpi-imag');
    const fourEl = document.getElementById('ts-kpi-fournisseurs');
    if (totalEl) totalEl.textContent = SAMA_DATA.equipementsTS.length;
    if (biomedEl) biomedEl.textContent = SAMA_DATA.equipementsTS.filter(e => e.entite === 'BIOMED').length;
    if (imagEl) imagEl.textContent = SAMA_DATA.equipementsTS.filter(e => e.entite === 'IMAG-CHIRG').length;
    if (fourEl) fourEl.textContent = [...new Set(SAMA_DATA.equipementsTS.map(e => e.fournisseur))].length;

    const countEl = document.getElementById('ts-records-count');
    if (countEl) countEl.textContent = `${items.length} équipement(s) répertorié(s)`;

    // Pagination
    const totalItems = items.length;
    const itemsPerPage = this.tsItemsPerPage || 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (this.tsCurrentPage > totalPages) this.tsCurrentPage = totalPages;

    const startIndex = (this.tsCurrentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    // Rendu HTML
    if (paginatedItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: #64748B;">
            <div style="font-size: 16px; font-weight: 700; color: #1E293B;">Aucun équipement catalogue trouvé</div>
            <div style="font-size: 12.5px; margin-top: 6px; color: #64748B;">Modifiez vos filtres ou cliquez sur <strong>"+ Ajouter Équipement TS"</strong> pour en créer un nouveau.</div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginatedItems.map((eq, idx) => {
        const entiteBadgeClass = eq.entite === 'BIOMED' ? 'blue' : 'green';
        const globalIdx = SAMA_DATA.equipementsTS.indexOf(eq);
        return `
          <tr>
            <!-- 1. FOURNISSEURS -->
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: rgba(46,80,144,0.08); border: 1px solid rgba(46,80,144,0.15); display: flex; align-items: center; justify-content: center; color: #2E5090; font-weight: 800; font-size: 12px;">
                  ${eq.fournisseur.charAt(0)}
                </div>
                <strong style="color: #16243D; font-size: 13.5px;">${eq.fournisseur}</strong>
              </div>
            </td>
            <!-- 2. DESIGNATION -->
            <td>
              <span style="font-weight: 600; color: #1E293B;">${eq.designation}</span>
            </td>
            <!-- 3. MODELE -->
            <td>
              <span style="font-family: monospace; font-size: 12px; font-weight: 700; color: #2E5090; background: #F1F5F9; padding: 4px 8px; border-radius: 4px; border: 1px solid #E2E8F0;">
                ${eq.modele}
              </span>
            </td>
            <!-- 4. CATEGORIE -->
            <td>
              <span class="badge-tag slate" style="font-size: 11.5px;">${eq.categorie}</span>
            </td>
            <!-- 5. ENTITE -->
            <td style="text-align: center;">
              <span class="badge-tag ${entiteBadgeClass}" style="font-weight: 800; padding: 4px 12px;">
                ${eq.entite}
              </span>
            </td>
            <!-- 6. ACTIONS -->
            <td style="text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 6px;">
                <button class="btn-ts-action" title="Créer une entrée atelier pour ce modèle" onclick="APP.createAtelierFromTS('${eq.modele.replace(/'/g, "\\'")}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                  <span>Atelier</span>
                </button>
                <button class="btn-ts-delete" title="Supprimer du catalogue" onclick="APP.deleteEquipementTS(${globalIdx})">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Pagination Footer
    const footerCountEl = document.getElementById('ts-footer-count');
    if (footerCountEl) {
      const endItem = Math.min(startIndex + itemsPerPage, totalItems);
      footerCountEl.textContent = totalItems > 0 
        ? `Affichage de ${startIndex + 1} à ${endItem} sur ${totalItems} équipements catalogue TS`
        : `0 équipement trouvé`;
    }

    const paginationContainer = document.getElementById('ts-pagination-controls');
    if (paginationContainer) {
      if (itemsPerPage >= 99999 || totalPages <= 1) {
        paginationContainer.innerHTML = '';
      } else {
        let html = `<button class="page-btn" ${this.tsCurrentPage === 1 ? 'disabled' : ''} onclick="APP.goToTSPage(${this.tsCurrentPage - 1})">«</button>`;
        for (let p = 1; p <= totalPages; p++) {
          html += `<button class="page-btn ${p === this.tsCurrentPage ? 'active' : ''}" onclick="APP.goToTSPage(${p})">${p}</button>`;
        }
        html += `<button class="page-btn" ${this.tsCurrentPage === totalPages ? 'disabled' : ''} onclick="APP.goToTSPage(${this.tsCurrentPage + 1})">»</button>`;
        paginationContainer.innerHTML = html;
      }
    }
  },

  sortEquipementsTS(col) {
    if (this.tsSortColumn === col) {
      this.tsSortDirection = this.tsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.tsSortColumn = col;
      this.tsSortDirection = 'asc';
    }
    this.renderEquipementsTS();
  },

  goToTSPage(page) {
    this.tsCurrentPage = page;
    this.renderEquipementsTS();
  },

  openNewEquipementTSModal() {
    const modal = document.getElementById('modal-new-equipement-ts');
    const overlay = document.getElementById('modal-overlay');
    if (modal && overlay) {
      overlay.classList.add('active');
      modal.style.display = 'block';
      setTimeout(() => {
        document.getElementById('form-ts-fournisseur')?.focus();
      }, 50);
    }
  },

  closeNewEquipementTSModal() {
    const modal = document.getElementById('modal-new-equipement-ts');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
  },

  saveNewEquipementTS(e) {
    if (e) e.preventDefault();
    const fournisseur = document.getElementById('form-ts-fournisseur')?.value;
    const designation = document.getElementById('form-ts-designation')?.value;
    const modele = document.getElementById('form-ts-modele')?.value;
    const categorie = document.getElementById('form-ts-categorie')?.value;
    const entite = document.getElementById('form-ts-entite')?.value;

    if (!fournisseur || !designation || !modele) {
      this.showToast("Veuillez renseigner au moins le Fournisseur, la Désignation et le Modèle.", "error");
      return;
    }

    const newEquip = {
      fournisseur: fournisseur.trim(),
      designation: designation.trim(),
      modele: modele.trim(),
      categorie: (categorie || "Équipement Général").trim(),
      entite: entite || "BIOMED"
    };

    SAMA_DATA.equipementsTS.unshift(newEquip);

    // Synchronisation Supabase
    if (window.supabaseSync && typeof window.supabaseSync.syncSaveEquipementTS === 'function') {
      window.supabaseSync.syncSaveEquipementTS(newEquip);
    }

    this.tsCurrentPage = 1;
    this.renderEquipementsTS();
    this.closeNewEquipementTSModal();
    this.showToast(`Équipement ${modele} (${fournisseur}) ajouté au catalogue TS !`, "success");
    document.getElementById('form-new-equipement-ts')?.reset();
  },

  createAtelierFromTS(modele) {
    const eq = SAMA_DATA.equipementsTS.find(e => e.modele === modele);
    if (!eq) return;

    this.switchModule('atelier-equipements');
    this.openNewEquipmentModal();

    // Pré-remplir le formulaire atelier
    const codeGen = `EQ-${eq.modele.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const codeEl = document.getElementById('form-code');
    const descEl = document.getElementById('form-desc');
    const fourEl = document.getElementById('form-fournisseur');
    const modEl = document.getElementById('form-modele');
    const entEl = document.getElementById('form-entite');

    if (codeEl) codeEl.value = codeGen;
    if (descEl) descEl.value = eq.designation;
    if (fourEl) fourEl.value = eq.fournisseur;
    if (modEl) modEl.value = eq.modele;
    if (entEl) entEl.value = eq.entite;

    this.showToast(`Modèle "${eq.modele}" pré-rempli dans le formulaire d'entrée atelier !`, "info");
  },

  deleteEquipementTS(index) {
    if (index < 0 || index >= SAMA_DATA.equipementsTS.length) return;
    const item = SAMA_DATA.equipementsTS[index];
    if (confirm(`Confirmez-vous la suppression de l'équipement "${item.modele} (${item.fournisseur})" du catalogue TS ?`)) {
      if (window.supabaseSync && typeof window.supabaseSync.syncDeleteEquipementTS === 'function') {
        window.supabaseSync.syncDeleteEquipementTS(item.codeTS || item.modele);
      }
      SAMA_DATA.equipementsTS.splice(index, 1);
      this.renderEquipementsTS();
      this.showToast(`Équipement ${item.modele} supprimé du catalogue TS.`, "info");
    }
  },

  exportEquipementsTSToCSV() {
    let csv = "\uFEFF"; // UTF-8 BOM pour Excel
    csv += "FOURNISSEURS,DESIGNATION,MODELE,CATEGORIE,ENTITE\n";
    SAMA_DATA.equipementsTS.forEach(eq => {
      csv += `"${(eq.fournisseur || '').replace(/"/g, '""')}","${(eq.designation || '').replace(/"/g, '""')}","${(eq.modele || '').replace(/"/g, '""')}","${(eq.categorie || '').replace(/"/g, '""')}","${(eq.entite || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Sama_CST_Catalogue_Equipements_TS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Catalogue Équipements TS exporté en CSV (UTF-8) !", "success");
  },

  // ------------------------------------------------------------------------
  // MODULE CLIENTS (9 COLONNES OFFICIELLES & GESTION DES COMPTES)
  // ------------------------------------------------------------------------
  renderClients() {
    const tbody = document.getElementById('table-clients-body');
    if (!tbody || !SAMA_DATA.clients) return;

    // Remplissage dynamique des filtres Ville & Pays
    const selectVille = document.getElementById('filter-client-ville');
    if (selectVille) {
      const currentSelectedV = selectVille.value;
      const villes = [...new Set(SAMA_DATA.clients.map(c => c.villeClient))].filter(Boolean).sort();
      selectVille.innerHTML = '<option value="all">📍 Toutes les Villes</option>';
      villes.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = `📍 ${v}`;
        if (v === currentSelectedV) opt.selected = true;
        selectVille.appendChild(opt);
      });
    }

    const selectPays = document.getElementById('filter-client-pays');
    if (selectPays) {
      const currentSelectedP = selectPays.value;
      const pays = [...new Set(SAMA_DATA.clients.map(c => c.paysClient))].filter(Boolean).sort();
      selectPays.innerHTML = '<option value="all">🌍 Tous les Pays</option>';
      pays.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `🌍 ${p}`;
        if (p === currentSelectedP) opt.selected = true;
        selectPays.appendChild(opt);
      });
    }

    let items = [...SAMA_DATA.clients];

    // Recherche
    if (this.clientSearchQuery) {
      const q = this.clientSearchQuery.toLowerCase().trim();
      items = items.filter(c => 
        (c.client && c.client.toLowerCase().includes(q)) ||
        (c.adresseClient && c.adresseClient.toLowerCase().includes(q)) ||
        (c.villeClient && c.villeClient.toLowerCase().includes(q)) ||
        (c.paysClient && c.paysClient.toLowerCase().includes(q)) ||
        (c.codePostal && c.codePostal.toLowerCase().includes(q)) ||
        (c.nomClient && c.nomClient.toLowerCase().includes(q)) ||
        (c.telephoneClient && c.telephoneClient.toLowerCase().includes(q)) ||
        (c.mailClient && c.mailClient.toLowerCase().includes(q)) ||
        (c.rcNinea && c.rcNinea.toLowerCase().includes(q))
      );
    }

    // Filtre Ville
    if (this.clientFilterVille !== 'all') {
      items = items.filter(c => c.villeClient === this.clientFilterVille);
    }

    // Filtre Pays
    if (this.clientFilterPays !== 'all') {
      items = items.filter(c => c.paysClient === this.clientFilterPays);
    }

    // Tri
    items.sort((a, b) => {
      let valA = a[this.clientSortColumn] || '';
      let valB = b[this.clientSortColumn] || '';
      return this.clientSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    // Mise à jour des indicateurs de tri visuels dans le header
    ['client', 'nomClient', 'adresseClient', 'villeClient', 'paysClient', 'codePostal', 'telephoneClient', 'mailClient', 'rcNinea'].forEach(col => {
      const indEl = document.getElementById(`sort-client-${col}`);
      if (indEl) {
        if (this.clientSortColumn === col) {
          indEl.textContent = this.clientSortDirection === 'asc' ? '▲' : '▼';
          indEl.style.color = 'var(--ts-green-dark)';
          indEl.style.fontWeight = '900';
        } else {
          indEl.textContent = '↕';
          indEl.style.color = '#94A3B8';
          indEl.style.fontWeight = 'normal';
        }
      }
    });

    // KPIs
    const totalEl = document.getElementById('clients-kpi-total');
    const villesEl = document.getElementById('clients-kpi-villes');
    const santeEl = document.getElementById('clients-kpi-sante');
    const industrieEl = document.getElementById('clients-kpi-industrie');
    if (totalEl) totalEl.textContent = SAMA_DATA.clients.length;
    if (villesEl) villesEl.textContent = [...new Set(SAMA_DATA.clients.map(c => c.villeClient))].length;
    
    // Détection secteur santé vs industrie pour les KPIs
    const santeKeywords = ['hôpital', 'hopital', 'clinique', 'pasteur', 'santé', 'sante', 'dalal', 'médical', 'medical'];
    const santeCount = SAMA_DATA.clients.filter(c => {
      const txt = `${c.nomClient} ${c.mailClient}`.toLowerCase();
      return santeKeywords.some(k => txt.includes(k));
    }).length;
    if (santeEl) santeEl.textContent = santeCount;
    if (industrieEl) industrieEl.textContent = SAMA_DATA.clients.length - santeCount;

    const countEl = document.getElementById('clients-records-count');
    if (countEl) countEl.textContent = `${items.length} client(s) répertorié(s)`;

    // Pagination
    const totalItems = items.length;
    const itemsPerPage = this.clientItemsPerPage || 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (this.clientCurrentPage > totalPages) this.clientCurrentPage = totalPages;

    const startIndex = (this.clientCurrentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    // Rendu HTML des 9 colonnes officielles + actions
    if (paginatedItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 40px; color: #64748B;">
            <div style="font-size: 16px; font-weight: 700; color: #1E293B;">Aucun client trouvé</div>
            <div style="font-size: 12.5px; margin-top: 6px; color: #64748B;">Modifiez vos filtres ou cliquez sur <strong>"+ Ajouter un Client"</strong> pour enregistrer un nouveau compte.</div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginatedItems.map((c, idx) => {
        const globalIdx = SAMA_DATA.clients.indexOf(c);
        const safeNom = (c.nomClient || '').replace(/'/g, "\\'");
        return `
          <tr>
            <!-- 1. CLIENT (Code / ID) -->
            <td>
              <span style="font-family: monospace; font-weight: 800; color: #2E5090; background: #EEF2FF; padding: 4px 8px; border-radius: 4px; border: 1px solid #C7D2FE; font-size: 12px; display: inline-block;">
                ${c.client}
              </span>
            </td>
            <!-- 2. NOM CLIENT -->
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: rgba(114, 193, 0, 0.15); border: 1px solid rgba(114, 193, 0, 0.4); display: flex; align-items: center; justify-content: center; color: #3E6B00; font-weight: 800; font-size: 12px; flex-shrink: 0;">
                  ${(c.nomClient || 'C').charAt(0)}
                </div>
                <strong style="color: #16243D; font-size: 13.5px;">${c.nomClient}</strong>
              </div>
            </td>
            <!-- 3. ADRESSE CLIENT -->
            <td>
              <span style="color: #475569; font-size: 12.5px; line-height: 1.4; display: block; max-width: 220px;">
                ${c.adresseClient}
              </span>
            </td>
            <!-- 4. VILLE DU CLIENT -->
            <td>
              <span class="badge-tag blue" style="font-weight: 700; white-space: nowrap;">
                📍 ${c.villeClient}
              </span>
            </td>
            <!-- 5. PAYS DU CLIENT -->
            <td>
              <span class="badge-tag slate" style="font-weight: 600; white-space: nowrap;">
                ${c.paysClient}
              </span>
            </td>
            <!-- 6. CODE POSTAL -->
            <td>
              <span style="font-family: monospace; font-size: 12px; font-weight: 600; color: #64748B;">
                ${c.codePostal || '-'}
              </span>
            </td>
            <!-- 7. TELEPHONE CLIENT -->
            <td>
              <a href="tel:${c.telephoneClient}" style="color: #2E5090; font-weight: 700; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>${c.telephoneClient}</span>
              </a>
            </td>
            <!-- 8. MAIL DU CLIENT -->
            <td>
              <a href="mailto:${c.mailClient}" style="color: #0284C7; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-weight: 500;" title="${c.mailClient}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.mailClient}</span>
              </a>
            </td>
            <!-- 9. RC / NINEA -->
            <td>
              <span style="font-family: monospace; font-size: 11px; color: #334155; background: #F8FAFC; padding: 3px 6px; border-radius: 4px; border: 1px solid #E2E8F0; display: inline-block; white-space: nowrap;">
                ${c.rcNinea}
              </span>
            </td>
            <!-- 10. ACTIONS -->
            <td style="text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 6px;">
                <button class="btn-ts-action" title="Voir les équipements de ce client" onclick="APP.filterByClient('${safeNom}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span>Équipements</span>
                </button>
                <button class="btn-ts-delete" title="Supprimer ce client" onclick="APP.deleteClient(${globalIdx})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Pagination Footer
    const footerCountEl = document.getElementById('clients-footer-count');
    if (footerCountEl) {
      const endItem = Math.min(startIndex + itemsPerPage, totalItems);
      footerCountEl.textContent = totalItems > 0 
        ? `Affichage de ${startIndex + 1} à ${endItem} sur ${totalItems} clients Technologies Services`
        : `0 client trouvé`;
    }

    const paginationContainer = document.getElementById('clients-pagination-controls');
    if (paginationContainer) {
      if (itemsPerPage >= 99999 || totalPages <= 1) {
        paginationContainer.innerHTML = '';
      } else {
        let html = `<button class="page-btn" ${this.clientCurrentPage === 1 ? 'disabled' : ''} onclick="APP.goToClientPage(${this.clientCurrentPage - 1})">«</button>`;
        for (let p = 1; p <= totalPages; p++) {
          html += `<button class="page-btn ${p === this.clientCurrentPage ? 'active' : ''}" onclick="APP.goToClientPage(${p})">${p}</button>`;
        }
        html += `<button class="page-btn" ${this.clientCurrentPage === totalPages ? 'disabled' : ''} onclick="APP.goToClientPage(${this.clientCurrentPage + 1})">»</button>`;
        paginationContainer.innerHTML = html;
      }
    }
  },

  sortClients(col) {
    if (this.clientSortColumn === col) {
      this.clientSortDirection = this.clientSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.clientSortColumn = col;
      this.clientSortDirection = 'asc';
    }
    this.renderClients();
  },

  goToClientPage(page) {
    this.clientCurrentPage = page;
    this.renderClients();
  },

  changeClientPerPage(val) {
    this.clientItemsPerPage = val === 'all' ? 99999 : parseInt(val, 10);
    this.clientCurrentPage = 1;
    this.renderClients();
  },

  openNewClientModal() {
    const modal = document.getElementById('modal-new-client');
    const overlay = document.getElementById('modal-overlay');
    
    // Auto-générer un code client suggéré
    const nextNum = (SAMA_DATA.clients.length + 1).toString().padStart(3, '0');
    const codeInput = document.getElementById('form-clt-code');
    if (codeInput && (!codeInput.value || codeInput.value.startsWith('CLT-'))) {
      codeInput.value = `CLT-${nextNum}`;
    }

    if (modal && overlay) {
      overlay.classList.add('active');
      modal.style.display = 'block';
      setTimeout(() => {
        document.getElementById('form-clt-nom')?.focus();
      }, 50);
    }
  },

  closeNewClientModal() {
    const modal = document.getElementById('modal-new-client');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
  },

  saveNewClient(e) {
    if (e) e.preventDefault();
    const code = document.getElementById('form-clt-code')?.value;
    const nom = document.getElementById('form-clt-nom')?.value;
    const adresse = document.getElementById('form-clt-adresse')?.value;
    const ville = document.getElementById('form-clt-ville')?.value;
    const pays = document.getElementById('form-clt-pays')?.value || 'Sénégal';
    const codePostal = document.getElementById('form-clt-codepostal')?.value || '';
    const telephone = document.getElementById('form-clt-telephone')?.value;
    const mail = document.getElementById('form-clt-mail')?.value;
    const rcNinea = document.getElementById('form-clt-rcninea')?.value;

    if (!code || !nom || !adresse || !ville || !telephone || !mail || !rcNinea) {
      this.showToast("Veuillez remplir tous les champs obligatoires du formulaire client.", "error");
      return;
    }

    const newClient = {
      client: code.trim(),
      nomClient: nom.trim(),
      adresseClient: adresse.trim(),
      villeClient: ville.trim(),
      paysClient: pays.trim(),
      codePostal: codePostal.trim(),
      telephoneClient: telephone.trim(),
      mailClient: mail.trim(),
      rcNinea: rcNinea.trim()
    };

    SAMA_DATA.clients.unshift(newClient);

    // Synchronisation Supabase
    if (window.supabaseSync && typeof window.supabaseSync.syncSaveClient === 'function') {
      window.supabaseSync.syncSaveClient(newClient);
    }

    this.clientCurrentPage = 1;
    this.renderClients();
    this.closeNewClientModal();
    this.showToast(`Client "${nom}" (${code}) enregistré avec succès !`, "success");
    document.getElementById('form-new-client')?.reset();
  },

  deleteClient(index) {
    if (index < 0 || index >= SAMA_DATA.clients.length) return;
    const item = SAMA_DATA.clients[index];
    if (confirm(`Confirmez-vous la suppression du client "${item.nomClient} (${item.client})" ?`)) {
      if (window.supabaseSync && typeof window.supabaseSync.syncDeleteClient === 'function') {
        window.supabaseSync.syncDeleteClient(item.client || item.codeClient);
      }
      SAMA_DATA.clients.splice(index, 1);
      this.renderClients();
      this.showToast(`Client ${item.nomClient} supprimé du répertoire.`, "info");
    }
  },

  exportClientsToCSV() {
    let csv = "\uFEFF"; // UTF-8 BOM pour Excel
    csv += "CLIENT,ADRESSE CLIENT,VILLE DU CLIENT,PAYS DU CLIENT,CODE POSTAL,NOM CLIENT,TELEPHONE CLIENT,MAIL DU CLIENT,RC / NINEA\n";
    SAMA_DATA.clients.forEach(c => {
      csv += `"${(c.client || '').replace(/"/g, '""')}","${(c.adresseClient || '').replace(/"/g, '""')}","${(c.villeClient || '').replace(/"/g, '""')}","${(c.paysClient || '').replace(/"/g, '""')}","${(c.codePostal || '').replace(/"/g, '""')}","${(c.nomClient || '').replace(/"/g, '""')}","${(c.telephoneClient || '').replace(/"/g, '""')}","${(c.mailClient || '').replace(/"/g, '""')}","${(c.rcNinea || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Sama_CST_Repertoire_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Répertoire des Clients exporté en CSV (UTF-8) !", "success");
  },

  filterByClient(clientName) {
    this.switchModule('atelier-equipements');
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.value = clientName;
    }
    this.tableSearchQuery = clientName.toLowerCase();
    this.renderEquipementTable();
  },

  // ------------------------------------------------------------------------
  // MODULE PERSONNEL CST (3 COLONNES : AGENT, EMAIL, POLE)
  // ------------------------------------------------------------------------
  renderPersonnel() {
    const tbody = document.getElementById('table-personnel-cst-body');
    if (!tbody || !SAMA_DATA.personnelCST) return;

    // Remplissage dynamique du filtre des pôles si pas déjà fait
    const filterPoleSelect = document.getElementById('filter-personnel-pole');
    if (filterPoleSelect && filterPoleSelect.options.length <= 1) {
      const poles = [...new Set(SAMA_DATA.personnelCST.map(p => p.pole))].filter(Boolean).sort();
      poles.forEach(pole => {
        const opt = document.createElement('option');
        opt.value = pole;
        opt.textContent = `🎯 Pôle ${pole}`;
        filterPoleSelect.appendChild(opt);
      });
    }

    // Filtrage
    let items = [...SAMA_DATA.personnelCST];

    if (this.personnelSearchQuery) {
      const q = this.personnelSearchQuery;
      items = items.filter(p => 
        (p.agent && p.agent.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.pole && p.pole.toLowerCase().includes(q)) ||
        (p.specialite && p.specialite.toLowerCase().includes(q)) ||
        (p.telephone && p.telephone.toLowerCase().includes(q))
      );
    }

    if (this.personnelFilterPole !== 'all') {
      items = items.filter(p => p.pole === this.personnelFilterPole);
    }

    // Tri
    items.sort((a, b) => {
      let valA = a[this.personnelSortColumn] || '';
      let valB = b[this.personnelSortColumn] || '';
      const cmp = valA.toString().localeCompare(valB.toString(), 'fr', { numeric: true });
      return this.personnelSortDirection === 'asc' ? cmp : -cmp;
    });

    // Mise à jour des indicateurs de tri dans l'en-tête
    ['agent', 'email', 'pole'].forEach(col => {
      const el = document.getElementById(`sort-personnel-${col}`);
      if (el) {
        if (this.personnelSortColumn === col) {
          el.textContent = this.personnelSortDirection === 'asc' ? '▲' : '▼';
          el.style.color = 'var(--ts-blue)';
          el.style.fontWeight = '900';
        } else {
          el.textContent = '↕';
          el.style.color = '#94A3B8';
          el.style.fontWeight = 'normal';
        }
      }
    });

    // Mise à jour des KPIs
    const totalEl = document.getElementById('personnel-kpi-total');
    const biomedEl = document.getElementById('personnel-kpi-biomed');
    const imagEl = document.getElementById('personnel-kpi-imag');
    const atelierEl = document.getElementById('personnel-kpi-atelier');

    if (totalEl) totalEl.textContent = SAMA_DATA.personnelCST.length;
    if (biomedEl) biomedEl.textContent = SAMA_DATA.personnelCST.filter(p => p.pole === 'BIOMED').length;
    if (imagEl) imagEl.textContent = SAMA_DATA.personnelCST.filter(p => p.pole === 'IMAG-CHIRG').length;
    if (atelierEl) atelierEl.textContent = SAMA_DATA.personnelCST.filter(p => p.pole !== 'BIOMED' && p.pole !== 'IMAG-CHIRG').length;

    const countEl = document.getElementById('personnel-records-count');
    if (countEl) {
      countEl.textContent = `${items.length} agent(s) trouvé(s) sur ${SAMA_DATA.personnelCST.length}`;
    }

    // Pagination
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / this.personnelItemsPerPage) || 1;
    if (this.personnelCurrentPage > totalPages) this.personnelCurrentPage = totalPages;
    if (this.personnelCurrentPage < 1) this.personnelCurrentPage = 1;

    const startIndex = (this.personnelCurrentPage - 1) * this.personnelItemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + this.personnelItemsPerPage);

    // Rendu du tableau (3 Colonnes Officielles : AGENT, EMAIL, POLE + Actions)
    if (paginatedItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 32px; color: var(--text-muted);">
            <div style="font-size: 14px; font-weight: 600;">Aucun agent ne correspond aux critères de recherche.</div>
            <button class="btn-secondary" style="margin-top: 10px; font-size: 12px;" onclick="APP.personnelSearchQuery=''; APP.personnelFilterPole='all'; document.getElementById('search-personnel').value=''; document.getElementById('filter-personnel-pole').value='all'; APP.renderPersonnel();">
              Réinitialiser les filtres
            </button>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginatedItems.map(p => {
        const globalIdx = SAMA_DATA.personnelCST.indexOf(p);
        
        let poleClass = 'atelier';
        if (p.pole === 'BIOMED') poleClass = 'biomed';
        else if (p.pole === 'IMAG-CHIRG') poleClass = 'imag-chirg';
        else if (p.pole.includes('ESSAI') || p.pole.includes('CONTRÔLE')) poleClass = 'controle';
        else if (p.pole.includes('QUALITÉ') || p.pole.includes('MÉTROLOGIE')) poleClass = 'qualite';
        else if (p.pole.includes('SUPPORT') || p.pole.includes('SAV')) poleClass = 'support';

        const initials = p.agent.split(' ').map(n => n[0]).join('').substring(0, 2);

        return `
          <tr>
            <!-- 1. AGENT -->
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <div class="tech-avatar" style="width: 32px; height: 32px; font-size: 11px; flex-shrink: 0;">${initials}</div>
                <div>
                  <div style="font-weight: 800; color: #16243D; font-size: 13px;">${p.agent}</div>
                  ${p.specialite ? `<div style="font-size: 11.5px; color: #64748B;">${p.specialite}</div>` : ''}
                </div>
              </div>
            </td>

            <!-- 2. EMAIL -->
            <td>
              <a href="mailto:${p.email}" style="color: var(--ts-blue); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;" title="Envoyer un email">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>${p.email}</span>
              </a>
              ${p.telephone ? `<div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">📞 ${p.telephone}</div>` : ''}
            </td>

            <!-- 3. POLE -->
            <td>
              <span class="pole-badge ${poleClass}">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                <span>${p.pole}</span>
              </span>
            </td>

            <!-- ACTIONS -->
            <td style="text-align: center; white-space: nowrap;">
              <div style="display: inline-flex; align-items: center; gap: 6px;">
                <button class="btn-ts-action" title="Voir les équipements pris en charge à l'atelier" onclick="APP.filterByTechnician('${p.agent.replace(/'/g, "\\'")}')">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span>Atelier</span>
                </button>
                <button class="btn-ts-action" style="background: #F8FAFC; color: #334155; border-color: #CBD5E1;" title="Modifier les informations de l'agent" onclick="APP.openEditPersonnelModal(${globalIdx})">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>Modifier</span>
                </button>
                <button class="btn-ts-delete" title="Supprimer cet agent" onclick="APP.deletePersonnel(${globalIdx})">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Mise à jour du footer
    const footerCountEl = document.getElementById('personnel-footer-count');
    if (footerCountEl) {
      const endItem = Math.min(startIndex + this.personnelItemsPerPage, totalItems);
      footerCountEl.textContent = totalItems > 0 
        ? `Affichage de ${startIndex + 1} à ${endItem} sur ${totalItems} agents Technologies Services`
        : "Aucun résultat";
    }

    // Pagination controls
    const paginationContainer = document.getElementById('personnel-pagination-controls');
    if (paginationContainer) {
      let html = '';
      html += `<button class="page-btn" ${this.personnelCurrentPage === 1 ? 'disabled' : ''} onclick="APP.goToPersonnelPage(${this.personnelCurrentPage - 1})">«</button>`;
      
      for (let p = 1; p <= totalPages; p++) {
        if (totalPages > 7) {
          if (p === 1 || p === totalPages || (p >= this.personnelCurrentPage - 1 && p <= this.personnelCurrentPage + 1)) {
            html += `<button class="page-btn ${p === this.personnelCurrentPage ? 'active' : ''}" onclick="APP.goToPersonnelPage(${p})">${p}</button>`;
          } else if (p === this.personnelCurrentPage - 2 || p === this.personnelCurrentPage + 2) {
            html += `<span style="padding: 0 4px; color: #94A3B8;">...</span>`;
          }
        } else {
          html += `<button class="page-btn ${p === this.personnelCurrentPage ? 'active' : ''}" onclick="APP.goToPersonnelPage(${p})">${p}</button>`;
        }
      }

      html += `<button class="page-btn" ${this.personnelCurrentPage === totalPages || totalPages === 0 ? 'disabled' : ''} onclick="APP.goToPersonnelPage(${this.personnelCurrentPage + 1})">»</button>`;
      paginationContainer.innerHTML = html;
    }
  },

  sortPersonnel(col) {
    if (this.personnelSortColumn === col) {
      this.personnelSortDirection = this.personnelSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.personnelSortColumn = col;
      this.personnelSortDirection = 'asc';
    }
    this.renderPersonnel();
  },

  goToPersonnelPage(page) {
    this.personnelCurrentPage = page;
    this.renderPersonnel();
  },

  changePersonnelPerPage(val) {
    this.personnelItemsPerPage = val === 'all' ? 99999 : parseInt(val, 10);
    this.personnelCurrentPage = 1;
    this.renderPersonnel();
  },

  openNewPersonnelModal() {
    const modal = document.getElementById('modal-new-personnel');
    const overlay = document.getElementById('modal-overlay');
    if (modal && overlay) {
      overlay.classList.add('active');
      modal.style.display = 'block';
      setTimeout(() => {
        document.getElementById('form-prs-agent')?.focus();
      }, 50);
    }
  },

  closeNewPersonnelModal() {
    const modal = document.getElementById('modal-new-personnel');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
  },

  openEditPersonnelModal(idx) {
    if (idx < 0 || idx >= SAMA_DATA.personnelCST.length) return;
    this.editingPersonnelIdx = idx;
    const p = SAMA_DATA.personnelCST[idx];
    
    document.getElementById('edit-prs-agent').value = p.agent || '';
    document.getElementById('edit-prs-email').value = p.email || '';
    document.getElementById('edit-prs-pole').value = p.pole || 'BIOMED';
    document.getElementById('edit-prs-specialite').value = p.specialite || '';
    document.getElementById('edit-prs-telephone').value = p.telephone || '';

    const modal = document.getElementById('modal-edit-personnel');
    const overlay = document.getElementById('modal-overlay');
    if (modal && overlay) {
      overlay.classList.add('active');
      modal.style.display = 'block';
      setTimeout(() => {
        document.getElementById('edit-prs-agent')?.focus();
      }, 50);
    }
  },

  closeEditPersonnelModal() {
    const modal = document.getElementById('modal-edit-personnel');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
    this.editingPersonnelIdx = null;
  },

  saveNewPersonnel(e) {
    if (e) e.preventDefault();
    const agent = document.getElementById('form-prs-agent')?.value;
    const email = document.getElementById('form-prs-email')?.value;
    const pole = document.getElementById('form-prs-pole')?.value;
    const specialite = document.getElementById('form-prs-specialite')?.value;
    const telephone = document.getElementById('form-prs-telephone')?.value;

    if (!agent || !email || !pole) {
      this.showToast("Veuillez renseigner le Nom de l'agent, l'Email et le Pôle.", "error");
      return;
    }

    const newAgent = {
      agent: agent.trim(),
      email: email.trim(),
      pole: pole.trim(),
      specialite: (specialite || '').trim(),
      telephone: (telephone || '').trim(),
      statut: "Actif"
    };

    SAMA_DATA.personnelCST.unshift(newAgent);

    // Synchronisation Supabase
    if (window.supabaseSync && typeof window.supabaseSync.syncSavePersonnel === 'function') {
      window.supabaseSync.syncSavePersonnel(newAgent);
    }

    this.personnelCurrentPage = 1;
    this.renderPersonnel();
    this.closeNewPersonnelModal();
    this.showToast(`Agent "${agent}" ajouté au pôle ${pole} avec succès !`, "success");
    document.getElementById('form-new-personnel')?.reset();
  },

  saveEditPersonnel(e) {
    if (e) e.preventDefault();
    if (this.editingPersonnelIdx === null || this.editingPersonnelIdx < 0 || this.editingPersonnelIdx >= SAMA_DATA.personnelCST.length) {
      this.showToast("Erreur lors de la modification de l'agent.", "error");
      return;
    }

    const agent = document.getElementById('edit-prs-agent')?.value;
    const email = document.getElementById('edit-prs-email')?.value;
    const pole = document.getElementById('edit-prs-pole')?.value;
    const specialite = document.getElementById('edit-prs-specialite')?.value;
    const telephone = document.getElementById('edit-prs-telephone')?.value;

    if (!agent || !email || !pole) {
      this.showToast("Veuillez renseigner le Nom de l'agent, l'Email et le Pôle.", "error");
      return;
    }

    const updatedAgent = {
      ...SAMA_DATA.personnelCST[this.editingPersonnelIdx],
      agent: agent.trim(),
      email: email.trim(),
      pole: pole.trim(),
      specialite: (specialite || '').trim(),
      telephone: (telephone || '').trim()
    };

    SAMA_DATA.personnelCST[this.editingPersonnelIdx] = updatedAgent;

    // Synchronisation Supabase
    if (window.supabaseSync && typeof window.supabaseSync.syncSavePersonnel === 'function') {
      window.supabaseSync.syncSavePersonnel(updatedAgent);
    }

    this.renderPersonnel();
    this.closeEditPersonnelModal();
    this.showToast(`Fiche de l'agent "${agent}" mise à jour !`, "success");
  },

  deletePersonnel(index) {
    if (index < 0 || index >= SAMA_DATA.personnelCST.length) return;
    const item = SAMA_DATA.personnelCST[index];
    if (confirm(`Confirmez-vous la suppression de l'agent "${item.agent}" (${item.pole}) ?`)) {
      if (window.supabaseSync && typeof window.supabaseSync.syncDeletePersonnel === 'function') {
        window.supabaseSync.syncDeletePersonnel(item.codeAgent || item.agent);
      }
      SAMA_DATA.personnelCST.splice(index, 1);
      this.renderPersonnel();
      this.showToast(`Agent ${item.agent} supprimé du répertoire.`, "info");
    }
  },

  exportPersonnelToCSV() {
    let csv = "\uFEFF"; // UTF-8 BOM pour Excel
    csv += "AGENT,EMAIL,POLE,SPECIALITE,TELEPHONE,STATUT\n";
    SAMA_DATA.personnelCST.forEach(p => {
      csv += `"${(p.agent || '').replace(/"/g, '""')}","${(p.email || '').replace(/"/g, '""')}","${(p.pole || '').replace(/"/g, '""')}","${(p.specialite || '').replace(/"/g, '""')}","${(p.telephone || '').replace(/"/g, '""')}","${(p.statut || 'Actif').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Sama_CST_Personnel_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Répertoire du Personnel CST exporté en CSV (UTF-8) !", "success");
  },

  filterByTechnician(agentName) {
    this.switchModule('atelier-equipements');
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.value = agentName;
    }
    this.tableSearchQuery = agentName.toLowerCase();
    this.renderEquipementTable();
  },

  // ------------------------------------------------------------------------
  // RENDU DES SECTIONS TECHNIQUES & RISQUES
  // ------------------------------------------------------------------------
  renderTechnicians() {
    const container = document.getElementById('technicians-cards-container');
    if (!container) return;

    container.innerHTML = SAMA_DATA.techniciensStats.map(tech => `
      <div class="tech-card">
        <div class="tech-header">
          <div class="tech-avatar">${tech.nom.split(' ').map(n=>n[0]).join('')}</div>
          <div class="tech-info">
            <h4>${tech.nom}</h4>
            <span>${tech.specialite}</span>
          </div>
        </div>
        <div class="tech-stats-row">
          <div class="stat-item">
            <span class="lbl">MTTR Moyen</span>
            <span class="val" style="color: #2E5090;">${tech.mttrMoyenHeures} hrs</span>
          </div>
          <div class="stat-item">
            <span class="lbl">Taux Clôture</span>
            <span class="val" style="color: #4A8000;">${tech.tauxCloture}%</span>
          </div>
          <div class="stat-item">
            <span class="lbl">Ordres Réalisés</span>
            <span class="val">${tech.ordresTotal}</span>
          </div>
          <div class="stat-item">
            <span class="lbl">Backlog Actuel</span>
            <span class="val" style="color: #EF4444;">${tech.backlogActuel}</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderBlocages4Axes() {
    const tbody = document.getElementById('table-blocages-4axes-body');
    if (!tbody) return;

    tbody.innerHTML = SAMA_DATA.blocages4Axes.map(b => `
      <tr>
        <td><span class="axis-badge">${b.axe}</span></td>
        <td style="font-size: 12px; color: #475569;">${b.description}</td>
        <td style="text-align: center;"><strong style="font-size: 14px; color: #EF4444;">${b.nbEquipementsImpactes}</strong></td>
        <td><span class="badge-tag amber">${b.delaiMoyenAttente}</span></td>
        <td><span class="badge-tag ${b.severite.includes('Élevée') ? 'red' : b.severite.includes('Moyenne') ? 'amber' : 'green'}">${b.severite}</span></td>
        <td><strong>${b.valeurBloquee}</strong></td>
        <td style="font-size: 11.5px; color: #16243D; background: #F8FAFC; border-left: 3px solid #2E5090;">${b.planAction}</td>
      </tr>
    `).join('');
  },

  renderCriticiteTable() {
    const tbody = document.getElementById('table-criticite-body');
    if (!tbody) return;

    tbody.innerHTML = SAMA_DATA.criticiteData.map(c => `
      <tr>
        <td><span style="font-weight: 800; color: #2E5090;">${c.code}</span></td>
        <td><strong>${c.nom}</strong></td>
        <td><span class="badge-tag ${c.classe.includes('A') ? 'red' : 'amber'}">${c.classe}</span></td>
        <td style="font-size: 12px;">${c.impactOperationnel}</td>
        <td><span class="badge-tag ${c.spof.includes('Oui') ? 'red' : 'slate'}">${c.spof}</span></td>
        <td><span class="days-badge red">${c.joursBlocage} jours</span></td>
        <td>${c.delaiFRB}</td>
        <td><span class="status-pill ${c.statutAlerte.includes('Rouge') ? 'bloque' : 'cours'}">${c.statutAlerte}</span></td>
      </tr>
    `).join('');
  },

  renderRedAlerts() {
    const container = document.getElementById('red-alerts-stream');
    if (!container) return;

    container.innerHTML = SAMA_DATA.alertesBlocages.map(alt => `
      <div class="red-alert-card">
        <div class="alert-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div class="alert-body">
          <div class="alert-title-row">
            <span class="alert-title">${alt.titre}</span>
            <span class="alert-duration-badge">${alt.duree}</span>
          </div>
          <div class="alert-description">
            <strong>Équipement :</strong> ${alt.equipement} | <strong>Client :</strong> ${alt.client}<br>
            <strong>Cause de blocage :</strong> ${alt.motif}
          </div>
          <div class="alert-action-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Plan d'action : ${alt.actionRequise}
          </div>
        </div>
        <button class="alert-btn-escalate" onclick="APP.showToast('Escalade déclenchée auprès de la direction pour ${alt.equipement}', 'success')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Escalader
        </button>
      </div>
    `).join('');
  },

  renderEntityAvailability() {
    const container = document.getElementById('entity-availability-list');
    if (!container) return;

    container.innerHTML = SAMA_DATA.disponibiliteEntites.map(ent => `
      <div class="entity-dispo-card">
        <div class="entity-card-header">
          <span class="entity-name">${ent.entite}</span>
          <span class="entity-stats-nums">${ent.dispo}% <span style="font-size: 11px; color: #64748B; font-weight: normal;">(Cible: ${ent.cible}%)</span></span>
        </div>
        <div class="entity-progress-bar-bg">
          <div class="entity-progress-fill" style="width: ${ent.dispo}%;"></div>
        </div>
        <div class="entity-footer-metrics">
          <span>Parc Total : <strong>${ent.total}</strong> machines</span>
          <span>En Atelier : <strong style="color: #EF4444;">${ent.atelier}</strong></span>
          <span style="color: #4A8000; font-weight: 700;">SLA Conforme</span>
        </div>
      </div>
    `).join('');
  },

  renderTop5List() {
    const container = document.getElementById('top5-downtime-container');
    if (!container) return;

    container.innerHTML = SAMA_DATA.top5Durees.map(item => `
      <div class="top5-item">
        <div class="top5-rank">#${item.rang}</div>
        <div class="top5-content">
          <div class="top5-title">${item.equipement} (${item.code})</div>
          <div class="top5-sub">${item.client} • <em>${item.motif}</em></div>
        </div>
        <div class="top5-badge">${item.jours} jours d'arrêt</div>
      </div>
    `).join('');
  },

  // ------------------------------------------------------------------------
  // MODAL NOUVEL ÉQUIPEMENT & EXPORT
  // ------------------------------------------------------------------------
  openNewEquipmentModal() {
    const modal = document.getElementById('modal-new-equipment');
    const overlay = document.getElementById('modal-overlay');
    const statutSelect = document.getElementById('form-statut');

    this.initDatePickers();
    this.setPickerValue('form-date-entree', new Date().toISOString().split('T')[0]);
    this.setPickerValue('form-date-sortie', '');
    if (statutSelect) statutSelect.value = 'DEPENDANT';

    if (modal && overlay) {
      overlay.classList.add('active');
      modal.style.display = 'block';
    }
  },

  handleModalDateChange() {
    const sortieEl = document.getElementById('form-date-sortie');
    const statutSelect = document.getElementById('form-statut');
    const situationSelect = document.getElementById('form-situation');
    const etatSortieSelect = document.getElementById('form-etat-sortie');
    
    if (sortieEl && sortieEl.value && sortieEl.value.trim() !== '') {
      if (statutSelect) statutSelect.value = 'CLÔTURE';
      if (situationSelect) situationSelect.value = 'Clôturé';
      if (etatSortieSelect) etatSortieSelect.value = 'Fonctionnel';
    } else {
      if (statutSelect) statutSelect.value = 'DEPENDANT';
      if (situationSelect && situationSelect.value === 'Clôturé') situationSelect.value = 'En traitement';
      if (etatSortieSelect && etatSortieSelect.value === 'Fonctionnel') etatSortieSelect.value = 'Non fonctionnel';
    }
  },

  closeNewEquipmentModal() {
    const modal = document.getElementById('modal-new-equipment');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.classList.remove('active');
  },

  saveNewEquipment(e) {
    if (e) e.preventDefault();
    const code = document.getElementById('form-code').value;
    const desc = document.getElementById('form-desc').value;
    const client = document.getElementById('form-client').value;
    const serial = document.getElementById('form-serial').value;
    const tech = document.getElementById('form-tech').value;
    const zone = document.getElementById('form-zone').value;
    const motif = document.getElementById('form-motif').value;
    const entite = document.getElementById('form-entite').value;
    const dateEntree = document.getElementById('form-date-entree')?.value || new Date().toISOString().split('T')[0];
    const dateSortieVal = document.getElementById('form-date-sortie')?.value;
    const fournisseur = document.getElementById('form-fournisseur').value;
    const modele = document.getElementById('form-modele').value;
    const formSituation = document.getElementById('form-situation')?.value;
    const formEtatSortie = document.getElementById('form-etat-sortie')?.value;

    if (!code || !desc || !client) {
      this.showToast("Veuillez renseigner au moins le Code, la Description et le Client.", "error");
      return;
    }

    const hasDateSortie = Boolean(dateSortieVal && dateSortieVal.trim() !== '');
    const dateSortie = hasDateSortie ? dateSortieVal : '-';
    const nbJours = hasDateSortie ? this.calculateDays(dateEntree, dateSortie) : '-';
    const dureeAtelier = !hasDateSortie ? `${this.calculateDaysFromToday(dateEntree)} j` : '-';
    const statut = hasDateSortie ? 'CLÔTURE' : 'DEPENDANT';
    const situation = formSituation || (hasDateSortie ? "Clôturé" : "En traitement");
    const etatSortie = formEtatSortie || (hasDateSortie ? "Fonctionnel" : "Non fonctionnel");

    const newEquip = {
      codeEquipement: code,
      description: desc,
      numSerie: serial || "N/A",
      client: client,
      dateEntree: dateEntree,
      dateSortie: dateSortie,
      responsableReception: "Modou Faye",
      responsableTechnique: tech,
      zoneActuelle: zone,
      motif: motif || "Entrée atelier pour révision",
      situation: situation,
      statut: statut,
      etatSortie: etatSortie,
      nombreJoursAtelier: nbJours,
      dureeAtelier: dureeAtelier,
      entite: entite || "BIOMED",
      fournisseur: fournisseur || "Caterpillar",
      modele: modele || "Standard HD",
      datePriseEnCharge: new Date().toISOString().replace('T', ' ').substring(0, 16),
      delaisPriseEnCharge: "0h 30m",
      dateFRB: "-",
      delaisFRB: "En attente",
      criticite: "B (Majeur)",
      coutEstime: "1 500 000 FCFA",
      timeline: [
        { date: new Date().toISOString().replace('T', ' ').substring(0, 16), event: "Réception & Enregistrement atelier", agent: "Modou Faye", status: "done" }
      ],
      pieces: []
    };

    SAMA_DATA.equipementsAtelier.unshift(newEquip);

    // Synchronisation Supabase
    if (window.supabaseSync && typeof window.supabaseSync.syncSaveEquipementAtelier === 'function') {
      window.supabaseSync.syncSaveEquipementAtelier(newEquip);
      window.supabaseSync.syncSaveTimelineStep(newEquip.codeEquipement, newEquip.timeline[0], 0);
    }

    this.renderEquipementTable();
    this.closeNewEquipmentModal();
    this.showToast(`Équipement ${code} enregistré (${statut}) !`, "success");
  },

  exportTableToCSV() {
    let csv = "Code_Equipement,Description,Num_Serie,Client,Date_Entree,Date_Sortie,Responsable_Reception,Responsable_Technique,Zone_Actuelle,Motif,Situation,Statut,Etat_Sortie,Nombre_Jours_Atelier,Duree_Atelier,Entite,Fournisseur,Modele,Date_Prise_En_Charge,Delais_Prise_En_Charge,Date_FRB,Delais_FRB\n";

    SAMA_DATA.equipementsAtelier.forEach(eq => {
      csv += `"${eq.codeEquipement}","${eq.description}","${eq.numSerie}","${eq.client}","${eq.dateEntree}","${eq.dateSortie}","${eq.responsableReception}","${eq.responsableTechnique}","${eq.zoneActuelle}","${eq.motif}","${eq.situation}","${eq.statut}","${eq.etatSortie}",${eq.nombreJoursAtelier},"${eq.dureeAtelier}","${eq.entite}","${eq.fournisseur}","${eq.modele}","${eq.datePriseEnCharge}","${eq.delaisPriseEnCharge}","${eq.dateFRB}","${eq.delaisFRB}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Sama_CST_Equipements_Atelier_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Fichier CSV exporté avec succès !", "success");
  },

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.padding = "14px 20px";
    toast.style.background = type === "success" ? "#065F46" : type === "error" ? "#991B1B" : "#0F172A";
    toast.style.color = "#FFFFFF";
    toast.style.borderRadius = "8px";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    toast.style.zIndex = "999";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3500);
  }
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
