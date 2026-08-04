import React from 'react';
import {
  Handshake,
  FileText,
  GraduationCap,
  Award,
  Send,
  ArrowRight,
  RefreshCw,
  Building2,
  Database,
  Shield
} from 'lucide-react';
import { DashboardKey, DashboardDataResponse } from '../types/dashboard';
import { MENU_CONFIGS } from '../data/menuConfig';
import { HomeOverviewCharts } from './DashboardCharts';

interface HomeScreenProps {
  onSelectMenu: (menu: DashboardKey) => void;
  dashboardDataMap: Record<string, DashboardDataResponse>;
  isSyncingAll?: boolean;
  onRefreshAll?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMenu,
  dashboardDataMap,
  isSyncingAll,
  onRefreshAll
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Handshake': return <Handshake className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'Award': return <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Send': return <Send className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      default: return <FileText className="w-6 h-6 text-rose-600" />;
    }
  };

  const getCardGradient = (color?: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500/10 via-blue-500/5 to-transparent border-blue-200/80 dark:border-blue-900/40 hover:border-blue-400';
      case 'emerald': return 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400';
      case 'violet': return 'from-purple-500/10 via-purple-500/5 to-transparent border-purple-200/80 dark:border-purple-900/40 hover:border-purple-400';
      case 'amber': return 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/80 dark:border-amber-900/40 hover:border-amber-400';
      case 'rose': return 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-200/80 dark:border-rose-900/40 hover:border-rose-400';
      default: return 'from-slate-500/10 via-slate-500/5 to-transparent border-slate-200 hover:border-rose-400';
    }
  };

  return (
    <div id="home-screen-container" className="space-y-8 pb-12 animate-fade-in">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl shadow-rose-950/20 border border-slate-800">
        {/* Background Decorative Graphic */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>Badan Riset dan Inovasi Nasional (BRIN)</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Layanan Kesekretariatan PR TPP BRIN
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Pusat Riset Teknologi dan Proses Pangan - Dashboard Monitoring Layanan Kesekretariatan Terintegrasi dengan Google Sheet Secara Otomatis
            </p>
          </div>

          {/* Quick Actions & Status Summary Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="home-refresh-all-button"
              onClick={onRefreshAll}
              disabled={isSyncingAll}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Memperbarui Google Sheets...' : 'Sinkronkan Ulang Google Sheets'}</span>
            </button>

            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs flex items-center gap-2 backdrop-blur-md">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>5 Data Source Google Sheets Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Overview */}
      <HomeOverviewCharts dashboardDataMap={dashboardDataMap} />

      {/* 5 Service Dashboards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pilih 5 Dashboard Layanan Kesekretariatan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik kartu layanan di bawah ini untuk melihat tabel data lengkap dan filter status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MENU_CONFIGS.map((menu, index) => {
            const data = dashboardDataMap[menu.id];
            const totalRows = data?.stats?.total || 0;
            const selesaiCount = data?.stats?.selesai || 0;
            const onProsesCount = data?.stats?.onProses || 0;
            const antrianCount = data?.stats?.dalamAntrian || 0;

            return (
              <div
                key={menu.id}
                onClick={() => onSelectMenu(menu.id)}
                className={`group relative cursor-pointer rounded-2xl bg-gradient-to-br ${getCardGradient(menu.badgeColor)} bg-white dark:bg-slate-900 p-6 border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {index + 1}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                      {getIcon(menu.iconName)}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                    {menu.title}
                  </h4>
                  {menu.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {menu.subtitle}
                    </p>
                  )}

                  {/* PIC WhatsApp Button */}
                  {menu.picInfo && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate" title={`PIC: ${menu.picInfo.name}`}>
                        PIC: {menu.picInfo.name}
                      </span>
                      <a
                        href={menu.picInfo.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 shrink-0"
                      >
                        <span>Klik me</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom Row Stats & Navigation Arrow */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{totalRows} Data</span>
                    {menu.hasStatusFilter ? (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">{selesaiCount} Selesai</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">{onProsesCount} Proses</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">{antrianCount} Antrian</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">Tanpa Filter Warna</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Buka</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Explanation Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-rose-600" />
          <span>Informasi Integrasi Data Google Sheets Kesekretariatan PR TPP</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100">1. Sinkronisasi Otomatis</p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Sistem menarik data langsung dari Google Sheets resmi Kesekretariatan PR TPP BRIN secara langsung tanpa perlu input manual ulang.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100">2. Filter 3 Warna Status</p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Baris data dikategorikan ke dalam 3 indikator warna: Hijau (SELESAI PROSES), Kuning (ON PROSES), dan Putih (DALAM ANTRIAN PROSES).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-100">3. Pemetaan Kolom Khusus</p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Masing-masing dashboard menyaring kolom spesifik (misal: Kerjasama D, E, F, G, H, I mulai R83; Surat Tugas A, B, G, I, J, K mulai R2).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
