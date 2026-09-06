'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { EquipementAtelier, InterventionTimelineStep, PersonnelCST } from '@/types/database.types';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { formatDateFR, formatFCFA } from '@/lib/utils/formatters';

interface FicheDeVieDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  equipement: EquipementAtelier | null;
  personnelList: PersonnelCST[];
  onUpdateStep: (atelierId: string, stepIndex: number, step: Partial<InterventionTimelineStep>) => void;
  onAddStep: (atelierId: string, step: Omit<InterventionTimelineStep, 'step_index'>) => void;
}

export const FicheDeVieDrawer: React.FC<FicheDeVieDrawerProps> = ({
  isOpen,
  onClose,
  equipement,
  personnelList,
  onUpdateStep,
  onAddStep,
}) => {
  // Editing state for an existing step
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editDateHeure, setEditDateHeure] = useState('');
  const [editResponsable, setEditResponsable] = useState('');
  const [editStatut, setEditStatut] = useState<'Effectué' | 'En cours' | 'En attente / Planifié'>('Effectué');
  const [editDescription, setEditDescription] = useState('');
  const [editResultat, setEditResultat] = useState('');

  // New Step form state
  const [newDateHeure, setNewDateHeure] = useState(
    new Date().toISOString().slice(0, 16).replace('T', ' ')
  );
  const [newResponsable, setNewResponsable] = useState('Ousmane Fall');
  const [newStatut, setNewStatut] = useState<'Effectué' | 'En cours' | 'En attente / Planifié'>('Effectué');
  const [newDescription, setNewDescription] = useState('');
  const [newResultat, setNewResultat] = useState('');

  if (!equipement) return null;

  const startEditStep = (step: InterventionTimelineStep) => {
    setEditingStepIndex(step.step_index);
    setEditDateHeure(step.date_heure);
    setEditResponsable(step.responsable);
    setEditStatut(step.statut);
    setEditDescription(step.description);
    setEditResultat(step.resultat_obtenu || '');
  };

  const cancelEdit = () => {
    setEditingStepIndex(null);
  };

  const saveEdit = (stepIndex: number) => {
    onUpdateStep(equipement.id, stepIndex, {
      date_heure: editDateHeure,
      responsable: editResponsable,
      statut: editStatut,
      description: editDescription,
      resultat_obtenu: editResultat,
    });
    setEditingStepIndex(null);
  };

  const handleAddNewStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    onAddStep(equipement.id, {
      date_heure: newDateHeure,
      responsable: newResponsable,
      statut: newStatut,
      description: newDescription,
      resultat_obtenu: newResultat,
    });

    setNewDescription('');
    setNewResultat('');
    setNewDateHeure(new Date().toISOString().slice(0, 16).replace('T', ' '));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Fiche de Vie 360° — ${equipement.code_reception}`}
      subtitle={`${equipement.designation} (${equipement.client_nom})`}
      badge={<Badge status={equipement.statut}>{equipement.statut}</Badge>}
      width="max-w-3xl"
    >
      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Pôle CST</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{equipement.pole}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">N° de Série</div>
          <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">{equipement.num_serie}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Date Réception</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{formatDateFR(equipement.date_entree)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Technicien Référent</div>
          <div className="text-xs font-bold text-ts-blue mt-0.5">{equipement.technicien_responsable}</div>
        </div>
      </div>

      {/* 2. Anomalie & Devis FRB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Anomalie & Motif de Réception
          </div>
          <p className="text-xs text-amber-900">{equipement.anomalie_signalee}</p>
        </div>

        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
              <FileText className="w-4 h-4 text-blue-600" />
              Devis FRB / Facturation
            </div>
            <Badge frb={equipement.devis_frb_statut}>{equipement.devis_frb_statut}</Badge>
          </div>
          <div className="text-base font-black text-blue-950 mt-1">
            {formatFCFA(equipement.montant_frb)}
          </div>
        </div>
      </div>

      {/* 3. Chronologie des Interventions (Timeline) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-ts-blue" />
            Chronologie & Traçabilité des Interventions ({equipement.timeline?.length || 0})
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Suivi technique CST certifié</span>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {equipement.timeline && equipement.timeline.length > 0 ? (
            equipement.timeline.map((step) => {
              const isEditing = editingStepIndex === step.step_index;

              if (isEditing) {
                return (
                  <div
                    key={step.step_index}
                    className="p-4 bg-blue-50/80 border-2 border-ts-blue rounded-xl space-y-3 animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ts-blue">
                        ✏️ Modification de l&apos;Étape #{step.step_index}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <DatePicker
                        label="Date & Heure"
                        enableTime
                        value={editDateHeure}
                        onChange={setEditDateHeure}
                      />

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Responsable
                        </label>
                        <select
                          value={editResponsable}
                          onChange={(e) => setEditResponsable(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                        >
                          {personnelList.map((p) => (
                            <option key={p.id} value={p.nom}>
                              {p.nom} ({p.pole})
                            </option>
                          ))}
                          <option value="Atelier Usinage">Atelier Usinage Externe</option>
                          <option value="Contrôle Qualité">Contrôle Qualité</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
                        <select
                          value={editStatut}
                          onChange={(e) => setEditStatut(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                        >
                          <option value="Effectué">Effectué</option>
                          <option value="En cours">En cours</option>
                          <option value="En attente / Planifié">En attente / Planifié</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Description de l&apos;intervention
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Résultat obtenu / Observation
                      </label>
                      <input
                        type="text"
                        value={editResultat}
                        onChange={(e) => setEditResultat(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Save className="w-3.5 h-3.5" />}
                        onClick={() => saveEdit(step.step_index)}
                      >
                        ✓ Valider la modification
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.step_index}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-ts-blue-light text-ts-blue font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-ts-blue/20">
                      {step.step_index}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{step.responsable}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-slate-100 text-slate-600">
                          {step.date_heure}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                            step.statut === 'Effectué'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : step.statut === 'En cours'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {step.statut}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{step.description}</p>
                      {step.resultat_obtenu && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[11px] font-medium mt-1">
                          <span>🎯 Résultat :</span>
                          <span>{step.resultat_obtenu}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditStep(step)}
                      title="Modifier cette intervention"
                      className="p-1.5 text-slate-400 hover:text-ts-blue hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Aucune étape enregistrée pour le moment.</p>
          )}
        </div>

        {/* 4. Formulaire d'ajout d'une nouvelle étape */}
        <form
          onSubmit={handleAddNewStep}
          className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl space-y-3"
        >
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-ts-green" />
            Ajouter une Nouvelle Étape d&apos;Intervention
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePicker
              label="Date & Heure"
              enableTime
              value={newDateHeure}
              onChange={setNewDateHeure}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsable <span className="text-rose-500">*</span>
              </label>
              <select
                value={newResponsable}
                onChange={(e) => setNewResponsable(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                {personnelList.map((p) => (
                  <option key={p.id} value={p.nom}>
                    {p.nom} ({p.pole})
                  </option>
                ))}
                <option value="Atelier Usinage">Atelier Usinage Externe</option>
                <option value="Contrôle Qualité">Contrôle Qualité</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
              <select
                value={newStatut}
                onChange={(e) => setNewStatut(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="Effectué">Effectué</option>
                <option value="En cours">En cours</option>
                <option value="En attente / Planifié">En attente / Planifié</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description de l&apos;action <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Ex: Remplacement électrovanne et purge circuit..."
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Résultat obtenu / Observation
              </label>
              <input
                type="text"
                value={newResultat}
                onChange={(e) => setNewResultat(e.target.value)}
                placeholder="Ex: Test validé sous 200 bars conforme"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />} type="submit">
              + Ajouter l&apos;Étape à la Fiche de Vie
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};
