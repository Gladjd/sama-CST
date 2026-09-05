import React from 'react';
import { Wrench, ShieldCheck, MapPin, Calendar, ExternalLink, Activity } from 'lucide-react';
import { ParcEquipementTS } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDateFR, formatPercent } from '@/lib/utils/formatters';

interface ParcEquipementsGridProps {
  equipements: ParcEquipementTS[];
  onOpenFicheDeVieByCode: (codeMachine: string) => void;
  onGoToAtelierByCode: (codeMachine: string) => void;
}

export const ParcEquipementsGrid: React.FC<ParcEquipementsGridProps> = ({
  equipements,
  onOpenFicheDeVieByCode,
  onGoToAtelierByCode,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {equipements.map((eq) => (
        <div
          key={eq.id}
          className="card-ts p-5 hover:shadow-ts-md hover:border-slate-300 transition-all flex flex-col justify-between group"
        >
          <div>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs font-mono font-bold text-ts-blue px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100">
                {eq.code_machine}
              </span>
              <Badge status={eq.etat_operationnel}>{eq.etat_operationnel}</Badge>
            </div>

            <h3 className="text-sm font-bold text-slate-900 group-hover:text-ts-blue transition-colors">
              {eq.designation}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-3">
              {eq.marque_modele} • <span className="font-mono text-[11px]">{eq.num_serie}</span>
            </p>

            {/* Availability gauge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-ts-green" /> Disponibilité
                </span>
                <span className="font-bold text-slate-900">{formatPercent(eq.taux_disponibilite)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    eq.taux_disponibilite >= 95 ? 'bg-ts-green' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(eq.taux_disponibilite, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Info grid */}
            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Client :</span>
                <span className="font-semibold text-slate-800 text-right">{eq.client_nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site / Déploiement :</span>
                <span className="font-semibold text-slate-700">{eq.site}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pôle :</span>
                <Badge pole={eq.pole}>{eq.pole}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dernière Maintenance :</span>
                <span className="text-slate-700 font-medium">{formatDateFR(eq.derniere_maintenance)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              onClick={() => onOpenFicheDeVieByCode(eq.code_machine)}
            >
              Fiche de Vie
            </Button>
            {eq.en_atelier ? (
              <Button
                size="sm"
                variant="primary"
                icon={<Wrench className="w-3.5 h-3.5" />}
                onClick={() => onGoToAtelierByCode(eq.code_machine)}
              >
                Voir Atelier
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                icon={<Wrench className="w-3.5 h-3.5 text-slate-400" />}
                onClick={() => onGoToAtelierByCode(eq.code_machine)}
              >
                Entrée Atelier
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
