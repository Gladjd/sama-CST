'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { NewClientModal } from '@/components/clients/NewClientModal';
import { SupabaseService } from '@/lib/data/supabaseService';
import { Client } from '@/types/database.types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await SupabaseService.getClients();
      setClients(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddClient = async (data: Omit<Client, 'id' | 'created_at'>) => {
    const created = await SupabaseService.addClient(data);
    setClients((prev) => [created, ...prev]);
  };

  return (
    <div className="space-y-6">
      <HeaderBanner
        badgeText="RELATION CLIENT & CONTRATS"
        title="Référentiel des Clients Partenaires"
        description="Gestion des contrats de maintenance, contacts référents, niveaux de SLA et plateaux techniques."
      />

      {loading ? (
        <div className="card-ts p-8 text-center text-slate-400">Chargement des clients...</div>
      ) : (
        <ClientsTable clients={clients} onOpenNewModal={() => setIsModalOpen(true)} />
      )}

      <NewClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}
