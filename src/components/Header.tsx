import React from 'react';
import { Menu, RefreshCw, ExternalLink, Info, CheckCircle2, AlertCircle, Clock, Search, Layers } from 'lucide-react';
import { DashboardKey } from '../types/dashboard';
import { MENU_CONFIGS } from '../data/menuConfig';

interface HeaderProps {
  currentMenu: DashboardKey;
  onOpenMobileMenu: () => void;
  onOpenSheetInfo: () => void;
  isSyncing?: boolean;
  onRefreshCurrent?: () => void;
  lastUpdated?: string;
  isLive?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMenu,
  onOpenMobileMenu,
  onOpenSheetInfo,
  isSyncing,
  onRefreshCurrent,
  lastUpdated,
  isLive,
  searchQuery,
  onSearchChange
}) => {
  const currentConfig = MENU_CONFIGS.find(m => m.id === currentMenu);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Title Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-sidebar-toggle"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 lg:hidden transition-colors shrink-0"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-rose-600 dark:text-rose-400">PR TPP BRIN</span>
              <span>/</span>
              <span className="truncate">Kesekretariatan</span>
              <span>/</span>
              <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                {currentMenu === 'home' ? 'Beranda Utama' : currentConfig?.title}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight flex items-center gap-2 mt-0.5">
              {currentMenu === 'home' ? (
                'Layanan Kesekretariatan PR TPP BRIN'
              ) : (
                <>
                  <span>{currentConfig?.title}</span>
                  {currentConfig && (
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Google Sheet ID: {currentConfig.sheetId.slice(0, 8)}...
                    </span>
                  )}
                </>
              )}
            </h2>
          </div>
        </div>

        {/* Right: Search Input, Info Modal, Refresh Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentMenu !== 'home' && onSearchChange !== undefined && (
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari kata kunci..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>
          )}

          {/* Info button removed as requested */}

          {currentMenu !== 'home' && onRefreshCurrent && (
            <button
              id="refresh-current-button"
              onClick={onRefreshCurrent}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Sinkron...' : 'Refresh Sheet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
