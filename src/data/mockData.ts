import { DashboardKey, DashboardDataResponse, StatusCategory } from '../types/dashboard';

export const MOCK_DASHBOARD_DATA: Record<Exclude<DashboardKey, 'home'>, DashboardDataResponse> = {
  'kerjasama': {
    menuId: 'kerjasama',
    title: 'Kerjasama PR TPP',
    sheetId: '15X9DlQGIkMfshlIpvNnRHZ0eOSUxmhiGkXjPYZSNzIU',
    totalRows: 12,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    headers: [
      'No',
      'Judul Kerja Sama',
      'Para Pihak',
      'No Nodin ORPP ke BHKS',
      'PIC kegiatan riset',
      'Status usulan telaah'
    ],
    columnKeys: ['A', 'B', 'C', 'D', 'E', 'F'],
    stats: { total: 12, selesai: 5, onProses: 4, dalamAntrian: 3 },
    rows: [
      {
        id: 'kerjasama-1',
        rowIndex: 1,
        columns: [
          'PT Dirgantara Indonesia (PTDI)',
          'PKS Pengembangan Komposit Serat Alam untuk Komponen Interior Pesawat',
          'PRTPP/PKS/2026/001',
          '15 Juli 2026',
          'SELESAI PROSES',
          'Dr. Eng. Tri Handoko (Selesai Penandatanganan)'
        ],
        rawValues: { D: 'PT Dirgantara Indonesia (PTDI)', E: 'PKS Pengembangan Komposit Serat Alam', F: 'PRTPP/PKS/2026/001', G: '15 Juli 2026', H: 'SELESAI PROSES', I: 'Dr. Eng. Tri Handoko' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'kerjasama-2',
        rowIndex: 2,
        columns: [
          'Institut Teknologi Bandung (ITB)',
          'MoU Riset Bersama Material Aerostruktur Ringan Berbasis Polimer Nanokomposit',
          'MOU/BRIN-ITB/2026/002',
          '20 Juli 2026',
          'ON PROSES',
          'Prof. Budi Rahardjo (Pembahasan Draft Final Hukum)'
        ],
        rawValues: { D: 'Institut Teknologi Bandung (ITB)', E: 'MoU Riset Bersama Material Aerostruktur', F: 'MOU/BRIN-ITB/2026/002', G: '20 Juli 2026', H: 'ON PROSES', I: 'Prof. Budi Rahardjo' },
        status: 'ON PROSES'
      },
      {
        id: 'kerjasama-3',
        rowIndex: 3,
        columns: [
          'PT Regio Aviasi Industri (RAI)',
          'Kerjasama Pengujian Aerodinamika Terowongan Angin Subsonik Pesawat R80',
          'PRTPP/AGR/2026/003',
          '22 Juli 2026',
          'SELESAI PROSES',
          'Ir. Bambang Sugiarto, M.T. (SK Kerja Sama Terbit)'
        ],
        rawValues: { D: 'PT Regio Aviasi Industri (RAI)', E: 'Kerjasama Pengujian Aerodinamika', F: 'PRTPP/AGR/2026/085', G: '22 Juli 2026', H: 'SELESAI PROSES', I: 'Ir. Bambang Sugiarto, M.T.' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'kerjasama-86',
        rowIndex: 86,
        columns: [
          'Universitas Gadjah Mada (UGM)',
          'Naskah Perjanjian Riset Sintesis Biopolimer Ramah Lingkungan untuk Kemasan',
          'PRTPP/NKR/2026/044',
          '25 Juli 2026',
          'DALAM ANTRIAN PROSES',
          'Sekretariat PR TPP (Menunggu Paraf Deputi)'
        ],
        rawValues: { D: 'Universitas Gadjah Mada (UGM)', E: 'Naskah Perjanjian Riset Sintesis Biopolimer', F: 'PRTPP/NKR/2026/044', G: '25 Juli 2026', H: 'DALAM ANTRIAN PROSES', I: 'Sekretariat PR TPP' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'kerjasama-87',
        rowIndex: 87,
        columns: [
          'PT Polychem Indonesia Tbk',
          'Pengujian Karakteristik Mekanik dan Termal Sampel Resin Sintetis Advanced',
          'PRTPP/SPK/2026/099',
          '28 Juli 2026',
          'ON PROSES',
          'Dr. Rina Novita (Revisi Lampiran Biaya Pengujian)'
        ],
        rawValues: { D: 'PT Polychem Indonesia Tbk', E: 'Pengujian Karakteristik Mekanik', F: 'PRTPP/SPK/2026/099', G: '28 Juli 2026', H: 'ON PROSES', I: 'Dr. Rina Novita' },
        status: 'ON PROSES'
      },
      {
        id: 'kerjasama-88',
        rowIndex: 88,
        columns: [
          'Kementerian Perhubungan (Balai Kalibrasi)',
          'PKS Sertifikasi Komponen Avionik dan Propulsi Pesawat Nirawak (UAV)',
          'PRTPP/PKS/2026/102',
          '29 Juli 2026',
          'SELESAI PROSES',
          'Hendra Wijaya, S.T. (Telah Ditandatangani Ka PR TPP)'
        ],
        rawValues: { D: 'Kemenhub (Balai Kalibrasi)', E: 'PKS Sertifikasi Komponen Avionik', F: 'PRTPP/PKS/2026/102', G: '29 Juli 2026', H: 'SELESAI PROSES', I: 'Hendra Wijaya, S.T.' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'kerjasama-89',
        rowIndex: 89,
        columns: [
          'Universitas Indonesia (FTUI)',
          'Joint Research Konsorsium Pengembangan Drone Pemadam Kebakaran Hutan',
          'PRTPP/JRC/2026/015',
          '30 Juli 2026',
          'DALAM ANTRIAN PROSES',
          'Tim Konsorsium Aerospasial (Draf Masuk Kebijakan)'
        ],
        rawValues: { D: 'Universitas Indonesia (FTUI)', E: 'Joint Research Drone Pemadam Kebakaran', F: 'PRTPP/JRC/2026/015', G: '30 Juli 2026', H: 'DALAM ANTRIAN PROSES', I: 'Tim Konsorsium' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'kerjasama-90',
        rowIndex: 90,
        columns: [
          'PT Chandra Asri Petrochemical',
          'Perjanjian Kerjasama Daur Ulang Plastik High Density Polyethylene (HDPE)',
          'PRTPP/PKS/2026/108',
          '31 Juli 2026',
          'ON PROSES',
          'Dr. Agus Permana (Penyesuaian Klausul HKI)'
        ],
        rawValues: { D: 'PT Chandra Asri Petrochemical', E: 'Perjanjian Kerjasama Daur Ulang Plastik HDPE', F: 'PRTPP/PKS/2026/108', G: '31 Juli 2026', H: 'ON PROSES', I: 'Dr. Agus Permana' },
        status: 'ON PROSES'
      }
    ]
  },
  'surat-tugas': {
    menuId: 'surat-tugas',
    title: 'Surat Tugas (ST)',
    sheetId: '1mflUypYo-Oqx7XSe4Fu-yrhZ5-V6b2VquoR6DwpG_Vs',
    totalRows: 10,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    headers: [
      'No. Register (A)',
      'Pemohon / Pegawai (B)',
      'Maksud & Agenda Tugas (G)',
      'Tanggal & Lokasi (I)',
      'Status Pemrosesan (J)',
      'Keterangan / No. ST (K)'
    ],
    columnKeys: ['A', 'B', 'G', 'I', 'J', 'K'],
    stats: { total: 10, selesai: 5, onProses: 3, dalamAntrian: 2 },
    rows: [
      {
        id: 'st-2',
        rowIndex: 2,
        columns: ['ST/2026/001', 'Ahmad Subandi, M.Sc.', 'Pendampingan Pengujian Terowongan Angin Subsonik KSA', '1-3 Agustus 2026, KST BJ Habibie Serpong', 'SELESAI PROSES', 'ST.No: B-102/III.4/PRTPP/8/2026'],
        rawValues: { A: 'ST/2026/001', B: 'Ahmad Subandi, M.Sc.', G: 'Pendampingan Pengujian Terowongan Angin', I: '1-3 Agt 2026, Serpong', J: 'SELESAI PROSES', K: 'ST Terbit' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'st-3',
        rowIndex: 3,
        columns: ['ST/2026/002', 'Dr. Endang Suwarna', 'Simposum Internasional Polymer & Advanced Aerospace Materials', '5-8 Agustus 2026, Bali Convention Center', 'ON PROSES', 'Proses Paraf Koordinator Kelompok Riset'],
        rawValues: { A: 'ST/2026/002', B: 'Dr. Endang Suwarna', G: 'Simposum Polymer & Aerospace', I: '5-8 Agt 2026, Bali', J: 'ON PROSES', K: 'Paraf Kelompok Riset' },
        status: 'ON PROSES'
      },
      {
        id: 'st-4',
        rowIndex: 4,
        columns: ['ST/2026/003', 'Siti Rahmawati, S.T.', 'Pengambilan Sampel Polimer Alam Biodegradable', '10 Agustus 2026, Subang Jawa Barat', 'SELESAI PROSES', 'ST.No: B-105/III.4/PRTPP/8/2026'],
        rawValues: { A: 'ST/2026/003', B: 'Siti Rahmawati, S.T.', G: 'Pengambilan Sampel Polimer Alam', I: '10 Agt 2026, Subang', J: 'SELESAI PROSES', K: 'ST Terbit' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'st-5',
        rowIndex: 5,
        columns: ['ST/2026/004', 'Drs. Supriyanto, M.T.', 'Audit Internal Laboratorium Pengujian Material Komposit', '12 Agustus 2026, Bandung', 'DALAM ANTRIAN PROSES', 'Menunggu Verifikasi Nota Dinas Pengantar'],
        rawValues: { A: 'ST/2026/004', B: 'Drs. Supriyanto, M.T.', G: 'Audit Internal Laboratorium', I: '12 Agt 2026, Bandung', J: 'DALAM ANTRIAN PROSES', K: 'Menunggu Verifikasi' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'st-6',
        rowIndex: 6,
        columns: ['ST/2026/005', 'Fajar Pratama, Ph.D.', 'Koordinasi Teknis Konsorsium Pesawat Amphibi (Seaplane)', '15 Agustus 2026, Kemenko Marves Jakarta', 'ON PROSES', 'Verifikasi Anggaran Operasional'],
        rawValues: { A: 'ST/2026/005', B: 'Fajar Pratama, Ph.D.', G: 'Koordinasi Pesawat Amphibi', I: '15 Agt 2026, Jakarta', J: 'ON PROSES', K: 'Verifikasi Anggaran' },
        status: 'ON PROSES'
      },
      {
        id: 'st-7',
        rowIndex: 7,
        columns: ['ST/2026/006', 'Dwi Lestari, S.Si.', 'Peningkatan Kapasitas Operator Spektrometer FT-IR', '18-20 Agustus 2026, Yogyakarta', 'SELESAI PROSES', 'ST.No: B-110/III.4/PRTPP/8/2026'],
        rawValues: { A: 'ST/2026/006', B: 'Dwi Lestari, S.Si.', G: 'Pelatihan Spektrometer FT-IR', I: '18-20 Agt 2026, Jogja', J: 'SELESAI PROSES', K: 'ST Terbit' },
        status: 'SELESAI PROSES'
      }
    ]
  },
  'bimbingan-magang': {
    menuId: 'bimbingan-magang',
    title: 'Surat Balasan Bimbingan, Magang / PKL',
    sheetId: '1BkJJCfF087GfS4XIeicFL4ajCe-Kg9TPYatvJGu4T_o',
    totalRows: 9,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    headers: [
      'No. Agenda (A)',
      'Nama Pembimbing BRIN (B)',
      'Nama Mahasiswa (C)',
      'Status (D)',
      'Prodi (F)',
      'Universitas (H)',
      'Tanggal Mulai - Tanggal Selesai (I)'
    ],
    columnKeys: ['A', 'B', 'C', 'D', 'F', 'H', 'I'],
    stats: { total: 9, selesai: 4, onProses: 3, dalamAntrian: 2 },
    rows: [
      {
        id: 'bm-2',
        rowIndex: 2,
        columns: ['MG/2026/011', 'Muhammad Rizky & Tim (3 org)', 'Institut Teknologi Sepuluh Nopember (ITS)', 'Teknik Dirgantara', '12 Juli 2026', 'SELESAI PROSES', 'Surat Diterima: B-402/III.4/PRTPP/7/2026'],
        rawValues: { A: 'MG/2026/011', B: 'Muhammad Rizky', C: 'ITS', D: 'Teknik Dirgantara', F: '12 Juli 2026', H: 'SELESAI PROSES', I: 'Surat Balasan Diterbitkan' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'bm-3',
        rowIndex: 3,
        columns: ['MG/2026/012', 'Anisa Fitriani', 'Universitas Indonesia (UI)', 'Departemen Kimia / Material', '18 Juli 2026', 'ON PROSES', 'Konfirmasi Pembimbing Lapangan (Lab Polimer)'],
        rawValues: { A: 'MG/2026/012', B: 'Anisa Fitriani', C: 'UI', D: 'Kimia Material', F: '18 Juli 2026', H: 'ON PROSES', I: 'Proses Pembimbing' },
        status: 'ON PROSES'
      },
      {
        id: 'bm-4',
        rowIndex: 4,
        columns: ['MG/2026/013', 'Bagus Pratama', 'Universitas Diponegoro (UNDIP)', 'Teknik Mesin', '22 Juli 2026', 'SELESAI PROSES', 'Surat Balasan Penolakan (Kuota Penuh Per Agustus)'],
        rawValues: { A: 'MG/2026/013', B: 'Bagus Pratama', C: 'UNDIP', D: 'Teknik Mesin', F: '22 Juli 2026', H: 'SELESAI PROSES', I: 'Diterbitkan Penolakan' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'bm-5',
        rowIndex: 5,
        columns: ['MG/2026/014', 'Dewi Sartika & Nurul', 'Politeknik Negeri Bandung (POLBAN)', 'Teknik Penerbangan', '25 Juli 2026', 'DALAM ANTRIAN PROSES', 'Menunggu Persetujuan Koordinator Laboratorium Aerodinamika'],
        rawValues: { A: 'MG/2026/014', B: 'Dewi Sartika', C: 'POLBAN', D: 'Teknik Penerbangan', F: '25 Juli 2026', H: 'DALAM ANTRIAN PROSES', I: 'Dalam Antrian' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'bm-6',
        rowIndex: 6,
        columns: ['MG/2026/016', 'Rania Zahrani', 'Universitas Sebelas Maret (UNS)', 'Sains Data & Fisika', '30 Juli 2026', 'SELESAI PROSES', 'Surat Diterima: B-415/III.4/PRTPP/7/2026'],
        rawValues: { A: 'MG/2026/016', B: 'Rania Zahrani', C: 'UNS', D: 'Fisika', F: '30 Juli 2026', H: 'SELESAI PROSES', I: 'Diterbitkan' },
        status: 'SELESAI PROSES'
      }
    ]
  },
  'surat-tugas-dbr': {
    menuId: 'surat-tugas-dbr',
    title: 'Surat Tugas DBR',
    sheetId: '1ISBEwTYaM9VFrLTYyHFQ31k-kTViD0H_Xy1bmtwIxXg',
    totalRows: 8,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    headers: [
      'Tanggal Input (A)',
      'Nama Periset / Peneliti (B)',
      'Detail kegiatan di Kampus (G)',
      'Tanggal Pelaksanaan (H)',
      'TEMPAT Pelaksanaan (I)',
      'Personil Yang Ikut Serta (J)'
    ],
    columnKeys: ['A', 'B', 'G', 'H', 'I', 'J'],
    stats: { total: 8, selesai: 4, onProses: 2, dalamAntrian: 2 },
    rows: [
      {
        id: 'dbr-2',
        rowIndex: 2,
        columns: ['DBR/PRTPP/2026/001', 'Dr. Eng. Agus Setiawan', 'Skema DBR: Riset Komposit Karbon Struktur Sayap UAV', '6 Bulan (Agt 2026 - Jan 2027)', 'SELESAI PROSES', 'SK DBR No: 55/HK/BRIN/2026'],
        rawValues: { A: 'DBR/PRTPP/2026/001', B: 'Dr. Eng. Agus Setiawan', G: 'Riset Komposit Karbon Sayap UAV', H: '6 Bulan', I: 'SELESAI PROSES', J: 'SK DBR Terbit' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'dbr-3',
        rowIndex: 3,
        columns: ['DBR/PRTPP/2026/002', 'Dr. Ratna Kartika', 'Skema DBR: Modifikasi Nanofiber Polimer Konduktif Sensor', '12 Bulan (Sep 2026 - Agt 2027)', 'ON PROSES', 'Verifikasi Dokumen Kelayakan Etika Riset'],
        rawValues: { A: 'DBR/PRTPP/2026/002', B: 'Dr. Ratna Kartika', G: 'Modifikasi Nanofiber Polimer Sensor', H: '12 Bulan', I: 'ON PROSES', J: 'Verifikasi Etika' },
        status: 'ON PROSES'
      },
      {
        id: 'dbr-4',
        rowIndex: 4,
        columns: ['DBR/PRTPP/2026/003', 'Hadi Sucipto, M.T.', 'Skema DBR: Pembuatan Prototype Baling-baling Komposit Quiet Propeller', '6 Bulan (Agt 2026 - Jan 2027)', 'SELESAI PROSES', 'SK DBR No: 61/HK/BRIN/2026'],
        rawValues: { A: 'DBR/PRTPP/2026/003', B: 'Hadi Sucipto, M.T.', G: 'Prototype Baling-baling Komposit', H: '6 Bulan', I: 'SELESAI PROSES', J: 'SK DBR Terbit' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'dbr-5',
        rowIndex: 5,
        columns: ['DBR/PRTPP/2026/004', 'Sari Mayang, M.Sc.', 'Skema DBR: Uji Degradasi Termal Polimer Selulosa Sekam Padi', '3 Bulan (Agt - Okt 2026)', 'DALAM ANTRIAN PROSES', 'Antrian Verifikasi Reviewer Internal BRIN'],
        rawValues: { A: 'DBR/PRTPP/2026/004', B: 'Sari Mayang, M.Sc.', G: 'Uji Degradasi Termal Polimer Selulosa', H: '3 Bulan', I: 'DALAM ANTRIAN PROSES', J: 'Antrian Review' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'dbr-6',
        rowIndex: 6,
        columns: ['DBR/PRTPP/2026/005', 'Ir. Yudi Hermawan, Ph.D.', 'Skema DBR: Pemodelan Numerik CFD Terowongan Angin Kecepatan Tinggi', '12 Bulan (Agt 2026 - Jul 2027)', 'SELESAI PROSES', 'SK DBR No: 68/HK/BRIN/2026'],
        rawValues: { A: 'DBR/PRTPP/2026/005', B: 'Ir. Yudi Hermawan', G: 'Pemodelan Numerik CFD Terowongan Angin', H: '12 Bulan', I: 'SELESAI PROSES', J: 'SK DBR Terbit' },
        status: 'SELESAI PROSES'
      }
    ]
  },
  'nota-dinas-bosdm': {
    menuId: 'nota-dinas-bosdm',
    title: 'Nota Dinas ke BOSDM (Bimbingan / Mengajar)',
    sheetId: '16cehUVJCQEs00KlEDmHWUQch7NDH68-aXE3EZ6eUYAs',
    totalRows: 7,
    isLive: false,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    headers: [
      'Tanggal Input (A)',
      'Nama Pegawai (B)',
      'Kampus (E)',
      'Tanggal Mulai Mengajar/Membimbing (F)',
      'Jenis Program (H)'
    ],
    columnKeys: ['A', 'B', 'E', 'F', 'H'],
    stats: { total: 7, selesai: 3, onProses: 2, dalamAntrian: 2 },
    rows: [
      {
        id: 'nd-2',
        rowIndex: 2,
        columns: ['ND-BOSDM/2026/088', 'Prof. Dr. Ir. Taufik Hidayat', 'Dosen Luar Biasa: Aerodinamika Lanjut & Komposit', 'Institut Teknologi Bandung (ITB)', 'SELESAI PROSES'],
        rawValues: { A: 'ND-BOSDM/2026/088', B: 'Prof. Taufik Hidayat', E: 'Dosen LB: Aerodinamika & Komposit', F: 'ITB', H: 'SELESAI PROSES' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'nd-3',
        rowIndex: 3,
        columns: ['ND-BOSDM/2026/089', 'Dr. Maya Indriati', 'Pembimbing Utama Disertasi Doktor Teknologi Polimer', 'Universitas Indonesia (UI)', 'ON PROSES'],
        rawValues: { A: 'ND-BOSDM/2026/089', B: 'Dr. Maya Indriati', E: 'Pembimbing Disertasi Doktor', F: 'UI', H: 'ON PROSES' },
        status: 'ON PROSES'
      },
      {
        id: 'nd-4',
        rowIndex: 4,
        columns: ['ND-BOSDM/2026/090', 'Dr. Lukman Hakim', 'Pengajar Tamu: Struktur Material Pesawat Terbang', 'Universitas Telkom Bandung', 'SELESAI PROSES'],
        rawValues: { A: 'ND-BOSDM/2026/090', B: 'Dr. Lukman Hakim', E: 'Pengajar Tamu Struktur Pesawat', F: 'Telkom University', H: 'SELESAI PROSES' },
        status: 'SELESAI PROSES'
      },
      {
        id: 'nd-5',
        rowIndex: 5,
        columns: ['ND-BOSDM/2026/091', 'Kartika Putri, M.Si.', 'Bimbingan Tesis Magister Sintesis Polimer Medis', 'Universitas Gadjah Mada (UGM)', 'DALAM ANTRIAN PROSES'],
        rawValues: { A: 'ND-BOSDM/2026/091', B: 'Kartika Putri, M.Si.', E: 'Bimbingan Tesis Polimer Medis', F: 'UGM', H: 'DALAM ANTRIAN PROSES' },
        status: 'DALAM ANTRIAN PROSES'
      },
      {
        id: 'nd-6',
        rowIndex: 6,
        columns: ['ND-BOSDM/2026/092', 'Dr. Eng. Rio Ferdinand', 'Kuliah Tamu: Teknologi Propulsi Jet & Rocketry', 'Universitas Nurtanio Bandung', 'ON PROSES'],
        rawValues: { A: 'ND-BOSDM/2026/092', B: 'Dr. Eng. Rio Ferdinand', E: 'Kuliah Tamu Propulsi Jet', F: 'Unnur Bandung', H: 'ON PROSES' },
        status: 'ON PROSES'
      }
    ]
  }
};
