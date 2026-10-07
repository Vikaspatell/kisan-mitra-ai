import { Router, Request, Response } from 'express';
import { getSchemes, getSchemeById } from '../services/schemeService';

const router = Router();

// GET /api/schemes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, state, search } = req.query;

    const data = await getSchemes({
      category: category as any,
      state: state as string,
      search: search as string,
    });

    res.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Government schemes retrieval error:', error);
    res.status(500).json({
      error: 'Unable to retrieve government schemes at this moment.',
      message: error.message,
      source: 'National Portal of India / DA&FW, GoI',
      status: 'unavailable',
    });
  }
});

// GET /api/schemes/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await getSchemeById(req.params.id);
    if (!scheme) {
      res.status(404).json({ error: 'Government scheme not found' });
      return;
    }
    res.json({ scheme });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Failed to fetch scheme' });
  }
});

export default router;
