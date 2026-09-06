'use client';

import React from 'react';
import { BarChart3, PieChart, CheckCircle } from 'lucide-react';

export const SupervisionCharts: React.FC = () => {
  const rotationStats = [
    { label: 'Jan', entrees: 18, sorties: 16 },
    { label: 'Fév', entrees: 22, sorties: 20 },
    { label: 'Mar', entrees: 25, sorties: 24 },
    { label: 'Avr', entrees: 21, sorties: 22 },
    { label: 'Mai', entrees: 28, sorties: 27 },
    { label: 'Juin', entrees: 30, sorties: 29 },
    { label: 'Juil', entrees: 26, sorties: 25 },
    { label: 'Août', entrees: 32, sorties: 31 },
    { label: 'Sep', entrees: 14, sorties: 12 },
  ];

  const maxVal = 35;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {/* Rotation Atelier Bar Chart */}
      <div className="card-ts p-4 sm:p-5 lg:col-span-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-ts-blue shrink-0" />
              <span>Rotation Atelier CST — Entrées vs Sorties (2026)</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Flux mensuel des équipements pris en charge et restitués</p>
          </div>
          <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-ts-blue"></span>
              <span className="text-slate-600 font-medium text-[10px] sm:text-[11px]">Entrées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs bg-ts-green"></span>
              <span className="text-slate-600 font-medium text-[10px] sm:text-[11px]">Sorties</span>
            </div>
          </div>
        </div>

        {/* Scrollable Container on very narrow screens */}
        <div className="overflow-x-auto pb-2">
          <div className="h-44 sm:h-48 min-w-[340px] flex items-end justify-between gap-2 pt-4 border-b border-slate-100">
            {rotationStats.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-32 sm:h-36">
                  {/* Entrées */}
                  <div
                    style={{ height: `${(item.entrees / maxVal) * 100}%` }}
                    className="w-2.5 sm:w-3 bg-ts-blue rounded-t-xs sm:rounded-t-sm transition-all duration-300 hover:brightness-110 relative group"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] sm:text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {item.entrees} entrées
                    </span>
                  </div>
                  {/* Sorties */}
                  <div
                    style={{ height: `${(item.sorties / maxVal) * 100}%` }}
                    className="w-2.5 sm:w-3 bg-ts-green rounded-t-xs sm:rounded-t-sm transition-all duration-300 hover:brightness-110 relative group"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] sm:text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      {item.sorties} sorties
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Répartition par Pôle & Statuts */}
      <div className="card-ts p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
            <PieChart className="w-4 h-4 text-ts-green shrink-0" />
            <span>Répartition par Pôle & SLAs</span>
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mb-3 sm:mb-4">Charge opérationnelle active</p>

          <div className="space-y-3">
            {/* Pôle BIOMED */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 truncate pr-2">BIOMED (Hôpitaux & Cliniques)</span>
                <span className="text-slate-800 shrink-0">54% (13)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>

            {/* Pôle IMAG-CHIRG */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-700 truncate pr-2">IMAG-CHIRG (Imagerie & Mines)</span>
                <span className="text-slate-800 shrink-0">46% (11)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '46%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Status Card */}
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-800 leading-tight">Respect des SLAs Contractuels</div>
              <div className="text-[10px] text-emerald-600">Intervention moyenne en 1h45</div>
            </div>
          </div>
          <span className="text-sm font-black text-emerald-700 shrink-0">99.2%</span>
        </div>
      </div>
    </div>
  );
};
