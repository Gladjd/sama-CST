// ==============================================================================
// CONFIGURATION DE LA CONNEXION SUPABASE — SAMA CST
// Technologies Services
// ==============================================================================

window.SUPABASE_CONFIG = {
  // Vous pouvez renseigner directement vos identifiants ci-dessous,
  // ou utiliser le dialogue de configuration dans l'application.
  url: localStorage.getItem('sama_supabase_url') || '',
  anonKey: localStorage.getItem('sama_supabase_key') || '',
  
  // Sauvegarde des identifiants dans le localStorage
  saveCredentials(url, anonKey) {
    if (url && anonKey) {
      localStorage.setItem('sama_supabase_url', url.trim());
      localStorage.setItem('sama_supabase_key', anonKey.trim());
      this.url = url.trim();
      this.anonKey = anonKey.trim();
      return true;
    }
    return false;
  },
  
  // Effacer la connexion et repasser en mode local pur
  clearCredentials() {
    localStorage.removeItem('sama_supabase_url');
    localStorage.removeItem('sama_supabase_key');
    this.url = '';
    this.anonKey = '';
  },
  
  // Vérifie si la configuration est prête
  isConfigured() {
    return Boolean(this.url && this.anonKey && this.url.startsWith('https://') && this.anonKey.length > 20);
  }
};
