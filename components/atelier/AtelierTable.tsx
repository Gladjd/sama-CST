'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import { EquipementAtelier } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateFR, formatFCFA } from '@/lib/utils/formatters';
import { exportToCSV } from '@/lib/utils/csvExport';

interface AtelierTableProps {
  equipements: EquipementAtelier[];
  onOpenFicheDeVie: (eq: EquipementAtelier) => void;
  onOpenNewModal: () => void;
}

export const AtelierTable: React.FC<AtelierTableProps> = ({
  equipements,
  onOpenFicheDeVie,
  onOpenNewModal,
}) => {
  const [search, setSearch] = useState('');
  const [poleFilter, setPoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof EquipementAtelier>('date_entree');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [mobileViewMode, setMobileViewMode] = useState<'table' | 'cards'>('table');

  const filteredData = equipements
    .filter((item) => {
      const matchSearch =
        item.code_reception.toLowerCase().includes(search.toLowerCase()) ||
        item.designation.toLowerCase().includes(search.toLowerCase()) ||
        item.client_nom.toLowerCase().includes(search.toLowerCase()) ||
        item.num_serie.toLowerCase().includes(search.toLowerCase()) ||
        item.technicien_responsable.toLowerCase().includes(search.toLowerCase());

      const matchPole = poleFilter === 'all' || item.pole === poleFilter;
      const matchStatus = statusFilter === 'all' || item.statut === statusFilter;
      const matchPriority = priorityFilter === 'all' || item.priorite === priorityFilter;

      return matchSearch && matchPole && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof EquipementAtelier) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(
      'Sama_CST_Equipements_Atelier',
      [
        { key: 'code_reception', label: 'Code Réception' },
        { key: 'designation', label: 'Équipement' },
        { key: 'client_nom', label: 'Client' },
        { key: 'pole', label: 'Pôle' },
        { key: 'num_serie', label: 'N° Série' },
        { key: 'statut', label: 'Statut' },
        { key: 'priorite', label: 'Priorité' },
        { key: 'technicien_responsable', label: 'Responsable' },
        { key: 'date_entree', label: 'Date Entrée' },
        { key: 'devis_frb_statut', label: 'Statut Devis FRB' },
        { key: 'montant_frb', label: 'Montant Devis FCFA' },
      ],
      filteredData
    );
  };

  return (
    <div className="space-y-4">
      {/* Responsive Toolbar */}
      <div className="card-ts p-3 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-auto sm:min-w-[220px] flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher code, équipement, client..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20"
              />
            </div>

            {/* Dropdown Filters */}
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
              <option value="En Diagnostic">En Diagnostic</option>
              <option value="En Réparation">En Réparation</option>
              <option value="En Attente Pièces">En Attente Pièces</option>
              <option value="En Contrôle / Banc d'Essai">En Contrôle</option>
              <option value="Prêt pour Livraison">Prêt Livraison</option>
              <option value="Livré / Clôturé">Livré / Clôturé</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="all">Priorité (Toutes)</option>
              <option value="Urgente">Urgente</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {/* View switcher on mobile */}
            <div className="md:hidden flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileViewMode('table')}
                className={`p-1.5 rounded-md text-xs ${
                  mobileViewMode === 'table' ? 'bg-white text-ts-blue shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('cards')}
                className={`p-1.5 rounded-md text-xs ${
                  mobileViewMode === 'cards' ? 'bg-white text-ts-blue shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>
                <span className="hidden sm:inline">Exporter CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button size="sm" variant="primary" icon={<Wrench className="w-3.5 h-3.5" />} onClick={onOpenNewModal}>
                <span className="hidden sm:inline">Nouvelle Réception</span>
                <span className="sm:hidden">Réception</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards View (Optional on small screens) */}
      {mobileViewMode === 'cards' ? (
        <div className="md:hidden grid grid-cols-1 gap-3">
          {filteredData.map((item) => (
            <div key={item.id} className="card-ts p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-ts-blue">{item.code_reception}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.designation}</h4>
                  <p className="text-xs text-slate-500">{item.client_nom}</p>
                </div>
                <Badge status={item.statut}>{item.statut}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-400 text-[10px] block">Pôle</span>
                  <Badge pole={item.pole}>{item.pole}</Badge>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Priorité</span>
                  <Badge priority={item.priorite}>{item.priorite}</Badge>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Responsable</span>
                  <span className="font-semibold text-slate-800">{item.technicien_responsable}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Entrée</span>
                  <span className="font-medium text-slate-700">{formatDateFR(item.date_entree)}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                icon={<Eye className="w-3.5 h-3.5" />}
                className="w-full"
                onClick={() => onOpenFicheDeVie(item)}
              >
                Fiche de Vie 360°
              </Button>
            </div>
          ))}
        </div>
      ) : (
        /* Full Data Table with horizontal scroll */
        <div className="card-ts overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold tracking-wider uppercase text-[11px]">
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 whitespace-nowrap" onClick={() => handleSort('code_reception')}>
                    <div className="flex items-center gap-1.5">
                      Code Réception <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 min-w-[200px]" onClick={() => handleSort('designation')}>
                    <div className="flex items-center gap-1.5">
                      Équipement / Client <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">Pôle</th>
                  <th className="py-3 px-4 whitespace-nowrap">Statut Atelier</th>
                  <th className="py-3 px-4 whitespace-nowrap">Priorité</th>
                  <th className="py-3 px-4 whitespace-nowrap">Responsable</th>
                  <th className="py-3 px-4 whitespace-nowrap">Date Entrée</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Aucun équipement trouvé correspondant aux critères.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-4 font-bold text-ts-blue whitespace-nowrap">
                        {item.code_reception}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{item.designation}</div>
                        <div className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                          {item.client_nom} • N° {item.num_serie}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge pole={item.pole}>{item.pole}</Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge status={item.statut}>{item.statut}</Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge priority={item.priorite}>{item.priorite}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {item.technicien_responsable}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                        {formatDateFR(item.date_entree)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => onOpenFicheDeVie(item)}
                        >
                          <span className="hidden sm:inline">Fiche de Vie 360°</span>
                          <span className="sm:hidden">Fiche</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Affichage de <strong>{filteredData.length}</strong> équipement(s) sur {equipements.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Centre de Service Technique Sama CST</span>
          </div>
        </div>
      )}
    </div>
  );
};
