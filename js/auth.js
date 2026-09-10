// ==============================================================================
// GESTIONNAIRE D'AUTHENTIFICATION & PROFILS UTILISATEURS — SAMA CST
// Technologies Services (GMAO & Supervision Opérationnelle)
// ==============================================================================

window.AUTH = {
  // Profils de démonstration préconfigurés Technologies Services
  DEMO_PROFILES: {
    superviseur: {
      id: 'usr-superviseur',
      nom: 'Glad MOUKOUIRI',
      initials: 'GM',
      email: 'g.moukouiri@technologies-services.sn',
      role: 'superviseur',
      roleLabel: 'Superviseur Technologies Services',
      pole: 'DIRECTION & SUPERVISION CST',
      telephone: '+221 77 100 20 30',
      badgeColor: '#72C100',
      badgeClass: 'green',
      icon: '👑',
      description: 'Supervision globale, validation des devis FRB & pilotage des KPIs'
    },
    biomed: {
      id: 'usr-biomed',
      nom: 'Ousmane Fall',
      initials: 'OF',
      email: 'o.fall@technologies-services.sn',
      role: 'technicien',
      roleLabel: 'Ingénieur Biomédical Senior',
      pole: 'BIOMED',
      telephone: '+221 77 123 45 67',
      badgeColor: '#2E5090',
      badgeClass: 'blue',
      icon: '🩺',
      description: 'Prise en charge des respirateurs, moniteurs & autoclaves'
    },
    imagerie: {
      id: 'usr-imagerie',
      nom: 'Moussa Diakhaté',
      initials: 'MD',
      email: 'm.diakhate@technologies-services.sn',
      role: 'technicien',
      roleLabel: 'Ingénieur Imagerie & Bloc',
      pole: 'IMAG-CHIRG',
      telephone: '+221 77 345 67 89',
      badgeColor: '#8B5CF6',
      badgeClass: 'purple',
      icon: '🔬',
      description: 'Scanners, IRM, tables radiologiques & colonnes de cœlioscopie'
    },
    admin: {
      id: 'usr-admin',
      nom: 'Administration TS',
      initials: 'AD',
      email: 'admin@technologies-services.sn',
      role: 'admin',
      roleLabel: 'Administrateur GMAO & Système',
      pole: 'SUPPORT & INFRASTRUCTURE',
      telephone: '+221 33 800 00 00',
      badgeColor: '#F59E0B',
      badgeClass: 'amber',
      icon: '⚡',
      description: 'Gestion des référentiels, exports de données & configuration'
    },
    client: {
      id: 'usr-client',
      nom: 'Dr. Cheikh Tidiane Diop',
      initials: 'CD',
      email: 'contact@hpd.sn',
      role: 'client',
      roleLabel: 'Client Référent (Hôpital Principal)',
      pole: 'CLIENT PARTENAIRE',
      telephone: '+221 33 839 50 50',
      badgeColor: '#0EA5E9',
      badgeClass: 'cyan',
      icon: '🏥',
      description: 'Suivi des équipements hospitaliers & demandes d\'intervention'
    }
  },

  currentUser: null,
  isMenuOpen: false,

  // Initialisation de la session
  async init() {
    // 1. Récupération de la session stockée UNIQUEMENT si l'utilisateur s'est déjà connecté sur CE navigateur
    const savedUser = localStorage.getItem('sama_current_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
        localStorage.removeItem('sama_current_user');
      }
    } else {
      // ⚠️ Nouveau visiteur / collègue : Session nulle par défaut ! Ne JAMAIS forcer Glad MOUKOUIRI.
      this.currentUser = null;
    }

    // 2. Écoute de la session Supabase Auth si le client est prêt
    if (window.supabaseSync && window.supabaseSync.client) {
      this.bindSupabaseAuth(window.supabaseSync.client);
    }

    // 3. Mise à jour de l'interface
    this.updateUserUI();
    this.bindClickOutside();

    // 4. Si aucun utilisateur n'est connecté à l'ouverture, afficher le portail d'accueil après un court délai
    if (!this.currentUser) {
      setTimeout(() => {
        // N'ouvre la modale que si elle n'est pas déjà ouverte
        const modal = document.getElementById('modal-auth-login');
        if (modal && !modal.classList.contains('active')) {
          this.openLoginModal('demo');
        }
      }, 350);
    }
  },

  // Connexion avec les événements Supabase Auth
  bindSupabaseAuth(client) {
    if (!client || !client.auth) return;

    // Récupérer la session active Supabase
    client.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        this.syncSupabaseUser(session.user);
      }
    }).catch(e => console.warn('Supabase getSession notice:', e));

    // Écouter les changements d'état (connexion/déconnexion)
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && session.user) {
        this.syncSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('ℹ️ Déconnexion Supabase Auth');
      }
    });
  },

  // Synchronise un utilisateur Supabase Auth avec le profil local
  async syncSupabaseUser(user) {
    if (!user) return;
    const email = user.email || '';
    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || metadata.nom || email.split('@')[0];
    
    // Calcul des initiales
    const parts = fullName.trim().split(' ');
    const initials = parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : fullName.substring(0, 2).toUpperCase();

    this.currentUser = {
      id: user.id,
      nom: fullName,
      initials: initials,
      email: email,
      role: metadata.role || 'superviseur',
      roleLabel: metadata.roleLabel || (metadata.role === 'admin' ? 'Administrateur GMAO' : 'Superviseur Technologies Services'),
      pole: metadata.pole || 'DIRECTION & SUPERVISION CST',
      telephone: metadata.telephone || '+221 77 100 20 30',
      badgeColor: '#72C100',
      isAuthenticated: true
    };

    this.saveCurrentSession();
    this.updateUserUI();
  },

  // Sauvegarde la session dans le localStorage
  saveCurrentSession() {
    if (this.currentUser) {
      localStorage.setItem('sama_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('sama_current_user');
    }
  },

  // Met à jour les éléments visuels de profil dans le DOM
  updateUserUI() {
    const avatarEl = document.getElementById('user-sidebar-avatar');
    const nameEl = document.getElementById('user-sidebar-name');
    const roleEl = document.getElementById('user-sidebar-role');
    const statusDot = document.getElementById('user-sidebar-status-dot');
    const footerContainer = document.getElementById('sidebar-user-footer');

    if (this.currentUser) {
      // Utilisateur connecté
      if (avatarEl) {
        avatarEl.textContent = this.currentUser.initials || 'TS';
        avatarEl.style.background = this.currentUser.badgeColor || '#72C100';
        avatarEl.title = `${this.currentUser.nom} (${this.currentUser.roleLabel})`;
      }
      if (nameEl) {
        nameEl.textContent = this.currentUser.nom;
        nameEl.style.color = '#FFFFFF';
      }
      if (roleEl) {
        roleEl.textContent = this.currentUser.roleLabel;
      }
      if (statusDot) {
        statusDot.style.background = '#72C100';
        statusDot.title = 'Session active';
      }
      if (footerContainer) {
        footerContainer.classList.add('is-authenticated');
        footerContainer.classList.remove('is-guest');
      }

      // Mettre à jour le popover
      const popName = document.getElementById('pop-user-name');
      const popEmail = document.getElementById('pop-user-email');
      const popRole = document.getElementById('pop-user-role');
      const popAvatar = document.getElementById('pop-user-avatar');
      const popPole = document.getElementById('pop-user-pole');

      if (popName) popName.textContent = this.currentUser.nom;
      if (popEmail) popEmail.textContent = this.currentUser.email;
      if (popRole) popRole.textContent = this.currentUser.roleLabel;
      if (popAvatar) {
        popAvatar.textContent = this.currentUser.initials;
        popAvatar.style.background = this.currentUser.badgeColor || '#72C100';
      }
      if (popPole) popPole.textContent = this.currentUser.pole;
    } else {
      // Visiteur non connecté
      if (avatarEl) {
        avatarEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
        avatarEl.style.background = '#334155';
        avatarEl.title = 'Non connecté - Cliquer pour s\'identifier';
      }
      if (nameEl) {
        nameEl.textContent = 'Non connecté';
        nameEl.style.color = '#94A3B8';
      }
      if (roleEl) {
        roleEl.textContent = 'Cliquer pour s\'identifier';
      }
      if (statusDot) {
        statusDot.style.background = '#94A3B8';
        statusDot.title = 'Aucune session active';
      }
      if (footerContainer) {
        footerContainer.classList.remove('is-authenticated');
        footerContainer.classList.add('is-guest');
      }

      // Mettre à jour le popover pour mode invité
      const popName = document.getElementById('pop-user-name');
      const popEmail = document.getElementById('pop-user-email');
      const popRole = document.getElementById('pop-user-role');
      const popAvatar = document.getElementById('pop-user-avatar');

      if (popName) popName.textContent = 'Mode Visiteur / Non Connecté';
      if (popEmail) popEmail.textContent = 'Accès libre en consultation';
      if (popRole) popRole.textContent = 'Identifiez-vous pour administrer';
      if (popAvatar) {
        popAvatar.innerHTML = '👤';
        popAvatar.style.background = '#475569';
      }
    }

    // Surligner le profil actif dans la liste des démos si ouvert
    this.highlightActiveDemoCard();
  },

  // Surligne la carte démo correspondant au profil actuellement actif
  highlightActiveDemoCard() {
    const currentEmail = this.currentUser ? this.currentUser.email.toLowerCase() : '';
    document.querySelectorAll('.auth-demo-card').forEach(card => {
      const cardKey = card.getAttribute('data-profile-key');
      const profile = this.DEMO_PROFILES[cardKey];
      if (profile && profile.email.toLowerCase() === currentEmail) {
        card.classList.add('active-profile');
      } else {
        card.classList.remove('active-profile');
      }
    });
  },

  // Ouvre / Ferme le menu contextuel utilisateur dans la barre latérale
  toggleUserMenu(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const popover = document.getElementById('user-profile-popover');
    if (!popover) return;

    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      popover.classList.add('active');
      this.updateUserUI();
    } else {
      popover.classList.remove('active');
    }
  },

  closeUserMenu() {
    const popover = document.getElementById('user-profile-popover');
    if (popover) {
      popover.classList.remove('active');
      this.isMenuOpen = false;
    }
  },

  // Fermer le menu lors d'un clic extérieur
  bindClickOutside() {
    document.addEventListener('click', (e) => {
      const footer = document.querySelector('.sidebar-footer');
      const popover = document.getElementById('user-profile-popover');
      if (this.isMenuOpen && popover && !popover.contains(e.target) && footer && !footer.contains(e.target)) {
        this.closeUserMenu();
      }
    });
  },

  // Bascule rapide de profil en 1 clic (Superviseur Glad MOUKOUIRI, Biomed, Admin, Client)
  switchDemoProfile(profileKey) {
    const profile = this.DEMO_PROFILES[profileKey];
    if (!profile) return;

    this.currentUser = { 
      ...profile,
      isAuthenticated: true,
      lastLogin: new Date().toISOString()
    };

    this.saveCurrentSession();
    this.updateUserUI();
    this.closeUserMenu();
    this.closeLoginModal();

    if (window.APP && typeof window.APP.showToast === 'function') {
      window.APP.showToast(`Connecté avec succès : ${profile.nom} (${profile.roleLabel})`, 'success');
    }
  },

  // Poursuivre la navigation en mode visiteur/invité
  continueAsGuest() {
    this.closeLoginModal();
    this.closeUserMenu();
    if (window.APP && typeof window.APP.showToast === 'function') {
      window.APP.showToast('Mode consultation actif. Vous pouvez vous identifier à tout moment en bas du menu.', 'info');
    }
  },

  // Connexion via formulaire (Email / Mot de passe avec Supabase Auth)
  async handleLoginForm(e) {
    e.preventDefault();
    const email = document.getElementById('auth-login-email')?.value?.trim();
    const password = document.getElementById('auth-login-password')?.value;

    if (!email || !password) {
      if (window.APP) window.APP.showToast('Veuillez saisir votre email et mot de passe.', 'error');
      return;
    }

    const btn = document.getElementById('btn-auth-submit');
    const originalText = btn ? btn.innerHTML : 'Se Connecter';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:8px;"></span> Connexion en cours...`;
    }

    try {
      // 1. Si Supabase est connecté, on tente la connexion Supabase Auth
      if (window.supabaseSync && window.supabaseSync.client) {
        try {
          const { data, error } = await window.supabaseSync.client.auth.signInWithPassword({ email, password });
          if (!error && data && data.user) {
            await this.syncSupabaseUser(data.user);
            this.closeLoginModal();
            if (window.APP) window.APP.showToast(`Bienvenue, ${this.currentUser.nom} !`, 'success');
            return;
          }
        } catch (supabaseErr) {
          console.warn('Supabase auth attempt notice:', supabaseErr);
        }
      }

      // 2. Fallback démo par email officiel
      const demoKey = Object.keys(this.DEMO_PROFILES).find(k => this.DEMO_PROFILES[k].email.toLowerCase() === email.toLowerCase());
      if (demoKey) {
        this.switchDemoProfile(demoKey);
        return;
      }

      // 3. Création de session locale générique
      const rawName = email.split('@')[0].replace(/[\._-]/g, ' ');
      const formattedName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const initials = formattedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TS';

      this.currentUser = {
        id: 'usr-' + Date.now(),
        nom: formattedName || 'Collaborateur TS',
        initials: initials,
        email: email,
        role: 'technicien',
        roleLabel: 'Ingénieur / Technicien CST',
        pole: 'BIOMED',
        telephone: '+221 77 000 00 00',
        badgeColor: '#2E5090',
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      };

      this.saveCurrentSession();
      this.updateUserUI();
      this.closeLoginModal();
      if (window.APP) window.APP.showToast(`Connexion réussie : ${this.currentUser.nom}`, 'success');
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      if (window.APP) window.APP.showToast(err.message || 'Identifiants invalides. Veuillez réessayer.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  },

  // Inscription d'un nouveau compte
  async handleRegisterForm(e) {
    e.preventDefault();
    const nom = document.getElementById('auth-reg-nom')?.value?.trim();
    const email = document.getElementById('auth-reg-email')?.value?.trim();
    const password = document.getElementById('auth-reg-password')?.value;
    const role = document.getElementById('auth-reg-role')?.value || 'technicien';
    const pole = document.getElementById('auth-reg-pole')?.value || 'BIOMED';

    if (!nom || !email || !password) {
      if (window.APP) window.APP.showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const btn = document.getElementById('btn-reg-submit');
    const originalText = btn ? btn.innerHTML : 'Créer mon Compte';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:8px;"></span> Création du compte...`;
    }

    try {
      if (window.supabaseSync && window.supabaseSync.client) {
        try {
          const { data, error } = await window.supabaseSync.client.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: nom, role: role, pole: pole }
            }
          });
          if (error) console.warn('Supabase signUp notice:', error.message);
        } catch (supErr) {
          console.warn('Supabase signUp error handled:', supErr);
        }
      }

      const initials = nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TS';
      const roleLabel = role === 'superviseur' 
        ? 'Superviseur Technologies Services' 
        : (role === 'admin' ? 'Administrateur GMAO' : (role === 'client' ? 'Client Référent' : 'Ingénieur / Technicien CST'));

      this.currentUser = {
        id: 'usr-' + Date.now(),
        nom: nom,
        initials: initials,
        email: email,
        role: role,
        roleLabel: roleLabel,
        pole: pole,
        telephone: '+221 77 000 00 00',
        badgeColor: role === 'superviseur' ? '#72C100' : (role === 'admin' ? '#F59E0B' : '#2E5090'),
        isAuthenticated: true,
        lastLogin: new Date().toISOString()
      };

      this.saveCurrentSession();
      this.updateUserUI();
      this.closeLoginModal();
      if (window.APP) window.APP.showToast(`Compte créé avec succès ! Bienvenue, ${nom}.`, 'success');
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err);
      if (window.APP) window.APP.showToast(err.message || 'Erreur lors de l\'inscription.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  },

  // Basculer la visibilité d'un mot de passe (Icône Œil)
  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    if (btn) {
      btn.innerHTML = isPassword
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      btn.title = isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe';
    }
  },

  // Remplir rapidement les identifiants de test dans le formulaire de connexion
  fillLoginCredentials(email, pwd = 'password123') {
    this.switchAuthTab('login');
    const emailInput = document.getElementById('auth-login-email');
    const pwdInput = document.getElementById('auth-login-password');
    if (emailInput) emailInput.value = email;
    if (pwdInput) pwdInput.value = pwd;
    if (emailInput) emailInput.focus();
  },

  // Déconnexion complète et propre
  async logout() {
    if (confirm('Voulez-vous vraiment fermer votre session Sama CST ?')) {
      if (window.supabaseSync && window.supabaseSync.client) {
        try {
          await window.supabaseSync.client.auth.signOut();
        } catch (e) {
          console.warn('Supabase signOut notice:', e);
        }
      }

      // Nettoyage complet de la session locale
      this.currentUser = null;
      localStorage.removeItem('sama_current_user');

      this.closeUserMenu();
      this.updateUserUI();
      this.openLoginModal('demo');

      if (window.APP && typeof window.APP.showToast === 'function') {
        window.APP.showToast('Session fermée. Vous pouvez vous reconnecter avec un autre compte.', 'info');
      }
    }
  },

  // Modales d'authentification et de profil
  openLoginModal(tab = 'demo') {
    this.closeUserMenu();
    const modal = document.getElementById('modal-auth-login');
    if (modal) {
      modal.classList.add('active');
      this.switchAuthTab(tab);
      this.highlightActiveDemoCard();
    }
  },

  closeLoginModal() {
    const modal = document.getElementById('modal-auth-login');
    if (modal) modal.classList.remove('active');
  },

  switchAuthTab(tabName) {
    const tabDemo = document.getElementById('auth-tab-content-demo');
    const tabLogin = document.getElementById('auth-tab-content-login');
    const tabRegister = document.getElementById('auth-tab-content-register');

    const btnDemo = document.getElementById('btn-tab-demo');
    const btnLogin = document.getElementById('btn-tab-login');
    const btnRegister = document.getElementById('btn-tab-register');

    [tabDemo, tabLogin, tabRegister].forEach(el => el && (el.style.display = 'none'));
    [btnDemo, btnLogin, btnRegister].forEach(el => el && el.classList.remove('active'));

    if (tabName === 'demo' && tabDemo) {
      tabDemo.style.display = 'block';
      if (btnDemo) btnDemo.classList.add('active');
      this.highlightActiveDemoCard();
    } else if (tabName === 'login' && tabLogin) {
      tabLogin.style.display = 'block';
      if (btnLogin) btnLogin.classList.add('active');
    } else if (tabName === 'register' && tabRegister) {
      tabRegister.style.display = 'block';
      if (btnRegister) btnRegister.classList.add('active');
    }
  },

  openProfileModal() {
    this.closeUserMenu();
    if (!this.currentUser) {
      this.openLoginModal('demo');
      return;
    }

    const modal = document.getElementById('modal-user-profile');
    if (modal) {
      const nameInput = document.getElementById('profile-edit-nom');
      const telInput = document.getElementById('profile-edit-tel');
      const poleInput = document.getElementById('profile-edit-pole');

      if (nameInput) nameInput.value = this.currentUser.nom || '';
      if (telInput) telInput.value = this.currentUser.telephone || '';
      if (poleInput) poleInput.value = this.currentUser.pole || '';

      modal.classList.add('active');
    }
  },

  closeProfileModal() {
    const modal = document.getElementById('modal-user-profile');
    if (modal) modal.classList.remove('active');
  },

  saveProfileModal(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    const nom = document.getElementById('profile-edit-nom')?.value?.trim();
    const tel = document.getElementById('profile-edit-tel')?.value?.trim();
    const pole = document.getElementById('profile-edit-pole')?.value?.trim();

    if (!nom) {
      if (window.APP) window.APP.showToast('Le nom est requis.', 'error');
      return;
    }

    const parts = nom.split(' ');
    const initials = parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : nom.substring(0, 2).toUpperCase();

    this.currentUser.nom = nom;
    this.currentUser.initials = initials;
    this.currentUser.telephone = tel || this.currentUser.telephone;
    this.currentUser.pole = pole || this.currentUser.pole;

    this.saveCurrentSession();
    this.updateUserUI();
    this.closeProfileModal();
    if (window.APP) window.APP.showToast('Profil mis à jour avec succès !', 'success');
  }
};
