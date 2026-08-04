import React from 'react';
import { X, Copy, Check, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SheetRowData, DashboardMenuConfig } from '../types/dashboard';

interface RowDetailModalProps {
  row: SheetRowData | null;
  config: DashboardMenuConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RowDetailModal: React.FC<RowDetailModalProps> = ({
  row,
  config,
  isOpen,
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen || !row || !config) return null;

  const copyField = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s.includes('ANTRIAN') || s.includes('PENDING') || s.includes('WAITING') || s.includes('BELUM')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>DALAM ANTRIAN</span>
        </span>
      );
    }
    if (s.includes('SELESAI') || s.includes('TERBIT') || s.includes('DITERIMA')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-200/90 text-emerald-950 border border-emerald-400 dark:bg-emerald-900/80 dark:text-emerald-100 dark:border-emerald-700 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          <span>SELESAI PROSES</span>
        </span>
      );
    }
    if (s.includes('ON PROSES') || s.includes('REVISI') || s.includes('DRAFT') || s.includes('VERIFIKASI') || s.includes('PARAF') || s.includes('DITINJAU') || s.includes('KUNING') || s.includes('YELLOW')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200/90 text-amber-950 border border-amber-400 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-700 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
          <span>ON PROSES</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-2xs">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>DALAM ANTRIAN</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">Baris #{row.rowIndex}</span>
              {getStatusBadge(row.status)}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              Detail Data {config.title}
            </h3>
          </div>
        </div>

        {/* Column Fields List */}
        <div className="space-y-3">
          {config.targetColumns.map((colKey, index) => {
            const headerName = config.columnHeaders?.[index] || `Kolom ${colKey}`;
            const value = row.columns[index] || '-';

            return (
              <div
                key={colKey}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {colKey}
                    </span>
                    <span>{headerName}</span>
                  </span>

                  {value !== '-' && (
                    <button
                      onClick={() => copyField(value, index)}
                      className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium flex items-center gap-1"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedIndex === index ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-relaxed pt-1">
                  {value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
