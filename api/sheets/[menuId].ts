import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchGoogleSheetDirectly } from '../../src/utils/sheetParser';
import { DashboardKey } from '../../src/types/dashboard';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { menuId } = req.query;
  const id = Array.isArray(menuId) ? menuId[0] : menuId;

  if (!id) {
    res.status(400).json({ error: 'Menu ID required' });
    return;
  }

  try {
    const data = await fetchGoogleSheetDirectly(id as DashboardKey);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch Google Sheet data' });
  }
}
