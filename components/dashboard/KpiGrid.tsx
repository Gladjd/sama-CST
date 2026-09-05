import React from 'react';
import { Wrench, ShieldCheck, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatPercent } from '@/lib/utils/formatters';

interface KpiGridProps {
  atelierEnCours: number;
  tauxDispo: number;
  frbEnAttente: number;
  resolutionsMois: number;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  atelierEnCours = 9,
  tauxDispo = 96.4,
  frbEnAttente = 3,
  resolutionsMois = 28,
}) => {
  const kpis = [
    {
      label: 'Équipements en Atelier',
      value: atelierEnCours,
      sub: 'En cours de diagnostic ou révision',
      icon: Wrench,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: '+2 cette semaine',
      badgeColor: 'text-amber-700 bg-amber-100',
    },
    {
      label: 'Taux de Disponibilité Parc',
      value: formatPercent(tauxDispo),
      sub: 'Disponibilité moyenne contractuelle',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'Objectif SLA > 95%',
      badgeColor: 'text-emerald-700 bg-emerald-100',
    },
    {
      label: 'Devis FRB en Validation',
      value: frbEnAttente,
      sub: 'Fiches Réparation & Bilan en attente',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Délai moyen: 24h',
      badgeColor: 'text-blue-700 bg-blue-100',
    },
    {
      label: 'Interventions Clôturées',
      value: resolutionsMois,
      sub: 'Équipements livrés ce mois-ci',
      icon: CheckCircle2,
      color: 'text-ts-green bg-ts-green-light border-ts-green-subtle',
      badge: '100% conformes',
      badgeColor: 'text-emerald-700 bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="card-ts p-5 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</div>
            <div className="text-xs font-bold text-slate-700 mt-0.5">{kpi.label}</div>
            <div className="text-[11px] text-slate-400 mt-1">{kpi.sub}</div>
          </div>
        );
      })}
    </div>
  );
};
