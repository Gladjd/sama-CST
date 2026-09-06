'use client';

import React, { useState } from 'react';
import { Building2, Search, Download, Plus, Mail, Phone, MapPin, ArrowUpDown } from 'lucide-react';
import { Client } from '@/types/database.types';
import { Button } from '@/components/ui/Button';
import { exportToCSV } from '@/lib/utils/csvExport';

interface ClientsTableProps {
  clients: Client[];
  onOpenNewModal: () => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onOpenNewModal }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Client>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = clients
    .filter((c) => {
      return (
        c.nom.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.contact_nom.toLowerCase().includes(search.toLowerCase()) ||
        c.site_principal.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    exportToCSV(
      'Sama_CST_Clients',
      [
        { key: 'code', label: 'Code Client' },
        { key: 'nom', label: 'Entreprise / Client' },
        { key: 'contact_nom', label: 'Contact Référent' },
        { key: 'email', label: 'Email' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'site_principal', label: 'Site Principal' },
        { key: 'type_contrat', label: 'Type Contrat' },
        { key: 'sla_heures', label: 'SLA (Heures)' },
        { key: 'equipements_count', label: 'Équipements Actifs' },
      ],
      filteredData
    );
  };

  return (
    <div className="space-y-4">
      {/* Responsive Toolbar */}
      <div className="card-ts p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-auto sm:min-w-[280px] flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher client, contact, site..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>
            <span className="hidden sm:inline">Exporter CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenNewModal}>
            <span className="hidden sm:inline">Nouveau Client</span>
            <span className="sm:hidden">Client</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card-ts overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 cursor-pointer whitespace-nowrap" onClick={() => handleSort('code')}>
                  <div className="flex items-center gap-1.5">
                    Code <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer min-w-[180px]" onClick={() => handleSort('nom')}>
                  <div className="flex items-center gap-1.5">
                    Client / Entreprise <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[200px]">Contact & Coordonnées</th>
                <th className="py-3 px-4 min-w-[160px]">Site Principal</th>
                <th className="py-3 px-4 whitespace-nowrap">Type de Contrat</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">SLA Garanti</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Équipements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-ts-blue whitespace-nowrap">
                    {client.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{client.nom}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {client.adresse}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{client.contact_nom}</div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                      <a href={`mailto:${client.email}`} className="text-ts-blue hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3 shrink-0" /> {client.email}
                      </a>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {client.telephone}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{client.site_principal}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                      {client.type_contrat}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-xs">
                      &lt; {client.sla_heures}h
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {client.equipements_count || 0}
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
