import React from 'react';
import {
  Home,
  Handshake,
  FileText,
  GraduationCap,
  Award,
  Send,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { DashboardKey } from '../types/dashboard';
import { MENU_CONFIGS } from '../data/menuConfig';

interface SidebarProps {
  currentMenu: DashboardKey;
  onSelectMenu: (menu: DashboardKey) => void;
  isSyncing?: boolean;
  onRefreshAll?: () => void;
  lastUpdatedAll?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  onSelectMenu,
  isSyncing,
  onRefreshAll,
  lastUpdatedAll,
  isMobileOpen,
  onCloseMobile
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Handshake': return <Handshake className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Send': return <Send className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300';
      case 'emerald': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'violet': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300';
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300';
      case 'rose': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="sidebar-nav"
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 md:w-80 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-0.5 shadow-lg shadow-rose-900/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wider text-rose-400 uppercase">BRIN</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">PR TPP</span>
              </div>
              <h1 className="text-sm font-semibold text-slate-100 truncate tracking-tight">
                Kesekretariatan PR TPP
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Pusat Riset Teknologi dan Proses Pangan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {/* Main Home Button */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Utama
            </div>
            <button
              id="menu-item-home"
              onClick={() => {
                onSelectMenu('home');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all group ${
                currentMenu === 'home'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-5 h-5 ${currentMenu === 'home' ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
                <span>Beranda Kesekretariatan</span>
              </div>
              {currentMenu === 'home' && <Sparkles className="w-4 h-4 text-rose-200 animate-pulse" />}
            </button>
          </div>

          {/* 5 Dashboards */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                5 Dashboard Layanan
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Auto Sync
              </span>
            </div>

            <div className="space-y-1.5">
              {MENU_CONFIGS.map((menu, index) => {
                const isActive = currentMenu === menu.id;
                return (
                  <button
                    key={menu.id}
                    id={`menu-item-${menu.id}`}
                    onClick={() => {
                      onSelectMenu(menu.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all group relative border ${
                      isActive
                        ? 'bg-slate-800/90 text-white border-rose-500/50 shadow-sm shadow-slate-900/50'
                        : 'text-slate-300 border-transparent hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    {/* Active Left Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-rose-500 rounded-r-full" />
                    )}

                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isActive ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700/60'
                    }`}>
                      {getIcon(menu.iconName)}
                    </div>

                    <div className="flex-1 min-w-0 self-center">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-semibold leading-snug truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {index + 1}. {menu.title}
                        </span>
                      </div>
                      {menu.subtitle && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                          {menu.subtitle}
                        </p>
                      )}
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 self-center transition-transform ${
                      isActive ? 'text-rose-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Help / info */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-slate-800/50 to-slate-800/20 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Integrasi Real-Time</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tersinkronisasi otomatis dengan Google Sheets Kesekretariatan PR TPP BRIN. Update di Google Sheet akan memperbarui dashboard secara otomatis.
            </p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Google Sheets Connected</span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
              Last: {lastUpdatedAll || 'Baru saja'}
            </p>
          </div>

          {onRefreshAll && (
            <button
              id="refresh-all-button"
              onClick={onRefreshAll}
              disabled={isSyncing}
              title="Sinkronkan Ulang Semua Data"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-rose-400' : ''}`} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
