# SAMA CST — Technologies Services

Application web complète de **GMAO (Gestion de Maintenance Assistée par Ordinateur)** et de **Supervision Opérationnelle** conçue pour **Technologies Services (TS)**.

---

## 🎯 Ce que fait l'application

1. **Traçabilité des Réceptions & Sorties d'Atelier** : Enregistrement rigoureux de chaque entrée d'équipement avec code unique (`EQ-AT-XXXX`), assignation technique, motif de panne et suivi des délais d'immobilisation.
2. **Fiche de Vie 360° de l'Équipement** : Historique chronologique complet (diagnostic, devis, attente pièces, commande, usinage, banc d'essai, contrôle qualité, livraison).
3. **Pilotage de la Performance & des Délais** : Analyse en direct des 4 axes de blocage opérationnels, calcul du MTTR (*Mean Time To Repair*) et de la disponibilité globale du parc (**96.4%**).
4. **Gestion Centralisée des Référentiels Métier** :
   - Répertoire complet des clients (avec identifiants fiscaux NINEA & RC).
   - Répertoire du personnel technique et ingénieurs CST avec affectation par pôle.
   - Catalogue des équipements commercialisés et maintenus par Technologies Services.
   - Base de données des sites clients et du parc de machines déployé.

---

## ⚡ Fonctionnalités Clés

- **Supervision & KPIs** : 4 vues métiers (Synthèse Direction, Performance Technique, Risques & Dépendances, Disponibilité du Parc).
- **Atelier GMAO 23 Colonnes** : Tableau exhaustif, filtres instantanés, création/modification d'équipements et export CSV/Excel avec BOM UTF-8.
- **Fiche de Vie 360° coulissante (Drawer)** : Stepper chronologique interactif, ajout/modification d'étapes d'intervention, gestion des pièces de rechange et observations techniques.
- **Base de Données TS** : Double vue interactive (Sites Clients sous contrat & Grille/Tableau du Parc Équipements 24 machines).
- **Référentiel Clients** : 9 colonnes officielles avec NINEA et Registre de Commerce.
- **Personnel CST** : 12 profils d'agents répartis par pôles (`BIOMED`, `IMAG-CHIRG`, `RÉCEPTION & ATELIER`, `BANC D'ESSAI & CONTRÔLE`, `QUALITÉ & MÉTROLOGIE`, `SUPPORT & SAV`).

---

## 📁 Structure du Projet

```
Sama CST/
├── css/
│   └── style.css            # Feuille de style complète (Charte Technologies Services)
├── js/
│   ├── app.js               # Logique applicative (navigation, modales, drawer, CRUD, filtres)
│   ├── charts.js            # Graphiques Chart.js (Rotation, MTTR, Pôles)
│   └── data.js              # Données de référence et état initial
├── vendor/
│   └── flatpickr/           # Sélecteurs de date/heure dynamiques
├── index.html               # Application Web Standalone complète
├── package.json             # Configuration et scripts de lancement
└── README.md
```

---

## 🎨 Charte Graphique Technologies Services

- 🟢 **Vert Vif TS** : `#72C100` (Validation, statuts fonctionnels, badges actifs)
- 🔵 **Bleu Foncé TS** : `#2E5090` (Boutons d'action, sélections actives)
- 🌑 **Bleu Navy TS** : `#16243D` & `#111D31` (Sidebar, en-têtes de prestige)

---

## 🚀 Démarrage Rapide

### Option 1 : Ouvrir directement dans le navigateur
Double-cliquez simplement sur `index.html`.

### Option 2 : Serveur local
```bash
# Avec Node.js :
npm start

# Ou avec Python :
python3 -m http.server 3000
```
Puis ouvrez [http://localhost:3000](http://localhost:3000).
