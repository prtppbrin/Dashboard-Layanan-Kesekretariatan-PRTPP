import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { DashboardDataResponse } from '../types/dashboard';
import { MENU_CONFIGS } from '../data/menuConfig';

interface HomeOverviewChartsProps {
  dashboardDataMap: Record<string, DashboardDataResponse>;
}

export const HomeOverviewCharts: React.FC<HomeOverviewChartsProps> = ({ dashboardDataMap }) => {
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');

  // Prepare comparative data across all 5 dashboards
  const barData = MENU_CONFIGS.map((m) => {
    const stats = dashboardDataMap[m.id]?.stats || { total: 0, selesai: 0, onProses: 0, dalamAntrian: 0 };
    
    // Short title for X-Axis labels
    let shortName = m.title;
    if (m.id === 'kerjasama') shortName = 'Kerjasama';
    else if (m.id === 'surat-tugas') shortName = 'Surat Tugas';
    else if (m.id === 'bimbingan-magang') shortName = 'Surat Balasan';
    else if (m.id === 'surat-tugas-dbr') shortName = 'ST DBR';
    else if (m.id === 'nota-dinas-bosdm') shortName = 'Nota Dinas';

    const isKerjasama = m.id === 'kerjasama' || !m.hasStatusFilter;

    return {
      name: shortName,
      fullTitle: m.title,
      Total: stats.total,
      Selesai: isKerjasama ? stats.total : stats.selesai,
      'On Proses': isKerjasama ? 0 : stats.onProses,
      'Dalam Antrian': isKerjasama ? 0 : stats.dalamAntrian,
      hasFilter: m.hasStatusFilter
    };
  });

  // Calculate grand totals
  let totalSelesai = 0;
  let totalOnProses = 0;
  let totalAntrian = 0;
  let totalAll = 0;

  Object.entries(dashboardDataMap).forEach(([key, d]: [string, DashboardDataResponse]) => {
    if (d?.stats) {
      totalAll += d.stats.total || 0;
      if (key === 'kerjasama') {
        totalSelesai += d.stats.total || 0;
      } else {
        totalSelesai += d.stats.selesai || 0;
        totalOnProses += d.stats.onProses || 0;
        totalAntrian += d.stats.dalamAntrian || 0;
      }
    }
  });

  const pieData = [
    { name: 'Selesai Proses', value: totalSelesai, color: '#10b981', label: 'SELESAI' },
    { name: 'On Proses', value: totalOnProses, color: '#f59e0b', label: 'ON PROSES' },
    { name: 'Dalam Antrian', value: totalAntrian, color: '#64748b', label: 'DALAM ANTRIAN' },
  ].filter((item) => item.value > 0);

  return (
    <div id="home-overview-charts" className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Grafik Statistics Monitoring Layanan
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi distribusi data & status proses di seluruh 5 dashboard kesekretariatan
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-rose-500" />
            <span>Grafik Batang</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              chartType === 'donut'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChartIcon className="w-4 h-4 text-rose-500" />
            <span>Grafik Lingkaran</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Semua Berkas</p>
          <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">{totalAll} <span className="text-xs font-normal text-slate-500">dokumen</span></h4>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Total Selesai</p>
          </div>
          <h4 className="text-xl font-black text-emerald-950 dark:text-emerald-200 mt-1">{totalSelesai} <span className="text-xs font-normal text-emerald-700">({totalAll > 0 ? Math.round((totalSelesai/totalAll)*100) : 0}%)</span></h4>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">On Proses</p>
          </div>
          <h4 className="text-xl font-black text-amber-950 dark:text-amber-200 mt-1">{totalOnProses} <span className="text-xs font-normal text-amber-700">({totalAll > 0 ? Math.round((totalOnProses/totalAll)*100) : 0}%)</span></h4>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Dalam Antrian</p>
          </div>
          <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{totalAntrian} <span className="text-xs font-normal text-slate-500">({totalAll > 0 ? Math.round((totalAntrian/totalAll)*100) : 0}%)</span></h4>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-72 w-full pt-2">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                }}
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', pt: '10px' }} />
              <Bar dataKey="Selesai" fill="#10b981" radius={[6, 6, 0, 0]} name="Selesai (Hijau)" />
              <Bar dataKey="On Proses" fill="#f59e0b" radius={[6, 6, 0, 0]} name="On Proses (Kuning)" />
              <Bar dataKey="Dalam Antrian" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Dalam Antrian (Putih)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-full">
            <ResponsiveContainer width="100%" height="100%" className="max-w-xs">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}:</span>
                  <span className="font-black text-slate-900 dark:text-white ml-auto">{item.value} berkas</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SingleDashboardChartProps {
  stats: { total: number; selesai: number; onProses: number; dalamAntrian: number };
  title: string;
  hasStatusFilter: boolean;
}

export const SingleDashboardChart: React.FC<SingleDashboardChartProps> = ({
  stats,
  title,
  hasStatusFilter
}) => {
  if (!hasStatusFilter) {
    const categoryName = 'Kerjasama Yang Sudah di Usulkan ORPP ke BHKS';
    const pieData = [{ name: categoryName, value: stats.total, color: '#2563eb' }];

    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Grafik Statistics - {title}
            </h4>
          </div>
          <span className="text-xs font-bold text-slate-500">Total: {stats.total} Berkas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart */}
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill="#2563eb" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Details */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <p className="text-xs font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wider">
                  {categoryName}
                </p>
              </div>
              <h4 className="text-2xl font-black text-blue-950 dark:text-blue-100 mt-1">
                {stats.total} <span className="text-xs font-normal text-blue-700 dark:text-blue-300">(100% Berkas Usulan)</span>
              </h4>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-blue-700 dark:text-blue-400">{categoryName}</span>
                <span className="text-blue-800 dark:text-blue-300">{stats.total} (100%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Selesai Proses', value: stats.selesai, color: '#10b981' },
    { name: 'On Proses', value: stats.onProses, color: '#f59e0b' },
    { name: 'Dalam Antrian', value: stats.dalamAntrian, color: '#94a3b8' }
  ].filter((item) => item.value > 0);

  const barData = [
    { name: 'Selesai', jumlah: stats.selesai, fill: '#10b981' },
    { name: 'On Proses', jumlah: stats.onProses, fill: '#f59e0b' },
    { name: 'Dalam Antrian', jumlah: stats.dalamAntrian, fill: '#94a3b8' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Grafik Distribusi Status - {title}
          </h4>
        </div>
        <span className="text-xs font-bold text-slate-500">Total: {stats.total} Berkas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Donut Chart */}
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Bars & Legend */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-700 dark:text-emerald-400">Selesai Proses</span>
              <span className="text-emerald-800 dark:text-emerald-300">{stats.selesai} ({stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.selesai / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-amber-700 dark:text-amber-400">On Proses</span>
              <span className="text-amber-800 dark:text-amber-300">{stats.onProses} ({stats.total > 0 ? Math.round((stats.onProses / stats.total) * 100) : 0}%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.onProses / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600 dark:text-slate-400">Dalam Antrian</span>
              <span className="text-slate-700 dark:text-slate-300">{stats.dalamAntrian} ({stats.total > 0 ? Math.round((stats.dalamAntrian / stats.total) * 100) : 0}%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.dalamAntrian / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
