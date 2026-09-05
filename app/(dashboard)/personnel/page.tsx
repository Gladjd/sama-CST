'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { PersonnelTable } from '@/components/personnel/PersonnelTable';
import { NewPersonnelModal } from '@/components/personnel/NewPersonnelModal';
import { SupabaseService } from '@/lib/data/supabaseService';
import { PersonnelCST } from '@/types/database.types';
import { useRouter } from 'next/navigation';

export default function PersonnelPage() {
  const router = useRouter();
  const [personnel, setPersonnel] = useState<PersonnelCST[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await SupabaseService.getPersonnel();
      setPersonnel(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddPersonnel = async (data: Omit<PersonnelCST, 'id' | 'created_at'>) => {
    const created = await SupabaseService.addPersonnel(data);
    setPersonnel((prev) => [created, ...prev]);
  };

  const handleFilterAtelierByAgent = (agentNom: string) => {
    router.push('/atelier');
  };

  return (
    <div className="space-y-6">
      <HeaderBanner
        badgeText="ÉQUIPE TECHNIQUE & INGÉNIERIE"
        title="Personnel CST Technologies Services"
        description="Répertoire des 12 techniciens, ingénieurs et spécialistes affectés aux pôles biomédicaux, imagerie et ateliers."
      />

      {loading ? (
        <div className="card-ts p-8 text-center text-slate-400">Chargement de l&apos;équipe CST...</div>
      ) : (
        <PersonnelTable
          personnel={personnel}
          onOpenNewModal={() => setIsModalOpen(true)}
          onFilterAtelierByAgent={handleFilterAtelierByAgent}
        />
      )}

      <NewPersonnelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPersonnel}
      />
    </div>
  );
}
