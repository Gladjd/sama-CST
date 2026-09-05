import React from 'react';
import { Building2, ShieldCheck, MapPin, User, ArrowRight, Layers } from 'lucide-react';
import { SiteTS } from '@/types/database.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SitesGridProps {
  sites: SiteTS[];
  onSelectSite?: (site: SiteTS) => void;
}

export const SitesGrid: React.FC<SitesGridProps> = ({ sites, onSelectSite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {sites.map((site) => (
        <div
          key={site.id}
          className="card-ts p-5 hover:shadow-ts-md hover:border-slate-300 transition-all flex flex-col justify-between group"
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-bold text-ts-blue uppercase tracking-wider">
                  {site.type_contrat}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-ts-blue transition-colors">
                  {site.nom_site}
                </h3>
              </div>
              <Badge status={site.statut}>{site.statut}</Badge>
            </div>

            {/* Client info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-4 bg-slate-50 p-2 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{site.client_nom}</span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs text-slate-600 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Localisation :
                </span>
                <span className="font-semibold text-slate-800">{site.localisation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SLA Garanti :
                </span>
                <span className="font-bold text-emerald-700">{site.sla_resolution}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Référent CST :
                </span>
                <span className="font-semibold text-ts-blue">{site.technicien_referent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Équipements Actifs :
                </span>
                <span className="font-bold text-slate-900">{site.equipements_count} machines</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">
              Visite : {site.derniere_visite || 'Récemment'}
            </span>
            {onSelectSite && (
              <Button size="sm" variant="ghost" onClick={() => onSelectSite(site)}>
                Voir Parc <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
