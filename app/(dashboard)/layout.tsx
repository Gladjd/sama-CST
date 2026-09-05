'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { NewEquipmentModal } from '@/components/atelier/NewEquipmentModal';
import { NewClientModal } from '@/components/clients/NewClientModal';
import { NewPersonnelModal } from '@/components/personnel/NewPersonnelModal';
import { SupabaseService } from '@/lib/data/supabaseService';
import { Client, PersonnelCST, EquipementAtelier } from '@/types/database.types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewAtelierOpen, setIsNewAtelierOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewPersonnelOpen, setIsNewPersonnelOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelCST[]>([]);
  const [atelierCount, setAtelierCount] = useState(9);
  const [personnelCount, setPersonnelCount] = useState(12);

  useEffect(() => {
    async function loadData() {
      const [c, p, a] = await Promise.all([
        SupabaseService.getClients(),
        SupabaseService.getPersonnel(),
        SupabaseService.getEquipementsAtelier(),
      ]);
      setClients(c);
      setPersonnel(p);
      setPersonnelCount(p.length);
      setAtelierCount(a.length);
    }
    loadData();
  }, []);

  const handleAddAtelier = async (data: Omit<EquipementAtelier, 'id' | 'created_at'>) => {
    await SupabaseService.addEquipementAtelier(data);
    setAtelierCount((prev) => prev + 1);
  };

  const handleAddClient = async (data: Omit<Client, 'id' | 'created_at'>) => {
    const newC = await SupabaseService.addClient(data);
    setClients((prev) => [newC, ...prev]);
  };

  const handleAddPersonnel = async (data: Omit<PersonnelCST, 'id' | 'created_at'>) => {
    const newP = await SupabaseService.addPersonnel(data);
    setPersonnel((prev) => [newP, ...prev]);
    setPersonnelCount((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        atelierCount={atelierCount}
        personnelCount={personnelCount}
        parcCount={24}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar with hamburger toggle */}
        <Topbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenNewAtelier={() => setIsNewAtelierOpen(true)}
          onOpenNewClient={() => setIsNewClientOpen(true)}
          onOpenNewPersonnel={() => setIsNewPersonnelOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <NewEquipmentModal
        isOpen={isNewAtelierOpen}
        onClose={() => setIsNewAtelierOpen(false)}
        clients={clients}
        personnel={personnel}
        onAdd={handleAddAtelier}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onAdd={handleAddClient}
      />

      <NewPersonnelModal
        isOpen={isNewPersonnelOpen}
        onClose={() => setIsNewPersonnelOpen(false)}
        onAdd={handleAddPersonnel}
      />
    </div>
  );
}
