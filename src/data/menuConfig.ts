import { DashboardMenuConfig } from '../types/dashboard';

// Convert column letter to 0-based index (A -> 0, B -> 1, ..., Z -> 25)
export function colToIdx(col: string): number {
  let idx = 0;
  const uppercaseCol = col.trim().toUpperCase();
  for (let i = 0; i < uppercaseCol.length; i++) {
    idx = idx * 26 + uppercaseCol.charCodeAt(i) - 64;
  }
  return idx - 1;
}

export const MENU_CONFIGS: DashboardMenuConfig[] = [
  {
    id: 'kerjasama',
    title: 'Kerjasama PR TPP',
    subtitle: '',
    sheetId: '15X9DlQGIkMfshlIpvNnRHZ0eOSUxmhiGkXjPYZSNzIU',
    sheetName: '',
    targetColumns: ['A', 'B', 'C', 'D', 'E', 'F'],
    columnIndices: [colToIdx('A'), colToIdx('B'), colToIdx('C'), colToIdx('D'), colToIdx('E'), colToIdx('F')],
    startRow: 4,
    hasStatusFilter: true,
    statusColumnKey: 'F',
    statusColumnHeader: 'Keterangan',
    iconName: 'Handshake',
    columnHeaders: [
      'No',
      'Judul Kerja Sama',
      'Para Pihak',
      'No Nodin ORPP ke BHKS',
      'PIC kegiatan riset',
      'Status usulan telaah'
    ],
    badgeColor: 'blue',
    picInfo: {
      name: 'Allen Relyan Wijaya',
      role: 'Kerjasama PR TPP',
      waUrl: 'https://wa.me/6285643415448'
    }
  },
  {
    id: 'surat-tugas',
    title: 'Surat Tugas (ST)',
    subtitle: '',
    sheetId: '1mflUypYo-Oqx7XSe4Fu-yrhZ5-V6b2VquoR6DwpG_Vs',
    targetColumns: ['A', 'B', 'G', 'I', 'J', 'K'],
    columnIndices: [colToIdx('A'), colToIdx('B'), colToIdx('G'), colToIdx('I'), colToIdx('J'), colToIdx('K')],
    startRow: 4,
    hasStatusFilter: true,
    statusColumnKey: 'J',
    statusColumnHeader: 'Keterangan',
    iconName: 'FileText',
    columnHeaders: [
      'Tanggal Input',
      'Pemohon / Pegawai',
      'Maksud & Agenda Tugas',
      'Tanggal',
      'Tempat Pelaksanaan',
      'Personil Yang Ikut Serta'
    ],
    badgeColor: 'emerald',
    picInfo: {
      name: 'Yeny Indri Hapsari',
      role: 'Surat Tugas',
      waUrl: 'https://wa.me/6287884771566'
    }
  },
  {
    id: 'bimbingan-magang',
    title: 'Surat Balasan Bimbingan',
    subtitle: '',
    sheetId: '1BkJJCfF087GfS4XIeicFL4ajCe-Kg9TPYatvJGu4T_o',
    targetColumns: ['A', 'B', 'C', 'D', 'F', 'H', 'I'],
    columnIndices: [colToIdx('A'), colToIdx('B'), colToIdx('C'), colToIdx('D'), colToIdx('F'), colToIdx('H'), colToIdx('I')],
    startRow: 2,
    hasStatusFilter: true,
    statusColumnKey: 'H',
    statusColumnHeader: 'Keterangan',
    iconName: 'GraduationCap',
    columnHeaders: [
      'No. Agenda',
      'Nama Pembimbing BRIN',
      'Nama Mahasiswa',
      'Status',
      'Prodi',
      'Universitas',
      'Tanggal Mulai - Tanggal Selesai'
    ],
    badgeColor: 'violet',
    picInfo: {
      name: 'Allen Relyan Wijaya',
      role: 'Surat Balasan Bimbingan',
      waUrl: 'https://wa.me/6285643415448'
    }
  },
  {
    id: 'surat-tugas-dbr',
    title: 'Surat Tugas DBR',
    subtitle: '',
    sheetId: '1ISBEwTYaM9VFrLTYyHFQ31k-kTViD0H_Xy1bmtwIxXg',
    targetColumns: ['A', 'B', 'G', 'H', 'I', 'J'],
    columnIndices: [colToIdx('A'), colToIdx('B'), colToIdx('G'), colToIdx('H'), colToIdx('I'), colToIdx('J')],
    startRow: 2,
    hasStatusFilter: true,
    statusColumnKey: 'I',
    iconName: 'Award',
    columnHeaders: [
      'Tanggal Input',
      'Nama Periset / Peneliti',
      'Detail kegiatan di Kampus',
      'Tanggal Pelaksanaan',
      'Tempat Pelaksanaan',
      'Personil Yang Ikut Serta'
    ],
    badgeColor: 'amber',
    picInfo: {
      name: 'Yeny Indri Hapsari',
      role: 'Surat Tugas DBR',
      waUrl: 'https://wa.me/6287884771566'
    }
  },
  {
    id: 'nota-dinas-bosdm',
    title: 'Nota Dinas ke BOSDM (Bimbingan/ Mengajar)',
    subtitle: '',
    sheetId: '16cehUVJCQEs00KlEDmHWUQch7NDH68-aXE3EZ6eUYAs',
    targetColumns: ['A', 'B', 'E', 'F', 'H'],
    columnIndices: [colToIdx('A'), colToIdx('B'), colToIdx('E'), colToIdx('F'), colToIdx('H')],
    startRow: 2,
    hasStatusFilter: true,
    statusColumnKey: 'H',
    iconName: 'Send',
    columnHeaders: [
      'Tanggal Input',
      'Nama Pegawai',
      'Kampus',
      'Tanggal Mulai Mengajar/Membimbing',
      'Jenis Program'
    ],
    badgeColor: 'rose',
    picInfo: {
      name: 'Allen Relyan Wijaya',
      role: 'Nota Dinas ke BOSDM',
      waUrl: 'https://wa.me/6285643415448'
    }
  }
];
