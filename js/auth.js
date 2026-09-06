// ==============================================================================
// GESTIONNAIRE D'AUTHENTIFICATION & PROFILS UTILISATEURS — SAMA CST
// Technologies Services (GMAO & Supervision)
// ==============================================================================

window.AUTH = {
  // Profils de démonstration préconfigurés TS
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
      badgeColor: '#72C100'
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
      badgeColor: '#2E5090'
    },
    imagerie: {
      id: 'usr-imagerie',
      nom: 'Moussa Diakhaté',
      initials: 'MD',
      email: 'm.diakhate@technologies-services.sn',
      role: 'technicien',
      roleLabel: 'Ingénieur Imagerie Médicale',
      pole: 'IMAG-CHIRG',
      telephone: '+221 77 345 67 89',
      badgeColor: '#8B5CF6'
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
      badgeColor: '#F59E0B'
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
      badgeColor: '#0EA5E9'
    }
  },

  currentUser: null,
  isMenuOpen: false,

  // Initialisation de la session
  async init() {
    // 1. Récupération du profil stocké localement ou superviseur par défaut (Glad MOUKOUIRI)
    const savedUser = localStorage.getItem('sama_current_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = { ...this.DEMO_PROFILES.superviseur };
      }
    } else {
      this.currentUser = { ...this.DEMO_PROFILES.superviseur };
      this.saveCurrentSession();
    }

    // 2. Écoute de la session Supabase Auth si le client est prêt
    if (window.supabaseSync && window.supabaseSync.client) {
      this.bindSupabaseAuth(window.supabaseSync.client);
    }

    // 3. Mise à jour de l'interface
    this.updateUserUI();
    this.bindClickOutside();
  },

  // Connexion avec les événements Supabase Auth
  bindSupabaseAuth(client) {
    if (!client || !client.auth) return;

    // Récupérer la session active Supabase
    client.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        this.syncSupabaseUser(session.user);
      }
    });

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
      badgeColor: '#72C100'
    };

    this.saveCurrentSession();
    this.updateUserUI();
  },

  // Sauvegarde la session dans le localStorage
  saveCurrentSession() {
    if (this.currentUser) {
      localStorage.setItem('sama_current_user', JSON.stringify(this.currentUser));
    }
  },

  // Met à jour les éléments visuels de profil dans le DOM
  updateUserUI() {
    if (!this.currentUser) return;

    // 1. Sidebar Footer
    const avatarEl = document.getElementById('user-sidebar-avatar');
    const nameEl = document.getElementById('user-sidebar-name');
    const roleEl = document.getElementById('user-sidebar-role');

    if (avatarEl) {
      avatarEl.textContent = this.currentUser.initials || 'GM';
      avatarEl.title = `${this.currentUser.nom} (${this.currentUser.roleLabel})`;
    }
    if (nameEl) {
      nameEl.textContent = this.currentUser.nom || 'Glad MOUKOUIRI';
    }
    if (roleEl) {
      roleEl.textContent = this.currentUser.roleLabel || 'Superviseur Technologies Services';
    }

    // 2. Modale de profil / Popover si affiché
    const popName = document.getElementById('pop-user-name');
    const popEmail = document.getElementById('pop-user-email');
    const popRole = document.getElementById('pop-user-role');
    const popAvatar = document.getElementById('pop-user-avatar');
    const popPole = document.getElementById('pop-user-pole');

    if (popName) popName.textContent = this.currentUser.nom;
    if (popEmail) popEmail.textContent = this.currentUser.email;
    if (popRole) popRole.textContent = this.currentUser.roleLabel;
    if (popAvatar) popAvatar.textContent = this.currentUser.initials;
    if (popPole) popPole.textContent = this.currentUser.pole;
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

    this.currentUser = { ...profile };
    this.saveCurrentSession();
    this.updateUserUI();
    this.closeUserMenu();
    this.closeLoginModal();

    if (window.APP && typeof window.APP.showToast === 'function') {
      window.APP.showToast(`Connecté en tant que : ${profile.nom} (${profile.roleLabel})`, 'success');
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
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Connexion en cours...';
    }

    try {
      // Si Supabase est connecté, on tente la connexion Supabase Auth
      if (window.supabaseSync && window.supabaseSync.client) {
        const { data, error } = await window.supabaseSync.client.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }
        if (data && data.user) {
          await this.syncSupabaseUser(data.user);
          this.closeLoginModal();
          if (window.APP) window.APP.showToast(`Bienvenue, ${this.currentUser.nom} !`, 'success');
          return;
        }
      }

      // Fallback si mode local : vérification par email ou démo
      const demoKey = Object.keys(this.DEMO_PROFILES).find(k => this.DEMO_PROFILES[k].email.toLowerCase() === email.toLowerCase());
      if (demoKey) {
        this.switchDemoProfile(demoKey);
        return;
      }

      // Création de session locale générique
      const name = email.split('@')[0].replace('.', ' ');
      const initials = name.substring(0, 2).toUpperCase();
      this.currentUser = {
        id: 'usr-' + Date.now(),
        nom: name.charAt(0).toUpperCase() + name.slice(1),
        initials: initials,
        email: email,
        role: 'technicien',
        roleLabel: 'Technicien CST',
        pole: 'BIOMED',
        telephone: '+221 77 000 00 00',
        badgeColor: '#2E5090'
      };
      this.saveCurrentSession();
      this.updateUserUI();
      this.closeLoginModal();
      if (window.APP) window.APP.showToast(`Connexion réussie : ${this.currentUser.nom}`, 'success');
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      if (window.APP) window.APP.showToast(err.message || 'Identifiants invalides.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Se Connecter';
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
      if (window.APP) window.APP.showToast('Veuillez remplir tous les champs.', 'error');
      return;
    }

    const btn = document.getElementById('btn-reg-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Création du compte...';
    }

    try {
      if (window.supabaseSync && window.supabaseSync.client) {
        const { data, error } = await window.supabaseSync.client.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: nom, role: role, pole: pole }
          }
        });
        if (error) throw error;
      }

      const initials = nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TS';
      this.currentUser = {
        id: 'usr-' + Date.now(),
        nom: nom,
        initials: initials,
        email: email,
        role: role,
        roleLabel: role === 'superviseur' ? 'Superviseur Technologies Services' : (role === 'admin' ? 'Administrateur GMAO' : 'Ingénieur / Technicien CST'),
        pole: pole,
        telephone: '+221 77 000 00 00',
        badgeColor: '#72C100'
      };

      this.saveCurrentSession();
      this.updateUserUI();
      this.closeLoginModal();
      if (window.APP) window.APP.showToast(`Compte créé avec succès pour ${nom} !`, 'success');
    } catch (err) {
      console.error('❌ Erreur d\'inscription:', err);
      if (window.APP) window.APP.showToast(err.message || 'Erreur lors de l\'inscription.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Créer mon Compte';
      }
    }
  },

  // Déconnexion
  async logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter de votre session Sama CST ?')) {
      if (window.supabaseSync && window.supabaseSync.client) {
        try {
          await window.supabaseSync.client.auth.signOut();
        } catch (e) {
          console.warn(e);
        }
      }

      this.closeUserMenu();
      this.openLoginModal();
      if (window.APP) window.APP.showToast('Vous êtes déconnecté.', 'info');
    }
  },

  // Modales d'authentification et de profil
  openLoginModal(tab = 'demo') {
    this.closeUserMenu();
    const modal = document.getElementById('modal-auth-login');
    if (modal) {
      modal.classList.add('active');
      this.switchAuthTab(tab);
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
