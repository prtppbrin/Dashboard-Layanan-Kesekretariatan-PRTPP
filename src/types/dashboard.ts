export type DashboardKey = 'home' | 'kerjasama' | 'surat-tugas' | 'bimbingan-magang' | 'surat-tugas-dbr' | 'nota-dinas-bosdm';

export type StatusCategory = 'SELESAI PROSES' | 'ON PROSES' | 'DALAM ANTRIAN PROSES';

export interface DashboardMenuConfig {
  id: DashboardKey;
  title: string;
  subtitle: string;
  sheetId: string;
  sheetName?: string;
  targetColumns: string[]; // e.g., ['D', 'E', 'F', 'G', 'H', 'I'] or ['A', 'B', 'G', 'I', 'J', 'K']
  columnIndices: number[]; // 0-based column indices e.g., [3, 4, 5, 6, 7, 8]
  startRow: number; // 1-based start row index e.g., 83 or 2
  hasStatusFilter: boolean;
  statusColumnKey?: string;
  statusColumnHeader?: string;
  iconName: string;
  columnHeaders?: string[];
  badgeColor?: string;
}

export interface SheetRowData {
  id: string;
  rowIndex: number;
  columns: string[];
  rawValues: Record<string, string>; // e.g. { A: '...', B: '...' }
  status?: StatusCategory | string;
}

export interface DashboardDataResponse {
  menuId: DashboardKey;
  title: string;
  sheetId: string;
  totalRows: number;
  headers: string[];
  columnKeys: string[];
  rows: SheetRowData[];
  lastUpdated: string;
  isLive: boolean;
  error?: string;
  stats?: {
    total: number;
    selesai: number;
    onProses: number;
    dalamAntrian: number;
  };
}
