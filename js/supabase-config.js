// ==============================================================================
// CONFIGURATION DE LA CONNEXION SUPABASE — SAMA CST
// Technologies Services
// ==============================================================================

window.SUPABASE_CONFIG = {
  // Identifiants par défaut du projet Supabase Sama CST
  url: localStorage.getItem('sama_supabase_url') || 'https://cqvrbckpjrgnqsetejye.supabase.co',
  anonKey: localStorage.getItem('sama_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdnJiY2twanJnbnFzZXRlanllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MDk1NzMsImV4cCI6MjEwNDE4NTU3M30.5Z4R4IPfybRvRgrvQywu8VSwF9G74I9GMBswdcbzPs0',
  
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
