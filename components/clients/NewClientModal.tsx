'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Client } from '@/types/database.types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id' | 'created_at'>) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [code, setCode] = useState(`CL-00${Math.floor(10 + Math.random() * 90)}`);
  const [nom, setNom] = useState('');
  const [contactNom, setContactNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sitePrincipal, setSitePrincipal] = useState('');
  const [typeContrat, setTypeContrat] = useState('Contrat Intégral 24/7');
  const [slaHeures, setSlaHeures] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      code,
      nom,
      contact_nom: contactNom,
      email,
      telephone,
      adresse,
      site_principal: sitePrincipal,
      type_contrat: typeContrat,
      sla_heures: slaHeures,
      equipements_count: 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau Client Partenaire TS"
      subtitle="Enregistrement d'un contrat de maintenance ou d'un compte client"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Code Client <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Entreprise / Établissement <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Ex: Clinique Madeleine, Sabodala Gold..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Référent</label>
            <input
              type="text"
              value={contactNom}
              onChange={(e) => setContactNom(e.target.value)}
              placeholder="Ex: Dr. Diallo, M. Faye"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@client.sn"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+221 33 800 00 00"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Site Principal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={sitePrincipal}
              onChange={(e) => setSitePrincipal(e.target.value)}
              required
              placeholder="Ex: Plateau Technique Dakar..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Dakar, Thiès, Diamniadio..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Contrat</label>
            <select
              value={typeContrat}
              onChange={(e) => setTypeContrat(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="Contrat Intégral 24/7">Contrat Intégral 24/7</option>
              <option value="Contrat Biomédical Vital 24/7">Contrat Biomédical Vital 24/7</option>
              <option value="Contrat Préventif & Curatif Plus">Contrat Préventif & Curatif Plus</option>
              <option value="Contrat Curatif Standard">Contrat Curatif Standard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">SLA Résolution (Heures)</label>
            <input
              type="number"
              value={slaHeures}
              onChange={(e) => setSlaHeures(Number(e.target.value))}
              min={1}
              max={48}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            ✓ Enregistrer le Client
          </Button>
        </div>
      </form>
    </Modal>
  );
};
