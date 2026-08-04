import React from 'react';
import { X, ExternalLink, Copy, Check, Info, FileSpreadsheet, Key, Database, RefreshCcw } from 'lucide-react';
import { DashboardMenuConfig } from '../types/dashboard';

interface SheetInfoModalProps {
  config: DashboardMenuConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SheetInfoModal: React.FC<SheetInfoModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !config) return null;

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${config.sheetId}/edit`;

  const copySheetId = () => {
    navigator.clipboard.writeText(config.sheetId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Detail Sumber Data Google Sheet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {config.title}
            </p>
          </div>
        </div>

        {/* Source ID Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-rose-500" />
              <span>Google Sheet Source ID</span>
            </span>
            <button
              onClick={copySheetId}
              className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin ID'}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 break-all select-all">
            {config.sheetId}
          </p>
        </div>

        {/* Mapping Specifications */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white">Aturan Pemetaan Data:</h4>
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Kolom</span>
              <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                {config.targetColumns.join(', ')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Awal Baris (Start)</span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                Baris ke-{config.startRow}
              </span>
            </div>
          </div>
        </div>

        {/* Notice & Instructions */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Petunjuk Akses Google Sheet:</span>
          </p>
          <p className="text-[11px] leading-relaxed opacity-90">
            Pastikan file Google Sheet diatur dengan hak akses <strong>"Siapa saja yang memiliki link dapat melihat"</strong> agar data dapat tersinkronisasi otomatis secara publik.
          </p>
        </div>

        {/* External Link */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all"
          >
            <span>Buka Google Sheet di Tab Baru</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
