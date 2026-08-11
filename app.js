/**
 * Application Main Controller
 * Jurusan Manajemen FEB Universitas Trunojoyo Madura
 */

import { db } from './storage.js';
import { auth, ROLES } from './auth.js';
import { UI } from './ui.js';

class App {
  constructor() {
    this.activeTab = 'home'; // 'home', 'prodi', 'dosen', 'berita', 'kontak', 'student', 'admin', 'dosen_portal'
    this.adminTab = 'dashboard'; // 'dashboard', 'pemberkasan', 'prestasi', 'attendance', 'dosen', 'pengumuman', 'users'
    this.prodiFilter = 'all';
    this.dosenSearch = '';
    this.selectedProdiId = null;
    window.switchRoleAndNav = (role) => {
      if (role === ROLES.ADMIN) {
        const inputId = prompt("🔒 Otentikasi Administrator Jurusan\nMasukkan ID Admin Anda:");
        if (!inputId || !inputId.trim()) {
          UI.showToast("Masuk sebagai Admin dibatalkan. ID Admin wajib diisi.", "warning");
          return;
        }
        const inputPass = prompt("🔑 Masukkan Kata Sandi / Password Admin:");
        if (!inputPass || !inputPass.trim()) {
          UI.showToast("Masuk sebagai Admin dibatalkan. Kata Sandi wajib diisi.", "warning");
          return;
        }
        try {
          auth.loginAdmin(inputId.trim(), inputPass.trim());
          this.activeTab = 'admin';
          UI.showToast("Berhasil log masuk sebagai Admin Jurusan!", "success");
          this.render();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
        return;
      }
      if (role === ROLES.MAHASISWA) {
        const inputNama = prompt("Silakan masukkan Nama Lengkap Anda terlebih dahulu untuk masuk sebagai Mahasiswa:");
        if (!inputNama || !inputNama.trim()) {
          UI.showToast("Masuk sebagai Mahasiswa dibatalkan. Nama lengkap wajib diisi.", "warning");
          return;
        }
        try {
          auth.loginMhs(inputNama.trim());
          this.activeTab = 'student';
          UI.showToast(`Selamat datang, Mahasiswa ${inputNama.trim()}!`, 'success');
          this.render();
        } catch (err) {
          UI.showToast(err.message, 'error');
        }
        return;
      }
      auth.switchRole(role);
      if (role === ROLES.DOSEN) this.activeTab = 'dosen_portal';
      UI.showToast(`Berhasil masuk sebagai ${role.toUpperCase()}`, 'success');
      this.render();
    };
    this.init();
  }

  init() {
    // Subscribe to DB changes
    db.subscribe(() => this.render());

    // Event Listeners for global elements
    this.bindEvents();

    // Responsive Header offset dynamic listener
    window.addEventListener('resize', () => this.updateHeaderOffset());

    // Initial render
    this.render();
  }

  bindEvents() {
    // Role switcher buttons
    document.addEventListener('click', (e) => {
      const roleBtn = e.target.closest('[data-switch-role]');
      if (roleBtn) {
        const role = roleBtn.dataset.switchRole;
        if (role === ROLES.ADMIN) {
          const inputId = prompt("🔒 Otentikasi Administrator Jurusan\nMasukkan ID Admin Anda:");
          if (!inputId || !inputId.trim()) {
            UI.showToast("Masuk sebagai Admin dibatalkan. ID Admin wajib diisi.", "warning");
            return;
          }
          const inputPass = prompt("🔑 Masukkan Kata Sandi / Password Admin:");
          if (!inputPass || !inputPass.trim()) {
            UI.showToast("Masuk sebagai Admin dibatalkan. Kata Sandi wajib diisi.", "warning");
            return;
          }
          try {
            auth.loginAdmin(inputId.trim(), inputPass.trim());
            this.activeTab = 'admin';
            UI.showToast("Berhasil log masuk sebagai Admin Jurusan!", "success");
            this.render();
          } catch (err) {
            UI.showToast(err.message, "error");
          }
          return;
        }
        if (role === ROLES.MAHASISWA) {
          const inputNama = prompt("Silakan masukkan Nama Lengkap Anda terlebih dahulu untuk masuk sebagai Mahasiswa:");
          if (!inputNama || !inputNama.trim()) {
            UI.showToast("Masuk sebagai Mahasiswa dibatalkan. Nama lengkap wajib diisi.", "warning");
            return;
          }
          try {
            auth.loginMhs(inputNama.trim());
            this.activeTab = 'student';
            UI.showToast(`Selamat datang, Mahasiswa ${inputNama.trim()}!`, 'success');
            this.render();
          } catch (err) {
            UI.showToast(err.message, 'error');
          }
          return;
        }
        auth.switchRole(role);
        if (role === ROLES.DOSEN) this.activeTab = 'dosen_portal';
        else this.activeTab = 'home';
        UI.showToast(`Berhasil beralih ke peran: ${role.toUpperCase()}`, 'info');
        this.render();
      }

      // Login Modal Tab Switchers
      if (e.target.closest('#tab-login-mhs')) {
        document.getElementById('tab-login-mhs')?.classList.add('active');
        if (document.getElementById('tab-login-mhs')) {
          document.getElementById('tab-login-mhs').style.background = '#FFF';
          document.getElementById('tab-login-mhs').style.color = '#0F2942';
        }
        document.getElementById('tab-login-admin')?.classList.remove('active');
        if (document.getElementById('tab-login-admin')) {
          document.getElementById('tab-login-admin').style.background = 'transparent';
          document.getElementById('tab-login-admin').style.color = '#64748B';
        }
        if (document.getElementById('group-login-mhs')) document.getElementById('group-login-mhs').style.display = 'block';
        if (document.getElementById('group-login-admin')) document.getElementById('group-login-admin').style.display = 'none';
      }
      if (e.target.closest('#tab-login-admin')) {
        document.getElementById('tab-login-admin')?.classList.add('active');
        if (document.getElementById('tab-login-admin')) {
          document.getElementById('tab-login-admin').style.background = '#FFF';
          document.getElementById('tab-login-admin').style.color = '#0F2942';
        }
        document.getElementById('tab-login-mhs')?.classList.remove('active');
        if (document.getElementById('tab-login-mhs')) {
          document.getElementById('tab-login-mhs').style.background = 'transparent';
          document.getElementById('tab-login-mhs').style.color = '#64748B';
        }
        if (document.getElementById('group-login-mhs')) document.getElementById('group-login-mhs').style.display = 'none';
        if (document.getElementById('group-login-admin')) document.getElementById('group-login-admin').style.display = 'block';
      }

      // Nav Links
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        e.preventDefault();
        this.activeTab = navBtn.dataset.nav;
        if (this.activeTab === 'prodi') {
          this.selectedProdiId = null;
        }
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Admin Tab Buttons
      const adminNavBtn = e.target.closest('[data-admin-tab]');
      if (adminNavBtn) {
        this.adminTab = adminNavBtn.dataset.adminTab;
        this.render();
      }

      // Action Modals & Forms
      this.handleModalActions(e);
    });



    // Search and Filters
    const handleFilterInput = (e) => {
      if (e.target.id === 'search-dosen') {
        this.dosenSearch = e.target.value;
        this.updateDosenCards();
      }
      if (e.target.id === 'filter-prodi-dosen') {
        this.prodiFilter = e.target.value;
        this.updateDosenCards();
      }
    };
    document.addEventListener('input', handleFilterInput);
    document.addEventListener('change', handleFilterInput);
  }

  handleModalActions(e) {
    // Open Login Modal (General Users & Admin)
    if (e.target.closest('#btn-open-login') || e.target.closest('#btn-lock-login')) {
      this.openModal('modal-login');
      setTimeout(() => {
        const tabMhs = document.getElementById('tab-login-mhs');
        if (tabMhs) tabMhs.click();
      }, 50);
    }

    // Open Upload Document Modal
    if (e.target.closest('#btn-open-upload-doc')) {
      this.openModal('modal-upload-doc');
    }

    // Open Upload Achievement Modal
    if (e.target.closest('#btn-open-upload-prestasi')) {
      this.openModal('modal-upload-prestasi');
    }

    // Open Add Attendance Modal
    if (e.target.closest('#btn-open-add-attendance')) {
      this.openModal('modal-add-attendance');
    }

    // Open Add Dosen Modal
    if (e.target.closest('#btn-open-add-dosen')) {
      this.openModal('modal-add-dosen');
    }

    // Open Add Pengumuman Modal
    if (e.target.closest('#btn-open-add-news')) {
      this.openModal('modal-add-news');
    }

    // Close Modal buttons
    if (e.target.closest('.btn-close-modal') || e.target.classList.contains('modal-overlay')) {
      this.closeModals();
    }
  }

  openModal(modalId) {
    this.closeModals();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  updateHeaderOffset() {
    const main = document.getElementById('main-content');
    const header = document.querySelector('.sticky-header-wrapper');
    if (!main) return;
    if (!header || !auth.isLoggedIn()) {
      main.style.paddingTop = '0px';
      return;
    }
    const h = header.getBoundingClientRect().height;
    if (h > 0) {
      main.style.paddingTop = `${Math.ceil(h) + 16}px`;
    }
  }

  render() {
    if (!auth.isLoggedIn()) {
      this.renderLoginGate();
      this.updateHeaderOffset();
      return;
    }
    this.renderRoleBar();
    this.renderNavbar();
    this.renderMainContent();
    this.renderFooter();
    this.updateHeaderOffset();
    setTimeout(() => this.updateHeaderOffset(), 50);
  }

  renderLoginGate() {
    const navbar = document.getElementById('navbar-container');
    const main = document.getElementById('main-content');
    const footer = document.getElementById('footer-container');

    if (navbar) navbar.innerHTML = '';
    if (footer) footer.innerHTML = '';
    if (!main) return;

    main.innerHTML = `
      <div class="login-gate-screen" style="min-height: 100vh; background: linear-gradient(135deg, rgba(7, 19, 37, 0.82) 0%, rgba(15, 41, 66, 0.78) 100%), url('IMAGE/Gedung FEB UTM.png'); background-size: cover; background-position: center center; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2.5rem 1.5rem;">
        
        <div style="max-width: 480px; width: 100%; background: #FFFFFF; border-radius: 24px; padding: 2.75rem 2.25rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); text-align: center;">
          
          <div style="display: flex; justify-content: center; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem;">
            <img src="IMAGE/LOGO UTM.png" alt="Logo UTM" style="height: 56px; width: auto; object-fit: contain;">
            <img src="IMAGE/SAE UPDATE.png" alt="Logo SAE" style="height: 56px; width: auto; object-fit: contain;">
          </div>
          
          <span style="background: rgba(212, 175, 55, 0.18); color: #B59325; font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; letter-spacing: 0.5px; text-transform: uppercase;">Portal Digital Terpadu Jurusan</span>
          
          <h2 style="color: #0F2942; font-size: 1.65rem; font-weight: 800; margin: 0.65rem 0 0.2rem 0; line-height: 1.25;">Jurusan Manajemen FEB UTM</h2>
          <p style="color: #64748B; font-size: 0.88rem; margin-bottom: 1.75rem; line-height: 1.5;">Silakan masuk terlebih dahulu untuk mengakses seluruh informasi dan layanan jurusan.</p>

          <!-- Tab Selector -->
          <div style="display: flex; background: #F1F5F9; border-radius: 12px; padding: 4px; margin-bottom: 1.5rem;">
            <button type="button" id="gate-tab-user" class="login-tab-btn active" onclick="window.switchGateTab('user')" style="flex: 1; padding: 0.7rem; border: none; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; background: #FFF; color: #0F2942; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
              👤 Pengguna Umum
            </button>
            <button type="button" id="gate-tab-admin" class="login-tab-btn" onclick="window.switchGateTab('admin')" style="flex: 1; padding: 0.7rem; border: none; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; background: transparent; color: #64748B;">
              🛡️ Admin Jurusan
            </button>
          </div>

          <!-- Mode Pengguna Umum: Tanpa ID & Password -->
          <div id="gate-group-user">
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 1.1rem; margin-bottom: 1.5rem; font-size: 0.88rem; color: #047857; text-align: center; line-height: 1.5;">
              🟢 <strong>Akses Pengguna Umum:</strong> Tanpa ID & Tanpa Password. Klik tombol di bawah untuk langsung membuka dan melihat seluruh informasi web Jurusan Manajemen FEB UTM.
            </div>
            <button type="button" onclick="window.loginAsGateUser()" class="btn-gold" style="width: 100%; justify-content: center; padding: 0.95rem; font-weight: 800; font-size: 1rem; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);">
              🚀 Masuk Sebagai Pengguna Umum &raquo;
            </button>
          </div>

          <!-- Mode Admin: Diperlukan ID & Password -->
          <div id="gate-group-admin" style="display: none;">
            <div style="background: rgba(2, 132, 199, 0.08); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #0369A1; text-align: left; line-height: 1.5;">
              🔒 <strong>Akses Khusus Admin:</strong> Diperlukan ID / Username & Password Admin yang valid untuk mengelola data & status dosen serta sistem.
            </div>
            <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
              <label class="form-label" style="font-weight: 700;">ID / Username Admin <span style="color: #EF4444;">*</span></label>
              <input type="text" id="gate-admin-id" class="form-control" placeholder="Masukkan ID / Username Admin">
            </div>
            <div class="form-group" style="text-align: left; margin-bottom: 1.5rem;">
              <label class="form-label" style="font-weight: 700;">Kata Sandi / Password Admin <span style="color: #EF4444;">*</span></label>
              <input type="password" id="gate-admin-pass" class="form-control" placeholder="Masukkan Password Admin">
            </div>
            <button type="button" onclick="window.loginAsGateAdmin()" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(15, 41, 66, 0.35);">
              🔒 Masuk Sebagai Admin &raquo;
            </button>
          </div>

        </div>
      </div>
    `;
  }

  renderRoleBar() {
    const roleBar = document.getElementById('role-bar-container');
    if (!roleBar) return;
    roleBar.innerHTML = '';
  }

  renderNavbar() {
    const navbar = document.getElementById('navbar-container');
    if (!navbar) return;

    const user = auth.getCurrentUser();
    const role = auth.getRole();
    let portalBtnHTML = '';
    if (role === ROLES.ADMIN) {
      portalBtnHTML = `
        <button class="btn-gold" data-nav="admin" style="font-size: 0.8rem; padding: 0.5rem 0.8rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem;" title="Buka Panel Kontrol Admin"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Panel Admin</button>
        <button class="btn-outline" onclick="window.logoutUser()" style="font-size: 0.8rem; padding: 0.5rem 0.75rem; font-weight: 800; background: #FFF; border-color: #FCA5A5; color: #DC2626;" title="Keluar dari Panel Admin">Keluar 🚪</button>
      `;
    } else {
      portalBtnHTML = `
        <button class="btn-outline" onclick="window.logoutUser()" style="font-size: 0.8rem; padding: 0.5rem 0.75rem; font-weight: 800; background: #FFF; border-color: #CBD5E1; color: #475569;" title="Keluar dari akun">Keluar 🚪</button>
      `;
    }

    const submissionLinkHTML = `<a href="https://script.google.com/macros/s/AKfycbxvM9GnakdnMI2uSRr5qZ4xIU3SzN8FEKhCL05dMg1dBexu75sYe_k6XUl_178vq9axQg/exec" target="_blank" rel="noopener noreferrer" class="btn-gold" style="font-size: 0.8rem; padding: 0.5rem 0.8rem; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">📄 Pengajuan Berkas</a>`;

    navbar.innerHTML = `
      <nav class="navbar">
        <div class="container navbar-inner">
          <a href="#" class="nav-brand" data-nav="home">
            <div class="brand-logo-wrapper" style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="IMAGE/LOGO UTM.png" alt="Logo UTM" class="brand-logo" style="height: 48px; width: auto; object-fit: contain;">
              <img src="IMAGE/SAE UPDATE.png" alt="Logo SAE Jurusan Manajemen FEB UTM" class="brand-logo" style="height: 48px; width: auto; object-fit: contain;">
            </div>
            <div class="brand-divider"></div>
            <div class="brand-text">
              <span class="brand-title">JURUSAN MANAJEMEN</span>
              <span class="brand-sub-gold">FAKULTAS EKONOMI DAN BISNIS</span>
              <span class="brand-sub-univ">UNIVERSITAS TRUNOJOYOMADURA</span>
            </div>
          </a>
          <ul class="nav-menu">
            <li><a href="#" class="nav-link ${this.activeTab === 'home' ? 'active' : ''}" data-nav="home">Beranda</a></li>
            <li><a href="#" class="nav-link ${this.activeTab === 'profil' ? 'active' : ''}" data-nav="profil">Profil</a></li>
            <li class="nav-item-dropdown">
              <a href="#" class="nav-link ${this.activeTab === 'prodi' ? 'active' : ''}" data-nav="prodi" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                Prodi <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
              <div class="nav-dropdown-menu">
                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.navigateToProdi('prodi-d3');">
                  <span class="prodi-badge-mini" style="background: rgba(2, 132, 199, 0.15); color: #0284C7;">D3</span>
                  D3 Entrepreneurship
                </a>
                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.navigateToProdi('prodi-s1');">
                  <span class="prodi-badge-mini" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">S1</span>
                  S1 Manajemen
                </a>
                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.navigateToProdi('prodi-s2');">
                  <span class="prodi-badge-mini" style="background: rgba(212, 175, 55, 0.2); color: #B59325;">S2</span>
                  S2 Magister Manajemen
                </a>
                <a href="#" class="dropdown-item" onclick="event.preventDefault(); window.navigateToProdi('prodi-s3');">
                  <span class="prodi-badge-mini" style="background: rgba(139, 92, 246, 0.15); color: #8B5CF6;">S3</span>
                  S3 Doktor Ilmu Manajemen
                </a>
              </div>
            </li>
            <li><a href="#" class="nav-link ${this.activeTab === 'dosen' ? 'active' : ''}" data-nav="dosen">Dosen</a></li>
            <li><a href="#" class="nav-link ${this.activeTab === 'berita' ? 'active' : ''}" data-nav="berita">Berita</a></li>
            <li><a href="#" class="nav-link ${this.activeTab === 'kontak' ? 'active' : ''}" data-nav="kontak">Kontak</a></li>
          </ul>
          <div class="nav-actions" style="display: flex; align-items: center; gap: 0.45rem;">
            ${submissionLinkHTML}
            ${portalBtnHTML}
          </div>
        </div>
      </nav>
    `;
  }

  renderMainContent() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const currentRole = auth.getRole();
    let contentHTML = '';

    if (this.activeTab === 'home') {
      contentHTML = this.getHeroHTML() + this.getProfilPreviewHTML() + this.getProdiSectionHTML() + this.getBeritaSectionHTML();
    } else if (this.activeTab === 'profil') {
      contentHTML = this.getProfilFullHTML();
    } else if (this.activeTab === 'prodi') {
      contentHTML = this.getProdiSectionHTML(true);
    } else if (this.activeTab === 'dosen') {
      contentHTML = this.getDosenSectionHTML(true);
    } else if (this.activeTab === 'berita') {
      contentHTML = this.getBeritaSectionHTML(true);
    } else if (this.activeTab === 'kontak') {
      contentHTML = this.getKontakHTML();
    } else if (this.activeTab === 'student') {
      if (currentRole !== ROLES.MAHASISWA) {
        contentHTML = this.getAccessDeniedHTML(ROLES.MAHASISWA);
      } else {
        contentHTML = this.getStudentPortalHTML();
      }
    } else if (this.activeTab === 'admin') {
      if (currentRole !== ROLES.ADMIN) {
        contentHTML = this.getAccessDeniedHTML(ROLES.ADMIN);
      } else {
        contentHTML = this.getAdminPortalHTML();
      }
    } else if (this.activeTab === 'dosen_portal') {
      if (currentRole !== ROLES.DOSEN) {
        contentHTML = this.getAccessDeniedHTML(ROLES.DOSEN);
      } else {
        contentHTML = this.getDosenPortalHTML();
      }
    }

    main.innerHTML = `<div class="page-tab-content">${contentHTML}</div>`;
    UI.initScrollReveal();
  }

  getAccessDeniedHTML(requiredRole) {
    const roleLabels = {
      [ROLES.MAHASISWA]: 'Portal Layanan Mahasiswa',
      [ROLES.ADMIN]: 'Panel Administrator & Sekretariat',
      [ROLES.DOSEN]: 'Portal Dosen Pengampu & Pembimbing'
    };
    const title = roleLabels[requiredRole] || 'Area Terkunci';

    return `
      <section class="section" style="min-height: 70vh; display: flex; align-items: center; justify-content: center; background: #F8FAFC;">
        <div class="container" style="max-width: 520px;">
          <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2.5rem; text-align: center; box-shadow: var(--shadow-md);">
            <div style="width: 72px; height: 72px; background: rgba(212, 175, 55, 0.12); color: var(--color-gold-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; border: 2px solid rgba(212, 175, 55, 0.3);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 style="font-size: 1.4rem; color: var(--color-navy-primary); font-weight: 800; margin-bottom: 0.5rem;">Akses ${title} Terkunci</h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem;">
              Halaman ini khusus untuk pengguna dengan hak akses **${requiredRole.toUpperCase()}**. Silakan masuk menggunakan formulir login resmi dengan nama pengguna/NIM dan kata sandi Anda.
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <button class="btn-gold" style="width: 100%; justify-content: center; padding: 0.85rem; font-weight: 800;" id="btn-lock-login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Masuk Dengan Form Login
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --- HTML Generators ---
  getHeroHTML() {
    const prodiList = db.getProdiList();
    const totalMahasiswa = prodiList.reduce((sum, p) => sum + (Number(p.jumlah_mahasiswa) || 0), 0);
    const formattedTotal = totalMahasiswa.toLocaleString('id-ID') + '+';

    return `
      <section class="hero" style="background: linear-gradient(135deg, rgba(7, 19, 37, 0.58) 0%, rgba(15, 41, 66, 0.48) 60%, rgba(7, 19, 37, 0.60) 100%), url('IMAGE/Gedung FEB UTM.png'); background-size: cover; background-position: center center;">
        <div class="container hero-container-centered">
          <h1 class="hero-title">Jurusan Manajemen <span>FEB UTM</span></h1>
          
          <p style="font-weight: 400; font-size: 1.1rem; color: #F1F5F9; margin: 0 auto 0.35rem auto; max-width: 820px; line-height: 1.35; text-align: center; letter-spacing: 0.2px;">
            Jurusan Manajemen Fakultas Ekonomi dan Bisnis Universitas Trunodjoyo Madura
          </p>
          <p style="font-weight: 400; font-size: 0.96rem; color: rgba(203, 213, 225, 0.92); margin: 0 auto 1.6rem auto; max-width: 720px; line-height: 1.4; text-align: center;">
            Membentuk pemimpin masa depan yang inovatif, beretika, dan berdaya saing global.
          </p>

          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-number">4</div>
              <div class="stat-label">Program Studi (D3, S1, S2, S3)</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">Unggul</div>
              <div class="stat-label">Akreditasi LAMEMBA (D3,S1,S2)</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">42+</div>
              <div class="stat-label">Dosen Berpengalaman & Pakar</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${formattedTotal}</div>
              <div class="stat-label">Mahasiswa Aktif</div>
            </div>
          </div>

          <div class="hero-actions">
            <a href="https://script.google.com/macros/s/AKfycbxvM9GnakdnMI2uSRr5qZ4xIU3SzN8FEKhCL05dMg1dBexu75sYe_k6XUl_178vq9axQg/exec" target="_blank" rel="noopener noreferrer" class="btn-gold" style="display: inline-flex; align-items: center; gap: 0.55rem; text-decoration: none; font-weight: 800;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Pengajuan Berkas Mahasiswa 🚀
            </a>
            <button class="btn-primary" style="background: #FFFFFF !important; color: #0F2942 !important; font-weight: 800; border: none; box-shadow: 0 4px 18px rgba(255, 255, 255, 0.4);" data-nav="prodi">
              Jelajahi 4 Program Studi
            </button>
          </div>
        </div>
      </section>
    `;
  }

  getLeadershipSectionHTML() {
    const prodiList = db.getProdiList();
    const dosenList = db.getDosenList();
    const isAdmin = auth.getRole() === ROLES.ADMIN;

    // Kajur & Sekjur
    const kajur = dosenList.find(d => d.id === 'dsn-kajur') || {
      nama: 'Fathor AS',
      gelar: 'SE., M.M.',
      nidn: '197811152003121001',
      jabatan: 'Ketua Jurusan Manajemen',
      email: 'fathor.as@trunojoyo.ac.id',
      foto_url: 'IMAGE/Fathor.jpg'
    };
    let kajurFoto = kajur.foto_url;
    if (!kajurFoto || kajurFoto.includes('unsplash')) {
      kajurFoto = 'IMAGE/Fathor.jpg';
    } else if (!kajurFoto.startsWith('http') && !kajurFoto.startsWith('IMAGE/') && !kajurFoto.startsWith('/')) {
      kajurFoto = 'IMAGE/' + kajurFoto;
    }

    const sekjur = dosenList.find(d => d.id === 'dsn-sekjur') || {
      nama: 'M. Boy Singgih Gitayuda',
      gelar: 'S.E., M.M.',
      nidn: '199105122019031010',
      jabatan: 'Sekretaris Jurusan Manajemen',
      email: 'boy.gitayuda@trunojoyo.ac.id',
      foto_url: 'IMAGE/Boy.jpg'
    };
    let sekjurFoto = sekjur.foto_url;
    if (!sekjurFoto || sekjurFoto.includes('unsplash')) {
      sekjurFoto = 'IMAGE/Boy.jpg';
    } else if (!sekjurFoto.startsWith('http') && !sekjurFoto.startsWith('IMAGE/') && !sekjurFoto.startsWith('/')) {
      sekjurFoto = 'IMAGE/' + sekjurFoto;
    }

    // Coordinators matching prodi
    const coordList = prodiList.map(p => {
      const coordNameClean = p.koordinator_nama ? p.koordinator_nama.split(',')[0].trim() : '';
      const matchDosen = dosenList.find(d => d.nama && coordNameClean && d.nama.toLowerCase().includes(coordNameClean.toLowerCase()));
      const nama = matchDosen ? `${matchDosen.nama}, ${matchDosen.gelar}` : (p.koordinator_nama || 'Koordinator Program Studi');
      let rawFoto = (matchDosen && matchDosen.foto_url) ? matchDosen.foto_url : p.foto_url;
      if (!rawFoto || rawFoto.includes('unsplash')) {
        rawFoto = p.foto_url || 'IMAGE/yustin.jpg';
      }
      if (rawFoto && !rawFoto.startsWith('http') && !rawFoto.startsWith('IMAGE/') && !rawFoto.startsWith('/')) {
        rawFoto = 'IMAGE/' + rawFoto;
      }
      const foto = rawFoto || 'IMAGE/yustin.jpg';
      const nidn = matchDosen ? matchDosen.nidn : '-';
      const email = matchDosen ? matchDosen.email : '-';

      return {
        prodi_id: p.id,
        prodi_nama: p.nama,
        jenjang: p.jenjang,
        nama,
        nidn,
        email,
        foto,
        dosen_id: matchDosen ? matchDosen.id : null
      };
    });

    return `
      <div style="margin-bottom: 3.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--color-gold-primary); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.25rem;">Struktur Organisasi Jurusan</span>
          <h3 style="color: var(--color-navy-primary); font-size: 1.6rem; font-weight: 800;">Jajaran Pimpinan & Koordinator Program Studi</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 600px; margin: 0.5rem auto 0 auto;">Pimpinan Jurusan Manajemen FEB Universitas Trunojoyo Madura serta para Koordinator Program Studi berjenjang D3, S1, S2, dan S3.</p>
        </div>

        <!-- Tier 1: Pimpinan Utama (Kajur & Sekjur) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.5rem; max-width: 880px; margin: 0 auto 2.5rem auto;">
          <!-- Card Kajur -->
          <div style="background: #FFF; border: 2px solid rgba(212, 175, 55, 0.5); border-radius: var(--radius-xl); padding: 1.5rem 1.25rem; display: flex; gap: 1.25rem; align-items: center; box-shadow: 0 12px 30px rgba(15, 41, 66, 0.08); position: relative; overflow: hidden; flex-wrap: wrap;">
            <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%); border-radius: 50%;"></div>
            <img src="${kajurFoto}" alt="${kajur.nama}" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 3px solid var(--color-gold-primary); flex-shrink: 0; box-shadow: 0 4px 12px rgba(212,175,55,0.3); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${kajurFoto}', '${kajur.nama}')" title="Klik untuk memperbesar & mengunduh foto">
            <div style="flex: 1; min-width: 0; word-break: break-word; overflow-wrap: break-word;">
              <span style="background: var(--gradient-gold); color: var(--color-navy-dark); font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">Ketua Jurusan</span>
              <h4 style="font-size: 1.15rem; color: var(--color-navy-primary); margin: 0.4rem 0 0.15rem 0; font-weight: 800; word-break: break-word;">${kajur.nama}${kajur.gelar ? ', ' + kajur.gelar : ''}</h4>
              <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.15rem; word-break: break-word;">
                <span>NIP: ${kajur.nidn}</span>
                <span style="color: var(--color-blue-accent); font-weight: 600; word-break: break-all; overflow-wrap: anywhere;">${kajur.email}</span>
              </div>
              ${isAdmin ? `<button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-top: 0.4rem;" onclick="window.changeDosenPhoto('dsn-kajur')">Ubah Foto</button>` : ''}
            </div>
          </div>

          <!-- Card Sekjur (M. Boy Singgih Gitayuda) -->
          <div style="background: #FFF; border: 2px solid rgba(2, 132, 199, 0.4); border-radius: var(--radius-xl); padding: 1.5rem 1.25rem; display: flex; gap: 1.25rem; align-items: center; box-shadow: 0 12px 30px rgba(15, 41, 66, 0.08); position: relative; overflow: hidden; flex-wrap: wrap;">
            <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%); border-radius: 50%;"></div>
            <img src="${sekjurFoto}" alt="${sekjur.nama}" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 3px solid var(--color-blue-accent); flex-shrink: 0; box-shadow: 0 4px 12px rgba(2,132,199,0.3); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${sekjurFoto}', '${sekjur.nama}')" title="Klik untuk memperbesar & mengunduh foto">
            <div style="flex: 1; min-width: 0; word-break: break-word; overflow-wrap: break-word;">
              <span style="background: rgba(2, 132, 199, 0.15); color: #0284C7; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">Sekretaris Jurusan</span>
              <h4 style="font-size: 1.15rem; color: var(--color-navy-primary); margin: 0.4rem 0 0.15rem 0; font-weight: 800; word-break: break-word;">${sekjur.nama}${sekjur.gelar ? ', ' + sekjur.gelar : ''}</h4>
              <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.15rem; word-break: break-word;">
                <span>NIP: ${sekjur.nidn}</span>
                <span style="color: var(--color-blue-accent); font-weight: 600; word-break: break-all; overflow-wrap: anywhere;">${sekjur.email}</span>
              </div>
              ${isAdmin ? `<button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-top: 0.4rem;" onclick="window.changeDosenPhoto('dsn-sekjur')">Ubah Foto</button>` : ''}
            </div>
          </div>
        </div>

        <!-- Tier 2: Koordinator Program Studi (4 Cards Side-by-Side in 1 Row) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 1.15rem;">
          ${coordList.map(c => `
            <div style="background: #FFF; border: 1px solid rgba(226, 232, 240, 0.9); border-radius: var(--radius-lg); padding: 1.35rem; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 6px 18px rgba(15, 41, 66, 0.05); transition: var(--transition-fast);">
              <div style="position: relative; margin-bottom: 0.85rem;">
                <img src="${c.foto}" alt="${c.nama}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; object-position: center 15%; background: #FFF; border: 2px solid var(--color-gold-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${c.foto}', '${c.nama}')" title="Klik untuk memperbesar & mengunduh foto">
                <span style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); background: var(--color-navy-primary); color: #FFF; font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.5rem; border-radius: 99px; white-space: nowrap;">${c.jenjang}</span>
              </div>
              <span style="font-size: 0.75rem; font-weight: 800; color: var(--color-blue-accent); text-transform: uppercase; margin-bottom: 0.2rem;">Koprodi ${c.prodi_nama}</span>
              <h5 style="font-size: 0.98rem; color: var(--color-navy-primary); margin-bottom: 0.35rem; font-weight: 800; line-height: 1.3;">${c.nama}</h5>
              <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
                <div>NIP: ${c.nidn}</div>
                <div style="color: var(--text-light); word-break: break-all; margin-top: 0.15rem;">${c.email}</div>
              </div>
              ${isAdmin ? `<button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-top: 0.6rem;" onclick="window.changeCoordPhoto('${c.prodi_id}')">Ubah Foto</button>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getProfilPreviewHTML() {
    return `
      <section class="section" style="background: #FFFFFF;">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Profil & Struktur Pimpinan</span>
            <h2 class="section-title">Jurusan Manajemen FEB UTM</h2>
            <p class="section-subtitle">Mewujudkan lulusan manajerial yang berdaya saing global berbasis nilai-nilai etis dan keunggulan potensi lokal.</p>
          </div>

          <!-- Section Pimpinan & Koordinator -->
          ${this.getLeadershipSectionHTML()}

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 2rem;">
            <div style="background: #FFF; padding: 2.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: 0 8px 20px rgba(0,0,0,0.04);">
              <h3 style="margin-bottom: 1rem; color: var(--color-navy-primary);">Visi Jurusan</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7;">Menjadi Jurusan Manajemen yang terkemuka dalam penyelenggaraan pendidikan, penelitian, dan pengabdian masyarakat di bidang manajemen digital serta kewirausahaan pada tahun 2030.</p>
            </div>
            <div style="background: #FFF; padding: 2.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: 0 8px 20px rgba(0,0,0,0.04);">
              <h3 style="margin-bottom: 1rem; color: var(--color-navy-primary);">Misi Utama</h3>
              <ul style="color: var(--text-muted); font-size: 0.95rem; padding-left: 1.25rem; line-height: 1.8;">
                <li>Menyelenggarakan pendidikan manajemen berkualitas tinggi berstandar nasional dan internasional.</li>
                <li>Mengembangkan riset manajerial inovatif yang responsif terhadap perubahan industri.</li>
                <li>Memberdayakan masyarakat dan UMKM melalui program kewirausahaan berkelanjutan.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getProfilFullHTML() {
    return `
      <div class="container" style="padding: 4rem 1.5rem;">
        <div class="section-header">
          <span class="section-tag">Tentang Kami</span>
          <h2 class="section-title">Profil Lengkap & Struktur Organisasi Jurusan Manajemen</h2>
        </div>

        <!-- Section Pimpinan & Koordinator -->
        <div style="background: #FFF; padding: 2.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 3rem;">
          ${this.getLeadershipSectionHTML()}
        </div>

        <div style="background: #FFF; padding: 2.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); line-height: 1.8;">
          <h3 style="color: var(--color-navy-primary); margin-bottom: 1rem;">Sejarah & Identitas Institusi</h3>
          <p style="margin-bottom: 1.5rem; color: var(--text-muted);">Jurusan Manajemen merupakan salah satu jurusan tertua dan terbesar di lingkungan Fakultas Ekonomi dan Bisnis Universitas Trunojoyo Madura. Didirikan dengan komitmen tinggi untuk memajukan pendidikan tinggi di Madura dan Indonesia, Jurusan Manajemen mengelola 4 program studi berjenjang komplit mulai dari vokasi (D3), sarjana (S1), magister (S2), hingga doktoral (S3).</p>

          <h3 style="color: var(--color-navy-primary); margin-bottom: 1rem;">Keunggulan & Akreditasi</h3>
          <p style="margin-bottom: 1.5rem; color: var(--text-muted);">Dengan raihan **Akreditasi UNGGUL LAMEMBA** untuk Program Studi (D3, S1, dan S2) Manajemen serta dukungan laboratorium manajemen bisnis digital, inkubator bisnis kewirausahaan, dan laboratorium pengolahan data kuantitatif, kami terus mencetak pemimpin bisnis masa depan.</p>
        </div>
      </div>
    `;
  }

  getProdiSectionHTML(full = false) {
    const prodiList = db.getProdiList();
    if (this.selectedProdiId) {
      const selected = prodiList.find(p => p.id === this.selectedProdiId);
      if (selected) {
        return this.getProdiDetailHTML(selected);
      }
    }

    const isAdmin = auth.getRole() === ROLES.ADMIN;
    const dosenList = db.getDosenList();

    const cards = prodiList.map(p => {
      const coordNameClean = p.koordinator_nama ? p.koordinator_nama.split(',')[0].trim() : '';
      const matchDosen = dosenList.find(d => d.nama && coordNameClean && d.nama.toLowerCase().includes(coordNameClean.toLowerCase()));
      let rawFoto = (matchDosen && matchDosen.foto_url) ? matchDosen.foto_url : p.foto_url;
      if (rawFoto && !rawFoto.startsWith('http') && !rawFoto.startsWith('IMAGE/') && !rawFoto.startsWith('/')) {
        rawFoto = 'IMAGE/' + rawFoto;
      }
      const coordFoto = rawFoto || 'IMAGE/yustin.jpg';
      const coordJabatan = p.koordinator_jabatan || (matchDosen && matchDosen.jabatan ? matchDosen.jabatan : `Koordinator Prodi ${p.jenjang}`);

      return `
      <div class="prodi-card" id="card-${p.id}">
        <div class="prodi-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; gap: 0.5rem; flex-wrap: wrap;">
            <span class="prodi-tag">Akreditasi ${p.akreditasi}</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #FFF; background: rgba(255, 255, 255, 0.15); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.2);">Jenjang ${p.jenjang}</span>
          </div>
          <h3 class="prodi-title" style="margin: 0; line-height: 1.35; font-size: 1.25rem; font-weight: 700;">${p.nama}</h3>
          <p style="font-size: 0.8rem; opacity: 0.85; margin: 0.4rem 0 0 0;">Total ${p.jumlah_mahasiswa} Mahasiswa Aktif</p>
        </div>
        <div class="prodi-body">
          <div class="coordinator-box">
            <div class="coordinator-img-wrapper" style="cursor: pointer;" onclick="window.previewAndDownloadPhoto('${coordFoto}', '${p.koordinator_nama}')" title="Klik untuk memperbesar & mengunduh foto">
              <img src="${coordFoto}" alt="${p.koordinator_nama}" class="coordinator-img" id="img-coord-${p.id}">
              ${isAdmin ? `<button class="btn-upload-photo" onclick="event.stopPropagation(); window.changeCoordPhoto('${p.id}')">Ubah Foto</button>` : ''}
            </div>
            <div class="coordinator-info">
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-gold-primary); text-transform: uppercase;">${coordJabatan}</span>
              <h4>${p.koordinator_nama}</h4>
              <p>${p.koordinator_gelar}</p>
            </div>
          </div>
          <p class="prodi-desc" style="margin-bottom: 1.25rem;">${p.deskripsi}</p>
          <button class="btn-primary" style="width: 100%; margin-top: auto; justify-content: center; font-weight: 800; font-size: 0.85rem;" onclick="window.navigateToProdi('${p.id}')">Lihat Detail ${p.nama} &raquo;</button>
        </div>
      </div>
    `;
    }).join('');

    return `
      <section class="section prodi-section-hero" style="position: relative; background: linear-gradient(135deg, rgba(15, 41, 66, 0.90) 0%, rgba(10, 25, 40, 0.86) 100%), url('IMAGE/Rektorat.JPG') center/cover no-repeat; padding: 4.5rem 0; overflow: hidden; border-top: 3px solid var(--color-gold-primary); border-bottom: 3px solid var(--color-gold-primary); margin-top: 2rem;">
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
        <div class="container" style="position: relative; z-index: 2;">
          <div class="section-header" style="text-align: center; margin-bottom: 2.5rem;">
            <span class="section-tag" style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-weight: 900; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">PROGRAM STUDI JURUSAN MANAJEMEN</span>
            <h2 class="section-title" style="color: #FFF; font-size: 2.1rem; font-weight: 900; margin-top: 0.6rem; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">Pilihan Jenjang Studi Berkualitas</h2>
            <p class="section-subtitle" style="color: #E2E8F0; font-size: 0.98rem; max-width: 700px; margin: 0.4rem auto 0 auto; opacity: 0.95; line-height: 1.6;">Jurusan Manajemen FEB UTM mengampu 4 program studi unggulan berstandar nasional dan internasional.</p>
          </div>
          <div class="prodi-grid">
            ${cards}
          </div>
        </div>
      </section>
    `;
  }

  getProdiDetailHTML(p) {
    const isAdmin = auth.getRole() === ROLES.ADMIN;
    const dosenList = db.getDosenList();

    const prodiDetailsMap = {
      'prodi-d3': {
        gelar: 'Ahli Madya Manajemen (A.Md.M.)',
        sks: '108 SKS (6 Semester)',
        akreditasi: 'Unggul (LAMEMBA)',
        bannerImg: 'IMAGE/Gedung FEB UTM.png',
        visi: 'Menjadi Program Studi Diploma 3 Keahlian Terapan Wirausaha Berdaya Saing Global Berbasis Inovasi Bisnis Lokal pada Tahun 2030.',
        misi: [
          'Menyelenggarakan pendidikan vokasi terapan berbasis project-based learning & inkubasi bisnis nyata.',
          'Melaksanakan pendampingan UMKM berbasis keunggulan komoditas lokal Madura.',
          'Membangun jejaring kemitraan strategis dengan industri retail, e-commerce, dan dunia usaha nasional.'
        ],
        peminatan: [
          { nama: 'Digital Entrepreneurship & E-Commerce', ket: 'Strategi pemasaran digital, pengoperasian toko online, dan manajemen startup e-commerce.' },
          { nama: 'Kuliner & Industri Kreatif Agrokomoditas', ket: 'Inovasi olahan pangan lokal Madura, branding produk kreatif, dan manajemen produksi makanan.' },
          { nama: 'Ritel & Manajemen Usaha Mikro (UMKM)', ket: 'Pengelolaan rantai pasok ritel modern, pembukuan keuangan UMKM, dan pelayanan pelanggan.' }
        ],
        karir: [
          'Founder / Owner Business Startup',
          'Digital Marketing & E-Commerce Specialist',
          'Business Development Representative (BDR)',
          'Konsultan & Pendamping Lapangan UMKM'
        ],
        fasilitas: ['Lab Inkubator Bisnis SAE', 'Lab Digital Marketing', 'Business Practice Studio']
      },
      'prodi-s1': {
        gelar: 'Sarjana Manajemen (S.M.)',
        sks: '144 SKS (8 Semester)',
        akreditasi: 'Unggul (LAMEMBA)',
        bannerImg: 'IMAGE/Rektorat.JPG',
        visi: 'Menjadi Pusat Keunggulan Pendidikan S1 Manajemen Berjiwa Leadership, Analitis Digital, dan Beretika Bisnis Global.',
        misi: [
          'Menyelenggarakan kurikulum manajemen mutakhir terintegrasi teknologi data analytics dan etika korporasi.',
          'Menghasilkan riset manajerial berkualitas tinggi yang dipublikasikan pada jurnal bereputasi.',
          'Mengimplementasikan program pengabdian masyarakat bernilai guna tinggi bagi kemandirian ekonomi daerah.'
        ],
        peminatan: [
          { nama: 'Manajemen Pemasaran (Marketing Management)', ket: 'Brand strategist, customer relationship management, neuromarketing, dan ekonometrika konsumen.' },
          { nama: 'Manajemen Keuangan (Financial Management)', ket: 'Analisis portofolio investasi, corporate finance, financial technology, dan manajemen risiko.' },
          { nama: 'Manajemen Sumber Daya Manusia (HR Management)', ket: 'Talent management, kepemimpinan organisasi, kompensasi strategis, dan hubungan industrial.' }
        ],
        karir: [
          'Corporate Manager & Management Trainee (MT)',
          'Financial Analyst & Investment Banker',
          'Brand Manager & Marketing Strategist',
          'Human Resource Professional / Talent Manager'
        ],
        fasilitas: ['Galeri Investasi BEI UTM', 'Lab Perilaku Organisasi & SDM', 'Lab Software Statistika SPSS & SmartPLS']
      },
      'prodi-s2': {
        gelar: 'Magister Manajemen (M.M.)',
        sks: '42 SKS (4 Semester)',
        akreditasi: 'Unggul (LAMEMBA)',
        bannerImg: 'IMAGE/Gedung FEB UTM.png',
        visi: 'Menjadi Program Magister Manajemen Terkemuka dalam Mencetak Executive Leader dan Peneliti Terapan Berwawasan Strategis Kebijakan Bisnis.',
        misi: [
          'Menyelenggarakan proses pembelajaran magister berbasis studi kasus kebijakan korporasi global.',
          'Menghasilkan karya tesis dan riset terapan unggulan yang menyelesaikan dinamika persaingan industri.',
          'Memperluas jejaring executive alumni, pakar praktisi bisnis, dan konsorsium akademis internasional.'
        ],
        peminatan: [
          { nama: 'Strategic Leadership & Corporate Governance', ket: 'Perencanaan bisnis jangka panjang, tata kelola perusahaan bersih (GCG), dan transformasi organisasi.' },
          { nama: 'Financial Technology & Risk Management', ket: 'Strategi pembiayaan modern, restrukturisasi modal, teknologi pasar finansial, dan audit risiko.' },
          { nama: 'Global Supply Chain & Logistics Strategy', ket: 'Integrasi jaringan distribusi internasional, green supply chain, dan manajemen pengadaan barang strategis.' }
        ],
        karir: [
          'Senior Executive Manager / Chief Officer (C-Level)',
          'Senior Corporate Strategic Consultant',
          'Senior Business Policy Researcher & Analyst',
          'Dosen Perguruan Tinggi & Perencana Pembangunan'
        ],
        fasilitas: ['Executive Case Study Room', 'Akses Journal Database ScienceDirect & Scopus', 'Executive Lounge & Discussion Space']
      },
      'prodi-s3': {
        gelar: 'Doktor Ilmu Manajemen (Dr.)',
        sks: '48 SKS (6 Semester)',
        akreditasi: 'Baik Sekali',
        bannerImg: 'IMAGE/Rektorat.JPG',
        visi: 'Menjadi Program Doktoral Ilmu Manajemen Berorientasi Penemuan Filosofis Keilmuan Baru dan Penguatan Kebijakan Pembangunan Nasional.',
        misi: [
          'Menyelenggarakan pendidikan doktoral berbasis filsafat ilmu, epistemologi, dan metodologi riset sains manajemen.',
          'Memfasilitasi penulisan disertasi bereputasi tinggi yang menembus publikasi Scopus Q1/Q2.',
          'Memberikan sumbangan konsep filosofis mutakhir bagi perumusan kebijakan bisnis dan regulasi ekonomi nasional.'
        ],
        peminatan: [
          { nama: 'Filsafat Teori Manajemen & Strategi Korporasi', ket: 'Pengembangan teori baru manajemen strategis, paradigma kepemimpinan transformatif, dan dinamika industri.' },
          { nama: 'Ekonometrika Bisnis & Perilaku Keuangan Lanjutan', ket: 'Riset kuantitatif tingkat tinggi, teori portofolio makro finansial, dan pemodelan sistemik.' },
          { nama: 'Manajemen Keberlanjutan & Kebijakan Publik Terpadu', ket: 'Environmental Social Governance (ESG), kebijakan pembangunan ekonomi makro, dan etika pasar.' }
        ],
        karir: [
          'Guru Besar / Profesor & Academic Fellow',
          'Principal Scientist & Head of Research Institute',
          'Expert Policy Advisor / Staf Ahli Kementerian & BUMN',
          'Senior Board of Commissioner / Board of Directors'
        ],
        fasilitas: ['Doctoral Research Center', 'High-Performance Econometric Lab', 'International Defense Dissertation Hall']
      }
    };

    const details = prodiDetailsMap[p.id] || prodiDetailsMap['prodi-s1'];

    const prodiDosen = dosenList.filter(d => d.prodi_id === p.id || (d.prodi_nama && d.prodi_nama.toLowerCase().includes(p.jenjang.toLowerCase())));

    let pFoto = p.foto_url || 'IMAGE/yustin.jpg';
    if (pFoto && !pFoto.startsWith('http') && !pFoto.startsWith('IMAGE/') && !pFoto.startsWith('/')) {
      pFoto = 'IMAGE/' + pFoto;
    }

    return `
      <div style="background: #F8FAFC; min-height: 100vh; padding-bottom: 4rem;">
        <!-- Header Banner Detail -->
        <div style="background: linear-gradient(135deg, rgba(7, 19, 37, 0.90) 0%, rgba(15, 41, 66, 0.85) 100%), url('${details.bannerImg}') center/cover no-repeat; color: #FFF; padding: 4rem 1.5rem 3.5rem 1.5rem; border-bottom: 4px solid var(--color-gold-primary);">
          <div class="container">
            <button onclick="window.showAllProdi()" class="btn-gold" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; font-weight: 800; margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(212,175,55,0.3);">
              &laquo; Kembali ke Ringkasan Semua Prodi
            </button>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem;">
              <span style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-size: 0.78rem; font-weight: 900; padding: 0.3rem 0.85rem; border-radius: 99px; text-transform: uppercase;">Jenjang ${p.jenjang}</span>
              <span style="background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.3); color: #FFF; font-size: 0.78rem; font-weight: 800; padding: 0.3rem 0.85rem; border-radius: 99px;">Akreditasi ${details.akreditasi}</span>
              <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34D399; font-size: 0.78rem; font-weight: 800; padding: 0.3rem 0.85rem; border-radius: 99px;">Aktif (${p.jumlah_mahasiswa} Mahasiswa)</span>
            </div>
            <h1 style="color: #FFF; font-size: 2.3rem; font-weight: 900; margin: 0.4rem 0 0.8rem 0; line-height: 1.25;">${p.nama} FEB UTM</h1>
            <p style="font-size: 1.05rem; opacity: 0.95; max-width: 850px; line-height: 1.6; color: #E2E8F0;">${p.deskripsi}</p>
          </div>
        </div>

        <div class="container" style="margin-top: -2.5rem; position: relative; z-index: 10;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
            <div style="background: #FFF; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 52px; height: 52px; border-radius: 12px; background: rgba(15, 41, 66, 0.08); color: var(--color-navy-primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; flex-shrink: 0;">🎓</div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Gelar Lulusan</span>
                <h4 style="margin: 0.15rem 0 0 0; color: var(--color-navy-primary); font-size: 0.98rem; font-weight: 800;">${details.gelar}</h4>
              </div>
            </div>
            <div style="background: #FFF; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 52px; height: 52px; border-radius: 12px; background: rgba(212, 175, 55, 0.12); color: #B59325; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; flex-shrink: 0;">📚</div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Beban Studi</span>
                <h4 style="margin: 0.15rem 0 0 0; color: var(--color-navy-primary); font-size: 0.98rem; font-weight: 800;">${details.sks}</h4>
              </div>
            </div>
            <div style="background: #FFF; padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 52px; height: 52px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; flex-shrink: 0;">🏆</div>
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Status Akreditasi</span>
                <h4 style="margin: 0.15rem 0 0 0; color: var(--color-navy-primary); font-size: 0.98rem; font-weight: 800;">${details.akreditasi}</h4>
              </div>
            </div>
          </div>

          <!-- Section Grid 2 Kolom: Visi Misi & Profil Koordinator -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
            
            <!-- Visi & Misi -->
            <div style="background: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
              <span style="background: rgba(15, 41, 66, 0.08); color: var(--color-navy-primary); font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Visi & Misi Akademik</span>
              <h3 style="color: var(--color-navy-primary); font-size: 1.35rem; font-weight: 800; margin: 0.6rem 0 1rem 0;">Visi Program Studi</h3>
              <p style="color: var(--text-muted); line-height: 1.6; font-style: italic; background: #F8FAFC; padding: 1rem 1.25rem; border-left: 4px solid var(--color-gold-primary); border-radius: 0 8px 8px 0; margin-bottom: 1.5rem; font-weight: 500;">
                "${details.visi}"
              </p>

              <h4 style="color: var(--color-navy-primary); font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem;">Misi Strategis:</h4>
              <ul style="padding-left: 1.25rem; color: var(--text-muted); line-height: 1.7; font-size: 0.9rem;">
                ${details.misi.map(m => `<li style="margin-bottom: 0.5rem;">${m}</li>`).join('')}
              </ul>
            </div>

            <!-- Koordinator & Fasilitas -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
              <div style="background: #FFF; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.5rem;">
                <img src="${pFoto}" alt="${p.koordinator_nama}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 3px solid var(--color-gold-primary); box-shadow: var(--shadow-sm); flex-shrink: 0;">
                <div>
                  <span style="font-size: 0.72rem; font-weight: 800; color: var(--color-gold-primary); text-transform: uppercase;">${p.koordinator_jabatan || 'Koordinator Prodi'}</span>
                  <h4 style="font-size: 1.15rem; color: var(--color-navy-primary); margin: 0.2rem 0; font-weight: 800;">${p.koordinator_nama}</h4>
                  <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Fakultas Ekonomi dan Bisnis UTM</p>
                </div>
              </div>

              <div style="background: #FFF; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); flex: 1;">
                <h4 style="color: var(--color-navy-primary); font-size: 1.05rem; font-weight: 800; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                  🏢 Fasilitas & Laboratorium Unggulan
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${details.fasilitas.map(f => `
                    <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: var(--color-navy-primary); background: #F8FAFC; padding: 0.6rem 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0; font-weight: 700;">
                      <span style="color: #10B981;">✓</span> ${f}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

          </div>

          <!-- Konsentrasi / Peminatan Bidang -->
          <div style="background: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 2.5rem;">
            <div style="margin-bottom: 1.5rem;">
              <span style="background: rgba(212, 175, 55, 0.15); color: #B59325; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 4px; text-transform: uppercase;">Pilihan Keahlian</span>
              <h3 style="color: var(--color-navy-primary); font-size: 1.4rem; font-weight: 800; margin-top: 0.4rem;">Konsentrasi & Peminatan Bidang Utama</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1.25rem;">
              ${details.peminatan.map(pem => `
                <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; transition: var(--transition-fast);">
                  <h4 style="color: var(--color-navy-primary); font-size: 1.05rem; font-weight: 800; margin-bottom: 0.5rem; line-height: 1.35;">${pem.nama}</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; line-height: 1.5;">${pem.ket}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Peluang Karir Alumni -->
          <div style="background: linear-gradient(135deg, var(--color-navy-primary) 0%, var(--color-navy-dark) 100%); color: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); margin-bottom: 2.5rem; box-shadow: var(--shadow-md);">
            <div style="margin-bottom: 1.5rem; text-align: center;">
              <span style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-size: 0.75rem; font-weight: 900; padding: 0.25rem 0.75rem; border-radius: 4px; text-transform: uppercase;">Prospek Kelulusan</span>
              <h3 style="color: #FFF; font-size: 1.5rem; font-weight: 900; margin-top: 0.4rem;">Peluang Karir & Profil Alumni</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap: 1rem;">
              ${details.karir.map(k => `
                <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); padding: 1.1rem; border-radius: var(--radius-lg); text-align: center; font-size: 0.9rem; font-weight: 800; color: #FFF; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <span>🎯</span> ${k}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Direktori Dosen Pengampu Prodi Ini -->
          <div style="background: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="margin-bottom: 1.5rem;">
              <span style="background: rgba(2, 132, 199, 0.1); color: var(--color-blue-accent); font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 4px; text-transform: uppercase;">Pengajar Professional</span>
              <h3 style="color: var(--color-navy-primary); font-size: 1.4rem; font-weight: 800; margin-top: 0.4rem;">Dosen Pengampu ${p.nama}</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.25rem;">
              ${prodiDosen.length ? prodiDosen.map(d => {
                let dFoto = d.foto_url || '';
                if (dFoto && !dFoto.startsWith('http') && !dFoto.startsWith('IMAGE/') && !dFoto.startsWith('/')) {
                  dFoto = 'IMAGE/' + dFoto;
                }
                return `
                  <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; gap: 1rem; align-items: center;">
                    <img src="${dFoto}" alt="${d.nama}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 2px solid var(--color-gold-primary); flex-shrink: 0;">
                    <div>
                      <h5 style="margin: 0 0 0.2rem 0; color: var(--color-navy-primary); font-size: 0.95rem; font-weight: 800;">${d.nama}, ${d.gelar}</h5>
                      <p style="margin: 0; font-size: 0.78rem; color: var(--text-muted);">${d.jabatan ? `NIP: ${d.nidn} | ${d.jabatan}` : `NIP: ${d.nidn}`}</p>
                    </div>
                  </div>
                `;
              }).join('') : `<p style="color: var(--text-muted);">Informasi dosen pengampu untuk prodi ini tersedia di direktori dosen utama.</p>`}
            </div>
          </div>

          <!-- Bottom Action Back -->
          <div style="text-align: center; margin-top: 3rem;">
            <button onclick="window.showAllProdi()" class="btn-gold" style="padding: 0.85rem 2rem; font-size: 0.95rem; font-weight: 800; box-shadow: 0 6px 18px rgba(212,175,55,0.4);">
              &laquo; Kembali ke Ringkasan Semua Program Studi
            </button>
          </div>

        </div>
      </div>
    `;
  }

  getDosenSectionHTML() {
    let list = db.getDosenList();
    if (this.prodiFilter !== 'all') {
      list = list.filter(d => d.prodi_id === this.prodiFilter);
    }
    if (this.dosenSearch.trim() !== '') {
      const q = this.dosenSearch.toLowerCase();
      list = list.filter(d => d.nama.toLowerCase().includes(q) || d.nidn.includes(q) || d.email.toLowerCase().includes(q));
    }

    const isAdmin = auth.getRole() === ROLES.ADMIN;
    const hadirList = db.getDaftarHadirList();

    const leaderPhotos = {
      'Fathor AS, SE., M.M.': 'IMAGE/Fathor.jpg',
      'Fathor AS': 'IMAGE/Fathor.jpg',
      'M. Boy Singgih Gitayuda, S.E., M.M.': 'IMAGE/Boy.jpg',
      'M. Boy Singgih Gitayuda': 'IMAGE/Boy.jpg',
      'Darul Islam, SE., M.M.': 'IMAGE/Darul.jpg',
      'Darul Islam': 'IMAGE/Darul.jpg',
      'Yustina Chrismardani, SSi., M.M.': 'IMAGE/yustin.jpg',
      'Yustina Chrismardani': 'IMAGE/yustin.jpg',
      'Dr. Bambang Setiyo Pambudi, S.E., M.M.': 'IMAGE/Bambang.jpg',
      'Dr. Bambang Setiyo Pambudi': 'IMAGE/Bambang.jpg',
      'Dr. A. Yahya Surya Winata, S.E., M.Si.': 'IMAGE/Yahya.jpg',
      'Dr. A. Yahya Surya Winata': 'IMAGE/Yahya.jpg'
    };

    const statusCardsHTML = hadirList.map(h => {
      const isHadir = (h.status_hadir || '').includes('Hadir');
      const photo = leaderPhotos[h.nama_pimpinan] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
      const badgeCls = isHadir ? 'background: rgba(16,185,129,0.12); color: #10B981;' : 'background: rgba(245,158,11,0.12); color: #D97706;';

      return `
        <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.65rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; transition: var(--transition-normal); border-top: 4px solid var(--color-navy-primary);">
          <div style="display: flex; align-items: flex-start; gap: 1.15rem; margin-bottom: 1.15rem;">
            <div style="position: relative; flex-shrink: 0;">
              <img src="${photo}" alt="${h.nama_pimpinan}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; object-position: center 15%; background: #FFF; border: 2.5px solid var(--color-gold-primary); box-shadow: var(--shadow-sm); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${photo}', '${h.nama_pimpinan}')" title="Klik untuk memperbesar & mengunduh foto">
              <span style="position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; border-radius: 50%; background: ${isHadir ? '#10B981' : '#F59E0B'}; border: 2.5px solid #FFF;" title="${h.status_hadir}"></span>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                <span style="font-size: 0.72rem; font-weight: 800; color: var(--color-blue-accent); text-transform: uppercase; letter-spacing: 0.4px;">${h.jabatan}</span>
                <span style="font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 99px; ${badgeCls}">${h.status_hadir}</span>
              </div>
              <h4 style="font-size: 1.08rem; color: var(--color-navy-primary); margin: 0; line-height: 1.3; font-weight: 800;">${h.nama_pimpinan}</h4>
            </div>
          </div>
          <div style="background: #F8FAFC; border-radius: var(--radius-md); padding: 0.85rem 1rem; border: 1px solid #E2E8F0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
            <div style="margin-bottom: 0.3rem;">
              <strong style="color: var(--color-navy-primary);">📍 Keberadaan:</strong> ${h.catatan || 'Ruang Kerja FEB Lt. 2'}
            </div>
            <div>
              <strong style="color: var(--color-navy-primary);">📌 Agenda:</strong> ${h.agenda} (${h.waktu_masuk})
            </div>
          </div>
          ${isAdmin ? `<button class="btn-gold" style="padding: 0.4rem 0.75rem; font-size: 0.75rem; width: 100%; margin-top: 0.75rem; justify-content: center;" onclick="window.editAttendanceStatus('${h.id}')">✏️ Edit Presensi Pimpinan</button>` : ''}
        </div>
      `;
    }).join('');

    const tableRows = hadirList.map(h => `
      <tr>
        <td><strong>${h.nama_pimpinan}</strong><br><span style="font-size: 0.78rem; color: var(--color-blue-accent);">${h.jabatan}</span></td>
        <td>${UI.getStatusBadgeHTML(h.status_hadir)}</td>
        <td>${h.waktu_masuk || '-'}</td>
        <td>${h.agenda}</td>
        <td><span style="font-size: 0.82rem; color: var(--text-muted);">${h.catatan || '-'}</span></td>
        <td>${h.tanggal}</td>
        ${isAdmin ? `<td><button class="btn-primary" style="padding: 0.25rem 0.55rem; font-size: 0.72rem;" onclick="window.editAttendanceStatus('${h.id}')">Edit Presensi</button></td>` : ''}
      </tr>
    `).join('');

    const cards = list.map(d => {
      let dFoto = d.foto_url || '';
      if (dFoto && !dFoto.startsWith('http') && !dFoto.startsWith('IMAGE/') && !dFoto.startsWith('/')) {
        dFoto = 'IMAGE/' + dFoto;
      }
      return `
      <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; gap: 1.25rem; align-items: center; box-shadow: var(--shadow-sm);">
        <div style="position: relative; flex-shrink: 0;">
          <img src="${dFoto}" alt="${d.nama}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; object-position: center 15%; background: #FFF; border: 2.5px solid var(--color-gold-primary); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${dFoto}', '${d.nama}')" title="Klik untuk memperbesar & mengunduh foto">
          ${isAdmin ? `<button style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); background: var(--color-navy-primary); color: #FFF; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 4px; white-space: nowrap;" onclick="window.changeDosenPhoto('${d.id}')">Ubah Foto</button>` : ''}
        </div>
        <div style="flex: 1;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-blue-accent);">${d.prodi_nama}</span>
          <h4 style="font-size: 1.05rem; color: var(--color-navy-primary); margin: 0.1rem 0;">${d.nama}, ${d.gelar}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">${d.jabatan ? `NIP: ${d.nidn} | ${d.jabatan}` : `NIP: ${d.nidn}`}</p>
        </div>
        ${isAdmin ? `<button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="window.deleteDosen('${d.id}')">Hapus</button>` : ''}
      </div>
    `;
    }).join('');

    return `
      <section class="section" style="background: #FFF;">
        <div class="container">
          <!-- Banner Presensi Pimpinan -->
          <div style="background: linear-gradient(135deg, var(--color-navy-primary) 0%, var(--color-navy-light) 100%); color: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); margin-bottom: 2.5rem;">
            <div>
              <span style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 4px; letter-spacing: 0.5px;">DIREKTORI DOSEN & DAFTAR PRESENSI PIMPINAN</span>
              <h2 style="color: #FFF; margin-top: 0.6rem; font-size: 1.65rem;">Status Kehadiran Pimpinan & Dosen Jurusan Manajemen</h2>
              <p style="font-size: 0.92rem; opacity: 0.9; margin-top: 0.3rem;">Informasi real-time presensi pimpinan di tempat/kampus, agenda rapat, dan direktori dosen pengampu.</p>
            </div>
          </div>

          <!-- Section 1: Monitoring Keberadaan Real-Time Pimpinan -->
          <div style="margin-bottom: 3.5rem;">
            <div class="section-header" style="text-align: center; margin-bottom: 1.5rem;">
              <span class="section-tag">Status Real-Time Pimpinan</span>
              <h2 class="section-title">Monitoring Keberadaan Pimpinan Jurusan Hari Ini</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.75rem;">
              ${statusCardsHTML}
            </div>
          </div>

          <!-- Section 2: Direktori Dosen -->
          <div>
            <div class="section-header">
              <span class="section-tag">Tenaga Pengajar Pakar</span>
              <h2 class="section-title">Dosen Jurusan Manajemen</h2>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; justify-content: space-between; align-items: center;">
              <div class="search-box">
                <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="search-dosen" placeholder="Cari nama dosen / NIP..." value="${this.dosenSearch}">
              </div>
              <div class="filter-group">
                <label class="form-label" style="margin: 0;">Filter Prodi:</label>
                <select id="filter-prodi-dosen" class="select-input">
                  <option value="all" ${this.prodiFilter === 'all' ? 'selected' : ''}>Semua Program Studi</option>
                  <option value="prodi-d3" ${this.prodiFilter === 'prodi-d3' ? 'selected' : ''}>D3 Entrepreneurship</option>
                  <option value="prodi-s1" ${this.prodiFilter === 'prodi-s1' ? 'selected' : ''}>S1 Manajemen</option>
                  <option value="prodi-s2" ${this.prodiFilter === 'prodi-s2' ? 'selected' : ''}>S2 Manajemen</option>
                  <option value="prodi-s3" ${this.prodiFilter === 'prodi-s3' ? 'selected' : ''}>S3 Doktor Ilmu Manajemen</option>
                </select>
                ${isAdmin ? `<button class="btn-primary" id="btn-open-add-dosen">+ Tambah Dosen</button>` : ''}
              </div>
            </div>
            <div id="dosen-cards-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.5rem;">
              ${cards.length ? cards : `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #F8FAFC; border-radius: var(--radius-lg); color: #94A3B8;">Tidak ada data dosen yang sesuai dengan pencarian.</div>`}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  updateDosenCards() {
    const cardsContainer = document.getElementById('dosen-cards-container');
    if (!cardsContainer) {
      this.renderMainContent();
      return;
    }
    const isAdmin = auth.getRole() === ROLES.ADMIN;
    let list = db.getDosenList();

    if (this.dosenSearch) {
      const q = this.dosenSearch.toLowerCase();
      list = list.filter(d =>
        (d.nama && d.nama.toLowerCase().includes(q)) ||
        (d.nidn && d.nidn.toLowerCase().includes(q)) ||
        (d.jabatan && d.jabatan.toLowerCase().includes(q)) ||
        (d.prodi_nama && d.prodi_nama.toLowerCase().includes(q))
      );
    }
    if (this.prodiFilter !== 'all') {
      list = list.filter(d => d.prodi_id === this.prodiFilter);
    }

    if (list.length === 0) {
      cardsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #F8FAFC; border-radius: var(--radius-lg); color: #94A3B8;">Tidak ada data dosen yang sesuai dengan pencarian.</div>`;
      return;
    }

    cardsContainer.innerHTML = list.map(d => {
      let dFoto = d.foto_url || '';
      if (dFoto && !dFoto.startsWith('http') && !dFoto.startsWith('IMAGE/') && !dFoto.startsWith('/')) {
        dFoto = 'IMAGE/' + dFoto;
      }
      return `
      <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; gap: 1.25rem; align-items: center; box-shadow: var(--shadow-sm);">
        <div style="position: relative; flex-shrink: 0;">
          <img src="${dFoto}" alt="${d.nama}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; object-position: center 15%; background: #FFF; border: 2.5px solid var(--color-gold-primary); cursor: pointer;" onclick="window.previewAndDownloadPhoto('${dFoto}', '${d.nama}')" title="Klik untuk memperbesar & mengunduh foto">
          ${isAdmin ? `<button style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); background: var(--color-navy-primary); color: #FFF; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 4px; white-space: nowrap;" onclick="window.changeDosenPhoto('${d.id}')">Ubah Foto</button>` : ''}
        </div>
        <div style="flex: 1;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-blue-accent);">${d.prodi_nama}</span>
          <h4 style="font-size: 1.05rem; color: var(--color-navy-primary); margin: 0.1rem 0;">${d.nama}, ${d.gelar}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">${d.jabatan ? `NIP: ${d.nidn} | ${d.jabatan}` : `NIP: ${d.nidn}`}</p>
        </div>
        ${isAdmin ? `<button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="window.deleteDosen('${d.id}')">Hapus</button>` : ''}
      </div>
    `;
    }).join('');
  }

  getBeritaSectionHTML(full = false) {
    const newsList = db.getPengumumanList();
    const isAdmin = auth.getRole() === ROLES.ADMIN;

    const cards = newsList.map(n => {
      const badgeCls = n.penting ? 'background: rgba(225, 29, 72, 0.12); color: #E11D48; border: 1px solid rgba(225, 29, 72, 0.25);' : 'background: rgba(2, 132, 199, 0.12); color: #0284C7; border: 1px solid rgba(2, 132, 199, 0.25);';
      const categoryLabel = n.kategori || 'Pengumuman';

      return `
        <article style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; transition: var(--transition-normal); position: relative;">
          ${n.penting ? `<div style="position: absolute; top: -10px; right: 20px; background: #E11D48; color: #FFF; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.65rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(225,29,72,0.3);">PENTING</div>` : ''}
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
              <span style="font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.4px; ${badgeCls}">${categoryLabel}</span>
              <span style="font-size: 0.78rem; color: var(--text-light); display: flex; align-items: center; gap: 0.35rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${n.tanggal}
              </span>
            </div>
            <h3 style="font-size: 1.2rem; color: var(--color-navy-primary); margin-bottom: 0.75rem; font-weight: 800; line-height: 1.4;">${n.judul}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">${n.ringkasan || n.isi}</p>
          </div>
          <div style="border-top: 1px dashed var(--border-color); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-light);">
            <span>Oleh: <strong style="color: var(--color-navy-primary);">${n.penulis || 'Admin Jurusan'}</strong></span>
            ${isAdmin ? `<button class="btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; color: #E11D48; border-color: rgba(225,29,72,0.3);" onclick="if(confirm('Hapus berita ini?')){ db.deletePengumuman('${n.id}'); app.render(); }">Hapus</button>` : ''}
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="section" style="${full ? 'padding: 4rem 0;' : ''}">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Pusat Informasi Jurusan</span>
            <h2 class="section-title">Berita, Akademik & Pengumuman Terbaru</h2>
            <p class="section-subtitle">Dapatkan informasi terkini seputar kegiatan jurusan, pendaftaran yudisium, sosialisasi hibah, dan pengumuman akademik FEB UTM.</p>
            ${isAdmin && full ? `<div style="margin-top: 1.25rem;"><button class="btn-gold" id="btn-open-add-news">+ Terbitkan Pengumuman Baru</button></div>` : ''}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.75rem;">
            ${cards.length ? cards : `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem; background: #FFF; border-radius: var(--radius-xl); border: 1px dashed var(--border-color);">Belum ada berita atau pengumuman yang diterbitkan.</div>`}
          </div>
        </div>
      </section>
    `;
  }

  getKontakHTML() {
    return `
      <div class="container" style="padding: 3rem 1.5rem;">
        <div class="section-header">
          <span class="section-tag">Hubungi Kami</span>
          <h2 class="section-title">Sekretariat Jurusan Manajemen FEB UTM</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 2rem;">
          <div style="background: #FFF; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow-wrap: break-word; word-break: break-word;">
            <h3 style="color: var(--color-navy-primary); margin-bottom: 1.25rem; font-weight: 800;">Informasi Alamat & Kontak Sekretariat</h3>
            
            <div style="margin-bottom: 1.25rem; word-break: break-word;">
              <strong style="color: var(--color-navy-primary); display: block; margin-bottom: 0.25rem;">📍 Alamat Kantor Sekretariat:</strong>
              <p style="color: var(--text-muted); margin: 0; line-height: 1.6; font-size: 0.92rem;">
                Gedung Fakultas Ekonomi dan Bisnis (FEB) Lt. 2<br>
                Universitas Trunojoyo Madura<br>
                Jl. Raya Telang, PO. BOX 2 Kamal, Bangkalan - Jawa Timur (69162)
              </p>
            </div>

            <div style="margin-bottom: 1.25rem; word-break: break-word; overflow-wrap: break-word;">
              <strong style="color: var(--color-navy-primary); display: block; margin-bottom: 0.25rem;">📧 Email Resmi Jurusan:</strong>
              <span style="color: var(--color-blue-accent); font-weight: 700; word-break: break-all; overflow-wrap: anywhere; display: inline-block; font-size: 0.92rem;">jurusan.manajemen@trunojoyo.ac.id</span>
            </div>

            <div style="word-break: break-word;">
              <strong style="color: var(--color-navy-primary); display: block; margin-bottom: 0.25rem;">📞 Kontak Telepon:</strong>
              <span style="color: var(--text-muted); font-weight: 600; font-size: 0.92rem;">(031) 3011146 / Ext. 204</span>
            </div>
          </div>
          <div style="background: #FFF; padding: 2rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <img src="IMAGE/LOGO UTM.png" alt="Logo UTM" style="width: 84px; height: auto; max-height: 84px; object-fit: contain; margin-bottom: 1rem;">
            <h4 style="color: var(--color-navy-primary); font-weight: 800; margin: 0;">Lokasi Kampus Utama</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; line-height: 1.5;">Gedung FEB Universitas Trunojoyo Madura Bangkalan, Jawa Timur.</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- Student Portal HTML ---
  getStudentPortalHTML() {
    const user = auth.getCurrentUser();
    const userNama = (user.nama || '').toLowerCase().trim();
    const userNim = (user.nim_nidn || '').toLowerCase().trim();

    const allDocs = db.getPemberkasanList();
    let docList = allDocs.filter(d => {
      const dNama = (d.mahasiswa_nama || '').toLowerCase().trim();
      const dNim = (d.nim || '').toLowerCase().trim();
      const dId = (d.mahasiswa_id || '').toLowerCase().trim();
      const uId = (user.id || '').toLowerCase().trim();

      return (
        (uId && dId && dId === uId) ||
        (userNim && dNim && (dNim === userNim || dNim.includes(userNim) || userNim.includes(dNim))) ||
        (userNama && dNama && (dNama.includes(userNama) || userNama.includes(dNama)))
      );
    });

    const allPres = db.getPrestasiList();
    let presList = allPres.filter(p => {
      const pNama = (p.mahasiswa_nama || '').toLowerCase().trim();
      const pNim = (p.nim || '').toLowerCase().trim();
      const pId = (p.mahasiswa_id || '').toLowerCase().trim();
      const uId = (user.id || '').toLowerCase().trim();

      return (
        (uId && pId && pId === uId) ||
        (userNim && pNim && (pNim === userNim || pNim.includes(userNim) || userNim.includes(pNim))) ||
        (userNama && pNama && (pNama.includes(userNama) || userNama.includes(pNama)))
      );
    });

    const docRows = docList.map(d => `
      <tr>
        <td><strong>${d.id}</strong></td>
        <td>${d.jenis_berkas}</td>
        <td>${d.file_name} <span style="font-size: 0.75rem; color: #64748B;">(${d.file_size})</span></td>
        <td>${d.tanggal_upload}</td>
        <td>${UI.getStatusBadgeHTML(d.status)}</td>
        <td>
          <div style="font-size: 0.8rem; color: #0F172A; max-width: 220px; line-height: 1.35; background: #F8FAFC; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid #E2E8F0;">
            ${d.catatan_admin || 'Belum ada catatan admin'}
          </div>
        </td>
      </tr>
    `).join('');

    const presRows = presList.map(p => `
      <tr>
        <td><strong>${p.judul}</strong></td>
        <td>${p.kategori}</td>
        <td><span class="badge" style="background: rgba(2,132,199,0.1); color: #0284C7;">${p.tingkat}</span></td>
        <td>${p.tanggal_kegiatan}</td>
        <td>${UI.getStatusBadgeHTML(p.status_verifikasi)}</td>
        <td>
          <div style="font-size: 0.8rem; color: #0F172A; max-width: 220px; line-height: 1.35; background: #F8FAFC; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid #E2E8F0;">
            ${p.catatan || 'Belum ada catatan admin'}
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="container" style="padding: 3rem 1.5rem;">
        <div style="background: linear-gradient(135deg, var(--color-navy-primary) 0%, var(--color-navy-light) 100%); color: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px;">PORTAL MAHASISWA</span>
            <h2 style="color: #FFF; margin-top: 0.5rem; font-weight: 800;">Selamat Datang, ${user.nama}</h2>
            <p style="font-size: 0.9rem; opacity: 0.9; margin: 0.2rem 0 0 0;">NIM: ${user.nim_nidn} | Program Studi: ${user.prodi_nama || 'S1 Manajemen'}</p>
          </div>
          <div>
            <a href="https://script.google.com/macros/s/AKfycbxvM9GnakdnMI2uSRr5qZ4xIU3SzN8FEKhCL05dMg1dBexu75sYe_k6XUl_178vq9axQg/exec" target="_blank" rel="noopener noreferrer" class="btn-gold" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-weight: 800; padding: 0.85rem 1.35rem;">
              🚀 Buka Formulir Pengajuan Berkas
            </a>
          </div>
        </div>

        <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2.5rem; text-align: center; box-shadow: var(--shadow-sm); margin-bottom: 3rem;">
          <div style="width: 64px; height: 64px; background: rgba(2, 132, 199, 0.1); color: var(--color-blue-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 style="color: var(--color-navy-primary); font-weight: 800; margin-bottom: 0.5rem;">Layanan Pengajuan Berkas Mahasiswa Online</h3>
          <p style="color: var(--text-muted); max-width: 620px; margin: 0 auto 1.75rem auto; line-height: 1.6; font-size: 0.95rem;">
            Seluruh pengajuan berkas fisik, izin penelitian, judul skripsi, beasiswa, dan administrasi akademik disalurkan melalui formulir online resmi Jurusan Manajemen FEB UTM.
          </p>
          <a href="https://script.google.com/macros/s/AKfycbxvM9GnakdnMI2uSRr5qZ4xIU3SzN8FEKhCL05dMg1dBexu75sYe_k6XUl_178vq9axQg/exec" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.6rem; text-decoration: none; padding: 0.85rem 1.6rem; font-weight: 800;">
            Buka Formulir Pengajuan Berkas (Google Form / Script) &raquo;
          </a>
        </div>
      </div>
    `;
  }

  // --- Portal Dosen (Leadership & Lecturer Attendance Register) ---
  getDosenPortalHTML() {
    const hadirList = db.getDaftarHadirList();

    const leaderPhotos = {
      'Fathor AS, SE., M.M.': 'IMAGE/Fathor.jpg',
      'Fathor AS': 'IMAGE/Fathor.jpg',
      'M. Boy Singgih Gitayuda, S.E., M.M.': 'IMAGE/Boy.jpg',
      'M. Boy Singgih Gitayuda': 'IMAGE/Boy.jpg',
      'Darul Islam, SE., M.M.': 'IMAGE/Darul.jpg',
      'Darul Islam': 'IMAGE/Darul.jpg',
      'Yustina Chrismardani, SSi., M.M.': 'IMAGE/yustin.jpg',
      'Yustina Chrismardani': 'IMAGE/yustin.jpg',
      'Dr. Bambang Setiyo Pambudi, S.E., M.M.': 'IMAGE/Bambang.jpg',
      'Dr. Bambang Setiyo Pambudi': 'IMAGE/Bambang.jpg',
      'Dr. A. Yahya Surya Winata, S.E., M.Si.': 'IMAGE/Yahya.jpg',
      'Dr. A. Yahya Surya Winata': 'IMAGE/Yahya.jpg'
    };

    const statusCardsHTML = hadirList.map(h => {
      const isHadir = (h.status_hadir || '').includes('Hadir');
      const photo = leaderPhotos[h.nama_pimpinan] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
      const badgeCls = isHadir ? 'background: rgba(16,185,129,0.12); color: #10B981;' : 'background: rgba(245,158,11,0.12); color: #D97706;';

      return `
        <div style="background: #FFF; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.65rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; transition: var(--transition-normal); border-top: 4px solid var(--color-navy-primary);">
          <div style="display: flex; align-items: flex-start; gap: 1.15rem; margin-bottom: 1.15rem;">
            <div style="position: relative; flex-shrink: 0;">
              <img src="${photo}" alt="${h.nama_pimpinan}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; object-position: center 15%; background: #FFF; border: 2.5px solid var(--color-gold-primary); box-shadow: var(--shadow-sm);">
              <span style="position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; border-radius: 50%; background: ${isHadir ? '#10B981' : '#F59E0B'}; border: 2.5px solid #FFF;" title="${h.status_hadir}"></span>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                <span style="font-size: 0.72rem; font-weight: 800; color: var(--color-blue-accent); text-transform: uppercase; letter-spacing: 0.4px;">${h.jabatan}</span>
                <span style="font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 99px; ${badgeCls}">${h.status_hadir}</span>
              </div>
              <h4 style="font-size: 1.08rem; color: var(--color-navy-primary); margin: 0; line-height: 1.3; font-weight: 800;">${h.nama_pimpinan}</h4>
            </div>
          </div>

          <div style="background: #F8FAFC; border-radius: var(--radius-md); padding: 0.85rem 1rem; border: 1px solid #E2E8F0; font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
            <div style="margin-bottom: 0.3rem;">
              <strong style="color: var(--color-navy-primary);">📍 Keberadaan:</strong> ${h.catatan || 'Ruang Kerja FEB Lt. 2'}
            </div>
            <div>
              <strong style="color: var(--color-navy-primary);">📌 Agenda:</strong> ${h.agenda} (${h.waktu_masuk})
            </div>
          </div>
        </div>
      `;
    }).join('');

    const tableRows = hadirList.map(h => `
      <tr>
        <td><strong>${h.nama_pimpinan}</strong><br><span style="font-size: 0.78rem; color: var(--color-blue-accent);">${h.jabatan}</span></td>
        <td>${UI.getStatusBadgeHTML(h.status_hadir)}</td>
        <td>${h.waktu_masuk || '-'}</td>
        <td>${h.agenda}</td>
        <td><span style="font-size: 0.82rem; color: var(--text-muted);">${h.catatan || '-'}</span></td>
        <td>${h.tanggal}</td>
      </tr>
    `).join('');

    return `
      <div class="container" style="padding: 3rem 1.5rem;">
        <div style="background: linear-gradient(135deg, var(--color-navy-primary) 0%, var(--color-navy-light) 100%); color: #FFF; padding: 2.25rem; border-radius: var(--radius-xl); margin-bottom: 2.5rem;">
          <div>
            <span style="background: var(--color-gold-primary); color: var(--color-navy-dark); font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 4px; letter-spacing: 0.5px;">PORTAL DOSEN & DAFTAR PRESENSI PIMPINAN</span>
            <h2 style="color: #FFF; margin-top: 0.6rem; font-size: 1.65rem;">Status Kehadiran Pimpinan Jurusan Manajemen</h2>
            <p style="font-size: 0.92rem; opacity: 0.9; margin-top: 0.3rem;">Informasi real-time presensi, lokasi keberadaan pimpinan di kampus, agenda rapat, dan jadwal layanan konsultasi.</p>
          </div>
        </div>

        <div style="margin-bottom: 3rem;">
          <div class="section-header" style="text-align: center; margin-bottom: 1.5rem;">
            <span class="section-tag">Status Real-Time Pimpinan</span>
            <h2 class="section-title">Monitoring Keberadaan Pimpinan Jurusan Hari Ini</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 1.75rem;">
            ${statusCardsHTML}
          </div>
        </div>

        <div>
          <div class="section-header" style="text-align: center; margin-bottom: 1.25rem;">
            <span class="section-tag">Rekap Presensi</span>
            <h2 class="section-title">Daftar Hadir Lengkap Pimpinan & Agenda Kegiatan</h2>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nama Pimpinan & Jabatan</th>
                  <th>Status Presensi</th>
                  <th>Waktu Masuk</th>
                  <th>Agenda / Kegiatan</th>
                  <th>Keterangan Keberadaan / Catatan</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows.length ? tableRows : `<tr><td colspan="6" style="text-align: center; color: #94A3B8;">Belum ada data presensi pimpinan terrekam.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --- Admin Portal HTML ---
  getAdminPortalHTML() {
    const docList = db.getPemberkasanList();
    const presList = db.getPrestasiList();
    const hadirList = db.getDaftarHadirList();
    const dosenList = db.getDosenList();
    const userList = db.getUsers();

    // Counts
    const totalDoc = docList.length;
    const totalApprovedDoc = docList.filter(d => d.status.includes('Disetujui')).length;
    const totalPres = presList.length;
    const totalDosen = dosenList.length;

    let adminContentHTML = '';

    if (this.adminTab === 'dashboard') {
      adminContentHTML = `
        <div class="stats-overview-grid">
          <div class="metric-card">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Total Berkas Masuk</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--color-navy-primary);">${totalDoc}</div>
            </div>
            <div class="metric-icon metric-blue">📄</div>
          </div>
          <div class="metric-card">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Berkas Selesai</div>
              <div style="font-size: 2rem; font-weight: 800; color: var(--status-approved);">${totalApprovedDoc}</div>
            </div>
            <div class="metric-icon metric-emerald">✅</div>
          </div>
          <div class="metric-card">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Prestasi Mahasiswa</div>
              <div style="font-size: 2rem; font-weight: 800; color: #B59325;">${totalPres}</div>
            </div>
            <div class="metric-icon metric-gold">🏆</div>
          </div>
          <div class="metric-card">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Total Dosen</div>
              <div style="font-size: 2rem; font-weight: 800; color: #8B5CF6;">${totalDosen}</div>
            </div>
            <div class="metric-icon metric-purple">👨‍🏫</div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card">
            <h3>Rekapitulasi Berkas Masuk per Status</h3>
            <div class="chart-bars">
              <div class="bar-col">
                <div class="bar-val">${docList.filter(d => d.status === 'Diterima').length}</div>
                <div class="bar-fill" style="height: ${Math.max(15, docList.filter(d => d.status === 'Diterima').length * 25)}px; background: #8B5CF6;"></div>
                <div class="bar-label">Diterima</div>
              </div>
              <div class="bar-col">
                <div class="bar-val">${docList.filter(d => d.status === 'Sedang Diproses').length}</div>
                <div class="bar-fill" style="height: ${Math.max(15, docList.filter(d => d.status === 'Sedang Diproses').length * 25)}px; background: #0284C7;"></div>
                <div class="bar-label">Diproses</div>
              </div>
              <div class="bar-col">
                <div class="bar-val">${docList.filter(d => d.status === 'Perlu Revisi').length}</div>
                <div class="bar-fill" style="height: ${Math.max(15, docList.filter(d => d.status === 'Perlu Revisi').length * 25)}px; background: #F59E0B;"></div>
                <div class="bar-label">Revisi</div>
              </div>
              <div class="bar-col">
                <div class="bar-val">${docList.filter(d => d.status.includes('Disetujui')).length}</div>
                <div class="bar-fill" style="height: ${Math.max(15, docList.filter(d => d.status.includes('Disetujui')).length * 25)}px; background: #10B981;"></div>
                <div class="bar-label">Selesai</div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h3>Aktivitas Sistem Terakhir (Audit Trail)</h3>
            <div style="max-height: 220px; overflow-y: auto; font-size: 0.85rem;">
              ${db.getAuditLogs().map(log => `
                <div style="padding: 0.6rem 0; border-bottom: 1px dashed var(--border-color);">
                  <div style="display: flex; justify-content: space-between; font-weight: 600; color: var(--color-navy-primary);">
                    <span>${log.action}</span>
                    <span style="color: var(--text-light); font-size: 0.75rem;">${log.timestamp}</span>
                  </div>
                  <div style="color: var(--text-muted);">${log.actor}: ${log.detail}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (this.adminTab === 'pemberkasan') {
      const search = this.adminDocSearch || '';
      const filterStatus = this.adminDocStatusFilter || '';
      const page = this.adminDocPage || 1;
      const limit = 10;

      const result = db.getPemberkasanPaginated(page, limit, search, filterStatus);
      const docListPaginated = result.data;

      const rows = docListPaginated.map(d => `
        <tr>
          <td><strong>${d.id}</strong>${d.kode_tracking ? `<br><span style="font-size:0.7rem; color:var(--color-gold-primary); font-weight:800;">${d.kode_tracking}</span>` : ''}</td>
          <td>${d.mahasiswa_nama}<br><span style="font-size: 0.75rem; color: #64748B;">NIM: ${d.nim}</span></td>
          <td>${d.jenis_berkas}<br><span style="font-size: 0.75rem; color: #0284C7;">${d.prodi_nama}</span></td>
          <td>${d.tanggal_upload}</td>
          <td>${UI.getStatusBadgeHTML(d.status)}</td>
          <td>
            <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.openVerifyModal('${d.id}')">Verifikasi Status</button>
          </td>
        </tr>
      `).join('');

      const paginationHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 0.5rem 0; flex-wrap: wrap; gap: 0.5rem; font-size: 0.85rem;">
          <div style="color: var(--text-muted);">
            Menampilkan ${result.total === 0 ? 0 : (result.page - 1) * limit + 1} - ${Math.min(result.page * limit, result.total)} dari <strong>${result.total.toLocaleString('id-ID')} Data Berkas</strong>
          </div>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="btn-outline" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;" ${result.page <= 1 ? 'disabled' : ''} onclick="window.changeAdminDocPage(${result.page - 1})">&laquo; Prev</button>
            <span style="font-weight: 700; color: var(--color-navy-primary); padding: 0 0.5rem;">Halaman ${result.page} / ${result.totalPages}</span>
            <button class="btn-outline" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;" ${result.page >= result.totalPages ? 'disabled' : ''} onclick="window.changeAdminDocPage(${result.page + 1})">Next &raquo;</button>
          </div>
        </div>
      `;

      adminContentHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="color: var(--color-navy-primary); margin: 0;">Kelola & Verifikasi Pemberkasan Mahasiswa</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">Sistem Skalabilitas Tinggi: Berkapasitas menampung ribuan hingga puluhan ribu data.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-gold" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;" onclick="window.generateBulkData(1000)">+ Generate 1.000 Data Uji</button>
            <button class="btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;" onclick="window.exportBulkSQL()">Export Batch SQL Supabase</button>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          <input type="text" id="admin-doc-search" placeholder="Cari Nama, NIM, No. Berkas, Kode Tracking..." value="${search}" style="flex: 1; min-width: 140px; width: 100%; padding: 0.5rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.85rem;" onkeyup="window.filterAdminDocs()">
          <select id="admin-doc-status-filter" style="padding: 0.5rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.85rem;" onchange="window.filterAdminDocs()">
            <option value="">-- Semua Status --</option>
            <option value="Diterima" ${filterStatus === 'Diterima' ? 'selected' : ''}>Diterima</option>
            <option value="Sedang Diproses" ${filterStatus === 'Sedang Diproses' ? 'selected' : ''}>Sedang Diproses</option>
            <option value="Perlu Revisi" ${filterStatus === 'Perlu Revisi' ? 'selected' : ''}>Perlu Revisi</option>
            <option value="Disetujui Admin Jurusan" ${filterStatus === 'Disetujui Admin Jurusan' ? 'selected' : ''}>Disetujui Admin Jurusan</option>
            <option value="Disetujui Kaprodi" ${filterStatus === 'Disetujui Kaprodi' ? 'selected' : ''}>Disetujui Kaprodi</option>
          </select>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Berkas / Tracking</th>
                <th>Mahasiswa</th>
                <th>Jenis Berkas / Prodi</th>
                <th>Tanggal Masuk</th>
                <th>Status Berkas</th>
                <th>Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody>${rows.length ? rows : '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Tidak ada data berkas yang sesuai dengan kriteria pencarian.</td></tr>'}</tbody>
          </table>
        </div>
        ${paginationHTML}
      `;
    } else if (this.adminTab === 'prestasi') {
      const rows = presList.map(p => `
        <tr>
          <td><strong>${p.mahasiswa_nama}</strong><br><span style="font-size:0.75rem; color:#64748B;">${p.nim}</span></td>
          <td>${p.judul}</td>
          <td>${p.kategori} / <span style="color:#0284C7;">${p.tingkat}</span></td>
          <td>${p.tanggal_kegiatan}</td>
          <td>${UI.getStatusBadgeHTML(p.status_verifikasi)}</td>
          <td>
            <button class="btn-primary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="window.verifyPrestasiAdmin('${p.id}', 'Disetujui')">Setujui</button>
            <button class="btn-outline" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#EF4444; border-color:#FEE2E2;" onclick="window.verifyPrestasiAdmin('${p.id}', 'Ditolak')">Tolak</button>
          </td>
        </tr>
      `).join('');

      adminContentHTML = `
        <h3 style="color: var(--color-navy-primary); margin-bottom: 1.5rem;">Modul Khusus Admin: Kelola Berkas Prestasi Mahasiswa</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mahasiswa</th>
                <th>Judul Prestasi</th>
                <th>Kategori / Tingkat</th>
                <th>Tanggal</th>
                <th>Status Verifikasi</th>
                <th>Aksi Admin</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } else if (this.adminTab === 'attendance') {
      const rows = hadirList.map(h => `
        <tr>
          <td>${h.tanggal}</td>
          <td><strong>${h.nama_pimpinan}</strong><br><span style="font-size:0.75rem; color:#64748B;">${h.jabatan}</span></td>
          <td>${h.agenda}</td>
          <td>${UI.getStatusBadgeHTML(h.status_hadir)}</td>
          <td>${h.waktu_masuk}</td>
          <td>${h.catatan}</td>
          <td><button class="btn-outline" style="padding:0.2rem 0.4rem; font-size:0.75rem;" onclick="window.deleteAttendance('${h.id}')">Hapus</button></td>
        </tr>
      `).join('');

      adminContentHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h3 style="color: var(--color-navy-primary);">Kelola & Rekap Daftar Hadir Pimpinan / Dosen</h3>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-gold" onclick="window.exportAttendanceCSV()">Export CSV (Excel)</button>
          </div>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Pimpinan / Dosen</th>
                <th>Agenda Rapat / Kegiatan</th>
                <th>Status Presensi</th>
                <th>Waktu Masuk</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } else if (this.adminTab === 'users') {
      const rows = userList.map(u => `
        <tr>
          <td><strong>${u.nama}</strong></td>
          <td>${u.email}</td>
          <td><span class="badge" style="background: #E0F2FE; color: #0284C7;">${u.role.toUpperCase()}</span></td>
          <td>${u.nim_nidn}</td>
          <td>${UI.getStatusBadgeHTML(u.status_akun)}</td>
          <td>
            <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="window.toggleUserStatus('${u.id}')">Ubah Status</button>
          </td>
        </tr>
      `).join('');

      adminContentHTML = `
        <h3 style="color: var(--color-navy-primary); margin-bottom: 1.5rem;">Manajemen Pengguna & Pengaturan Akun</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama Pengguna</th>
                <th>Email Login</th>
                <th>Peran (Role)</th>
                <th>NIM / NIP</th>
                <th>Status Akun</th>
                <th>Aksi Admin</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    } else if (this.adminTab === 'dosen') {
      const dosenRows = dosenList.map(d => {
        const status = d.status_aktif || 'Aktif Mengajar';
        let statusBadge = 'background: rgba(16, 185, 129, 0.12); color: #10B981;';
        if (status === 'Cuti Akademik') statusBadge = 'background: rgba(245, 158, 11, 0.12); color: #D97706;';
        else if (status === 'Tugas Belajar') statusBadge = 'background: rgba(2, 132, 199, 0.12); color: #0284C7;';
        else if (status === 'Purnabakti') statusBadge = 'background: rgba(100, 116, 139, 0.12); color: #64748B;';

        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <img src="${d.foto_url}" alt="${d.nama}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; object-position: center 15%; border: 2px solid var(--color-gold-primary);">
                <div>
                  <strong style="color: var(--color-navy-primary); font-size: 0.92rem;">${d.nama}, ${d.gelar}</strong>
                  <div style="font-size: 0.78rem; color: #64748B;">NIP/NIDN: ${d.nidn || '-'}</div>
                </div>
              </div>
            </td>
            <td><span style="font-weight: 700; color: var(--color-navy-primary); font-size: 0.85rem;">${d.prodi_nama || 'S1 Manajemen'}</span></td>
            <td><span style="font-size: 0.85rem; color: #475569;">${d.jabatan || 'Dosen Pengajar'}</span></td>
            <td>
              <span style="font-size: 0.78rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 99px; ${statusBadge}">
                ● ${status}
              </span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <select class="custom-input" style="padding: 0.35rem 0.65rem; font-size: 0.78rem; width: auto; border-radius: 6px; font-weight: 700;" onchange="window.updateDosenStatus('${d.id}', this.value)">
                  <option value="Aktif Mengajar" ${status === 'Aktif Mengajar' ? 'selected' : ''}>Aktif Mengajar</option>
                  <option value="Cuti Akademik" ${status === 'Cuti Akademik' ? 'selected' : ''}>Cuti Akademik</option>
                  <option value="Tugas Belajar" ${status === 'Tugas Belajar' ? 'selected' : ''}>Tugas Belajar</option>
                  <option value="Purnabakti" ${status === 'Purnabakti' ? 'selected' : ''}>Purnabakti</option>
                </select>
                <button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-color: #EF4444; color: #EF4444; font-weight: 700;" onclick="window.deleteDosen('${d.id}')">Hapus</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      adminContentHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="color: var(--color-navy-primary); font-weight: 800; margin-bottom: 0.25rem;">Pengelolaan Data & Status Keaktifan Dosen</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0;">Kelola status keaktifan mengajar, tugas belajar, prodi, dan data dosen Jurusan Manajemen FEB UTM.</p>
          </div>
          <button class="btn-gold" id="btn-open-add-dosen" style="font-size: 0.85rem; font-weight: 800;">+ Tambah Dosen Baru</button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama & NIP Dosen</th>
                <th>Program Studi</th>
                <th>Jabatan Fungsional</th>
                <th>Status Keaktifan saat Ini</th>
                <th>Aksi Kelola Status Admin</th>
              </tr>
            </thead>
            <tbody>
              ${dosenRows.length ? dosenRows : `<tr><td colspan="5" style="text-align: center; color: #94A3B8;">Belum ada data dosen terdaftar.</td></tr>`}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: 2.5rem 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; background: #FFF; padding: 1.5rem 1.75rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div>
            <span style="background: rgba(2, 132, 199, 0.12); color: #0284C7; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px; text-transform: uppercase;">Portal Administrator Jurusan</span>
            <h2 style="color: var(--color-navy-primary); margin: 0.35rem 0 0.2rem 0; font-weight: 800;">Panel Kontrol Admin Jurusan</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">Kelola data pemberkasan, prestasi, absensi pimpinan, dosen, dan pengguna jurusan secara terpusat.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-outline" onclick="window.logoutUser()" style="font-weight: 800; border-color: #FCA5A5; color: #DC2626; background: #FFF; padding: 0.6rem 1rem; font-size: 0.85rem;" title="Keluar dari akun admin untuk beralih akun">
              🚪 Keluar / Beralih Akun
            </button>
          </div>
        </div>

        <div class="admin-layout">
          <aside class="admin-sidebar">
            <ul class="admin-nav">
              <li><button class="admin-nav-btn ${this.adminTab === 'dashboard' ? 'active' : ''}" data-admin-tab="dashboard">📊 Dashboard Analytics</button></li>
              <li><button class="admin-nav-btn ${this.adminTab === 'dosen' ? 'active' : ''}" data-admin-tab="dosen">👨‍🏫 Kelola Data & Status Dosen</button></li>
              <li><button class="admin-nav-btn ${this.adminTab === 'pemberkasan' ? 'active' : ''}" data-admin-tab="pemberkasan">📄 Verifikasi Pemberkasan</button></li>
              <li><button class="admin-nav-btn ${this.adminTab === 'prestasi' ? 'active' : ''}" data-admin-tab="prestasi">🏆 Berkas Prestasi Mhs</button></li>
              <li><button class="admin-nav-btn ${this.adminTab === 'attendance' ? 'active' : ''}" data-admin-tab="attendance">📌 Daftar Hadir Pimpinan</button></li>
              <li><button class="admin-nav-btn ${this.adminTab === 'users' ? 'active' : ''}" data-admin-tab="users">👥 Manajemen Pengguna</button></li>
              <li style="margin-top: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                <button class="admin-nav-btn" onclick="window.logoutUser()" style="color: #DC2626; font-weight: 700;">
                  🚪 Keluar / Beralih Akun
                </button>
              </li>
            </ul>
          </aside>
          <main>
            ${adminContentHTML}
          </main>
        </div>
      </div>
    `;
  }

  // --- Dosen Portal HTML ---
  getDosenPortalHTML() {
    const user = auth.getCurrentUser();
    const hadirList = db.getDaftarHadirList().filter(h => h.nama_pimpinan.includes(user.nama) || user.nama.includes('Bambang'));

    const rows = hadirList.map(h => `
      <tr>
        <td>${h.tanggal}</td>
        <td>${h.agenda}</td>
        <td>${UI.getStatusBadgeHTML(h.status_hadir)}</td>
        <td>${h.waktu_masuk}</td>
      </tr>
    `).join('');

    return `
      <div class="container" style="padding: 3rem 1.5rem;">
        <div style="background: #0F2942; color: #FFF; padding: 2.5rem; border-radius: var(--radius-xl); margin-bottom: 2rem;">
          <h2 style="color: #D4AF37;">Portal Dosen & Pimpinan</h2>
          <h3 style="color: #FFF; margin-top: 0.5rem;">${user.nama}</h3>
          <p style="color: #94A3B8;">NIP: ${user.nim_nidn} | ${user.prodi_nama || 'S2 Manajemen'}</p>
        </div>

        <h3 style="color: var(--color-navy-primary); margin-bottom: 1rem;">Rekap Riwayat Presensi Kegiatan Jurusan Saya</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Agenda Rapat / Kegiatan</th>
                <th>Status Presensi</th>
                <th>Waktu Tercatat</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows : `<tr><td colspan="4" style="text-align: center; color: #94A3B8;">Belum ada rekaman presensi.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderFooter() {
    const footer = document.getElementById('footer-container');
    if (!footer) return;

    footer.innerHTML = `
      <footer style="background: var(--color-navy-dark); color: #94A3B8; padding: 4rem 0 2rem 0; margin-top: 4rem; border-top: 1px solid rgba(255,255,255,0.08);">
        <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.85rem;">
              <img src="IMAGE/LOGO UTM.png" alt="Logo UTM" style="height: 54px; width: auto; object-fit: contain;">
              <img src="IMAGE/SAE UPDATE.png" alt="Logo SAE" style="height: 54px; width: auto; object-fit: contain;">
              <div>
                <span style="color: #D4AF37; font-weight: 800; font-size: 1.15rem; display: block; line-height: 1.2;">JURUSAN MANAJEMEN</span>
                <span style="color: #FFF; font-size: 0.78rem; font-weight: 700; display: block; line-height: 1.3; margin-top: 3px;">Fakultas Ekonomi dan Bisnis</span>
                <span style="color: #CBD5E1; font-size: 0.72rem; font-weight: 600; display: block; margin-top: 2px;">Universitas Trunojoyo Madura</span>
              </div>
            </div>
            <p style="font-size: 0.88rem; line-height: 1.6; color: #CBD5E1;">Fakultas Ekonomi dan Bisnis Universitas Trunojoyo Madura.<br>Gedung FEB Lt. 2 Telang, Bangkalan, Jawa Timur.</p>
          </div>
          <div>
            <h4 style="color: #FFF; margin-bottom: 1rem; font-size: 0.95rem;">Program Studi</h4>
            <ul style="list-style: none; font-size: 0.88rem; line-height: 2;">
              <li>D3 Entrepreneurship</li>
              <li>S1 Manajemen (Akreditasi UNGGUL)</li>
              <li>S2 Magister Manajemen</li>
              <li>S3 Doktor Ilmu Manajemen</li>
            </ul>
          </div>
          <div>
            <h4 style="color: #FFF; margin-bottom: 1rem; font-size: 0.95rem;">Tautan Cepat</h4>
            <ul style="list-style: none; font-size: 0.88rem; line-height: 2;">
              <li><a href="#" data-nav="profil" style="color: #CBD5E1;">Profil Jurusan</a></li>
              <li><a href="#" data-nav="dosen" style="color: #CBD5E1;">Data Dosen</a></li>
              <li><a href="#" data-nav="berita" style="color: #CBD5E1;">Pengumuman Pendaftaran</a></li>
              <li><a href="#" data-nav="student" style="color: #CBD5E1;">Status Pemberkasan</a></li>
            </ul>
          </div>
        </div>
        <div class="container" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; text-align: center; font-size: 0.82rem;">
          <p>© 2026 Jurusan Manajemen FEB Universitas Trunojoyo Madura. All Rights Reserved.</p>
        </div>
      </footer>
    `;
  }
}

export const app = new App();

// Global Helper Functions for inline onclick handlers
window.changeCoordPhoto = function (prodiId) {
  const prodiList = db.getProdiList();
  const prodi = prodiList.find(p => p.id === prodiId);
  const currentPhoto = prodi ? prodi.foto_url : 'IMAGE/yustin.jpg';
  const newUrl = prompt(`Masukkan URL foto Koordinator ${prodi ? prodi.nama : ''} baru (misal: IMAGE/nama_foto.jpg atau URL internet):`, currentPhoto);
  if (newUrl && newUrl.trim()) {
    const cleanUrl = newUrl.trim();
    db.updateProdi(prodiId, { foto_url: cleanUrl });

    const dosenList = db.getDosenList();
    const matchDosen = dosenList.find(d => d.prodi_id === prodiId || (d.id === 'dsn-002' && prodiId === 'prodi-s1'));
    if (matchDosen) {
      db.updateDosen(matchDosen.id, { foto_url: cleanUrl });
    }

    UI.showToast("Foto Koordinator Program Studi berhasil diperbarui!", "success");
    if (window.app) window.app.render();
  }
};

window.changeDosenPhoto = function (dosenId) {
  const newUrl = prompt("Masukkan URL foto Dosen baru (URL internet atau path gambar):", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400");
  if (newUrl) {
    db.updateDosen(dosenId, { foto_url: newUrl });
    UI.showToast("Foto Dosen berhasil diperbarui!");
  }
};

window.previewAndDownloadPhoto = function (photoUrl, lecturerName) {
  let modal = document.getElementById('modal-photo-preview');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-photo-preview';
    modal.className = 'modal-backdrop';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 460px; width: 90%; text-align: center; padding: 1.75rem; background: #FFF; border-radius: var(--radius-xl); box-shadow: 0 25px 50px rgba(15,41,66,0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #F1F5F9; padding-bottom: 0.75rem;">
          <h3 id="preview-photo-title" style="color: var(--color-navy-primary); font-size: 1.1rem; margin: 0; font-weight: 800; text-align: left;">Pratinjau Foto Dosen</h3>
          <button type="button" class="btn-close" onclick="document.getElementById('modal-photo-preview').classList.remove('active')">&times;</button>
        </div>
        <div style="background: #F8FAFC; border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1.25rem; border: 1px solid #E2E8F0; display: flex; justify-content: center; align-items: center; min-height: 240px;">
          <img id="preview-photo-img" src="" alt="Foto Dosen" style="max-width: 100%; max-height: 340px; border-radius: 12px; object-fit: contain; box-shadow: var(--shadow-md);">
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <a id="preview-photo-download-btn" href="" download="" class="btn-primary" style="flex: 1; justify-content: center; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1rem; font-weight: 700;">
            ⬇️ Unduh Foto
          </a>
          <button type="button" class="btn-outline" onclick="document.getElementById('modal-photo-preview').classList.remove('active')">Tutup</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  const titleEl = document.getElementById('preview-photo-title');
  const imgEl = document.getElementById('preview-photo-img');
  const downloadBtn = document.getElementById('preview-photo-download-btn');

  if (titleEl) titleEl.textContent = `${lecturerName || 'Foto Dosen'}`;
  if (imgEl) imgEl.src = photoUrl;
  if (downloadBtn) {
    downloadBtn.href = photoUrl;
    const cleanFileName = (lecturerName || 'Foto_Dosen_FEB_UTM').replace(/[^a-zA-Z0-9]/g, '_');
    let ext = '.jpg';
    if (photoUrl.includes('.')) {
      const pExt = photoUrl.substring(photoUrl.lastIndexOf('.'));
      if (pExt.length <= 5 && !pExt.includes('/')) ext = pExt;
    }
    downloadBtn.download = `Foto_${cleanFileName}${ext}`;
  }

  modal.classList.add('active');
};

window.deleteDosen = function (id) {
  if (confirm("Apakah Anda yakin ingin menghapus data dosen ini?")) {
    db.deleteDosen(id);
    UI.showToast("Data dosen berhasil dihapus.");
  }
};

window.deleteNews = function (id) {
  if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
    db.deletePengumuman(id);
    UI.showToast("Pengumuman berhasil dihapus.");
  }
};

window.openVerifyModal = function (docId) {
  const newStatus = prompt("Pilih Status Baru (Diterima / Sedang Diproses / Perlu Revisi / Selesai/Disetujui / Ditolak):", "Selesai/Disetujui");
  if (newStatus) {
    const catatan = prompt("Masukkan catatan/keterangan admin untuk mahasiswa:", "Berkas fisik valid dan terverifikasi disetujui.");
    db.updateStatusPemberkasan(docId, newStatus, catatan);
    UI.showToast(`Status berkas ${docId} berhasil diperbarui menjadi: ${newStatus}`, 'success');
    if (window.app) window.app.render();
  }
};

window.verifyPrestasiAdmin = function (id, status) {
  const catatan = prompt(`Catatan verifikasi prestasi (${status}):`, status === 'Disetujui' ? 'Validasi terkonfirmasi' : 'Berkas kurang jelas');
  db.verifyPrestasi(id, status, catatan);
  UI.showToast(`Prestasi berhasil di-${status.toLowerCase()}`, 'success');
  if (window.app) window.app.render();
};

window.deleteAttendance = function (id) {
  if (confirm("Hapus catatan presensi pimpinan ini?")) {
    db.deleteDaftarHadir(id);
    UI.showToast("Data presensi dihapus.");
  }
};

window.editAttendanceStatus = function (id) {
  const list = db.getDaftarHadirList();
  const current = list.find(h => h.id === id);
  if (!current) return;

  const newStatus = prompt(`Ubah Status Presensi Kehadiran (${current.nama_pimpinan}):\nKetik: Hadir / Izin / Sakit / Dinas Luar / Rapat Internal`, current.status_hadir);
  if (!newStatus) return;

  const newAgenda = prompt(`Agenda / Kegiatan (${current.nama_pimpinan}):`, current.agenda || '-');
  const newCatatan = prompt(`Keterangan Keberadaan / Ruangan (${current.nama_pimpinan}):`, current.catatan || '-');

  db.updateDaftarHadir(id, {
    status_hadir: newStatus,
    agenda: newAgenda || current.agenda,
    catatan: newCatatan || current.catatan
  });

  UI.showToast(`Status presensi ${current.nama_pimpinan} berhasil diperbarui!`, 'success');
  if (window.app) window.app.render();
};

window.exportAttendanceCSV = function () {
  const list = db.getDaftarHadirList();
  const headers = ["ID", "Tanggal", "Nama Pimpinan", "Jabatan", "Agenda", "Status Hadir", "Waktu Masuk", "Catatan"];
  const rows = list.map(h => [h.id, h.tanggal, h.nama_pimpinan, h.jabatan, h.agenda, h.status_hadir, h.waktu_masuk, h.catatan]);
  UI.exportToCSV("Rekap_Absensi_Pimpinan_Manajemen_UTM", headers, rows);
  UI.showToast("File Excel/CSV Rekap Absensi berhasil diunduh.");
};

window.printAttendanceReport = function () {
  const list = db.getDaftarHadirList();
  const headers = ["Tanggal", "Nama Pimpinan / Dosen", "Jabatan", "Agenda Kegiatan", "Status Presensi", "Waktu", "Catatan"];
  const rows = list.map(h => [h.tanggal, h.nama_pimpinan, h.jabatan, h.agenda, h.status_hadir, h.waktu_masuk, h.catatan]);
  UI.printReport("Laporan Rekapitulasi Daftar Hadir Pimpinan & Dosen Jurusan Manajemen FEB UTM", headers, rows);
};

window.toggleUserStatus = function (userId) {
  db.toggleUserStatus(userId);
  UI.showToast("Status akun pengguna diperbarui.");
};

window.resetAllData = function () {
  db.resetToInitial();
  UI.showToast("Data berhasil disinkronkan kembali dengan isi file js/data.js!", "success");
};

window.generateBulkData = function (count = 1000) {
  const generatedCount = db.generateThousandsData(count);
  UI.showToast(`Berhasil menambahkan ${generatedCount.toLocaleString('id-ID')} data pemberkasan baru ke dalam database!`, 'success');
  if (window.app) window.app.render();
};

window.exportBulkSQL = function () {
  const sql = db.exportToSQL();
  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SIM_Manajemen_UTM_Batch_Insert_Supabase_${Date.now()}.sql`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  UI.showToast("File Batch SQL Supabase (Import Ribuan Data) berhasil diunduh!", "success");
};

window.filterAdminDocs = function () {
  const searchEl = document.getElementById('admin-doc-search');
  const statusEl = document.getElementById('admin-doc-status-filter');
  if (window.app) {
    window.app.adminDocSearch = searchEl ? searchEl.value : '';
    window.app.adminDocStatusFilter = statusEl ? statusEl.value : '';
    window.app.adminDocPage = 1;
    window.app.render();
    const newSearchEl = document.getElementById('admin-doc-search');
    if (newSearchEl) {
      newSearchEl.focus();
      const val = newSearchEl.value;
      newSearchEl.value = '';
      newSearchEl.value = val;
    }
  }
};

window.changeAdminDocPage = function (newPage) {
  if (window.app) {
    window.app.adminDocPage = newPage;
    window.app.render();
  }
};

window.updateDosenStatus = function (dosenId, newStatus) {
  if (window.db) {
    window.db.updateDosen(dosenId, { status_aktif: newStatus });
    if (window.UI) window.UI.showToast(`Status dosen berhasil diperbarui menjadi '${newStatus}'!`, 'success');
    if (window.app) window.app.render();
  }
};

window.deleteDosen = function (dosenId) {
  if (confirm('Apakah Anda yakin ingin menghapus data dosen ini dari sistem?')) {
    if (window.db) {
      window.db.deleteDosen(dosenId);
      if (window.UI) window.UI.showToast('Data dosen berhasil dihapus!', 'success');
      if (window.app) window.app.render();
    }
  }
};

window.logoutUser = function () {
  if (window.auth) window.auth.logout();
  if (window.UI) window.UI.showToast("Anda telah keluar dari sistem.", "info");
  if (window.app) {
    window.app.activeTab = 'home';
    window.app.render();
  }
};

window.switchGateTab = function (mode) {
  const tabUser = document.getElementById('gate-tab-user');
  const tabAdmin = document.getElementById('gate-tab-admin');
  const groupUser = document.getElementById('gate-group-user');
  const groupAdmin = document.getElementById('gate-group-admin');

  if (mode === 'user') {
    if (tabUser) {
      tabUser.style.background = '#FFF';
      tabUser.style.color = '#0F2942';
      tabUser.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    }
    if (tabAdmin) {
      tabAdmin.style.background = 'transparent';
      tabAdmin.style.color = '#64748B';
      tabAdmin.style.boxShadow = 'none';
    }
    if (groupUser) groupUser.style.display = 'block';
    if (groupAdmin) groupAdmin.style.display = 'none';
  } else {
    if (tabAdmin) {
      tabAdmin.style.background = '#FFF';
      tabAdmin.style.color = '#0F2942';
      tabAdmin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    }
    if (tabUser) {
      tabUser.style.background = 'transparent';
      tabUser.style.color = '#64748B';
      tabUser.style.boxShadow = 'none';
    }
    if (groupAdmin) groupAdmin.style.display = 'block';
    if (groupUser) groupUser.style.display = 'none';
  }
};

window.loginAsGateUser = function () {
  if (window.auth) {
    const user = window.auth.loginMhs('Pengguna Umum');
    if (window.UI) window.UI.showToast(`Selamat datang, ${user.nama}! Akses web terbuka.`, 'success');
    if (window.app) {
      window.app.activeTab = 'home';
      window.app.render();
    }
  }
};

window.loginAsGateAdmin = function () {
  const adminId = document.getElementById('gate-admin-id')?.value || '';
  const adminPass = document.getElementById('gate-admin-pass')?.value || '';
  if (!adminId.trim() || !adminPass.trim()) {
    if (window.UI) window.UI.showToast("Admin wajib memasukkan ID dan Password!", "warning");
    return;
  }
  try {
    if (window.auth) {
      const user = window.auth.loginAdmin(adminId.trim(), adminPass.trim());
      if (window.UI) window.UI.showToast(`Selamat datang, ${user.nama}! Akses Panel Admin dibuka.`, 'success');
      if (window.app) {
        window.app.activeTab = 'admin';
        window.app.render();
      }
    }
  } catch (err) {
    if (window.UI) window.UI.showToast(err.message, 'error');
  }
};

window.navigateToProdi = function (prodiId) {
  if (window.app) {
    window.app.activeTab = 'prodi';
    window.app.selectedProdiId = prodiId;
    window.app.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.showAllProdi = function () {
  if (window.app) {
    window.app.activeTab = 'prodi';
    window.app.selectedProdiId = null;
    window.app.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
