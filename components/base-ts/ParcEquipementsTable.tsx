import React from 'react';
import { ParcEquipementTS } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateFR, formatPercent } from '@/lib/utils/formatters';
import { Eye, Wrench } from 'lucide-react';

interface ParcEquipementsTableProps {
  equipements: ParcEquipementTS[];
  onOpenFicheDeVieByCode: (codeMachine: string) => void;
  onGoToAtelierByCode: (codeMachine: string) => void;
}

export const ParcEquipementsTable: React.FC<ParcEquipementsTableProps> = ({
  equipements,
  onOpenFicheDeVieByCode,
  onGoToAtelierByCode,
}) => {
  return (
    <div className="card-ts overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Code Machine</th>
              <th className="py-3 px-4">Désignation / Modèle</th>
              <th className="py-3 px-4">Client & Site</th>
              <th className="py-3 px-4">Pôle</th>
              <th className="py-3 px-4">État Opérationnel</th>
              <th className="py-3 px-4">Disponibilité</th>
              <th className="py-3 px-4">Dernière Maint.</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {equipements.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Aucun équipement ne correspond aux critères de filtre.
                </td>
              </tr>
            ) : (
              equipements.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-ts-blue whitespace-nowrap">
                    {eq.code_machine}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{eq.designation}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {eq.marque_modele} • N° {eq.num_serie}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{eq.client_nom}</div>
                    <div className="text-[11px] text-slate-500">{eq.site}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge pole={eq.pole}>{eq.pole}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={eq.etat_operationnel}>{eq.etat_operationnel}</Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        eq.taux_disponibilite >= 95
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {formatPercent(eq.taux_disponibilite)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-medium">
                    {formatDateFR(eq.derniere_maintenance)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => onOpenFicheDeVieByCode(eq.code_machine)}
                      >
                        Fiche
                      </Button>
                      <Button
                        size="sm"
                        variant={eq.en_atelier ? 'primary' : 'ghost'}
                        icon={<Wrench className="w-3.5 h-3.5" />}
                        onClick={() => onGoToAtelierByCode(eq.code_machine)}
                      >
                        {eq.en_atelier ? 'Atelier' : '+ Atelier'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
