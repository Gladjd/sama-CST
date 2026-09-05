import React from 'react';
import { Activity, Clock, Wrench, FileText, CheckCircle2 } from 'lucide-react';
import { ActivityLog } from '@/types/database.types';
import { formatDateTimeFR } from '@/lib/utils/formatters';

interface RecentActivityListProps {
  logs: ActivityLog[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ logs }) => {
  return (
    <div className="card-ts p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-ts-blue" />
          Journal d&apos;Activité & Traçabilité CST en Temps Réel
        </h3>
        <span className="text-[10px] font-bold text-ts-green bg-ts-green-light px-2.5 py-1 rounded-full border border-ts-green-subtle">
          Flux Direct
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {logs.map((log) => (
          <div key={log.id} className="py-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                {log.entity_type === 'Atelier' ? (
                  <Wrench className="w-4 h-4 text-amber-600" />
                ) : log.entity_type === 'FRB' ? (
                  <FileText className="w-4 h-4 text-blue-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{log.action}</span>
                  {log.entity_id && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                      {log.entity_id}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-500">Par {log.user_nom}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTimeFR(log.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
