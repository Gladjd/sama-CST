'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PersonnelCST, PoleType } from '@/types/database.types';

interface NewPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: Omit<PersonnelCST, 'id' | 'created_at'>) => void;
}

export const NewPersonnelModal: React.FC<NewPersonnelModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [pole, setPole] = useState<PoleType>('BIOMED');
  const [specialite, setSpecialite] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      nom,
      email,
      pole,
      specialite,
      telephone,
      actif: true,
      equipements_assignes: 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un Nouvel Agent au Personnel CST"
      subtitle="Référencement d'un ingénieur, technicien ou agent de maintenance"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nom & Prénom <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder="Ex: Ibrahima Ndiaye"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Professionnel <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="prenom.nom@technologies-services.sn"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+221 77 000 00 00"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pôle d&apos;Affectation</label>
            <select
              value={pole}
              onChange={(e) => setPole(e.target.value as PoleType)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="BIOMED">Pôle BIOMED</option>
              <option value="IMAG-CHIRG">Pôle IMAG-CHIRG</option>
              <option value="RÉCEPTION & ATELIER">RÉCEPTION & ATELIER</option>
              <option value="BANC D'ESSAI & CONTRÔLE">BANC D&apos;ESSAI & CONTRÔLE</option>
              <option value="QUALITÉ & MÉTROLOGIE">QUALITÉ & MÉTROLOGIE</option>
              <option value="SUPPORT & SAV">SUPPORT & SAV</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Spécialité Technique <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
              required
              placeholder="Ex: Échographes, Hydraulique..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            ✓ Enregistrer l&apos;Agent
          </Button>
        </div>
      </form>
    </Modal>
  );
};
