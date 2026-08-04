import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { MENU_CONFIGS } from './src/data/menuConfig.js';
import { DashboardKey } from './src/types/dashboard.js';
import { fetchGoogleSheetDirectly } from './src/utils/sheetParser.js';

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

    try {
      const responseData = await fetchGoogleSheetDirectly(menuId);
      res.json(responseData);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Gagal membaca data Google Sheets' });
    }
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
