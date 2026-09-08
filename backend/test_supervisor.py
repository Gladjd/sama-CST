#!/usr/bin/env python3
"""
Tests unitaires pour le superviseur GMAO Antigravity (Sama CST)
"""

import unittest
from gmao_supervisor import (
    AntigravityGMAOSupervisor,
    EquipementAtelier,
    CriticiteAlerte
)


class TestAntigravityGMAOSupervisor(unittest.TestCase):

    def setUp(self):
        self.supervisor = AntigravityGMAOSupervisor(
            seuil_alerte_rouge_jours=30,
            seuil_alerte_orange_jours=15
        )
        self.sample_data = [
            EquipementAtelier(
                code_equipement="EQ-001",
                client="Hôpital Fann",
                pole="BIOMED",
                date_entree="2026-06-01",
                date_sortie="2026-06-15",
                motif_panne="Étalonnage",
                situation="Clôturé",
                statut="CLÔTURE",
                jours_atelier=14,
                montant_frb=300000.0
            ),
            EquipementAtelier(
                code_equipement="EQ-002",
                client="Hôpital Aristide Le Dantec",
                pole="IMAG-CHIRG",
                date_entree="2026-07-01",
                motif_panne="Tube HS",
                situation="Attente pièces détachées",
                statut="DEPENDANT",
                jours_atelier=35,
                montant_frb=5000000.0
            ),
            EquipementAtelier(
                code_equipement="EQ-003",
                client="Clinique Madeleine",
                pole="BIOMED",
                date_entree="2026-07-20",
                motif_panne="Carte électronique",
                situation="Attente Devis FRB",
                statut="DEPENDANT",
                jours_atelier=18,
                montant_frb=900000.0
            )
        ]

    def test_calcul_mttr(self):
        clotures = [eq for eq in self.sample_data if eq.statut == "CLÔTURE"]
        mttr = self.supervisor.calculer_mttr(clotures)
        self.assertEqual(mttr, 14.0)

    def test_detection_alertes_critiques(self):
        report = self.supervisor.evaluer_etat_parc(self.sample_data, taille_parc_total=2883)
        self.assertEqual(report.alertes_critiques_count, 1)
        self.assertEqual(report.alertes[0].code_equipement, "EQ-002")
        self.assertEqual(report.alertes[0].criticite, CriticiteAlerte.CRITIQUE)
        self.assertEqual(report.alertes[1].code_equipement, "EQ-003")
        self.assertEqual(report.alertes[1].criticite, CriticiteAlerte.ATTENTION)

    def test_disponibilite_globale(self):
        report = self.supervisor.evaluer_etat_parc(self.sample_data, taille_parc_total=2883)
        # 2 machines en atelier sur 2883 -> (2881 / 2883) * 100 = 99.93%
        self.assertGreater(report.disponibilite_globale_estimee, 99.0)
        self.assertEqual(report.total_en_atelier, 2)
        self.assertEqual(report.total_clotures, 1)

    def test_cout_total_frb(self):
        report = self.supervisor.evaluer_etat_parc(self.sample_data, taille_parc_total=2883)
        self.assertEqual(report.cout_total_frb_fcfa, 6200000.0)


if __name__ == "__main__":
    unittest.main()
