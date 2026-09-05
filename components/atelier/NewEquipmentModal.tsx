'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { EquipementAtelier, Client, PersonnelCST, PriorityType, WorkshopStatus } from '@/types/database.types';

interface NewEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  personnel: PersonnelCST[];
  onAdd: (eq: Omit<EquipementAtelier, 'id' | 'created_at'>) => void;
}

export const NewEquipmentModal: React.FC<NewEquipmentModalProps> = ({
  isOpen,
  onClose,
  clients,
  personnel,
  onAdd,
}) => {
  const [codeReception, setCodeReception] = useState(`REC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [codeEquipement, setCodeEquipement] = useState('');
  const [designation, setDesignation] = useState('');
  const [clientNom, setClientNom] = useState(clients[0]?.nom || '');
  const [numSerie, setNumSerie] = useState('');
  const [pole, setPole] = useState<'BIOMED' | 'IMAG-CHIRG'>('BIOMED');
  const [dateEntree, setDateEntree] = useState(new Date().toISOString().slice(0, 10));
  const [priorite, setPriorite] = useState<PriorityType>('Moyenne');
  const [technicienResponsable, setTechnicienResponsable] = useState(personnel[0]?.nom || 'Ousmane Fall');
  const [anomalieSignalee, setAnomalieSignalee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      code_reception: codeReception,
      code_equipement: codeEquipement || `EQ-${Date.now().toString().slice(-4)}`,
      designation,
      client_nom: clientNom,
      num_serie: numSerie || 'SN-NON-RENSEIGNÉ',
      pole,
      date_entree: dateEntree,
      statut: 'En Diagnostic',
      priorite,
      technicien_responsable: technicienResponsable,
      anomalie_signalee: anomalieSignalee,
      devis_frb_statut: 'Non Émis',
      montant_frb: 0,
    });

    onClose();
    // Reset form
    setCodeReception(`REC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setDesignation('');
    setNumSerie('');
    setAnomalieSignalee('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle Réception d'Équipement en Atelier"
      subtitle="Création de la Fiche de Vie 360° et prise en charge CST"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Code Réception <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={codeReception}
              onChange={(e) => setCodeReception(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Partenaire <span className="text-rose-500">*</span>
            </label>
            <select
              value={clientNom}
              onChange={(e) => setClientNom(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.nom}>
                  {c.nom} ({c.type_contrat})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Désignation de l&apos;Équipement / Organe <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Ex: Moniteur Multiparamétrique, Pompe Haute Pression..."
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              N° de Série <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={numSerie}
              onChange={(e) => setNumSerie(e.target.value)}
              placeholder="Ex: SN-9821-X"
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pôle CST</label>
            <select
              value={pole}
              onChange={(e) => setPole(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="BIOMED">Pôle BIOMED</option>
              <option value="IMAG-CHIRG">Pôle IMAG-CHIRG</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priorité</label>
            <select
              value={priorite}
              onChange={(e) => setPriorite(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="Urgente">Urgente (SLA &lt; 2h)</option>
              <option value="Haute">Haute (SLA &lt; 4h)</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable Assigné</label>
            <select
              value={technicienResponsable}
              onChange={(e) => setTechnicienResponsable(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              {personnel.map((p) => (
                <option key={p.id} value={p.nom}>
                  {p.nom} ({p.pole})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <DatePicker
            label="Date d'Entrée en Atelier"
            value={dateEntree}
            onChange={setDateEntree}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Anomalie Signalée / Diagnostic Initial <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={anomalieSignalee}
            onChange={(e) => setAnomalieSignalee(e.target.value)}
            rows={3}
            placeholder="Décrire les symptômes constatés, erreurs affichées, pièces endommagées..."
            required
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            ✓ Enregistrer et Ouvrir Fiche de Vie
          </Button>
        </div>
      </form>
    </Modal>
  );
};
