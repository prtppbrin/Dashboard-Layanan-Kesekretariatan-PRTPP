import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchGoogleSheetDirectly } from '../../src/utils/sheetParser';
import { DashboardKey } from '../../src/types/dashboard';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { menuId, id } = req.query;
  const targetId = (menuId || id) ? (Array.isArray(menuId || id) ? (menuId || id)[0] : (menuId || id)) : null;

  if (!targetId) {
    res.status(400).json({ error: 'Menu ID required' });
    return;
  }

  try {
    const data = await fetchGoogleSheetDirectly(targetId as DashboardKey);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch Google Sheet data' });
  }
}
