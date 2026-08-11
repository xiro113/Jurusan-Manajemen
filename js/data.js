/**
 * Initial Seed Data for Jurusan Manajemen FEB UTM
 * Universitas Trunojoyo Madura
 */

export const INITIAL_PRODI = [
  {
    id: "prodi-d3",
    nama: "D3 Entrepreneurship",
    jenjang: "D3",
    koordinator_nama: "Darul Islam, SE., M.M.",
    koordinator_gelar: "SE., M.M.",
    koordinator_jabatan: "Koordinator Prodi D3",
    foto_url: "IMAGE/Darul.jpg",
    deskripsi: "Program Studi D3 Entrepreneurship fokus mencetak wirausahawan muda yang inovatif, mandiri, dan berdaya saing global berbasis kearifan lokal Madura.",
    akreditasi: "Unggul",
    jumlah_mahasiswa: 240
  },
  {
    id: "prodi-s1",
    nama: "S1 Manajemen",
    jenjang: "S1",
    koordinator_nama: "Yustina Chrismardani, SSi., M.M.",
    koordinator_gelar: "SSi., M.M.",
    koordinator_jabatan: "Koordinator Prodi S1",
    foto_url: "IMAGE/yustin.jpg",
    deskripsi: "Program Studi S1 Manajemen menghasilkan lulusan berjiwa manajerial, analitis, etis, dan adaptif terhadap perkembangan bisnis digital serta industri terkini.",
    akreditasi: "Unggul",
    jumlah_mahasiswa: 300
  },
  {
    id: "prodi-s2",
    nama: "S2 Manajemen",
    jenjang: "S2",
    koordinator_nama: "Dr. Bambang Setiyo Pambudi, S.E., M.M.",
    koordinator_gelar: "Dr., S.E., M.M.",
    koordinator_jabatan: "Koordinator Prodi S2",
    foto_url: "IMAGE/Bambang.jpg",
    deskripsi: "Program Magister Manajemen mengembangkan kemampuan riset terapan, pengambilan keputusan strategis bisnis, dan kepemimpinan organisasi berkelas internasional.",
    akreditasi: "Unggul",
    jumlah_mahasiswa: 180
  },
  {
    id: "prodi-s3",
    nama: "S3 Doktor Ilmu Manajemen",
    jenjang: "S3",
    koordinator_nama: "Dr. A. Yahya Surya Winata, S.E., M.Si.",
    koordinator_gelar: "Dr., S.E., M.Si.",
    koordinator_jabatan: "Koordinator Prodi S3",
    foto_url: "IMAGE/Yahya.jpg",
    deskripsi: "Program Doktoral Ilmu Manajemen menghasilkan akademisi, peneliti utama, dan pakar filosofis manajemen berwawasan global serta kontributif bagi keilmuan nasional.",
    akreditasi: "Baik Sekali",
    jumlah_mahasiswa: 65
  }
];

export const INITIAL_DOSEN = [
  {
    id: "dsn-kajur",
    nama: "Fathor AS",
    gelar: "SE., M.M.",
    nidn: "197811152003121001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "Ketua Jurusan Manajemen",
    email: "fathor.as@trunojoyo.ac.id",
    foto_url: "IMAGE/Fathor.jpg"
  },
  {
    id: "dsn-sekjur",
    nama: "M. Boy Singgih Gitayuda",
    gelar: "S.E., M.M.",
    nidn: "199105122019031010",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "Sekretaris Jurusan Manajemen",
    email: "boy.gitayuda@trunojoyo.ac.id",
    foto_url: "IMAGE/Boy.jpg"
  },
  {
    id: "dsn-001",
    nama: "Darul Islam",
    gelar: "SE., M.M.",
    nidn: "198702172022031001",
    prodi_id: "prodi-d3",
    prodi_nama: "D3 Entrepreneurship",
    jabatan: "Koordinator Prodi D3",
    email: "darul.islam@trunojoyo.ac.id",
    foto_url: "IMAGE/Darul.jpg",
    mata_kuliah: ["Manajemen Kewirausahaan", "Bisnis Startup", "Studi Kelayakan Bisnis"]
  },
  {
    id: "dsn-002",
    nama: "Yustina Chrismardani",
    gelar: "SSi., M.M.",
    nidn: "197807192005012002",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "Koordinator Prodi S1",
    email: "yustina.chrismardani@trunojoyo.ac.id",
    foto_url: "IMAGE/yustin.jpg",
    mata_kuliah: ["Riset Operasi", "Statistika Bisnis"]
  },
  {
    id: "dsn-003",
    nama: "Dr. Bambang Setiyo Pambudi",
    gelar: "S.E., M.M.",
    nidn: "197309272003121001",
    prodi_id: "prodi-s2",
    prodi_nama: "S2 Manajemen",
    jabatan: "Koordinator Prodi S2",
    email: "bambang.pambudi@trunojoyo.ac.id",
    foto_url: "IMAGE/Bambang.jpg",
    mata_kuliah: ["Manajemen Pemasaran Stratejik", "Prilaku Konsumen Digital", "Metodologi Penelitian Manajemen"]
  },
  {
    id: "dsn-004",
    nama: "Dr. A. Yahya Surya Winata",
    gelar: "S.E., M.Si.",
    nidn: "197301042005011001",
    prodi_id: "prodi-s3",
    prodi_nama: "S3 Doktor Ilmu Manajemen",
    jabatan: "Koordinator Prodi S3",
    email: "yahya.surya@trunojoyo.ac.id",
    foto_url: "IMAGE/Yahya.jpg",
    mata_kuliah: ["Filsafat Ilmu & Etika Riset", "Teori Keuangan Modern", "Isi-Isu Mutakhir Manajemen"]
  },
  {
    id: "dsn-007",
    nama: "Aprilina Susandini",
    gelar: "S.E., M.SM.",
    nidn: "198704162015042005",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "aprilina.susandini@trunojoyo.ac.id",
    foto_url: "IMAGE/April.jpg",
    mata_kuliah: ["Manajemen Pemasaran", "Perilaku Organisasi"]
  },
  {
    id: "dsn-008",
    nama: "Vidi Hadyarti",
    gelar: "S.M., M.M.",
    nidn: "199306112024212001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "vidi.hadyarti@trunojoyo.ac.id",
    foto_url: "IMAGE/Vidi.jpg",
    mata_kuliah: ["Manajemen Operasional", "Pengantar Manajemen"]
  },
  {
    id: "dsn-009",
    nama: "Hj. Evaliati Amaniyah",
    gelar: "S.E., M.S.M.",
    nidn: "197401282003122001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "evaliati.amaniyah@trunojoyo.ac.id",
    foto_url: "IMAGE/Eva.jpg",
    mata_kuliah: ["Manajemen Keuangan", "Kewirausahaan"]
  },
  {
    id: "dsn-010",
    nama: "Faidal",
    gelar: "S.E., M.M.",
    nidn: "197703032003121002",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "faidal@trunojoyo.ac.id",
    foto_url: "IMAGE/Faidal.jpg",
    mata_kuliah: ["Manajemen Pemasaran", "Manajemen Operasional"]
  },
  {
    id: "dsn-011",
    nama: "Hadi Purnomo",
    gelar: "S.E., M.M.",
    nidn: "197209032003121001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "hadi.purnomo@trunojoyo.ac.id",
    foto_url: "IMAGE/Hadi.jpg",
    mata_kuliah: ["Manajemen Keuangan", "Metodologi Penelitian"]
  },
  {
    id: "dsn-012",
    nama: "Dr. Helmi Buyung Aulia Safrizal",
    gelar: "ST., SE., M.M.T.",
    nidn: "197805152006041002",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "helmi.safrizal@trunojoyo.ac.id",
    foto_url: "IMAGE/Helmi.jpg",
    mata_kuliah: ["Manajemen Strategis", "Manajemen Teknologi & Inovasi"]
  },
  {
    id: "dsn-013",
    nama: "Dr. Hj. Iriani Ismail",
    gelar: "Dra., M.M.",
    nidn: "196206231988112001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "iriani.ismail@trunojoyo.ac.id",
    foto_url: "IMAGE/Ir.jpg",
    mata_kuliah: ["Manajemen Sumber Daya Manusia", "Perilaku Organisasi"]
  },
  {
    id: "dsn-014",
    nama: "Drs. Makhmud Zulkifli",
    gelar: "M.Si.",
    nidn: "196407242001121001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "makhmud.zulkifli@trunojoyo.ac.id",
    foto_url: "IMAGE/Makhmud.jpg",
    mata_kuliah: ["Manajemen Keuangan", "Pengantar Manajemen"]
  },
  {
    id: "dsn-015",
    nama: "Dr. Mochammad Isa Anshori",
    gelar: "S.E., M.Si.",
    nidn: "197003222005011003",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "isa.anshori@trunojoyo.ac.id",
    foto_url: "IMAGE/Isa.jpg",
    mata_kuliah: ["Manajemen Pemasaran", "Metodologi Penelitian"]
  },
  {
    id: "dsn-016",
    nama: "Deykha Aguilika",
    gelar: "S.EI., M.SM.",
    nidn: "199008082022032012",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "deykha.aguilika@trunojoyo.ac.id",
    foto_url: "IMAGE/Deykha.jpg",
    mata_kuliah: ["Manajemen Keuangan Syariah", "Pengantar Bisnis"]
  },
  {
    id: "dsn-017",
    nama: "Dr. Dede Rosyadi ZA",
    gelar: "S.Hum., M.Pd",
    nidn: "198804162022031005",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "dede.rosyadi@trunojoyo.ac.id",
    foto_url: "IMAGE/Dede.jpg",
    mata_kuliah: ["Bahasa Indonesia Akademik", "Etika Bisnis"]
  },
  {
    id: "dsn-018",
    nama: "Dr. Muhammad Alkirom Wildan",
    gelar: "S.E., M.Si.",
    nidn: "196902132005011001",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    jabatan: "",
    email: "alkirom.wildan@trunojoyo.ac.id",
    foto_url: "IMAGE/Wildan.jpg",
    mata_kuliah: ["Manajemen Strategik", "Manajemen Perubahan"]
  }
];

export const INITIAL_PEMBERKASAN = [
  {
    id: "DOC-2026-001",
    mahasiswa_id: "mhs-001",
    mahasiswa_nama: "Bagas Pratama",
    nim: "210211100145",
    prodi_nama: "S1 Manajemen",
    jenis_berkas: "Pengajuan Judul Skripsi",
    file_name: "Proposal_Skripsi_BagasPratama.pdf",
    file_url: "#",
    file_size: "2.4 MB",
    status: "Sedang Diproses",
    catatan_admin: "Berkas sudah diterima di bagian administrasi jurusan. Menunggu verifikasi tim komisi skripsi.",
    tanggal_upload: "2026-08-04 09:30",
    tanggal_update: "2026-08-04 11:15"
  },
  {
    id: "DOC-2026-002",
    mahasiswa_id: "mhs-001",
    mahasiswa_nama: "Bagas Pratama",
    nim: "210211100145",
    prodi_nama: "S1 Manajemen",
    jenis_berkas: "Surat Izin Penelitian Kampus",
    file_name: "Surat_Izin_Penelitian_Bagas.pdf",
    file_url: "#",
    file_size: "1.8 MB",
    status: "Disetujui",
    catatan_admin: "Surat izin penelitian telah ditandatangani oleh Ketua Jurusan dan dapat diunduh/diambil di ruang adm.",
    tanggal_upload: "2026-07-28 14:20",
    tanggal_update: "2026-07-29 10:00"
  },
  {
    id: "DOC-2026-003",
    mahasiswa_id: "mhs-002",
    mahasiswa_nama: "Siti Nurhaliza",
    nim: "220211100088",
    prodi_nama: "D3 Entrepreneurship",
    jenis_berkas: "Berkas Pendaftaran Magang Industri",
    file_name: "Magang_SitiNurhaliza.pdf",
    file_url: "#",
    file_size: "3.1 MB",
    status: "Perlu Revisi",
    catatan_admin: "Harap melampirkan transkrip nilai semester 1-4 yang disahkan oleh Koprodi D3.",
    tanggal_upload: "2026-08-02 16:45",
    tanggal_update: "2026-08-03 08:30"
  },
  {
    id: "DOC-2026-004",
    mahasiswa_id: "mhs-003",
    mahasiswa_nama: "Rian Hidayatullah",
    nim: "200211100201",
    prodi_nama: "S1 Manajemen",
    jenis_berkas: "Berkas Kelengkapan Yudisium",
    file_name: "Yudisium_RianHidayat.pdf",
    file_url: "#",
    file_size: "4.5 MB",
    status: "Disetujui",
    catatan_admin: "Semua berkas kelulusan yudisium terverifikasi valid. Selamat!",
    tanggal_upload: "2026-07-20 11:00",
    tanggal_update: "2026-07-21 15:00"
  },
  {
    id: "DOC-2026-005",
    mahasiswa_id: "mhs-004",
    mahasiswa_nama: "Ahmad Rizky Fauzi",
    nim: "230211100312",
    prodi_nama: "S2 Manajemen",
    jenis_berkas: "Pendaftaran Ujian Tesis",
    file_name: "Draf_Tesis_AhmadRizky.pdf",
    file_url: "#",
    file_size: "5.0 MB",
    status: "Diterima",
    catatan_admin: "Berkas pendaftaran ujian tesis telah masuk antrean verifikasi admin.",
    tanggal_upload: "2026-08-06 08:15",
    tanggal_update: "2026-08-06 08:15"
  },
  {
    id: "DOC-2026-006",
    mahasiswa_id: "mhs-rahmat-hidayat",
    mahasiswa_nama: "Rahmat Hidayat",
    nim: "210211105432",
    prodi_nama: "S1 Manajemen",
    jenis_berkas: "Pengajuan Judul Skripsi",
    file_name: "Proposal_Skripsi_RahmatHidayat.pdf",
    file_url: "#",
    file_size: "2.8 MB",
    status: "Disetujui",
    catatan_admin: "Judul skripsi disetujui komisi skripsi. Lanjutkan ke tahap bimbingan dosen pembimbing.",
    tanggal_upload: "2026-08-08 10:15",
    tanggal_update: "2026-08-08 14:30"
  },
  {
    id: "DOC-2026-007",
    mahasiswa_id: "mhs-rahmat-hidayat",
    mahasiswa_nama: "Rahmat Hidayat",
    nim: "210211105432",
    prodi_nama: "S1 Manajemen",
    jenis_berkas: "Surat Izin Penelitian Kampus",
    file_name: "Surat_Penelitian_RahmatHidayat.pdf",
    file_url: "#",
    file_size: "1.5 MB",
    status: "Sedang Diproses",
    catatan_admin: "Berkas sedang dalam tahap pengesahan oleh Sekretaris Jurusan.",
    tanggal_upload: "2026-08-09 09:00",
    tanggal_update: "2026-08-09 09:00"
  }
];

export const INITIAL_PRESTASI = [
  {
    id: "PRES-2026-001",
    mahasiswa_id: "mhs-001",
    mahasiswa_nama: "Bagas Pratama",
    nim: "210211100145",
    prodi_nama: "S1 Manajemen",
    judul: "Juara 1 National Business Plan Competition FEB UNER 2026",
    kategori: "Akademik / Competiton",
    tingkat: "Nasional",
    tanggal_kegiatan: "2026-05-15",
    file_bukti_name: "Sertifikat_Juara1_Bagas.pdf",
    file_bukti_url: "#",
    status_verifikasi: "Disetujui",
    catatan: "Validasi panitia terkonfirmasi. Poin SKPI ditambahkan (+50 Poin)."
  },
  {
    id: "PRES-2026-002",
    mahasiswa_id: "mhs-001",
    mahasiswa_nama: "Bagas Pratama",
    nim: "210211100145",
    prodi_nama: "S1 Manajemen",
    judul: "Publikasi Jurnal Scopus Q3: Digital Transformation in Madura MSMEs",
    kategori: "Publikasi Ilmiah",
    tingkat: "Internasional",
    tanggal_kegiatan: "2026-06-20",
    file_bukti_name: "Scopus_Paper_Certificate.pdf",
    file_bukti_url: "#",
    status_verifikasi: "Disetujui",
    catatan: "Telah dipublikasikan pada International Journal of Business & Society."
  },
  {
    id: "PRES-2026-003",
    mahasiswa_id: "mhs-002",
    mahasiswa_nama: "Siti Nurhaliza",
    nim: "220211100088",
    prodi_nama: "D3 Entrepreneurship",
    judul: "Juara Best Innovation Award Madura Youth Startup Summit 2026",
    kategori: "Kewirausahaan",
    tingkat: "Lokal / Regional",
    tanggal_kegiatan: "2026-07-10",
    file_bukti_name: "Award_Certificate_Siti.png",
    file_bukti_url: "#",
    status_verifikasi: "Menunggu Verifikasi",
    catatan: "-"
  }
];

export const INITIAL_DAFTAR_HADIR = [
  {
    id: "PRESENCE-000A",
    tanggal: "2026-08-07",
    nama_pimpinan: "Fathor AS, SE., M.M.",
    jabatan: "Ketua Jurusan Manajemen",
    agenda: "Pelayanan Konsultasi Mahasiswa & Pengesahan Dokumen Jurusan",
    status_hadir: "Hadir",
    waktu_masuk: "07:30 WIB",
    catatan: "Standby di Ruang Ketua Jurusan (Gedung FEB Lt. 2)."
  },
  {
    id: "PRESENCE-000B",
    tanggal: "2026-08-07",
    nama_pimpinan: "M. Boy Singgih Gitayuda, S.E., M.M.",
    jabatan: "Sekretaris Jurusan Manajemen",
    agenda: "Koordinasi Administrasi Perkuliahan & Bimbingan Proposal",
    status_hadir: "Hadir",
    waktu_masuk: "07:45 WIB",
    catatan: "Standby di Ruang Sekretaris Jurusan / Sekretariat FEB."
  },
  {
    id: "PRESENCE-001",
    tanggal: "2026-08-07",
    nama_pimpinan: "Dr. A. Yahya Surya Winata, S.E., M.Si.",
    jabatan: "Koprodi S3 Doktor Ilmu Manajemen",
    agenda: "Rapat Koordinasi Evaluasi Kurikulum & Promosi Doktor",
    status_hadir: "Hadir",
    waktu_masuk: "08:45 WIB",
    catatan: "Memimpin pembahasan struktur mata kuliah S3 & S1."
  },
  {
    id: "PRESENCE-002",
    tanggal: "2026-08-07",
    nama_pimpinan: "Dr. Bambang Setiyo Pambudi, S.E., M.M.",
    jabatan: "Koprodi S2 Magister Manajemen",
    agenda: "Bimbingan Tesis Pascasarjana & Kerjasama Industri",
    status_hadir: "Hadir",
    waktu_masuk: "08:50 WIB",
    catatan: "Menyampaikan progress kerjasama magister dengan mitra industri."
  },
  {
    id: "PRESENCE-003",
    tanggal: "2026-08-07",
    nama_pimpinan: "Yustina Chrismardani, SSi., M.M.",
    jabatan: "Koprodi S1 Manajemen",
    agenda: "Konsultasi Mahasiswa S1 & Verifikasi Berkas Skripsi",
    status_hadir: "Hadir",
    waktu_masuk: "08:40 WIB",
    catatan: "Standby di Ruang Koprodi S1 untuk layanan berkas yudisium."
  },
  {
    id: "PRESENCE-004",
    tanggal: "2026-08-07",
    nama_pimpinan: "Darul Islam, SE., M.M.",
    jabatan: "Koprodi D3 Entrepreneurship",
    agenda: "Pendampingan Program Inkubator Bisnis & Kewirausahaan",
    status_hadir: "Izin",
    waktu_masuk: "-",
    catatan: "Dinas luar pendampingan UMKM mitra di Surabaya."
  }
];

export const INITIAL_PENGUMUMAN = [
  {
    id: "NEWS-001",
    judul: "Jadwal Pendaftaran Yudisium & Penyerahan Berkas Periode IV Tahun 2026",
    kategori: "Akademik",
    tanggal: "2026-08-04",
    ringkasan: "Diberitahukan kepada seluruh mahasiswa Jurusan Manajemen FEB UTM bahwa pendaftaran yudisium Periode IV dibuka mulai tanggal 10 - 25 Agustus 2026 melalui sistem online ini.",
    isi: "Diberitahukan kepada calon wisudawan/wisudawati Jurusan Manajemen (D3, S1, S2, S3) FEB Universitas Trunojoyo Madura bahwa pendaftaran Yudisium Periode IV Tahun 2026 resmi dibuka.\n\nPersyaratan Berkas:\n1. Bebas tanggungan perpustakaan UTM & FEB.\n2. Transkrip nilai bebas matakuliah mengulang.\n3. Bukti penyerahan draf akhir Skripsi/Tesis/Disertasi.\n4. Upload berita acara ujian dan bukti revisi.\n\nSeluruh proses pengunggahan dan pencocokan berkas dilakukan melalui portal ini.",
    penulis: "Admin Jurusan Manajemen",
    penting: true
  },
  {
    id: "NEWS-002",
    judul: "Pengumuman Sosialisasi Hibah Research & Business Plan Competition 2026",
    kategori: "Kemahasiswaan",
    tanggal: "2026-07-30",
    ringkasan: "Jurusan Manajemen menyelenggarakan Workshop Penyusunan Proposal Bisnis Plan bagi mahasiswa D3 & S1 dengan total pendanaan 50 Juta Rupiah.",
    isi: "Guna meningkatkan iklim kompetisi dan prestasi mahasiswa Jurusan Manajemen FEB UTM, kami mengundang seluruh mahasiswa untuk menghadiri Workshop Business Plan 2026.\n\nAcara diselenggarakan pada:\nHari/Tanggal: Kamis, 14 Agustus 2026\nPukul: 09.00 WIB - Selesai\nTempat: Aula Laboratorium Manajemen Lt.2",
    penulis: "Tim Kemahasiswaan Manajemen",
    penting: false
  },
  {
    id: "NEWS-003",
    judul: "Selamat atas Akreditasi UNGGUL Program Studi S1 Manajemen FEB UTM",
    kategori: "Prestasi Jurusan",
    tanggal: "2026-07-15",
    ringkasan: "Berdasarkan Keputusan LAMEMBA, Prodi S1 Manajemen Fakultas Ekonomi dan Bisnis Universitas Trunojoyo Madura berhasil meraih Peringkat Akreditasi UNGGUL.",
    isi: "Segenap civitas akademika Jurusan Manajemen FEB UTM mengucapkan rasa syukur dan terima kasih yang mendalam kepada seluruh dosen, tenaga kependidikan, alumni, mahasiswa, serta mitra industri atas raihan Akreditasi UNGGUL dari LAMEMBA.\n\nSemoga capaian ini memotivasi Jurusan Manajemen UTM untuk terus berkembang menjadi pusat keunggulan pendidikan manajemen berpilar kearifan lokal berstandar global.",
    penulis: "Ketua Jurusan Manajemen",
    penting: true
  }
];

export const INITIAL_USERS = [
  {
    id: "user-admin-1",
    nama: "Admin Utama Sekretariat FEB",
    email: "admin1.manajemen@trunojoyo.ac.id",
    role: "admin",
    nim_nidn: "NIP. 198503122010121001",
    prodi_id: "all",
    status_akun: "Aktif"
  },
  {
    id: "user-admin-2",
    nama: "Admin Pelayanan Pemberkasan",
    email: "admin2.manajemen@trunojoyo.ac.id",
    role: "admin",
    nim_nidn: "NIP. 198705142012011002",
    prodi_id: "all",
    status_akun: "Aktif"
  },
  {
    id: "user-admin-3",
    nama: "Admin Verifikator Jurusan",
    email: "admin3.manajemen@trunojoyo.ac.id",
    role: "admin",
    nim_nidn: "NIP. 199001202015041003",
    prodi_id: "all",
    status_akun: "Aktif"
  },
  {
    id: "user-mhs-1",
    nama: "Bagas Pratama",
    email: "210211100145@student.trunojoyo.ac.id",
    role: "mahasiswa",
    nim_nidn: "210211100145",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    status_akun: "Aktif"
  },
  {
    id: "mhs-rahmat-hidayat",
    nama: "Rahmat Hidayat",
    email: "rahmat.hidayat@student.trunojoyo.ac.id",
    role: "mahasiswa",
    nim_nidn: "210211105432",
    prodi_id: "prodi-s1",
    prodi_nama: "S1 Manajemen",
    status_akun: "Aktif"
  },
  {
    id: "user-dosen-1",
    nama: "Dr. Bambang Setiyo Pambudi, S.E., M.M.",
    email: "bambang.pambudi@trunojoyo.ac.id",
    role: "dosen",
    nim_nidn: "197309272003121001",
    prodi_id: "prodi-s2",
    prodi_nama: "S2 Manajemen",
    status_akun: "Aktif"
  }
];
