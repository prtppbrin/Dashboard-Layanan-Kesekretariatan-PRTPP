import Papa from 'papaparse';
import { MENU_CONFIGS } from '../data/menuConfig';
import { DashboardKey, DashboardDataResponse, SheetRowData, StatusCategory } from '../types/dashboard';

export function parseStatus(str: string): StatusCategory {
  if (!str) return 'DALAM ANTRIAN PROSES';
  const upper = str.toUpperCase().trim();
  if (/\b(ANTRIAN|PENDING|WAITING|BELUM)\b/i.test(upper)) {
    return 'DALAM ANTRIAN PROSES';
  }
  if (
    /\b(SELESAI|TERBIT|DITERIMA|APPROVED|DISETUJUI|SUDAH|ACC|DONE|FINISH|HIJAU|GREEN|TTD|DITERBITKAN|VALID|VERIFIED|SDA|LENGKAP|LULUS|DIKIRIM|SUCCESS)\b/i.test(upper)
  ) {
    return 'SELESAI PROSES';
  }
  if (
    /\b(ON PROSES|PROSES|REVISI|DRAFT|VERIFIKASI|PARAF|DITINJAU|KUNING|YELLOW)\b/i.test(upper)
  ) {
    return 'ON PROSES';
  }
  return 'DALAM ANTRIAN PROSES';
}

export async function fetchGoogleSheetDirectly(menuId: DashboardKey): Promise<DashboardDataResponse> {
  const config = MENU_CONFIGS.find(m => m.id === menuId);
  if (!config) {
    throw new Error(`Menu configuration for ${menuId} not found`);
  }

  const { sheetId, columnIndices, columnHeaders, startRow, targetColumns } = config;

  const baseUrls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`
  ];

  let csvText: string | null = null;
  let fetchError: any = null;

  const candidateUrls: string[] = [];
  for (const url of baseUrls) {
    candidateUrls.push(url);
    candidateUrls.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  }

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        let text = await res.text();
        if (text) {
          if (text.trim().startsWith('{') && text.includes('"contents"')) {
            try {
              const parsedJson = JSON.parse(text);
              if (parsedJson.contents) {
                text = parsedJson.contents;
              }
            } catch (_) {
              // ignore JSON parse error
            }
          }

          if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
            csvText = text;
            break;
          }
        }
      }
    } catch (err) {
      fetchError = err;
    }
  }

  if (!csvText) {
    for (const url of baseUrls) {
      try {
        const jsonUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(jsonUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.contents && !data.contents.trim().startsWith('<!DOCTYPE') && !data.contents.trim().startsWith('<html')) {
            csvText = data.contents;
            break;
          }
        }
      } catch (err) {
        fetchError = err;
      }
    }
  }

  if (!csvText) {
    throw new Error(fetchError?.message || `Failed to fetch CSV for sheet ${sheetId}`);
  }

  const parseResult = Papa.parse<string[]>(csvText, { skipEmptyLines: false });
  const rawRows = parseResult.data || [];
  const targetStartIdx = Math.max(0, startRow - 1);

  let effectiveHeaders: string[] = columnHeaders || [];
  const headerRowIdx = startRow - 2;
  if (headerRowIdx >= 0 && rawRows[headerRowIdx]) {
    const headerCells = rawRows[headerRowIdx];
    effectiveHeaders = columnIndices.map((colIdx, idx) => {
      if (columnHeaders && columnHeaders[idx]) {
        return columnHeaders[idx];
      }
      const val = headerCells[colIdx] !== undefined ? String(headerCells[colIdx]).trim() : '';
      return val || `Kolom ${targetColumns[idx]}`;
    });
  }

  const filteredSheetRows: SheetRowData[] = [];
  let countTotal = 0;
  let countSelesai = 0;
  let countOnProses = 0;
  let countDalamAntrian = 0;

  for (let i = targetStartIdx; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const selectedCols = columnIndices.map(idx => (row[idx] !== undefined ? String(row[idx]).trim() : ''));
    if (selectedCols.every(val => val === '')) continue;

    const rawMap: Record<string, string> = {};
    targetColumns.forEach((colKey, idx) => {
      const colIdx = columnIndices[idx];
      rawMap[colKey] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
    });

    let statusValue: StatusCategory = 'DALAM ANTRIAN PROSES';
    if (config.statusColumnKey && rawMap[config.statusColumnKey]) {
      statusValue = parseStatus(rawMap[config.statusColumnKey]);
    }

    if (statusValue === 'SELESAI PROSES') countSelesai++;
    else if (statusValue === 'ON PROSES') countOnProses++;
    else countDalamAntrian++;

    countTotal++;

    filteredSheetRows.push({
      id: `${menuId}-${i + 1}`,
      rowIndex: i + 1,
      columns: selectedCols,
      rawValues: rawMap,
      status: statusValue
    });
  }

  // Sort rows descending by rowIndex so the latest submissions appear at the top
  filteredSheetRows.sort((a, b) => b.rowIndex - a.rowIndex);

  return {
    menuId,
    title: config.title,
    sheetId,
    totalRows: filteredSheetRows.length,
    headers: effectiveHeaders.length > 0 ? effectiveHeaders : targetColumns.map(c => `Kolom ${c}`),
    columnKeys: targetColumns,
    rows: filteredSheetRows,
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isLive: true,
    stats: {
      total: countTotal,
      selesai: countSelesai,
      onProses: countOnProses,
      dalamAntrian: countDalamAntrian
    }
  };
}
