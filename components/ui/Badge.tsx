import React from 'react';
import clsx from 'clsx';
import { WorkshopStatus, PoleType, PriorityType, FrbStatus } from '@/types/database.types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'pole' | 'priority' | 'frb' | 'custom';
  status?: WorkshopStatus | string;
  pole?: PoleType | string;
  priority?: PriorityType | string;
  frb?: FrbStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'custom',
  status,
  pole,
  priority,
  frb,
  className,
}) => {
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status) {
    switch (status) {
      case 'En Diagnostic':
        badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'En Réparation':
        badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'En Attente Pièces':
        badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
      case 'En Contrôle / Banc d\'Essai':
        badgeStyles = 'bg-teal-50 text-teal-700 border-teal-200';
        break;
      case 'Prêt pour Livraison':
        badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Livré / Clôturé':
      case 'En Service':
      case 'Actif':
        badgeStyles = 'bg-green-50 text-green-700 border-green-200';
        break;
      case 'Bloqué / Devis en Attente':
      case 'Arrêt / Panne':
      case 'Suspendu':
        badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'En Atelier CST':
        badgeStyles = 'bg-red-50 text-red-700 border-red-200';
        break;
      case 'En Réserve / Standby':
      case 'En Audit':
        badgeStyles = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
    }
  } else if (pole) {
    switch (pole) {
      case 'BIOMED':
        badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'IMAG-CHIRG':
        badgeStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
      case 'RÉCEPTION & ATELIER':
        badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'BANC D\'ESSAI & CONTRÔLE':
        badgeStyles = 'bg-cyan-50 text-cyan-700 border-cyan-200';
        break;
      case 'QUALITÉ & MÉTROLOGIE':
        badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
      case 'SUPPORT & SAV':
        badgeStyles = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'Urgente':
        badgeStyles = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
        break;
      case 'Haute':
        badgeStyles = 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
        break;
      case 'Moyenne':
        badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'Basse':
        badgeStyles = 'bg-slate-50 text-slate-600 border-slate-200';
        break;
    }
  } else if (frb) {
    switch (frb) {
      case 'Validé par Client':
        badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'En Attente Validation Client':
        badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Refusé':
        badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      default:
        badgeStyles = 'bg-slate-50 text-slate-500 border-slate-200';
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        badgeStyles,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};
