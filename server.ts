import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Papa from 'papaparse';
import AdmZip from 'adm-zip';
import { MENU_CONFIGS } from './src/data/menuConfig.js';
import { MOCK_DASHBOARD_DATA } from './src/data/mockData.js';
import { DashboardKey, DashboardDataResponse, StatusCategory, SheetRowData } from './src/types/dashboard.js';

function parseStatus(str: string): StatusCategory {
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

function parseColorToStatus(color: string): StatusCategory {
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

  // Green check: High Green relative to Red & Blue (e.g. #b6d7a8, #93c47d, #6aa84f)
  if (g > r + 10 && g > b + 10) {
    return 'SELESAI PROSES';
  }

  // Yellow check: High Red & High Green, lower Blue (e.g. #ffff00, #ffe599, #fff2cc, #ffd966, #f1c232)
  if (r >= 200 && g >= 180 && b < 210) {
    return 'ON PROSES';
  }

  // Red / Orange check
  if (r > g + 20 && r > b + 20) {
    return 'ON PROSES';
  }

  return 'DALAM ANTRIAN PROSES';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Google Sheets Data by Menu ID
  app.get('/api/sheets/:menuId', async (req, res) => {
    const menuId = req.params.menuId as DashboardKey;
    const config = MENU_CONFIGS.find(m => m.id === menuId);

    if (!config) {
      res.status(404).json({ error: 'Menu dashboard tidak ditemukan' });
      return;
    }

    const { sheetId, columnIndices, columnHeaders, startRow, targetColumns } = config;

    let filteredSheetRows: SheetRowData[] = [];
    let effectiveHeaders: string[] = columnHeaders || [];
    let countTotal = 0;
    let countSelesai = 0;
    let countOnProses = 0;
    let countDalamAntrian = 0;
    let isLiveSuccess = false;

    // 0. APPS SCRIPT WEB APP ENDPOINT (If configured)
    if (config.scriptUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const scriptRes = await fetch(config.scriptUrl, {
          signal: controller.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (scriptRes.ok) {
          const json = await scriptRes.json();
          if (json && Array.isArray(json.rows) && json.rows.length > 0) {
            const headerRowIdx = Math.max(0, startRow - 2);
            if (json.rows[headerRowIdx] && json.rows[headerRowIdx].data) {
              const headerCells = json.rows[headerRowIdx].data;
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

            const targetStartIdx = Math.max(1, startRow - 1);
            for (let i = targetStartIdx; i < json.rows.length; i++) {
              const item = json.rows[i];
              if (!item || !item.data) continue;
              const row = item.data;
              const colors = item.colors || [];

              const selectedCols = columnIndices.map(idx => (row[idx] !== undefined ? String(row[idx]).trim() : ''));
              if (selectedCols.every(val => val === '')) continue;

              const rawMap: Record<string, string> = {};
              targetColumns.forEach((colKey, idx) => {
                const colIdx = columnIndices[idx];
                rawMap[colKey] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : '';
              });

              let statusValue: StatusCategory = 'DALAM ANTRIAN PROSES';
              for (const c of colors) {
                if (!c) continue;
                const st = parseColorToStatus(c);
                if (st === 'SELESAI PROSES') {
                  statusValue = 'SELESAI PROSES';
                  break;
                } else if (st === 'ON PROSES') {
                  statusValue = 'ON PROSES';
                }
              }

              if (statusValue === 'SELESAI PROSES') countSelesai++;
              else if (statusValue === 'ON PROSES') countOnProses++;
              else countDalamAntrian++;

              countTotal++;

              filteredSheetRows.push({
                id: `${menuId}-${item.rowIndex || (i + 1)}`,
                rowIndex: item.rowIndex || (i + 1),
                columns: selectedCols,
                rawValues: rawMap,
                status: statusValue
              });
            }

            if (filteredSheetRows.length > 0) {
              isLiveSuccess = true;
            }
          }
        }
      } catch (scriptErr) {
        console.warn(`Apps Script fetch failed for ${menuId}:`, scriptErr);
      }
    }

    // 1. PRIMARY METHOD: Fetch full CSV Data (Source of truth for all rows including hidden ones)
    let csvText: string | null = null;
    if (!isLiveSuccess) {
      const csvUrls = [
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv`
      ];

      for (const url of csvUrls) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const text = await response.text();
            if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
              csvText = text;
              break;
            }
          }
        } catch (err) {
          // ignore
        }
      }
    }

    // 2. HELPER METHOD: Try ZIP HTML Export to detect exact Cell Background Colors for visible rows
    const htmlRowStatusMap = new Map<number, StatusCategory>();
    const htmlComboStatusMap = new Map<string, StatusCategory>();
    let isZipParsed = false;

    if (!isLiveSuccess) {
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
          const buffer = Buffer.from(await zipRes.arrayBuffer());
          const zip = new AdmZip(buffer);
          const entries = zip.getEntries();
          const htmlEntry = entries.find(e => e.entryName.endsWith('.html'));

          if (htmlEntry) {
            isZipParsed = true;
            const htmlText = htmlEntry.getData().toString('utf8');
            const styleMatch = htmlText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            const styleText = styleMatch ? styleMatch[1] : '';

            const classBgMap: Record<string, string> = {};
            const sRules = styleText.match(/\.s\d+\{[^}]*\}/gi) || [];
            sRules.forEach(r => {
              const clsMatch = r.match(/\.s\d+/);
              if (!clsMatch) return;
              const cls = clsMatch[0].slice(1);
              const bgMatch = r.match(/background-color:\s*([^;\}]+)/i);
              if (bgMatch) {
                classBgMap[cls] = bgMatch[1].trim().toLowerCase();
              }
            });

            const trs = htmlText.match(/<tr[\s\S]*?<\/tr>/gi) || [];
            trs.forEach(tr => {
              let sheetRowNumber: number | null = null;
              const rowNumMatch = tr.match(/class="row-header-wrapper"[^>]*>\s*(\d+)\s*<\/div>/i);
              if (rowNumMatch) {
                sheetRowNumber = parseInt(rowNumMatch[1], 10);
              }

              const tdMatches = tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi) || [];
              if (tdMatches.length === 0) return;

              const allCellValues = tdMatches.map(td => td.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
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

                if ((detectedStatus as StatusCategory) === 'SELESAI PROSES') break;
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
      } catch (zipErr) {
        console.warn(`ZIP fetch helper failed for ${menuId}:`, zipErr);
      }
    }

    // 3. PROCESS CSV ROWS WITH HTML MAP
    if (!isLiveSuccess && csvText) {
      const parseResult = Papa.parse<string[]>(csvText, { skipEmptyLines: false });
      const rawRows = parseResult.data || [];
      const targetStartIdx = Math.max(0, startRow - 1);

      // Extract dynamic column headers from header row if available
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
          // In Google Sheets operational workflow, hidden rows are completed/green rows
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

    // 3. TERTIARY FALLBACK: Mock Data
    if (!isLiveSuccess || filteredSheetRows.length === 0) {
      const fallback = MOCK_DASHBOARD_DATA[menuId as Exclude<DashboardKey, 'home'>];
      if (fallback) {
        res.json({
          ...fallback,
          isLive: false,
          error: 'Gagal mengambil live data dari Google Sheets (akses privat/CORS). Menampilkan data contoh.'
        });
        return;
      }
      res.status(500).json({ error: 'Gagal membaca data Google Sheets' });
      return;
    }

    // Sort rows descending by rowIndex so the latest submissions appear at the top!
    filteredSheetRows.sort((a, b) => b.rowIndex - a.rowIndex);

    const responseData: DashboardDataResponse = {
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

    res.json(responseData);
  });

  // Vite middleware setup for Dev / Static serving for Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

