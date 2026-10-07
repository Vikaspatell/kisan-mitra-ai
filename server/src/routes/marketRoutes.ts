import { Router, Request, Response } from 'express';
import { getMarketPrices } from '../services/marketService';

const router = Router();

// GET /api/market
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { state, district, market, commodity, search } = req.query;

    const data = await getMarketPrices({
      state: state as string,
      district: district as string,
      market: market as string,
      commodity: commodity as string,
      search: search as string,
    });

    res.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Market price retrieval error:', error);
    res.status(500).json({
      error: 'Unable to retrieve real-time mandi prices at this moment.',
      message: error.message,
      source: 'Agmarknet / Directorate of Marketing & Inspection, GoI',
      status: 'unavailable',
    });
  }
});

export default router;
