// ==============================================================================
// UTILITAIRES & SÉCURITÉ — SAMA CST (TECHNOLOGIES SERVICES)
// ==============================================================================

window.SamaUtils = {
  /**
   * Échappe les caractères spéciaux HTML pour prévenir les injections XSS
   * @param {any} str - Valeur à sécuriser
   * @returns {string} Chaîne sécurisée
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Debounce une fonction pour limiter la fréquence d'exécution
   * @param {Function} func - Fonction à exécuter
   * @param {number} wait - Délai d'attente en millisecondes
   * @returns {Function}
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle une fonction pour garantir une exécution max par intervalle
   * @param {Function} func - Fonction à exécuter
   * @param {number} limit - Intervalle minimum en ms
   * @returns {Function}
   */
  throttle(func, limit = 200) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Formate un montant en devise FCFA
   * @param {number|string} amount 
   * @returns {string} Ex: "1 250 000 FCFA"
   */
  formatMoney(amount) {
    const num = parseFloat(String(amount).replace(/[^0-9.-]/g, '')) || 0;
    return `${num.toLocaleString('fr-FR')} FCFA`;
  },

  /**
   * Nettoie et formate une date ISO ou string vers le format français court
   * @param {string} dateStr 
   * @returns {string} Ex: "15/11/2026"
   */
  formatDateShort(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr === 'N/A') return '-';
    try {
      const cleanStr = String(dateStr).split('T')[0];
      const parts = cleanStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return cleanStr;
    } catch (e) {
      return String(dateStr);
    }
  },

  /**
   * Nettoie les entrées utilisateur pour stockage sécurisé
   * @param {string} input 
   * @returns {string}
   */
  sanitizeText(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
  }
};

// Raccourci global direct
window.escapeHtml = window.SamaUtils.escapeHtml;
window.debounce = window.SamaUtils.debounce;
