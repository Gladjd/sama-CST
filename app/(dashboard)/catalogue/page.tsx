'use client';

import React, { useState, useEffect } from 'react';
import { HeaderBanner } from '@/components/layout/HeaderBanner';
import { CatalogueTable } from '@/components/catalogue/CatalogueTable';
import { SupabaseService } from '@/lib/data/supabaseService';
import { EquipementTS } from '@/types/database.types';

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<EquipementTS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await SupabaseService.getCatalogue();
      setCatalogue(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <HeaderBanner
        badgeText="RÉFÉRENTIEL TECHNIQUE TS"
        title="Catalogue des Équipements TS"
        description="Base de connaissances des matériels biomédicaux, d'imagerie et industriels sous maintenance Technologies Services."
      />

      {loading ? (
        <div className="card-ts p-8 text-center text-slate-400">Chargement du catalogue...</div>
      ) : (
        <CatalogueTable
          catalogue={catalogue}
          onOpenNewModal={() => alert('Formulaire d\'ajout au catalogue disponible pour les administrateurs.')}
        />
      )}
    </div>
  );
}
