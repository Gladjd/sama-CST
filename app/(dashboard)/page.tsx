'use client';

import React, { useEffect, useState } from 'react';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { SupervisionCharts } from '@/components/dashboard/SupervisionCharts';
import { RecentActivityList } from '@/components/dashboard/RecentActivityList';
import { SupabaseService } from '@/lib/data/supabaseService';
import { ActivityLog } from '@/types/database.types';
import { ArrowRight, Wrench, Database, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const l = await SupabaseService.getLogs();
      setLogs(l);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <HeaderBanner
        badgeText="CENTRE DE SERVICE TECHNIQUE (CST)"
        title="Tableau de Bord & Supervision Globale"
        description="Suivi en direct des flux d'atelier, de la disponibilité contractuelle du parc machines et du respect des SLAs Technologies Services."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/atelier"
              className="px-3 py-2 bg-ts-green hover:bg-ts-green-hover text-white text-xs font-bold rounded-lg shadow-ts-green flex items-center gap-1.5 transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              Accéder à l&apos;Atelier
            </Link>
          </div>
        }
      />

      {/* 4 KPIs */}
      <KpiGrid
        atelierEnCours={9}
        tauxDispo={96.4}
        frbEnAttente={3}
        resolutionsMois={28}
      />

      {/* Charts & SLAs */}
      <SupervisionCharts />

      {/* Quick Navigation Cards & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityList logs={logs} />
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <div className="card-ts p-5 bg-gradient-to-br from-slate-900 to-ts-navy text-white">
            <h3 className="text-sm font-bold text-white mb-1">Base de Données TS</h3>
            <p className="text-xs text-slate-300 mb-4">
              Supervision des 7 contrats clients majeurs et des 24 machines du parc installé.
            </p>
            <Link
              href="/base-ts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ts-green hover:text-white transition-colors"
            >
              Consulter le Parc Déployé <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-ts p-5 bg-white border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Personnel CST</h3>
            <p className="text-xs text-slate-500 mb-4">
              12 agents, techniciens et ingénieurs répartis sur 6 pôles opérationnels.
            </p>
            <Link
              href="/personnel"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ts-blue hover:underline"
            >
              Voir le Référentiel Équipe <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
