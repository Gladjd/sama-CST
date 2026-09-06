'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Database,
  Layers,
  Building2,
  Users,
  ShieldCheck,
  X,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  atelierCount?: number;
  personnelCount?: number;
  parcCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  atelierCount = 9,
  personnelCount = 12,
  parcCount = 24,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Supervision & KPIs',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Équipements en Atelier',
      href: '/atelier',
      icon: Wrench,
      badge: atelierCount > 0 ? `${atelierCount} en cours` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      name: 'Base de Données TS',
      href: '/base-ts',
      icon: Database,
      badge: `${parcCount} machines`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      name: 'Catalogue Équipements',
      href: '/catalogue',
      icon: Layers,
      badge: null,
    },
    {
      name: 'Référentiel Clients',
      href: '/clients',
      icon: Building2,
      badge: '7 contrats',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      name: 'Personnel CST',
      href: '/personnel',
      icon: Users,
      badge: `${personnelCount} agents`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-ts-navy text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-ts-green to-ts-green-dark flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-ts-green shrink-0">
            TS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-sm sm:text-base tracking-tight">SAMA CST</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-ts-green/20 text-ts-green border border-ts-green/40 rounded-full font-bold">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Technologies Services</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Modules Opérationnels
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={clsx(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-ts-blue text-white shadow-ts-blue'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={clsx(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-ts-green' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={clsx(
                    'text-[10px] px-2 py-0.5 rounded-full border font-bold',
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Support & System status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 space-y-3 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-ts-green animate-pulse"></span>
            <span>Supabase Cloud</span>
          </div>
          <span className="text-[10px] text-slate-400">PostgreSQL</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-300">
          <div className="font-semibold text-white flex items-center gap-1.5 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
            <span>Centre de Service Technique</span>
          </div>
          <p className="text-slate-400 leading-tight text-[10px] sm:text-[11px]">Supervision & Traçabilité 360°</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
