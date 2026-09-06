'use client';

import React, { useState, useEffect } from 'react';
import { SitesGrid } from '@/components/base-ts/SitesGrid';
import { ParcEquipementsGrid } from '@/components/base-ts/ParcEquipementsGrid';
import { ParcEquipementsTable } from '@/components/base-ts/ParcEquipementsTable';
import { FicheDeVieDrawer } from '@/components/atelier/FicheDeVieDrawer';
import { SupabaseService } from '@/lib/data/supabaseService';
import {
  SiteTS,
  ParcEquipementTS,
  EquipementAtelier,
  PersonnelCST,
  InterventionTimelineStep,
} from '@/types/database.types';
import {
  Building2,
  Layers,
  Search,
  Download,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { exportToCSV } from '@/lib/utils/csvExport';
import { useRouter } from 'next/navigation';

export default function BaseTSPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'clients' | 'equipements'>('clients');
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');

  const [sites, setSites] = useState<SiteTS[]>([]);
  const [parc, setParc] = useState<ParcEquipementTS[]>([]);
  const [atelier, setAtelier] = useState<EquipementAtelier[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelCST[]>([]);
  const [selectedAtelierEq, setSelectedAtelierEq] = useState<EquipementAtelier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [poleFilter, setPoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const [s, p, a, pers] = await Promise.all([
        SupabaseService.getSites(),
        SupabaseService.getParcEquipements(),
        SupabaseService.getEquipementsAtelier(),
        SupabaseService.getPersonnel(),
      ]);
      setSites(s);
      setParc(p);
      setAtelier(a);
      setPersonnel(pers);
    }
    load();
  }, []);

  const filteredParc = parc.filter((eq) => {
    const matchSearch =
      eq.code_machine.toLowerCase().includes(search.toLowerCase()) ||
      eq.designation.toLowerCase().includes(search.toLowerCase()) ||
      eq.client_nom.toLowerCase().includes(search.toLowerCase()) ||
      eq.marque_modele.toLowerCase().includes(search.toLowerCase());

    const matchClient = clientFilter === 'all' || eq.client_nom === clientFilter;
    const matchPole = poleFilter === 'all' || eq.pole === poleFilter;
    const matchStatus = statusFilter === 'all' || eq.etat_operationnel === statusFilter;

    return matchSearch && matchClient && matchPole && matchStatus;
  });

  const handleOpenFicheDeVieByCode = (codeMachine: string) => {
    let eq = atelier.find((a) => a.code_equipement === codeMachine);
    if (!eq) {
      const p = parc.find((item) => item.code_machine === codeMachine);
      if (p) {
        eq = {
          id: 'ea-temp-' + p.id,
          code_reception: 'REC-PARC-' + p.code_machine,
          code_equipement: p.code_machine,
          designation: p.designation,
          client_nom: p.client_nom,
          num_serie: p.num_serie,
          pole: p.pole,
          date_entree: p.derniere_maintenance || new Date().toISOString().slice(0, 10),
          statut: p.en_atelier ? 'En Réparation' : 'En Service' as any,
          priorite: 'Moyenne',
          technicien_responsable: 'Ousmane Fall',
          anomalie_signalee: 'Maintenance préventive / Surveillance périodique sur site',
          devis_frb_statut: 'Non Requis',
          montant_frb: 0,
          timeline: [
            {
              step_index: 1,
              date_heure: p.derniere_maintenance || '2026-08-15',
              responsable: 'Ousmane Fall',
              statut: 'Effectué',
              description: 'Visite de maintenance préventive et contrôle des paramètres',
              resultat_obtenu: 'Conforme — Taux de disponibilité ' + p.taux_disponibilite + '%',
            },
          ],
        };
      }
    }
    if (eq) {
      setSelectedAtelierEq(eq);
      setIsDrawerOpen(true);
    }
  };

  const handleGoToAtelierByCode = (codeMachine: string) => {
    router.push('/atelier');
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Sama_CST_Parc_Equipements',
      [
        { key: 'code_machine', label: 'Code Machine' },
        { key: 'designation', label: 'Équipement' },
        { key: 'client_nom', label: 'Client' },
        { key: 'site', label: 'Site / Déploiement' },
        { key: 'marque_modele', label: 'Marque & Modèle' },
        { key: 'num_serie', label: 'N° Série' },
        { key: 'pole', label: 'Pôle CST' },
        { key: 'etat_operationnel', label: 'État Opérationnel' },
        { key: 'taux_disponibilite', label: 'Taux Disponibilité (%)' },
        { key: 'derniere_maintenance', label: 'Dernière Maintenance' },
      ],
      filteredParc
    );
  };

  const handleUpdateStep = async (
    atelierId: string,
    stepIndex: number,
    updatedStep: Partial<InterventionTimelineStep>
  ) => {
    await SupabaseService.updateInterventionStep(atelierId, stepIndex, updatedStep);
  };

  const handleAddStep = async (
    atelierId: string,
    newStep: Omit<InterventionTimelineStep, 'step_index'>
  ) => {
    await SupabaseService.addInterventionStep(atelierId, newStep);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Responsive View Switcher */}
      <div className="card-ts bg-gradient-to-r from-ts-navy to-ts-blue text-white p-4 sm:p-6 shadow-ts-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ts-green/20 border border-ts-green/40 rounded-full text-[11px] font-bold text-lime-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-green animate-pulse"></span>
              BASE DE DONNÉES CENTRALE TECHNOLOGIES SERVICES
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Base de Données TS — Supervision Sites & Parc Équipements
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Supervision des contrats de maintenance, suivi du parc machine déployé et traçabilité opérationnelle.
            </p>
          </div>

          {/* View Switcher Pills */}
          <div className="w-full lg:w-auto bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/80 flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewMode('clients')}
              className={`flex-1 lg:flex-initial justify-center px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'clients'
                  ? 'bg-ts-green text-white shadow-ts-green'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clients / Sites (7)</span>
            </button>
            <button
              onClick={() => setViewMode('equipements')}
              className={`flex-1 lg:flex-initial justify-center px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'equipements'
                  ? 'bg-ts-green text-white shadow-ts-green'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Équipements ({parc.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. VUE PAR CLIENT / SITE */}
      {viewMode === 'clients' && (
        <SitesGrid
          sites={sites}
          onSelectSite={(site) => {
            setClientFilter(site.client_nom);
            setViewMode('equipements');
          }}
        />
      )}

      {/* 2. VUE PAR ÉQUIPEMENT */}
      {viewMode === 'equipements' && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Parc KPIs Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="card-ts p-3.5 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 truncate">Total Parc</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{parc.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">Machines sous contrat</div>
            </div>
            <div className="card-ts p-3.5 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate">En Service</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
                {parc.filter((p) => p.etat_operationnel === 'En Service').length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">Opérationnels sur site</div>
            </div>
            <div className="card-ts p-3.5 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-600 truncate">En Atelier CST</div>
              <div className="text-xl sm:text-2xl font-black text-rose-700 mt-0.5">
                {parc.filter((p) => p.en_atelier).length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">En révision/contrôle</div>
            </div>
            <div className="card-ts p-3.5 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-bold text-ts-green truncate">Disponibilité</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">96.4%</div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">Taux moyen TS</div>
            </div>
          </div>

          {/* Filters & Display Mode Switcher */}
          <div className="card-ts p-3 sm:p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative w-full sm:w-auto sm:min-w-[220px] flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher code, marque, client..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20"
                  />
                </div>

                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none flex-1 sm:flex-initial"
                >
                  <option value="all">🏢 Clients (Tous)</option>
                  {Array.from(new Set(parc.map((p) => p.client_nom))).map((nom) => (
                    <option key={nom} value={nom}>
                      {nom}
                    </option>
                  ))}
                </select>

                <select
                  value={poleFilter}
                  onChange={(e) => setPoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none flex-1 sm:flex-initial"
                >
                  <option value="all">Pôles (Tous)</option>
                  <option value="BIOMED">Pôle BIOMED</option>
                  <option value="IMAG-CHIRG">Pôle IMAG-CHIRG</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none flex-1 sm:flex-initial"
                >
                  <option value="all">Statuts (Tous)</option>
                  <option value="En Service">En Service</option>
                  <option value="En Atelier CST">En Atelier CST</option>
                  <option value="En Réserve / Standby">En Réserve</option>
                  <option value="Arrêt / Panne">Arrêt</option>
                </select>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {/* Display mode buttons */}
                <div className="p-1 bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1">
                  <button
                    onClick={() => setDisplayMode('grid')}
                    title="Affichage Cartes"
                    className={`p-1.5 rounded-md text-xs transition-colors ${
                      displayMode === 'grid'
                        ? 'bg-white text-ts-blue shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDisplayMode('table')}
                    title="Affichage Tableau"
                    className={`p-1.5 rounded-md text-xs transition-colors ${
                      displayMode === 'table'
                        ? 'bg-white text-ts-blue shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExportCSV}>
                  <span className="hidden sm:inline">Exporter CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Grid or Table */}
          {displayMode === 'grid' ? (
            <ParcEquipementsGrid
              equipements={filteredParc}
              onOpenFicheDeVieByCode={handleOpenFicheDeVieByCode}
              onGoToAtelierByCode={handleGoToAtelierByCode}
            />
          ) : (
            <ParcEquipementsTable
              equipements={filteredParc}
              onOpenFicheDeVieByCode={handleOpenFicheDeVieByCode}
              onGoToAtelierByCode={handleGoToAtelierByCode}
            />
          )}
        </div>
      )}

      {/* Fiche de Vie Drawer */}
      <FicheDeVieDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        equipement={selectedAtelierEq}
        personnelList={personnel}
        onUpdateStep={handleUpdateStep}
        onAddStep={handleAddStep}
      />
    </div>
  );
}
