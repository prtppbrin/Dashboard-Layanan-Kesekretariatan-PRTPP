import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { DashboardTable } from './components/DashboardTable';
import { SheetInfoModal } from './components/SheetInfoModal';
import { RowDetailModal } from './components/RowDetailModal';
import { DashboardKey, DashboardDataResponse, SheetRowData } from './types/dashboard';
import { MENU_CONFIGS } from './data/menuConfig';
import { MOCK_DASHBOARD_DATA } from './data/mockData';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState<DashboardKey>('home');
  const [dashboardDataMap, setDashboardDataMap] = useState<Record<string, DashboardDataResponse>>(MOCK_DASHBOARD_DATA);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [lastUpdatedAll, setLastUpdatedAll] = useState<string>('');
  const [autoSyncInterval, setAutoSyncInterval] = useState<number>(30); // 30 seconds default auto sync

  // Search & Modals State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<SheetRowData | null>(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [isSheetInfoOpen, setIsSheetInfoOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch data for a specific menu dashboard
  const fetchDashboardData = useCallback(async (menuId: DashboardKey) => {
    if (menuId === 'home') return;

    setLoadingMap(prev => ({ ...prev, [menuId]: true }));

    try {
      const response = await fetch(`/api/sheets/${menuId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DashboardDataResponse = await response.json();
      setDashboardDataMap(prev => ({ ...prev, [menuId]: data }));
    } catch (err) {
      console.warn(`Fetch failed for ${menuId}, keeping fallback mock data:`, err);
    } finally {
      setLoadingMap(prev => ({ ...prev, [menuId]: false }));
    }
  }, []);

  // Fetch all 5 dashboards
  const fetchAllDashboards = useCallback(async () => {
    setIsSyncingAll(true);
    const promises = MENU_CONFIGS.map(menu => fetchDashboardData(menu.id));
    await Promise.allSettled(promises);
    setIsSyncingAll(false);
    setLastUpdatedAll(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [fetchDashboardData]);

  // Initial load: Fetch all 5 dashboards on mount
  useEffect(() => {
    fetchAllDashboards();
  }, [fetchAllDashboards]);

  // Auto Sync Interval effect
  useEffect(() => {
    if (autoSyncInterval <= 0) return;

    const intervalId = setInterval(() => {
      if (currentMenu !== 'home') {
        fetchDashboardData(currentMenu);
      } else {
        fetchAllDashboards();
      }
    }, autoSyncInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoSyncInterval, currentMenu, fetchDashboardData, fetchAllDashboards]);

  const activeConfig = MENU_CONFIGS.find(m => m.id === currentMenu) || null;
  const activeData = activeConfig ? dashboardDataMap[activeConfig.id] : undefined;
  const isLoadingCurrent = activeConfig ? !!loadingMap[activeConfig.id] : false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <div className="flex-1 flex w-full max-w-screen-2xl mx-auto">
        {/* Left Navigation Sidebar (5 Dashboards + Home) */}
        <Sidebar
          currentMenu={currentMenu}
          onSelectMenu={(menu) => {
            setCurrentMenu(menu);
            setSearchQuery('');
            if (menu !== 'home') {
              fetchDashboardData(menu);
            }
          }}
          isSyncing={isSyncingAll}
          onRefreshAll={fetchAllDashboards}
          lastUpdatedAll={lastUpdatedAll}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Header */}
          <Header
            currentMenu={currentMenu}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onOpenSheetInfo={() => setIsSheetInfoOpen(true)}
            isSyncing={isLoadingCurrent}
            onRefreshCurrent={() => activeConfig && fetchDashboardData(activeConfig.id)}
            lastUpdated={activeData?.lastUpdated}
            isLive={activeData?.isLive}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Main Body */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            {currentMenu === 'home' ? (
              <HomeScreen
                onSelectMenu={(menu) => {
                  setCurrentMenu(menu);
                  setSearchQuery('');
                  if (menu !== 'home') {
                    fetchDashboardData(menu);
                  }
                }}
                dashboardDataMap={dashboardDataMap}
                isSyncingAll={isSyncingAll}
                onRefreshAll={fetchAllDashboards}
              />
            ) : activeConfig ? (
              <DashboardTable
                config={activeConfig}
                data={activeData}
                isLoading={isLoadingCurrent}
                onRefresh={() => fetchDashboardData(activeConfig.id)}
                onSelectRow={(row) => {
                  setSelectedRow(row);
                  setIsRowModalOpen(true);
                }}
                onOpenSheetInfo={() => setIsSheetInfoOpen(true)}
                autoSyncInterval={autoSyncInterval}
                onChangeAutoSync={setAutoSyncInterval}
              />
            ) : null}
          </main>
        </div>
      </div>

      {/* Modals */}
      <SheetInfoModal
        config={activeConfig}
        isOpen={isSheetInfoOpen}
        onClose={() => setIsSheetInfoOpen(false)}
      />

      <RowDetailModal
        row={selectedRow}
        config={activeConfig}
        isOpen={isRowModalOpen}
        onClose={() => setIsRowModalOpen(false)}
      />
    </div>
  );
}
