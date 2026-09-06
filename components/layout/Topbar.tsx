'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Wrench,
  Building2,
  Users as UsersIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
  onOpenNewAtelier?: () => void;
  onOpenNewClient?: () => void;
  onOpenNewPersonnel?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  onOpenNewAtelier,
  onOpenNewClient,
  onOpenNewPersonnel,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between z-20 shrink-0 relative">
      {/* Left: Hamburger Button (Mobile) + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar - Desktop & Tablet */}
        <div className="hidden sm:flex items-center w-64 md:w-80 lg:w-96 max-w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher équipement, code..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-ts-blue/20 focus:border-ts-blue transition-all"
          />
        </div>

        {/* Mobile Search Icon Toggle */}
        <button
          type="button"
          onClick={() => setShowSearchMobile(!showSearchMobile)}
          className="sm:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg"
          aria-label="Recherche"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {showSearchMobile && (
        <div className="sm:hidden absolute inset-x-0 top-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center gap-2 z-30 animate-fade-in">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            placeholder="Rechercher équipement, code..."
            className="flex-1 py-2 bg-transparent text-xs text-slate-800 focus:outline-none"
          />
          <button
            onClick={() => setShowSearchMobile(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Action Buttons with responsive labels */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenNewAtelier && (
            <Button
              size="sm"
              variant="primary"
              icon={<Wrench className="w-3.5 h-3.5" />}
              onClick={onOpenNewAtelier}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Entrée Atelier</span>
              <span className="sm:hidden">Atelier</span>
            </Button>
          )}

          {onOpenNewClient && (
            <Button
              size="sm"
              variant="secondary"
              icon={<Building2 className="w-3.5 h-3.5" />}
              onClick={onOpenNewClient}
              className="hidden md:inline-flex"
            >
              Client
            </Button>
          )}

          {onOpenNewPersonnel && (
            <Button
              size="sm"
              variant="outline"
              icon={<UsersIcon className="w-3.5 h-3.5" />}
              onClick={onOpenNewPersonnel}
              className="hidden lg:inline-flex"
            >
              Agent
            </Button>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block"></div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications atelier"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 sm:p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-ts-blue to-ts-navy text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              OF
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">Ousmane Fall</div>
              <div className="text-[10px] text-ts-green font-semibold">Superviseur CST</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Ousmane Fall</p>
                <p className="text-[11px] text-slate-500 truncate">ousmane.fall@technologies-services.sn</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded-md font-semibold">
                  Pôle BIOMED — Admin
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
