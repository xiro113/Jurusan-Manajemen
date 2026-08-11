/**
 * Storage Service - LocalStorage State & Event Management
 * Jurusan Manajemen FEB UTM
 */

import {
  INITIAL_PRODI,
  INITIAL_DOSEN,
  INITIAL_PEMBERKASAN,
  INITIAL_PRESTASI,
  INITIAL_DAFTAR_HADIR,
  INITIAL_PENGUMUMAN,
  INITIAL_USERS
} from './data.js';

const STORAGE_KEYS = {
  PRODI: 'utm_mg_prodi_v3',
  DOSEN: 'utm_mg_dosen_v3',
  PEMBERKASAN: 'utm_mg_pemberkasan_v3',
  PRESTASI: 'utm_mg_prestasi_v3',
  DAFTAR_HADIR: 'utm_mg_daftar_hadir_v3',
  PENGUMUMAN: 'utm_mg_pengumuman_v3',
  USERS: 'utm_mg_users_v3',
  CURRENT_USER: 'utm_mg_current_user_v3',
  NOTIFICATIONS: 'utm_mg_notifications_v3',
  AUDIT_LOGS: 'utm_mg_audit_logs_v3'
};

function getWIBTimeString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} WIB`;
}

class StorageManager {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      // Auto-sync static seed data from data.js whenever data.js is edited or missing
      const prodiHash = JSON.stringify(INITIAL_PRODI);
      if (!localStorage.getItem(STORAGE_KEYS.PRODI) || localStorage.getItem(STORAGE_KEYS.PRODI + '_hash') !== prodiHash) {
        localStorage.setItem(STORAGE_KEYS.PRODI, JSON.stringify(INITIAL_PRODI));
        localStorage.setItem(STORAGE_KEYS.PRODI + '_hash', prodiHash);
      }

      const dosenHash = JSON.stringify(INITIAL_DOSEN);
      if (!localStorage.getItem(STORAGE_KEYS.DOSEN) || localStorage.getItem(STORAGE_KEYS.DOSEN + '_hash') !== dosenHash) {
        localStorage.setItem(STORAGE_KEYS.DOSEN, JSON.stringify(INITIAL_DOSEN));
        localStorage.setItem(STORAGE_KEYS.DOSEN + '_hash', dosenHash);
      }

      const newsHash = JSON.stringify(INITIAL_PENGUMUMAN);
      if (!localStorage.getItem(STORAGE_KEYS.PENGUMUMAN) || localStorage.getItem(STORAGE_KEYS.PENGUMUMAN + '_hash') !== newsHash) {
        localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(INITIAL_PENGUMUMAN));
        localStorage.setItem(STORAGE_KEYS.PENGUMUMAN + '_hash', newsHash);
      }

      if (!localStorage.getItem(STORAGE_KEYS.PEMBERKASAN)) {
        localStorage.setItem(STORAGE_KEYS.PEMBERKASAN, JSON.stringify(INITIAL_PEMBERKASAN));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PRESTASI)) {
        localStorage.setItem(STORAGE_KEYS.PRESTASI, JSON.stringify(INITIAL_PRESTASI));
      }
      if (!localStorage.getItem(STORAGE_KEYS.DAFTAR_HADIR)) {
        localStorage.setItem(STORAGE_KEYS.DAFTAR_HADIR, JSON.stringify(INITIAL_DAFTAR_HADIR));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ id: 'guest', nama: 'Tamu / Publik', role: 'guest' }));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
          {
            id: 'notif-1',
            user_id: 'mhs-001',
            title: 'Status Berkas Diperbarui',
            message: 'Berkas Surat Izin Penelitian Kampus Anda telah Disetujui oleh Admin Jurusan.',
            time: '2026-07-29 10:00',
            read: false
          }
        ]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([
          {
            id: 'log-1',
            timestamp: '2026-08-05 09:00',
            actor: 'Admin Jurusan',
            action: 'Input Absensi Pimpinan',
            detail: 'Mencatat Rapat Koordinasi Evaluasi Kurikulum MBKM'
          }
        ]));
      }
    } catch (err) {
      console.warn('[StorageManager] LocalStorage error detected, auto-clearing and resetting storage:', err);
      try {
        localStorage.clear();
        localStorage.setItem(STORAGE_KEYS.PRODI, JSON.stringify(INITIAL_PRODI));
        localStorage.setItem(STORAGE_KEYS.DOSEN, JSON.stringify(INITIAL_DOSEN));
        localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(INITIAL_PENGUMUMAN));
        localStorage.setItem(STORAGE_KEYS.PEMBERKASAN, JSON.stringify(INITIAL_PEMBERKASAN));
        localStorage.setItem(STORAGE_KEYS.PRESTASI, JSON.stringify(INITIAL_PRESTASI));
        localStorage.setItem(STORAGE_KEYS.DAFTAR_HADIR, JSON.stringify(INITIAL_DAFTAR_HADIR));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
      } catch (e) { }
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb());
  }

  getItem(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key}`, e);
      return null;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error(`Error setting ${key}`, e);
    }
  }

  // --- Auth & User ---
  getCurrentUser() {
    return this.getItem(STORAGE_KEYS.CURRENT_USER) || INITIAL_USERS[1];
  }

  setCurrentUser(user) {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  getUsers() {
    return this.getItem(STORAGE_KEYS.USERS) || [];
  }

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      id: `user-${Date.now()}`,
      status_akun: 'Aktif',
      ...user
    };
    users.unshift(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);
    this.addAuditLog('Tambah Pengguna', `Menambahkan pengguna baru: ${newUser.nama} (${newUser.role})`);
    return newUser;
  }

  toggleUserStatus(userId) {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        const nextStatus = u.status_akun === 'Aktif' ? 'Nonaktif' : 'Aktif';
        return { ...u, status_akun: nextStatus };
      }
      return u;
    });
    this.setItem(STORAGE_KEYS.USERS, users);
    this.addAuditLog('Ubah Status Akun', `Mengubah status akun ID: ${userId}`);
  }

  // --- Program Studi ---
  getProdiList() {
    const overrides = this.getItem(STORAGE_KEYS.PRODI + '_overrides') || {};
    return INITIAL_PRODI.map(p => {
      if (overrides[p.id]) {
        const merged = { ...p, ...overrides[p.id] };
        if (merged.foto_url && merged.foto_url.includes('unsplash')) {
          merged.foto_url = p.foto_url;
        }
        return merged;
      }
      return p;
    });
  }

  updateProdi(prodiId, updatedData) {
    const overrides = this.getItem(STORAGE_KEYS.PRODI + '_overrides') || {};
    overrides[prodiId] = { ...(overrides[prodiId] || {}), ...updatedData };
    this.setItem(STORAGE_KEYS.PRODI + '_overrides', overrides);
    this.notify();
    this.addAuditLog('Update Prodi', `Memperbarui data Program Studi ID: ${prodiId}`);
  }

  // --- Data Dosen ---
  getDosenList() {
    const overrides = this.getItem(STORAGE_KEYS.DOSEN + '_overrides') || {};
    const base = INITIAL_DOSEN.map(d => {
      if (overrides[d.id]) {
        const merged = { ...d, ...overrides[d.id] };
        if (merged.foto_url && merged.foto_url.includes('unsplash')) {
          merged.foto_url = d.foto_url;
        }
        return merged;
      }
      return d;
    });
    const added = this.getItem(STORAGE_KEYS.DOSEN_ADDED) || [];
    return [...base, ...added];
  }

  addDosen(dosen) {
    const added = this.getItem(STORAGE_KEYS.DOSEN_ADDED) || [];
    const newDosen = {
      id: `dsn-${Date.now()}`,
      foto_url: dosen.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      ...dosen
    };
    added.unshift(newDosen);
    this.setItem(STORAGE_KEYS.DOSEN_ADDED, added);
    this.addAuditLog('Tambah Dosen', `Menambahkan Dosen: ${newDosen.nama}`);
    return newDosen;
  }

  updateDosen(dosenId, updatedData) {
    const overrides = this.getItem(STORAGE_KEYS.DOSEN + '_overrides') || {};
    overrides[dosenId] = { ...(overrides[dosenId] || {}), ...updatedData };
    this.setItem(STORAGE_KEYS.DOSEN + '_overrides', overrides);
    this.notify();
    this.addAuditLog('Edit Dosen', `Memperbarui profil Dosen ID: ${dosenId}`);
  }

  deleteDosen(dosenId) {
    const added = (this.getItem(STORAGE_KEYS.DOSEN_ADDED) || []).filter(d => d.id !== dosenId);
    this.setItem(STORAGE_KEYS.DOSEN_ADDED, added);
    this.notify();
    this.addAuditLog('Hapus Dosen', `Menghapus Dosen ID: ${dosenId}`);
  }

  // --- Pemberkasan (Document Tracking) ---
  getPemberkasanList() {
    const saved = this.getItem(STORAGE_KEYS.PEMBERKASAN) || [];
    const submittedBackup = this.getItem('user_submitted_docs') || [];

    const allMap = new Map();
    INITIAL_PEMBERKASAN.forEach(item => allMap.set(item.id, item));
    submittedBackup.forEach(item => allMap.set(item.id, { ...(allMap.get(item.id) || {}), ...item }));
    saved.forEach(item => allMap.set(item.id, { ...(allMap.get(item.id) || {}), ...item }));

    return Array.from(allMap.values());
  }

  addPemberkasan(doc) {
    const list = this.getPemberkasanList();
    const currentUser = this.getCurrentUser();
    const now = getWIBTimeString();
    const newDoc = {
      id: `DOC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      mahasiswa_id: currentUser.id || 'mhs-001',
      mahasiswa_nama: currentUser.nama || 'Bagas Pratama',
      nim: currentUser.nim_nidn || '210211100145',
      prodi_nama: currentUser.prodi_nama || 'S1 Manajemen',
      status: 'Sedang Diproses',
      catatan_admin: 'Berkas telah diterima dan masuk antrean pengecekan admin.',
      tanggal_upload: now,
      tanggal_update: now,
      ...doc
    };
    list.unshift(newDoc);
    this.setItem(STORAGE_KEYS.PEMBERKASAN, list);

    const backup = this.getItem('user_submitted_docs') || [];
    backup.unshift(newDoc);
    this.setItem('user_submitted_docs', backup);

    this.notify();
    this.addAuditLog('Upload Berkas', `${newDoc.mahasiswa_nama} mengunggah ${newDoc.jenis_berkas}`);
    return newDoc;
  }

  updateStatusPemberkasan(docId, newStatus, catatanAdmin) {
    const now = getWIBTimeString();
    let targetDoc = null;

    const list = this.getPemberkasanList().map(doc => {
      if (doc.id === docId) {
        targetDoc = {
          ...doc,
          status: newStatus,
          catatan_admin: catatanAdmin || doc.catatan_admin,
          tanggal_update: now
        };
        return targetDoc;
      }
      return doc;
    });

    this.setItem(STORAGE_KEYS.PEMBERKASAN, list);

    const backup = (this.getItem('user_submitted_docs') || []).map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: newStatus,
          catatan_admin: catatanAdmin || doc.catatan_admin,
          tanggal_update: now
        };
      }
      return doc;
    });
    this.setItem('user_submitted_docs', backup);

    this.notify();

    if (targetDoc) {
      this.addNotification({
        user_id: targetDoc.mahasiswa_id,
        title: `Status Berkas ${targetDoc.id} Diperbarui`,
        message: `Status berkas "${targetDoc.jenis_berkas}" diubah menjadi [${newStatus}]. Catatan: ${catatanAdmin || 'Tidak ada'}`,
        time: now
      });

      this.addAuditLog('Update Status Berkas', `Admin mengubah status ${targetDoc.id} (${targetDoc.jenis_berkas}) -> ${newStatus}`);
    }
  }

  deletePemberkasan(docId) {
    const list = this.getPemberkasanList().filter(d => d.id !== docId);
    this.setItem(STORAGE_KEYS.PEMBERKASAN, list);
    this.notify();
    this.addAuditLog('Hapus Berkas', `Menghapus dokumen ID: ${docId}`);
  }

  // --- Berkas Prestasi ---
  getPrestasiList() {
    return this.getItem(STORAGE_KEYS.PRESTASI) || [];
  }

  addPrestasi(prestasi) {
    const list = this.getPrestasiList();
    const currentUser = this.getCurrentUser();
    const newPrestasi = {
      id: `PRES-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      mahasiswa_id: currentUser.id || 'mhs-001',
      mahasiswa_nama: currentUser.nama || 'Bagas Pratama',
      nim: currentUser.nim_nidn || '210211100145',
      prodi_nama: currentUser.prodi_nama || 'S1 Manajemen',
      status_verifikasi: 'Menunggu Verifikasi',
      catatan: '-',
      tanggal_upload: new Date().toISOString().split('T')[0],
      ...prestasi
    };
    list.unshift(newPrestasi);
    this.setItem(STORAGE_KEYS.PRESTASI, list);
    this.notify();
    this.addAuditLog('Upload Prestasi', `${newPrestasi.mahasiswa_nama} mengunggah prestasi: ${newPrestasi.judul}`);
    return newPrestasi;
  }

  verifyPrestasi(id, status, catatan) {
    const list = this.getPrestasiList().map(p => {
      if (p.id === id) {
        return {
          ...p,
          status_verifikasi: status,
          catatan: catatan || p.catatan
        };
      }
      return p;
    });
    this.setItem(STORAGE_KEYS.PRESTASI, list);
    this.notify();
    this.addAuditLog('Verifikasi Prestasi', `Admin memverifikasi prestasi ID: ${id} (${status})`);
  }

  // --- Daftar Hadir Pimpinan ---
  getDaftarHadirList() {
    return this.getItem(STORAGE_KEYS.DAFTAR_HADIR) || [];
  }

  addDaftarHadir(hadir) {
    const list = this.getDaftarHadirList();
    const newHadir = {
      id: `PRESENCE-${Date.now()}`,
      waktu_masuk: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      ...hadir
    };
    list.unshift(newHadir);
    this.setItem(STORAGE_KEYS.DAFTAR_HADIR, list);
    this.addAuditLog('Input Kehadiran Pimpinan', `Menambahkan absensi ${newHadir.nama_pimpinan} (${newHadir.status_hadir})`);
    return newHadir;
  }

  updateDaftarHadir(id, updatedData) {
    const list = this.getDaftarHadirList().map(h => {
      if (h.id === id) {
        return {
          ...h,
          ...updatedData
        };
      }
      return h;
    });
    this.setItem(STORAGE_KEYS.DAFTAR_HADIR, list);
    this.notify();
    this.addAuditLog('Update Presensi Pimpinan', `Admin memperbarui presensi ID: ${id}`);
  }

  deleteDaftarHadir(id) {
    const list = this.getDaftarHadirList().filter(h => h.id !== id);
    this.setItem(STORAGE_KEYS.DAFTAR_HADIR, list);
    this.addAuditLog('Hapus Presensi', `Menghapus data presensi ID: ${id}`);
  }

  // --- Pengumuman ---
  getPengumumanList() {
    const saved = this.getItem(STORAGE_KEYS.PENGUMUMAN) || [];
    const base = INITIAL_PENGUMUMAN.map(init => {
      const found = saved.find(s => s.id === init.id);
      return found ? { ...found, ...init } : init;
    });
    const extra = saved.filter(s => !INITIAL_PENGUMUMAN.some(init => init.id === s.id));
    return [...base, ...extra];
  }

  addPengumuman(news) {
    const list = this.getPengumumanList();
    const newNews = {
      id: `NEWS-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      penulis: this.getCurrentUser().nama || 'Admin Jurusan',
      ...news
    };
    list.unshift(newNews);
    this.setItem(STORAGE_KEYS.PENGUMUMAN, list);
    this.addAuditLog('Tambah Pengumuman', `Membuat pengumuman baru: ${newNews.judul}`);
    return newNews;
  }

  updatePengumuman(id, updated) {
    const list = this.getPengumumanList().map(n => n.id === id ? { ...n, ...updated } : n);
    this.setItem(STORAGE_KEYS.PENGUMUMAN, list);
    this.addAuditLog('Edit Pengumuman', `Memperbarui pengumuman ID: ${id}`);
  }

  deletePengumuman(id) {
    const list = this.getPengumumanList().filter(n => n.id !== id);
    this.setItem(STORAGE_KEYS.PENGUMUMAN, list);
    this.addAuditLog('Hapus Pengumuman', `Menghapus pengumuman ID: ${id}`);
  }

  // --- Notifications ---
  getNotifications(userId) {
    const notifs = this.getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    if (!userId) return notifs;
    return notifs.filter(n => n.user_id === userId || n.user_id === 'all');
  }

  addNotification(notif) {
    const notifs = this.getItem(STORAGE_KEYS.NOTIFICATIONS) || [];
    notifs.unshift({
      id: `notif-${Date.now()}`,
      read: false,
      ...notif
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  markNotificationRead(id) {
    const notifs = (this.getItem(STORAGE_KEYS.NOTIFICATIONS) || []).map(n => n.id === id ? { ...n, read: true } : n);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.getItem(STORAGE_KEYS.AUDIT_LOGS) || [];
  }

  addAuditLog(action, detail) {
    const logs = this.getAuditLogs();
    const currentUser = this.getCurrentUser();
    logs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: getWIBTimeString(),
      actor: currentUser ? currentUser.nama : 'Sistem',
      action,
      detail
    });
    if (logs.length > 500) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- Scalable Paginated Queries for Thousands of Data ---
  getPemberkasanPaginated(page = 1, limit = 10, search = '', filterStatus = '', filterProdi = '') {
    let list = this.getPemberkasanList();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => 
        (d.id && d.id.toLowerCase().includes(q)) ||
        (d.mahasiswa_nama && d.mahasiswa_nama.toLowerCase().includes(q)) ||
        (d.nim && d.nim.toLowerCase().includes(q)) ||
        (d.jenis_berkas && d.jenis_berkas.toLowerCase().includes(q)) ||
        (d.kode_tracking && d.kode_tracking.toLowerCase().includes(q))
      );
    }

    if (filterStatus) {
      list = list.filter(d => d.status === filterStatus);
    }

    if (filterProdi) {
      list = list.filter(d => d.prodi_nama === filterProdi);
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * limit;
    const paginatedData = list.slice(start, start + limit);

    return {
      total,
      page: currentPage,
      totalPages,
      limit,
      data: paginatedData
    };
  }

  // --- Bulk Thousand Data Generator for Testing High Scalability ---
  generateThousandsData(count = 1000) {
    const list = this.getPemberkasanList();
    const firstNames = ['Rahmat', 'Bagas', 'Dewi', 'Ahmad', 'Siti', 'Budi', 'Fajar', 'Nabila', 'Rizky', 'Putri', 'Dimas', 'Aditya', 'Fitri', 'Hasan', 'Maya', 'Eko', 'Nur', 'Agus', 'Lestari', 'Irfan'];
    const lastNames = ['Hidayat', 'Pratama', 'Lestari', 'Kurniawan', 'Rahayu', 'Santoso', 'Hidayatullah', 'Saputra', 'Wibowo', 'Anggraini', 'Ramadhan', 'Wijaya', 'Permana', 'Nugroho', 'Utami', 'Febrianto', 'Kusuma', 'Sari', 'Indra', 'Maulana'];
    const prodiArr = ['D3 Entrepreneurship', 'S1 Manajemen', 'S2 Manajemen', 'S3 Doktor Ilmu Manajemen'];
    const jenisArr = ['Surat Izin Penelitian Kampus', 'Pengajuan Beasiswa Unggulan', 'Pengajuan Judul Skripsi', 'Surat Masuk PKL / Magang', 'Pengajuan Bebas Kompensasi', 'Validasi Transkrip Nilai'];
    const statusArr = ['Diterima', 'Sedang Diproses', 'Perlu Revisi', 'Disetujui Admin Jurusan', 'Disetujui Kaprodi'];

    const newDocs = [];

    for (let i = 1; i <= count; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const nama = `${fName} ${lName}`;
      const nim = `210211${String(100000 + i).padStart(6, '0')}`;
      const prodi = prodiArr[Math.floor(Math.random() * prodiArr.length)];
      const jenis = jenisArr[Math.floor(Math.random() * jenisArr.length)];
      const status = statusArr[Math.floor(Math.random() * statusArr.length)];
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const trackingCode = `TRK-${randomNum}-${randomCode}`;

      newDocs.push({
        id: `DOC-2026-${String(i + 100).padStart(5, '0')}`,
        kode_tracking: trackingCode,
        mahasiswa_id: `mhs-bulk-${i}`,
        mahasiswa_nama: nama,
        nim: nim,
        prodi_nama: prodi,
        jenis_berkas: jenis,
        status: status,
        catatan_admin: `Generasi bulk data (${i}/${count}) untuk pengujian kapasitas sistem skala besar.`,
        tanggal_upload: `2026-08-${String((i % 28) + 1).padStart(2, '0')} 10:00 WIB`,
        tanggal_update: `2026-08-${String((i % 28) + 1).padStart(2, '0')} 11:30 WIB`
      });
    }

    const merged = [...newDocs, ...list];
    this.setItem(STORAGE_KEYS.PEMBERKASAN, merged);
    this.addAuditLog('Generasi Bulk Data', `Berhasil membuat ${count} data berkas mahasiswa baru ke dalam database.`);
    this.notify();
    return count;
  }

  // --- Bulk Export Engine to SQL (Supabase Batch Insert Ready) ---
  exportToSQL() {
    const list = this.getPemberkasanList();
    let sql = `-- SIM Jurusan Manajemen FEB UTM Bulk SQL Export\n`;
    sql += `-- Total Records: ${list.length} | Generated: ${getWIBTimeString()}\n\n`;
    sql += `INSERT INTO pemberkasan (id, kode_tracking, mahasiswa_id, mahasiswa_nama, nim, prodi_nama, jenis_berkas, status, catatan_admin, tanggal_upload, tanggal_update) VALUES\n`;

    const values = list.map(d => {
      const escape = (str) => (str ? `'${String(str).replace(/'/g, "''")}'` : 'NULL');
      return `(${escape(d.id)}, ${escape(d.kode_tracking)}, ${escape(d.mahasiswa_id)}, ${escape(d.mahasiswa_nama)}, ${escape(d.nim)}, ${escape(d.prodi_nama)}, ${escape(d.jenis_berkas)}, ${escape(d.status)}, ${escape(d.catatan_admin)}, ${escape(d.tanggal_upload)}, ${escape(d.tanggal_update)})`;
    });

    sql += values.join(',\n') + ';\n';
    return sql;
  }

  // --- Reset All Data ---
  resetToInitial() {
    localStorage.clear();
    window.location.reload();
  }
}

export const db = new StorageManager();
