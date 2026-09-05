'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { AtelierTable } from '@/components/atelier/AtelierTable';
import { FicheDeVieDrawer } from '@/components/atelier/FicheDeVieDrawer';
import { NewEquipmentModal } from '@/components/atelier/NewEquipmentModal';
import { SupabaseService } from '@/lib/data/supabaseService';
import { EquipementAtelier, Client, PersonnelCST, InterventionTimelineStep } from '@/types/database.types';

export default function AtelierPage() {
  const [equipements, setEquipements] = useState<EquipementAtelier[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelCST[]>([]);
  const [selectedEquipement, setSelectedEquipement] = useState<EquipementAtelier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [eqs, cls, prs] = await Promise.all([
        SupabaseService.getEquipementsAtelier(),
        SupabaseService.getClients(),
        SupabaseService.getPersonnel(),
      ]);
      setEquipements(eqs);
      setClients(cls);
      setPersonnel(prs);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleOpenFicheDeVie = (eq: EquipementAtelier) => {
    setSelectedEquipement(eq);
    setIsDrawerOpen(true);
  };

  const handleUpdateStep = async (
    atelierId: string,
    stepIndex: number,
    updatedStep: Partial<InterventionTimelineStep>
  ) => {
    await SupabaseService.updateInterventionStep(atelierId, stepIndex, updatedStep);
    // Refresh local state
    const updatedList = await SupabaseService.getEquipementsAtelier();
    setEquipements(updatedList);
    const updatedSelected = updatedList.find((e) => e.id === atelierId || e.code_reception === atelierId);
    if (updatedSelected) setSelectedEquipement(updatedSelected);
  };

  const handleAddStep = async (
    atelierId: string,
    newStep: Omit<InterventionTimelineStep, 'step_index'>
  ) => {
    await SupabaseService.addInterventionStep(atelierId, newStep);
    const updatedList = await SupabaseService.getEquipementsAtelier();
    setEquipements(updatedList);
    const updatedSelected = updatedList.find((e) => e.id === atelierId || e.code_reception === atelierId);
    if (updatedSelected) setSelectedEquipement(updatedSelected);
  };

  const handleAddNewEquipment = async (data: Omit<EquipementAtelier, 'id' | 'created_at'>) => {
    const created = await SupabaseService.addEquipementAtelier(data);
    setEquipements((prev) => [created, ...prev]);
  };

  return (
    <div className="space-y-6">
      <HeaderBanner
        badgeText="CENTRE DE RÉPARATION & CONTRÔLE CST"
        title="Équipements en Atelier & Fiches de Vie 360°"
        description="Traçabilité complète des réceptions, diagnostics, réparations, émissions de devis FRB et bancs d'essai dynamiques."
      />

      {loading ? (
        <div className="card-ts p-8 text-center text-slate-400">Chargement des équipements en atelier...</div>
      ) : (
        <AtelierTable
          equipements={equipements}
          onOpenFicheDeVie={handleOpenFicheDeVie}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />
      )}

      {/* 360 Fiche de Vie Drawer */}
      <FicheDeVieDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        equipement={selectedEquipement}
        personnelList={personnel}
        onUpdateStep={handleUpdateStep}
        onAddStep={handleAddStep}
      />

      {/* New Equipment Modal */}
      <NewEquipmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        clients={clients}
        personnel={personnel}
        onAdd={handleAddNewEquipment}
      />
    </div>
  );
}
