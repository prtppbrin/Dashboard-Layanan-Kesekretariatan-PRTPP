import Papa from 'papaparse';
import { MENU_CONFIGS } from '../data/menuConfig';
import { MOCK_DASHBOARD_DATA } from '../data/mockData';
import { DashboardKey, DashboardDataResponse, StatusCategory, SheetRowData } from '../types/dashboard';

export function parseStatus(str: string): StatusCategory {
  if (!str) return 'DALAM ANTRIAN PROSES';
  const upper = str.toUpperCase().trim();
  if (/\b(ANTRIAN|PENDING|WAITING|BELUM)\b/i.test(upper)) {
    return 'DALAM ANTRIAN PROSES';
  }
  if (
    /\b(ON PROSES|PROSES|REVISI|DRAFT|VERIFIKASI|PARAF|DITINJAU|KUNING|YELLOW)\b/i.test(upper) &&
    !/\b(SELESAI|TERBIT|DISETUJUI)\b/i.test(upper)
  ) {
    return 'ON PROSES';
  }
  if (
    /\b(SELESAI|TERBIT|DITERIMA|APPROVED|DISETUJUI|SUDAH|ACC|DONE|FINISH|HIJAU|GREEN|TTD|DITERBITKAN|VALID|VERIFIED|SDA|LENGKAP|LULUS|DIKIRIM|SUCCESS)\b/i.test(upper)
  ) {
    return 'SELESAI PROSES';
  }
  return 'DALAM ANTRIAN PROSES';
}

export function parseColorToStatus(color: string): StatusCategory {
  if (!color) return 'DALAM ANTRIAN PROSES';
  const c = color.trim().toLowerCase();
  if (
    c === 'transparent' ||
    c === '#ffffff' ||
    c === '#f8f9fa' ||
    c === '#f0f0f0' ||
    c === '#f3f3f3' ||
    c === '#fff' ||
    c === '#e8eaed' ||
    c === '#dadce0'
  ) {
    return 'DALAM ANTRIAN PROSES';
  }

  let r = 0, g = 0, b = 0;
  if (c.startsWith('#')) {
    const hex = c.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (c.startsWith('rgb')) {
    const parts = c.match(/\d+/g);
    if (parts && parts.length >= 3) {
      r = parseInt(parts[0], 10);
      g = parseInt(parts[1], 10);
      b = parseInt(parts[2], 10);
    }
  }

  // White or light gray standard cell backgrounds
  if (r >= 235 && g >= 235 && b >= 235) {
    return 'DALAM ANTRIAN PROSES';
  }

  // Green check
  if (g > r + 10 && g > b + 10) {
    return 'SELESAI PROSES';
  }

  // Yellow check
  if (r >= 200 && g >= 180 && b < 210) {
    return 'ON PROSES';
  }

  // Red / Orange check
  if (r > g + 20 && r > b + 20) {
    return 'ON PROSES';
  }

  return 'DALAM ANTRIAN PROSES';
}

export async function fetchGoogleSheetDirectly(menuId: DashboardKey): Promise<DashboardDataResponse> {
  const config = MENU_CONFIGS.find(m => m.id === menuId);
  if (!config) {
    throw new Error(`Config for menu ${menuId} not found`);
  }

  const { sheetId, columnIndices, columnHeaders, startRow, targetColumns } = config;

  let filteredSheetRows: SheetRowData[] = [];
  let effectiveHeaders: string[] = columnHeaders || [];
  let countTotal = 0;
  let countSelesai = 0;
  let countOnProses = 0;
  let countDalamAntrian = 0;
  let isLiveSuccess = false;

  // 1. Fetch full CSV
  let csvText: string | null = null;
  const baseCsvUrls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`
  ];

  const candidateUrls: string[] = [];
  for (const url of baseCsvUrls) {
    candidateUrls.push(url);
    candidateUrls.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  }

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        let text = await res.text();
        if (text && text.trim().startsWith('{') && text.includes('"contents"')) {
          try {
            const parsed = JSON.parse(text);
            if (parsed.contents) text = parsed.contents;
          } catch (_) {
            // ignore
          }
        }
        if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
          csvText = text;
          break;
        }
      }
    } catch (_) {
      // try next
    }
  }

  if (!csvText) {
    for (const url of baseCsvUrls) {
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
      } catch (_) {
        // ignore
      }
    }
  }

  // 2. Try ZIP HTML Export to detect exact Cell Background Colors for visible rows
  const htmlRowStatusMap = new Map<number, StatusCategory>();
  const htmlComboStatusMap = new Map<string, StatusCategory>();
  let isZipParsed = false;

  if (typeof window === 'undefined') {
    try {
      const zipUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=zip`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);
      const zipRes = await fetch(zipUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (zipRes.ok) {
        const AdmZipModule = await import('adm-zip');
        const AdmZipClass: any = AdmZipModule.default || AdmZipModule;
        const buffer = Buffer.from(await zipRes.arrayBuffer());
        const zip = new AdmZipClass(buffer);
        const entries = zip.getEntries();
        const htmlEntry = entries.find((e: any) => e.entryName.endsWith('.html'));

        if (htmlEntry) {
          isZipParsed = true;
          const htmlText = htmlEntry.getData().toString('utf8');
          const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          const styleText = styleMatch ? styleMatch[1] : '';

          const classBgMap: Record<string, string> = {};
          const sRules = styleText.match(/\.s\d+\{[^}]*\}/gi) || [];
          sRules.forEach((r: string) => {
            const clsMatch = r.match(/\.s\d+/);
            if (!clsMatch) return;
            const cls = clsMatch[0].slice(1);
            const bgMatch = r.match(/background-color:\s*([^;\}]+)/i);
            if (bgMatch) {
              classBgMap[cls] = bgMatch[1].trim().toLowerCase();
            }
          });

          const trs = htmlText.match(/<tr[\s\S]*?<\/tr>/gi) || [];
          trs.forEach((tr: string) => {
            let sheetRowNumber: number | null = null;
            const rowNumMatch = tr.match(/class="row-header-wrapper"[^>]*>\s*(\d+)\s*<\/div>/i);
            if (rowNumMatch) {
              sheetRowNumber = parseInt(rowNumMatch[1], 10);
            }

            const tdMatches = tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi) || [];
            if (tdMatches.length === 0) return;

            const allCellValues = tdMatches.map((td: string) => td.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
            const timestamp = allCellValues[0] || '';
            const name = allCellValues[1] || '';

            let detectedStatus: StatusCategory = 'DALAM ANTRIAN PROSES';

            const checkColIndices = Array.from(new Set([
              ...columnIndices,
              ...Array.from({ length: Math.min(14, tdMatches.length) }, (_, idx) => idx)
            ]));

            for (const colIdx of checkColIndices) {
              const td = tdMatches[colIdx];
              if (!td) continue;

              const classMatch = td.match(/class=\"([^\"]*)\"/i);
              if (classMatch) {
                const classes = classMatch[1].split(/\s+/);
                for (const cls of classes) {
                  if (classBgMap[cls]) {
                    const st = parseColorToStatus(classBgMap[cls]);
                    if (st === 'SELESAI PROSES') {
                      detectedStatus = 'SELESAI PROSES';
                      break;
                    } else if (st === 'ON PROSES' && (detectedStatus as StatusCategory) !== 'SELESAI PROSES') {
                      detectedStatus = 'ON PROSES';
                    }
                  }
                }
              }

              const inlineMatch = td.match(/background(?:-color)?\s*:\s*([^;\"\}]+)/i);
              if (inlineMatch) {
                const st = parseColorToStatus(inlineMatch[1]);
                if (st === 'SELESAI PROSES') {
                  detectedStatus = 'SELESAI PROSES';
                  break;
                } else if (st === 'ON PROSES' && (detectedStatus as StatusCategory) !== 'SELESAI PROSES') {
                  detectedStatus = 'ON PROSES';
                }
              }

              if (detectedStatus === 'SELESAI PROSES') break;
            }

            if (sheetRowNumber !== null) {
              htmlRowStatusMap.set(sheetRowNumber, detectedStatus);
            }
            if (timestamp && name) {
              htmlComboStatusMap.set(`${timestamp.trim()}||${name.trim()}`, detectedStatus);
            }
          });
        }
      }
    } catch (_) {
      // ignore zip errors
    }
  }

  // 3. Process CSV Rows
  if (csvText) {
    const parseResult = Papa.parse<string[]>(csvText, { skipEmptyLines: false });
    const rawRows = parseResult.data || [];
    const targetStartIdx = Math.max(0, startRow - 1);

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

    filteredSheetRows = [];
    countTotal = 0;
    countSelesai = 0;
    countOnProses = 0;
    countDalamAntrian = 0;

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

      const sheetRowNumber = i + 1;
      const timestamp = row[0] ? String(row[0]).trim() : '';
      const name = row[1] ? String(row[1]).trim() : '';
      const keyCombo = `${timestamp.trim()}||${name.trim()}`;

      let statusValue: StatusCategory = 'DALAM ANTRIAN PROSES';

      if (htmlRowStatusMap.has(sheetRowNumber)) {
        statusValue = htmlRowStatusMap.get(sheetRowNumber)!;
      } else if (htmlComboStatusMap.has(keyCombo)) {
        statusValue = htmlComboStatusMap.get(keyCombo)!;
      } else if (isZipParsed) {
        statusValue = 'SELESAI PROSES';
      } else if (config.statusColumnKey && rawMap[config.statusColumnKey]) {
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

    if (filteredSheetRows.length > 0) {
      isLiveSuccess = true;
    }
  }

  // 4. Fallback if live fetch completely failed
  if (!isLiveSuccess || filteredSheetRows.length === 0) {
    const fallback = MOCK_DASHBOARD_DATA[menuId as Exclude<DashboardKey, 'home'>];
    if (fallback) {
      return {
        ...fallback,
        isLive: false,
        error: 'Gagal mengambil live data dari Google Sheets. Menampilkan data contoh.'
      };
    }
    throw new Error('Gagal membaca data Google Sheets');
  }

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
