'use client';

import React, { useState } from 'react';
import { Layers, Search, Download, Plus, ArrowUpDown } from 'lucide-react';
import { EquipementTS } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { exportToCSV } from '@/lib/utils/csvExport';

interface CatalogueTableProps {
  catalogue: EquipementTS[];
  onOpenNewModal: () => void;
}

export const CatalogueTable: React.FC<CatalogueTableProps> = ({ catalogue, onOpenNewModal }) => {
  const [search, setSearch] = useState('');
  const [poleFilter, setPoleFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof EquipementTS>('code_equipement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = catalogue
    .filter((eq) => {
      const matchSearch =
        eq.code_equipement.toLowerCase().includes(search.toLowerCase()) ||
        eq.designation.toLowerCase().includes(search.toLowerCase()) ||
        eq.marque.toLowerCase().includes(search.toLowerCase()) ||
        eq.modele.toLowerCase().includes(search.toLowerCase());

      const matchPole = poleFilter === 'all' || eq.pole === poleFilter;
      return matchSearch && matchPole;
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof EquipementTS) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(
      'Sama_CST_Catalogue_Equipements_TS',
      [
        { key: 'code_equipement', label: 'Code Équipement' },
        { key: 'designation', label: 'Désignation' },
        { key: 'marque', label: 'Marque' },
        { key: 'modele', label: 'Modèle' },
        { key: 'pole', label: 'Pôle CST' },
        { key: 'type_service', label: 'Type de Service' },
        { key: 'statut', label: 'Statut' },
      ],
      filteredData
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card-ts p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher code, marque, modèle..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20"
            />
          </div>

          <select
            value={poleFilter}
            onChange={(e) => setPoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Tous les Pôles</option>
            <option value="BIOMED">Pôle BIOMED</option>
            <option value="IMAG-CHIRG">Pôle IMAG-CHIRG</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>
            Exporter CSV
          </Button>
          <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenNewModal}>
            + Ajouter au Catalogue
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-ts overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('code_equipement')}>
                  <div className="flex items-center gap-1.5">
                    Code <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('designation')}>
                  <div className="flex items-center gap-1.5">
                    Désignation <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Marque / Modèle</th>
                <th className="py-3 px-4">Pôle</th>
                <th className="py-3 px-4">Type de Service TS</th>
                <th className="py-3 px-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-ts-blue whitespace-nowrap">
                    {eq.code_equipement}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{eq.designation}</td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-semibold">{eq.marque}</span> — {eq.modele}
                  </td>
                  <td className="py-3 px-4">
                    <Badge pole={eq.pole}>{eq.pole}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{eq.type_service}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge status={eq.statut}>{eq.statut}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
