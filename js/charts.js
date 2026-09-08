// ==========================================================================
// PLATEFORME SAMA CST - MOTEUR DE GRAPHIQUES INTERACTIFS (CHARTS ENGINE)
// Charte Graphique Officielle : TECHNOLOGIES SERVICES
// - 🟢 Vert vif : Pantone 368 C (#72C100)
// - 🔵 Bleu foncé : Pantone 7684 C (#2E5090)
// ==========================================================================

const SAMA_CHARTS = {
  // 1. Initialisation de la Jauge SVG de Disponibilité (Synthèse Direction)
  renderAvailabilityGauge(containerId, value = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Calcul de la valeur dynamique si non passée
    if (value === null || value === undefined) {
      const parc = (window.SAMA_DATA && window.SAMA_DATA.parcEquipementsTS) || [];
      if (parc.length > 0) {
        const sum = parc.reduce((acc, p) => acc + (parseFloat(p.tauxDisponibilite || p.disponibilite) || 98.5), 0);
        value = parseFloat((sum / parc.length).toFixed(1));
      } else {
        value = 98.5;
      }
    }

    // Calcul de l'arc (semi-cercle de 180 degrés)
    const radius = 90;
    const circumference = Math.PI * radius; // ~282.74
    const percentage = Math.min(Math.max(value, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - percentage);

    // Détermination de la couleur selon le palier TS
    let strokeColor = "#72C100"; // Vert vif TS (>95%)
    let statusLabel = "Excellente (Objectif > 95% atteint)";
    if (value < 90) {
      strokeColor = "#EF4444"; // Rouge
      statusLabel = "Critique (< 90%)";
    } else if (value < 95) {
      strokeColor = "#F59E0B"; // Jaune/Orange
      statusLabel = "Vigilance (90% - 95%)";
    }

    container.innerHTML = `
      <div class="gauge-wrapper">
        <svg class="gauge-svg" viewBox="0 0 220 125">
          <!-- Dégradé dynamique Technologies Services -->
          <defs>
            <linearGradient id="gaugeGradTS" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#2E5090" />
              <stop offset="55%" stop-color="#4E7EB5" />
              <stop offset="100%" stop-color="${strokeColor}" />
            </linearGradient>
            <filter id="gaugeShadowTS" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${strokeColor}" flood-opacity="0.35"/>
            </filter>
          </defs>
          <!-- Chemin de fond -->
          <path class="gauge-bg-path" d="M 20 110 A 90 90 0 0 1 200 110" />
          <!-- Chemin de progression -->
          <path class="gauge-fill-path" d="M 20 110 A 90 90 0 0 1 200 110"
                stroke="url(#gaugeGradTS)"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
                id="gaugeFillPath"
                filter="url(#gaugeShadowTS)" />
        </svg>
        <div class="gauge-value-display">
          <div class="gauge-number">${value}%</div>
          <div class="gauge-label" style="color: ${strokeColor}">${statusLabel}</div>
        </div>
        <div class="gauge-scale">
          <span>0%</span>
          <span style="color: #2E5090; font-weight: 800;">SLA 95%</span>
          <span>100%</span>
        </div>
      </div>
    `;

    // Animation de remplissage fluide
    setTimeout(() => {
      const fillPath = document.getElementById("gaugeFillPath");
      if (fillPath) {
        fillPath.style.strokeDashoffset = strokeDashoffset;
      }
    }, 100);
  },

  // 2. Histogramme MTTR (Technologies Services Bleu & Vert)
  renderMTTRChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.Chart) {
      if (ctx._chartInstance) {
        ctx._chartInstance.destroy();
      }

      const labels = ["Avril", "Mai", "Juin", "Juillet", "Août", "Septembre"];
      const mttrReel = [4.6, 4.3, 4.1, 4.0, 3.9, 3.8];
      const objectifSLA = [4.0, 4.0, 4.0, 4.0, 4.0, 4.0];

      ctx._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'Cible SLA (4.0 hrs)',
              data: objectifSLA,
              borderColor: '#EF4444',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              order: 1
            },
            {
              type: 'bar',
              label: 'MTTR Réel (heures)',
              data: mttrReel,
              backgroundColor: function (context) {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return '#2E5090';
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, '#2E5090');
                gradient.addColorStop(1, '#72C100');
                return gradient;
              },
              borderRadius: 6,
              barThickness: 28,
              order: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                font: { family: 'Inter', size: 11, weight: 700 },
                color: '#64748B'
              }
            },
            tooltip: {
              backgroundColor: '#16243D',
              titleFont: { family: 'Inter', size: 12, weight: 700 },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 10,
              cornerRadius: 8,
              borderColor: '#72C100',
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  return ` ${context.dataset.label}: ${context.raw} hrs`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Inter', size: 11, weight: 600 }, color: '#64748B' }
            },
            y: {
              beginAtZero: true,
              max: 6,
              grid: { color: '#F1F5F9' },
              ticks: {
                font: { family: 'Inter', size: 11 },
                color: '#64748B',
                callback: function (val) { return val + ' h'; }
              }
            }
          }
        }
      });
    }
  },

  // 3. Donut Répartition par Marques (Calcul Dynamique depuis parcEquipementsTS)
  renderBrandsDonut(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.Chart) {
      if (ctx._chartInstance) ctx._chartInstance.destroy();

      const parc = (window.SAMA_DATA && window.SAMA_DATA.parcEquipementsTS) || [];
      const brandCounts = {};
      parc.forEach(p => {
        const brand = (p.fournisseur || 'Technologies Services').trim();
        if (brand && brand !== '-') {
          brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        }
      });

      const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);
      const total = parc.length || 1;
      
      let labels = [];
      let data = [];
      if (sortedBrands.length > 0) {
        const top5 = sortedBrands.slice(0, 5);
        const othersCount = sortedBrands.slice(5).reduce((acc, curr) => acc + curr[1], 0);
        
        labels = top5.map(b => b[0]);
        data = top5.map(b => Math.round((b[1] / total) * 100));
        
        if (othersCount > 0) {
          labels.push('Autres');
          data.push(Math.round((othersCount / total) * 100));
        }
      } else {
        labels = ["BIOSYSTEMS", "SIEMENS", "GE HEALTHCARE", "PHILIPS", "EDAN", "Autres"];
        data = [28, 22, 18, 14, 10, 8];
      }

      ctx._chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ["#2E5090", "#72C100", "#0284C7", "#F59E0B", "#8B5CF6", "#64748B"],
            borderWidth: 3,
            borderColor: '#FFFFFF',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                font: { family: 'Inter', size: 11, weight: 600 },
                color: '#16243D',
                padding: 10
              }
            },
            tooltip: {
              backgroundColor: '#16243D',
              padding: 10,
              cornerRadius: 8,
              borderColor: '#72C100',
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  return ` ${context.label}: ${context.raw}% du parc`;
                }
              }
            }
          }
        }
      });
    }
  },

  // 4. Performance Technique : Taux de Clôture (Vert Vif TS)
  renderTechPerformanceChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.Chart) {
      if (ctx._chartInstance) ctx._chartInstance.destroy();

      ctx._chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["Avr", "Mai", "Juin", "Juil", "Août", "Sept"],
          datasets: [
            {
              label: 'Taux de Clôture dans les Délais (%)',
              data: [84.2, 87.5, 89.1, 91.8, 93.4, 94.2],
              borderColor: '#72C100',
              backgroundColor: 'rgba(114, 193, 0, 0.12)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#72C100',
              pointBorderColor: '#FFFFFF',
              pointBorderWidth: 2
            },
            {
              label: 'Cible Contractuelle (90%)',
              data: [90, 90, 90, 90, 90, 90],
              borderColor: '#2E5090',
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: { boxWidth: 12, font: { family: 'Inter', size: 11, weight: 700 } }
            },
            tooltip: {
              backgroundColor: '#16243D',
              borderColor: '#72C100',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8
            }
          },
          scales: {
            y: {
              min: 75,
              max: 100,
              ticks: { callback: function (v) { return v + '%'; } }
            }
          }
        }
      });
    }
  },

  // 5. Risques & Dépendances : Donut Couverture des Contrats (Dynamique)
  renderContractsDonut(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.Chart) {
      if (ctx._chartInstance) ctx._chartInstance.destroy();

      const sites = (window.SAMA_DATA && window.SAMA_DATA.sitesTS) || [];
      let p247 = 0, gold = 0, std = 0, gar = 0;
      
      if (sites.length > 0) {
        sites.forEach(s => {
          const c = (s.contrat || '').toLowerCase();
          if (c.includes('24/7') || c.includes('platinum')) p247++;
          else if (c.includes('gold')) gold++;
          else if (c.includes('garantie')) gar++;
          else std++;
        });
      } else {
        p247 = 45; gold = 35; std = 15; gar = 5;
      }

      ctx._chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Contrat Platinum 24/7", "Contrat Maintenance Gold", "Contrat Standard TS", "Garantie Constructeur"],
          datasets: [{
            data: [p247, gold, std, gar],
            backgroundColor: ["#2E5090", "#72C100", "#0284C7", "#F59E0B"],
            borderWidth: 3,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { family: 'Inter', size: 11, weight: 600 }, padding: 10 }
            },
            tooltip: {
              backgroundColor: '#16243D',
              borderColor: '#2E5090',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8
            }
          }
        }
      });
    }
  },

  // 6. Disponibilité Parc : Donut État Global du Parc (Dynamique)
  renderFleetStatusDonut(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (window.Chart) {
      if (ctx._chartInstance) ctx._chartInstance.destroy();

      const parcTotal = (window.SAMA_DATA && window.SAMA_DATA.parcEquipementsTS && window.SAMA_DATA.parcEquipementsTS.length) || 2883;
      const inAtelier = (window.SAMA_DATA && window.SAMA_DATA.equipementsAtelier && window.SAMA_DATA.equipementsAtelier.filter(e => {
        const isClosed = e.statut === 'CLÔTURE' || e.statut === 'CLÔTURÉ' || (e.dateSortie && e.dateSortie !== '-' && e.dateSortie.trim() !== '');
        return !isClosed;
      }).length) || 0;
      const preventif = 43;
      const nominal = Math.max(0, parcTotal - inAtelier - preventif);

      ctx._chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["En Service (Nominal)", "Maintenance Préventive", "Immobilisés en Atelier"],
          datasets: [{
            data: [nominal, preventif, inAtelier],
            backgroundColor: ["#72C100", "#0284C7", "#EF4444"],
            borderWidth: 3,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, font: { family: 'Inter', size: 11, weight: 600 }, padding: 10 }
            },
            tooltip: {
              backgroundColor: '#16243D',
              borderColor: '#72C100',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return ` ${context.label}: ${context.raw.toLocaleString('fr-FR')} machines`;
                }
              }
            }
          }
        }
      });
    }
  },

  // Initialisation globale de tous les graphiques actifs
  initAllDashboardCharts() {
    this.renderAvailabilityGauge('gauge-dispo-container');
    this.renderMTTRChart('chart-mttr');
    this.renderBrandsDonut('chart-brands');
    this.renderTechPerformanceChart('chart-tech-closure');
    this.renderContractsDonut('chart-contracts-coverage');
    this.renderFleetStatusDonut('chart-fleet-status');
  }
};
