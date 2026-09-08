#!/usr/bin/env python3
"""
Sama CST — Module de Supervision Opérationnelle et Prédictive Antigravity
Technologies Services (GMAO Biomédicale & Industrielle)

Auteur: Antigravity Architecture Logicielle
Normes: PEP 8, Type Hints, Dataclasses & Robust Error Handling
"""

import json
import math
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import List, Dict, Any, Optional


class CriticiteAlerte(str, Enum):
    INFO = "INFO"
    ATTENTION = "ATTENTION_ORANGE"
    CRITIQUE = "CRITIQUE_ROUGE"


class PoleOperationnel(str, Enum):
    BIOMED = "BIOMED"
    IMAG_CHIRG = "IMAG-CHIRG"
    INDUSTRIE = "INDUSTRIE"


@dataclass
class PieceRechange:
    reference: str
    designation: str
    quantite: int = 1
    prix_unitaire: float = 0.0
    statut_commande: str = "Livrée"


@dataclass
class EtapeIntervention:
    titre: str
    date_etape: str
    responsable: str
    statut: str  # done, in-progress, pending
    observation: str = ""
    resultat_obtenu: str = ""


@dataclass
class EquipementAtelier:
    code_equipement: str
    client: str
    pole: str
    date_entree: str
    motif_panne: str
    situation: str
    statut: str  # CLÔTURE ou DEPENDANT
    jours_atelier: int = 0
    date_sortie: Optional[str] = None
    montant_frb: float = 0.0
    pieces: List[PieceRechange] = field(default_factory=list)
    timeline: List[EtapeIntervention] = field(default_factory=list)


@dataclass
class AlerteGMAO:
    code_equipement: str
    client: str
    pole: str
    criticite: CriticiteAlerte
    jours_immobilisation: int
    motif_alerte: str
    recommandation_antigravity: str
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class RapportSupervisionGMAO:
    parc_total_surveille: int
    total_en_atelier: int
    total_clotures: int
    disponibilite_globale_estimee: float
    mttr_moyen_jours: float
    mttr_biomed_jours: float
    mttr_imag_chirg_jours: float
    cout_total_frb_fcfa: float
    alertes_critiques_count: int
    alertes: List[AlerteGMAO]
    repartition_blocages: Dict[str, int]
    generated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=indent)


class AntigravityGMAOSupervisor:
    """
    Moteur d'Audit Opérationnel & Analyse Prédictive GMAO Sama CST.
    Détecte les dérives de SLA, calcule le MTTR exact et prévient les blocages atelier.
    """

    def __init__(self, seuil_alerte_rouge_jours: int = 30, seuil_alerte_orange_jours: int = 15):
        self.seuil_rouge = seuil_alerte_rouge_jours
        self.seuil_orange = seuil_alerte_orange_jours

    def calculer_mttr(self, dossier_clotures: List[EquipementAtelier]) -> float:
        """Calcule le Mean Time To Repair (MTTR) moyen en jours."""
        if not dossier_clotures:
            return 0.0
        total_jours = sum(max(1, eq.jours_atelier) for eq in dossier_clotures)
        return round(total_jours / len(dossier_clotures), 1)

    def evaluer_etat_parc(
        self,
        equipements_atelier: List[EquipementAtelier],
        taille_parc_total: int = 2883
    ) -> RapportSupervisionGMAO:
        """
        Analyse l'ensemble des dossiers ateliers et produit un rapport d'audit 360°.
        """
        en_atelier = [eq for eq in equipements_atelier if eq.statut != "CLÔTURE"]
        clotures = [eq for eq in equipements_atelier if eq.statut == "CLÔTURE"]

        # 1. Calculs MTTR Globaux et par Pôles
        mttr_global = self.calculer_mttr(clotures)
        clotures_biomed = [eq for eq in clotures if eq.pole.upper() == "BIOMED"]
        clotures_imag = [eq for eq in clotures if eq.pole.upper() == "IMAG-CHIRG"]
        mttr_biomed = self.calculer_mttr(clotures_biomed)
        mttr_imag = self.calculer_mttr(clotures_imag)

        # 2. Disponibilité globale estimée
        machines_arretees = len(en_atelier)
        dispo = round(((taille_parc_total - machines_arretees) / max(1, taille_parc_total)) * 100, 2)

        # 3. Coût total FRB
        cout_total = sum(eq.montant_frb for eq in equipements_atelier)

        # 4. Détection des 4 axes de blocage atelier
        blocages = {
            "Attente Pièces": 0,
            "Devis / FRB": 0,
            "Validation Client": 0,
            "Contrôle Banc d'Essai": 0
        }

        # 5. Détection des Alertes Prédictives
        alertes: List[AlerteGMAO] = []

        for eq in en_atelier:
            sit = eq.situation.lower()
            if "pièce" in sit or "pieces" in sit:
                blocages["Attente Pièces"] += 1
            elif "frb" in sit or "devis" in sit:
                blocages["Devis / FRB"] += 1
            elif "accord" in sit or "client" in sit or "validation" in sit:
                blocages["Validation Client"] += 1
            elif "banc" in sit or "essai" in sit or "contrôle" in sit:
                blocages["Contrôle Banc d'Essai"] += 1

            # Règle d'Alerte Rouge : > 30 jours
            if eq.jours_atelier >= self.seuil_rouge:
                alertes.append(AlerteGMAO(
                    code_equipement=eq.code_equipement,
                    client=eq.client,
                    pole=eq.pole,
                    criticite=CriticiteAlerte.CRITIQUE,
                    jours_immobilisation=eq.jours_atelier,
                    motif_alerte=f"Immobilisation critique ({eq.jours_atelier} jours) — Panne : {eq.motif_panne}",
                    recommandation_antigravity=(
                        f"Action Prioritaire Niveau 1 : Déclencher réunion d'escalade avec la direction de {eq.client}. "
                        "Mettre à disposition un équipement de courtoisie TS en urgence."
                    )
                ))
            # Règle d'Alerte Orange : > 15 jours
            elif eq.jours_atelier >= self.seuil_orange:
                alertes.append(AlerteGMAO(
                    code_equipement=eq.code_equipement,
                    client=eq.client,
                    pole=eq.pole,
                    criticite=CriticiteAlerte.ATTENTION,
                    jours_immobilisation=eq.jours_atelier,
                    motif_alerte=f"Délai d'atelier prolongé ({eq.jours_atelier} jours) — Statut : {eq.situation}",
                    recommandation_antigravity=(
                        "Relancer le fournisseur pour l'expédition express des composants ou accélérer les tests banc d'essai."
                    )
                ))

        # Tri des alertes par gravité puis par jours décroissants
        alertes.sort(key=lambda a: (0 if a.criticite == CriticiteAlerte.CRITIQUE else 1, -a.jours_immobilisation))

        return RapportSupervisionGMAO(
            parc_total_surveille=taille_parc_total,
            total_en_atelier=len(en_atelier),
            total_clotures=len(clotures),
            disponibilite_globale_estimee=dispo,
            mttr_moyen_jours=mttr_global,
            mttr_biomed_jours=mttr_biomed,
            mttr_imag_chirg_jours=mttr_imag,
            cout_total_frb_fcfa=cout_total,
            alertes_critiques_count=len([a for a in alertes if a.criticite == CriticiteAlerte.CRITIQUE]),
            alertes=alertes,
            repartition_blocages=blocages
        )


if __name__ == "__main__":
    # Test démonstrateur autonome
    sample_atelier = [
        EquipementAtelier(
            code_equipement="EQ-CAT-320D-01",
            client="Compagnie Minière Sabodala Gold",
            pole="INDUSTRIE",
            date_entree="2026-07-10",
            date_sortie="2026-07-28",
            motif_panne="Fuite pompe hydraulique",
            situation="Clôturé",
            statut="CLÔTURE",
            jours_atelier=18,
            montant_frb=4500000.0
        ),
        EquipementAtelier(
            code_equipement="EQ-SIE-CT64-01",
            client="Hôpital Principal de Dakar",
            pole="IMAG-CHIRG",
            date_entree="2026-08-01",
            motif_panne="Défaillance tube à rayons X",
            situation="Attente pièces détachées",
            statut="DEPENDANT",
            jours_atelier=38,
            montant_frb=12800000.0
        ),
        EquipementAtelier(
            code_equipement="EQ-GE-CARE-01",
            client="Clinique de la Madeleine",
            pole="BIOMED",
            date_entree="2026-08-20",
            motif_panne="Erreur capteur pression O2",
            situation="En cours de diagnostic",
            statut="DEPENDANT",
            jours_atelier=19,
            montant_frb=850000.0
        )
    ]

    supervisor = AntigravityGMAOSupervisor()
    report = supervisor.evaluer_etat_parc(sample_atelier, taille_parc_total=2883)
    print("=== RAPPORT D'AUDIT GMAO ANTIGRAVITY SAMA CST ===")
    print(report.to_json(indent=2))
