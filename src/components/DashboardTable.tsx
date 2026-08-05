import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Eye,
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { DashboardKey, DashboardDataResponse, SheetRowData, StatusCategory } from '../types/dashboard';
import { DashboardMenuConfig } from '../types/dashboard';
import { SingleDashboardChart } from './DashboardCharts';

interface DashboardTableProps {
  config: DashboardMenuConfig;
  data?: DashboardDataResponse;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectRow: (row: SheetRowData) => void;
  onOpenSheetInfo: () => void;
  autoSyncInterval: number; // in seconds, 0 = off
  onChangeAutoSync: (seconds: number) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  config,
  data,
  isLoading,
  onRefresh,
  onSelectRow,
  onOpenSheetInfo,
  autoSyncInterval,
  onChangeAutoSync
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | StatusCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showChart, setShowChart] = useState(true);

  // Reset page when config or query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [config.id, searchQuery, activeFilter, itemsPerPage]);

  const rows = data?.rows || [];

  // Filter rows based on Status Filter and Search Query (sorted newest first by default)
  const filteredRows = useMemo(() => {
    // Sort descending by rowIndex so the newest data appears at the top
    const sorted = [...rows].sort((a, b) => b.rowIndex - a.rowIndex);

    return sorted.filter(row => {
      // Status Filter (Only if hasStatusFilter is enabled)
      if (config.hasStatusFilter && activeFilter !== 'ALL') {
        if (row.status !== activeFilter) return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCols = row.columns.some(col => col.toLowerCase().includes(query));
        const matchesStatus = (row.status || '').toLowerCase().includes(query);
        return matchesCols || matchesStatus;
      }

      return true;
    });
  }, [rows, activeFilter, searchQuery, config.hasStatusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage]);

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!data || filteredRows.length === 0) return;
    const headers = config.columnHeaders || config.targetColumns.map(c => `Kolom ${c}`);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

    filteredRows.forEach(row => {
      const rowText = row.columns.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(",");
      csvContent += rowText + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Export_${config.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Styling helper
  const getRowStyle = (status?: string) => {
    if (!config.hasStatusFilter) {
      return {
        bg: 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60',
        border: 'border-b border-slate-200 dark:border-slate-800',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
        dot: 'bg-blue-500',
        label: 'KERJASAMA'
      };
    }
    const s = (status || '').toUpperCase();
    if (s.includes('ANTRIAN') || s.includes('PENDING') || s.includes('WAITING') || s.includes('BELUM')) {
      return {
        bg: 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60',
        border: 'border-l-4 border-l-slate-300 dark:border-l-slate-700 border-y border-r border-slate-200 dark:border-slate-800',
        badgeBg: 'bg-white text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        badgeClass: 'bg-white text-slate-700 border-slate-300',
        dot: 'bg-slate-400',
        label: 'DALAM ANTRIAN'
      };
    }
    if (s.includes('SELESAI') || s.includes('TERBIT') || s.includes('DITERIMA')) {
      return {
        bg: 'bg-emerald-100/60 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60',
        border: 'border-l-4 border-l-emerald-600 border-y border-r border-emerald-200/80 dark:border-slate-800',
        badgeBg: 'bg-emerald-200/90 text-emerald-950 border-emerald-400 dark:bg-emerald-900/80 dark:text-emerald-200 dark:border-emerald-700 font-bold',
        dot: 'bg-emerald-600',
        label: 'SELESAI PROSES'
      };
    }
    if (s.includes('ON PROSES') || s.includes('REVISI') || s.includes('DRAFT') || s.includes('VERIFIKASI') || s.includes('PARAF') || s.includes('DITINJAU') || s.includes('KUNING') || s.includes('YELLOW')) {
      return {
        bg: 'bg-amber-100/60 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60',
        border: 'border-l-4 border-l-amber-500 border-y border-r border-amber-200/80 dark:border-slate-800',
        badgeBg: 'bg-amber-200/90 text-amber-950 border-amber-400 dark:bg-amber-900/80 dark:text-amber-200 dark:border-amber-700 font-bold',
        dot: 'bg-amber-500',
        label: 'ON PROSES'
      };
    }
    return {
      bg: 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60',
      border: 'border-l-4 border-l-slate-300 dark:border-l-slate-700 border-y border-r border-slate-200 dark:border-slate-800',
      badgeBg: 'bg-white text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      badgeClass: 'bg-white text-slate-700 border-slate-300',
      dot: 'bg-slate-400',
      label: 'DALAM ANTRIAN'
    };
  };

  const stats = data?.stats || { total: 0, selesai: 0, onProses: 0, dalamAntrian: 0 };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner & Description */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                PR TPP BRIN
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {config.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {config.subtitle}
            </p>
          </div>

          {/* Sync Status Info & Auto Refresh Options */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${data?.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{data?.isLive ? 'Google Sheets Live' : 'Fallback Mode'}</span>
              <span className="text-slate-400 font-mono text-[11px]">({data?.lastUpdated || 'Now'})</span>
            </div>

            {/* Auto Refresh Select Dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 hidden sm:inline">Auto Sync:</span>
              <select
                value={autoSyncInterval}
                onChange={(e) => onChangeAutoSync(Number(e.target.value))}
                className="bg-transparent font-medium text-xs text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value={0} className="dark:bg-slate-900">Matikan</option>
                <option value={3600} className="dark:bg-slate-900">1 Jam (Default)</option>
                <option value={21600} className="dark:bg-slate-900">6 Jam</option>
                <option value={86400} className="dark:bg-slate-900">24 Jam</option>
              </select>
            </div>

            <button
              onClick={() => setShowChart(!showChart)}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                showChart
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
              title="Tampilkan / sembunyikan grafik data"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showChart ? 'Sembunyikan Grafik' : 'Grafik Data'}</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50"
              title="Refresh manual data dari Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* PIC Contact Button Banner */}
        {config.picInfo && (
          <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/90 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/40 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                  <span>PIC {config.picInfo.role} :</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{config.picInfo.name}</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Hubungi PIC via WhatsApp untuk koordinasi layanan {config.title.includes('PR TPP') ? `${config.title} BRIN` : `${config.title} PR TPP BRIN`}
                </p>
              </div>
            </div>

            <a
              href={config.picInfo.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Klik me</span>
              <span className="text-[11px] opacity-90 font-semibold border-l border-emerald-400/80 pl-2 ml-1">
                PIC {config.picInfo.name}
              </span>
              <ExternalLink className="w-4 h-4 ml-0.5" />
            </a>
          </div>
        )}
      </div>

      {/* Visual Chart Section */}
      {showChart && (
        <SingleDashboardChart
          stats={stats}
          title={config.title}
          hasStatusFilter={config.hasStatusFilter}
        />
      )}

      {/* Status Filter Cards */}
      {config.hasStatusFilter ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* All Tab */}
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20 dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">Semua Berkas</p>
              <h4 className="text-xl font-extrabold mt-0.5">{stats.total}</h4>
            </div>
            <Filter className="w-5 h-5 opacity-60" />
          </button>

          {/* Hijau = SELESAI PROSES */}
          <button
            onClick={() => setActiveFilter('SELESAI PROSES')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              activeFilter === 'SELESAI PROSES'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                : 'bg-emerald-100/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-200/90 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">SELESAI PROSES</p>
              </div>
              <h4 className="text-xl font-extrabold mt-0.5 text-emerald-950 dark:text-emerald-100">{stats.selesai}</h4>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </button>

          {/* Kuning = ON PROSES */}
          <button
            onClick={() => setActiveFilter('ON PROSES')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              activeFilter === 'ON PROSES'
                ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                : 'bg-amber-100/90 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-700/80 hover:bg-amber-200/90 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950 dark:text-amber-200">ON PROSES</p>
              </div>
              <h4 className="text-xl font-extrabold mt-0.5 text-amber-950 dark:text-amber-100">{stats.onProses}</h4>
            </div>
            <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </button>

          {/* Putih = DALAM ANTRIAN PROSES */}
          <button
            onClick={() => setActiveFilter('DALAM ANTRIAN PROSES')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              activeFilter === 'DALAM ANTRIAN PROSES'
                ? 'bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-500/30'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <p className="text-[11px] font-bold uppercase tracking-wider">DALAM ANTRIAN</p>
              </div>
              <h4 className="text-xl font-extrabold mt-0.5">{stats.dalamAntrian}</h4>
            </div>
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Record Data {config.title}</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total} Berkas / Naskah</h4>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 font-medium">
            Filter Warna Khusus Dinonaktifkan
          </div>
        </div>
      )}

      {/* Table Toolbar (Search, Export, Print) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci dalam tabel..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Download Data CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Cetak Tabel / Save PDF"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {isLoading && filteredRows.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Menarik Data Terbaru dari Google Sheets...
            </p>
            <p className="text-xs text-slate-400">Source ID: {config.sheetId}</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tidak Ada Data yang Sesuai Filter
            </p>
            <p className="text-xs text-slate-400">
              Coba atur ulang kata kunci pencarian atau pilih filter status lainnya.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-700 text-slate-100 dark:bg-slate-800 dark:text-slate-100 border-b-2 border-slate-800 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center text-slate-200 dark:text-slate-300">Row</th>
                  {data?.headers && data.headers.length > 0 ? (
                    data.headers.map((headerText, idx) => (
                      <th key={idx} className="py-3.5 px-4 font-semibold whitespace-nowrap">
                        {headerText}
                      </th>
                    ))
                  ) : config.columnHeaders ? (
                    config.columnHeaders.map((headerText, idx) => (
                      <th key={idx} className="py-3.5 px-4 font-semibold whitespace-nowrap">
                        {headerText}
                      </th>
                    ))
                  ) : (
                    config.targetColumns.map(col => (
                      <th key={col} className="py-3.5 px-4 font-semibold whitespace-nowrap">
                        Kolom {col}
                      </th>
                    ))
                  )}
                  {config.hasStatusFilter && (
                    <th className="py-3.5 px-4 text-center w-28">{config.statusColumnHeader || 'Keterangan'}</th>
                  )}
                  <th className="py-3.5 px-4 text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {paginatedRows.map((row) => {
                  const style = getRowStyle(row.status);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectRow(row)}
                      className={`cursor-pointer transition-colors ${style.bg} ${style.border}`}
                    >
                      {/* Row Index */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] font-bold text-slate-400">
                        #{row.rowIndex}
                      </td>

                      {/* Columns */}
                      {row.columns.map((colVal, cIdx) => (
                        <td key={cIdx} className="py-3.5 px-4 text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {colVal || <span className="text-slate-300 dark:text-slate-600 font-mono italic">-</span>}
                        </td>
                      ))}

                      {/* Status Color Badge */}
                      {config.hasStatusFilter && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-2xs ${style.badgeBg}`}>
                            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                            <span>{style.label}</span>
                          </span>
                        </td>
                      )}

                      {/* Action Detail View */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRow(row);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Lihat Detail Baris"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer / Pagination */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div>
              Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredRows.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> sampai{' '}
              <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredRows.length)}</span> dari{' '}
              <span className="font-bold text-slate-900 dark:text-white">{filteredRows.length}</span> data
            </div>

            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              >
                <option value={10}>10 Baris</option>
                <option value={25}>25 Baris</option>
                <option value={50}>50 Baris</option>
                <option value={100}>100 Baris</option>
                <option value={1000000}>Semua Data (Tanpa Batas)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-xs font-semibold">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
