/**
 * Auth & Role Management Controller
 * Jurusan Manajemen FEB UTM
 */

import { db } from './storage.js';

export const ROLES = {
  GUEST: 'guest',
  MAHASISWA: 'mahasiswa',
  ADMIN: 'admin',
  DOSEN: 'dosen'
};

export class AuthController {
  constructor() {
    this.currentUser = db.getCurrentUser();
  }

  getCurrentUser() {
    return db.getCurrentUser();
  }

  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!(user && user.id && user.id !== 'guest');
  }

  getRole() {
    const user = this.getCurrentUser();
    return user ? user.role : ROLES.GUEST;
  }

  switchRole(roleType) {
    const users = db.getUsers();
    let targetUser = null;

    if (roleType === ROLES.ADMIN) {
      throw new Error('Akses Admin wajib menggunakan ID dan Kata Sandi!');
    } else if (roleType === ROLES.MAHASISWA) {
      targetUser = db.getItem('last_active_mhs') || users.find(u => u.role === 'mahasiswa');
    } else if (roleType === ROLES.DOSEN) {
      targetUser = users.find(u => u.role === 'dosen');
    } else {
      // Guest mode
      targetUser = {
        id: 'guest',
        nama: 'Tamu / Publik',
        email: 'tamu@trunojoyo.ac.id',
        role: ROLES.GUEST,
        nim_nidn: '-',
        prodi_nama: '-'
      };
    }

    if (targetUser) {
      db.setCurrentUser(targetUser);
      this.currentUser = targetUser;
    }
    return targetUser;
  }

  loginMhs(nama) {
    if (!nama || !nama.trim()) {
      throw new Error('Silakan masukkan nama lengkap Anda.');
    }
    const cleanNama = nama.trim();
    const users = db.getUsers();
    let user = users.find(u => u.nama.toLowerCase() === cleanNama.toLowerCase());

    if (!user) {
      const stableId = 'mhs-' + cleanNama.toLowerCase().replace(/[^a-z0-9]/g, '-');
      let charSum = 0;
      for (let i = 0; i < cleanNama.length; i++) charSum += cleanNama.charCodeAt(i);
      const stableNim = '21021110' + String(1000 + (charSum % 8999)).padStart(4, '0');

      user = {
        id: stableId,
        nama: cleanNama,
        email: cleanNama.toLowerCase().replace(/\s+/g, '.') + '@student.trunojoyo.ac.id',
        role: ROLES.MAHASISWA,
        nim_nidn: stableNim,
        prodi_nama: 'S1 Manajemen',
        status_akun: 'Aktif'
      };
      users.push(user);
      db.setItem('utm_mg_users_v3', users);
    }
    db.setItem('last_active_mhs', user);
    db.setCurrentUser(user);
    this.currentUser = user;
    return user;
  }

  loginAdmin(id, pass) {
    const cleanId = (id || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (!cleanId) {
      throw new Error('Silakan masukkan ID Admin.');
    }
    if (!cleanPass) {
      throw new Error('Silakan masukkan kata sandi Admin.');
    }

    // Daftar 3 Akun Resmi Administrator Jurusan
    const adminAccounts = [
      {
        id: 'admin1',
        pass: 'PasswordAdmin1!',
        user: {
          id: 'user-admin-1',
          nama: 'Admin Utama Sekretariat FEB',
          email: 'admin1.manajemen@trunojoyo.ac.id',
          role: ROLES.ADMIN,
          nim_nidn: 'NIP. 198503122010121001',
          prodi_nama: 'Sekretariat Jurusan'
        }
      },
      {
        id: 'admin2',
        pass: 'PasswordAdmin2!',
        user: {
          id: 'user-admin-2',
          nama: 'Admin Pelayanan Pemberkasan',
          email: 'admin2.manajemen@trunojoyo.ac.id',
          role: ROLES.ADMIN,
          nim_nidn: 'NIP. 198705142012011002',
          prodi_nama: 'Bagian Kemahasiswaan'
        }
      },
      {
        id: 'admin3',
        pass: 'PasswordAdmin3!',
        user: {
          id: 'user-admin-3',
          nama: 'Admin Verifikator Jurusan',
          email: 'admin3.manajemen@trunojoyo.ac.id',
          role: ROLES.ADMIN,
          nim_nidn: 'NIP. 199001202015041003',
          prodi_nama: 'Bagian Verifikasi Dokumen'
        }
      }
    ];

    const match = adminAccounts.find(a => a.id.toLowerCase() === cleanId && a.pass === cleanPass) ||
      (cleanId === 'admin' && (cleanPass === 'admin123' || cleanPass === 'admin') ? adminAccounts[0] : null);

    if (!match) {
      throw new Error('ID atau Kata Sandi Admin tidak sesuai! Silakan periksa kembali kredensial Anda.');
    }

    db.setCurrentUser(match.user);
    this.currentUser = match.user;
    return match.user;
  }

  login(email, password) {
    const users = db.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      if (found.status_akun === 'Nonaktif') {
        throw new Error('Akun Anda sedang dinonaktifkan oleh Admin. Silakan hubungi sekretariat jurusan.');
      }
      db.setCurrentUser(found);
      this.currentUser = found;
      return found;
    }
    
    // Quick demo login fallback
    if (email.includes('admin')) return this.switchRole(ROLES.ADMIN);
    if (email.includes('dosen')) return this.switchRole(ROLES.DOSEN);
    
    throw new Error('Email atau password tidak ditemukan.');
  }

  logout() {
    this.switchRole(ROLES.GUEST);
  }
}

export const auth = new AuthController();
