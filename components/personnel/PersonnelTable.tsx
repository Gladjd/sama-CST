'use client';

import React, { useState } from 'react';
import { Search, Download, Plus, Mail, Phone, Wrench, ArrowUpDown } from 'lucide-react';
import { PersonnelCST } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { exportToCSV } from '@/lib/utils/csvExport';

interface PersonnelTableProps {
  personnel: PersonnelCST[];
  onOpenNewModal: () => void;
  onFilterAtelierByAgent?: (agentNom: string) => void;
}

export const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnel,
  onOpenNewModal,
  onFilterAtelierByAgent,
}) => {
  const [search, setSearch] = useState('');
  const [poleFilter, setPoleFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof PersonnelCST>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = personnel
    .filter((agent) => {
      const matchSearch =
        agent.nom.toLowerCase().includes(search.toLowerCase()) ||
        agent.email.toLowerCase().includes(search.toLowerCase()) ||
        agent.specialite.toLowerCase().includes(search.toLowerCase()) ||
        agent.telephone.toLowerCase().includes(search.toLowerCase());

      const matchPole = poleFilter === 'all' || agent.pole === poleFilter;
      return matchSearch && matchPole;
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof PersonnelCST) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(
      'Sama_CST_Personnel_CST',
      [
        { key: 'nom', label: 'Nom & Prénom' },
        { key: 'email', label: 'Email Professionnel' },
        { key: 'pole', label: 'Pôle Opérationnel' },
        { key: 'specialite', label: 'Spécialité & Compétences' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'equipements_assignes', label: 'Équipements Assignés' },
      ],
      filteredData
    );
  };

  return (
    <div className="space-y-4">
      {/* Responsive Toolbar */}
      <div className="card-ts p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-full sm:w-auto sm:min-w-[240px] flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher technicien, email, spécialité..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20"
              />
            </div>

            <select
              value={poleFilter}
              onChange={(e) => setPoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="all">Pôles (Tous)</option>
              <option value="BIOMED">Pôle BIOMED</option>
              <option value="IMAG-CHIRG">Pôle IMAG-CHIRG</option>
              <option value="RÉCEPTION & ATELIER">RÉCEPTION & ATELIER</option>
              <option value="BANC D'ESSAI & CONTRÔLE">BANC D&apos;ESSAI</option>
              <option value="QUALITÉ & MÉTROLOGIE">QUALITÉ</option>
              <option value="SUPPORT & SAV">SUPPORT & SAV</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>
              <span className="hidden sm:inline">Exporter CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenNewModal}>
              <span className="hidden sm:inline">Ajouter un Agent</span>
              <span className="sm:hidden">Agent</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table with responsive horizontal scroll */}
      <div className="card-ts overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleSort('nom')}>
                  <div className="flex items-center gap-1.5">
                    Agent <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer min-w-[200px]" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1.5">
                    Email <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleSort('pole')}>
                  <div className="flex items-center gap-1.5">
                    Pole <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[180px]">Spécialité & Compétences</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Assignés</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ts-blue to-ts-navy text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {agent.nom.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 whitespace-nowrap">{agent.nom}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 shrink-0" /> {agent.telephone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`mailto:${agent.email}`}
                      className="text-ts-blue hover:underline font-medium flex items-center gap-1.5 truncate max-w-xs"
                    >
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge pole={agent.pole}>{agent.pole}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{agent.specialite}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-bold text-xs">
                      {agent.equipements_assignes || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {onFilterAtelierByAgent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Wrench className="w-3.5 h-3.5 text-ts-blue" />}
                        onClick={() => onFilterAtelierByAgent(agent.nom)}
                      >
                        Atelier
                      </Button>
                    )}
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
